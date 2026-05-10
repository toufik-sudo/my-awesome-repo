import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AppRole, ROLE_HIERARCHY } from '../entity/user.entity';
import { ManagerPermission, PermissionScope } from '../entity/manager-permission.entity';
import { HyperManagerPermission, HyperManagerPermissionScope } from '../entity/hyper-manager-permission.entity';
import { GuestPermission, GuestPermissionScope } from '../entity/guest-permission.entity';
import { PropertyGroup } from '../../properties/entity/property-group.entity';
import { Invitation } from '../entity/invitation.entity';
import { logScopeFallback } from '../../rbac/utils/scope-fallback-logger';

const ASSIGNABLE_ROLES_BY_ROLE: Record<AppRole, AppRole[]> = {
  hyper_admin: ['admin', 'hyper_manager', 'guest'],
  hyper_manager: ['admin', 'guest'],
  admin: ['manager', 'guest'],
  manager: ['guest'],
  guest: [],
  user: [],
};

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ManagerPermission)
    private readonly managerPermRepo: Repository<ManagerPermission>,
    @InjectRepository(HyperManagerPermission)
    private readonly hyperPermRepo: Repository<HyperManagerPermission>,
    @InjectRepository(GuestPermission)
    private readonly guestPermRepo: Repository<GuestPermission>,
    @InjectRepository(PropertyGroup)
    private readonly propGroupRepo: Repository<PropertyGroup>,
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
  ) {}

  // ─── ROLE HELPERS ─────────────────────────────────────────────────────

  async getUserRole(userId: number | string): Promise<AppRole> {
    if (typeof userId === 'string') userId = parseInt(userId, 10);
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return 'user';
    return user.getRole();
  }

  /** @deprecated Use getUserRole() */
  async getUserRoles(userId: number): Promise<AppRole[]> {
    return [await this.getUserRole(userId)];
  }

  async hasRole(userId: number, role: AppRole): Promise<boolean> {
    return (await this.getUserRole(userId)) === role;
  }

  private async setUserRole(userId: number, role: AppRole): Promise<void> {
    await this.userRepo.update(userId, { role });
  }

  // ─── HELPERS — invited user IDs ─────────────────────────────────────

  private async getInvitedUserIds(inviterId: number): Promise<number[]> {
    const invitations = await this.invitationRepo.find({
      where: { invitedBy: inviterId, status: 'accepted' as any },
    });

    const managerPerms = await this.managerPermRepo.find({
      where: { assignedById: inviterId },
      select: ['managerId'],
    });
    const managerIds = [...new Set(managerPerms.map(p => p.managerId))];

    const invitedEmails = invitations.filter(inv => inv.email).map(inv => inv.email);
    let invitedUsers: User[] = [];
    if (invitedEmails.length > 0) {
      invitedUsers = await this.userRepo.find({
        where: invitedEmails.map(email => ({ email })),
      });
    }

    const allIds = new Set<number>([
      ...managerIds,
      ...invitedUsers.map(u => u.id),
    ]);
    return Array.from(allIds);
  }

  /**
   * Resolve the inviter admin user IDs for a manager / guest.
   *
   * Used by ScopeFilterService to apply the rule:
   *   "no scope defined / scope='all' → user inherits the inviter admin's
   *    full property + service inventory."
   *
   * Resolution strategy (union):
   *   1. Distinct `assignedById` from {manager,guest}_permissions where the
   *      user has at least one row (inviter explicitly granted something).
   *   2. Distinct `invitedBy` from invitations whose email matches this user
   *      AND status='accepted' AND inviter has role 'admin'.
   *
   * Returns admin user IDs only — non-admin inviters (hyper_admin /
   * hyper_manager / manager-of-guest) are filtered out because their
   * inventory is handled by their own scope rules.
   */
  async getInviterAdminIds(
    userId: number,
    role: 'manager' | 'guest',
  ): Promise<number[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return [];

    const assignerIds = new Set<number>();

    if (role === 'manager') {
      const rows = await this.managerPermRepo.find({
        where: { managerId: userId },
        select: ['assignedById'],
      });
      rows.forEach(r => assignerIds.add(r.assignedById));
    } else {
      const rows = await this.guestPermRepo.find({
        where: { guestId: userId },
        select: ['assignedById'],
      });
      rows.forEach(r => assignerIds.add(r.assignedById));
    }

    if (user.email) {
      const invs = await this.invitationRepo.find({
        where: { email: user.email, status: 'accepted' as any, role },
        select: ['invitedBy'],
      });
      invs.forEach(i => assignerIds.add(i.invitedBy));
    }

    if (assignerIds.size === 0) return [];

    const candidates = await this.userRepo.find({
      where: Array.from(assignerIds).map(id => ({ id })),
      select: ['id', 'role'],
    });
    return candidates.filter(c => c.getRole() === 'admin').map(c => c.id);
  }

  // ─── DASHBOARD STATS ─────────────────────────────────────────────────

  async getDashboardStats(callerId?: number) {
    const callerRole = callerId ? await this.getUserRole(callerId) : 'hyper_admin';
    const isHyper = callerRole === 'hyper_admin' || callerRole === 'hyper_manager';

    if (isHyper) {
      const users = await this.userRepo.find({ where: { isActive: true } });
      let totalAdmins = 0, totalManagers = 0, totalRegularUsers = 0,
        totalGuests = 0, hyperAdmins = 0, hyperManagers = 0;

      for (const u of users) {
        const role = u.getRole();
        if (role === 'hyper_admin') hyperAdmins++;
        else if (role === 'hyper_manager') hyperManagers++;
        else if (role === 'admin') totalAdmins++;
        else if (role === 'manager') totalManagers++;
        else if (role === 'guest') totalGuests++;
        else totalRegularUsers++;
      }

      const totalGroups = await this.propGroupRepo.count();
      const totalManagerPerms = await this.managerPermRepo.count({ where: { isGranted: true } });
      const totalHyperPerms = await this.hyperPermRepo.count({ where: { isGranted: true } });

      return {
        totalUsers: users.length,
        totalGroups,
        activeManagers: totalManagers,
        totalAssignments: totalManagerPerms + totalHyperPerms,
        totalAdmins, totalManagers, totalRegularUsers, totalGuests, hyperAdmins, hyperManagers,
      };
    }

    const invitedIds = await this.getInvitedUserIds(callerId);
    const myPerms = await this.managerPermRepo.count({
      where: { assignedById: callerId, isGranted: true },
    });

    let managersCount = 0, guestsCount = 0;
    if (invitedIds.length > 0) {
      const invitedUsers = await this.userRepo.find({
        where: invitedIds.map(id => ({ id })),
      });
      for (const u of invitedUsers) {
        if (u.getRole() === 'manager') managersCount++;
        else if (u.getRole() === 'guest') guestsCount++;
      }
    }

    return {
      totalUsers: invitedIds.length,
      totalGroups: 0,
      activeManagers: managersCount,
      totalAssignments: myPerms,
      totalAdmins: 0, totalManagers: managersCount, totalRegularUsers: 0,
      totalGuests: guestsCount, hyperAdmins: 0, hyperManagers: 0,
    };
  }

  // ─── ROLE ASSIGNMENT ──────────────────────────────────────────────────

  async assignRole(assignerId: number, userId: number, role: AppRole) {
    const assignerRole = await this.getUserRole(assignerId);
    const allowedRoles = ASSIGNABLE_ROLES_BY_ROLE[assignerRole] ?? [];
    if (!allowedRoles.includes(role)) {
      throw new ForbiddenException(
        `'${assignerRole}' cannot assign role '${role}'. Allowed: [${allowedRoles.join(', ') || 'none'}].`,
      );
    }

    const currentRole = await this.getUserRole(userId);
    if (currentRole === role) return { userId, role: currentRole };

    await this.setUserRole(userId, role);
    return { userId, role };
  }

  async removeRole(removerId: number, userId: number, _role: AppRole): Promise<void> {
    const removerRole = await this.getUserRole(removerId);
    if (!['hyper_admin', 'hyper_manager', 'admin'].includes(removerRole)) {
      throw new ForbiddenException('Insufficient permissions to remove roles');
    }

    const currentRole = await this.getUserRole(userId);

    if (removerRole === 'admin') {
      if (!['manager', 'guest'].includes(currentRole)) {
        throw new ForbiddenException('Admin can only manage manager and guest roles');
      }
      const invitedIds = await this.getInvitedUserIds(removerId);
      if (!invitedIds.includes(userId)) {
        throw new ForbiddenException('Admin can only manage their own invitees');
      }
    }

    if ((currentRole === 'hyper_admin' || currentRole === 'hyper_manager') && removerRole !== 'hyper_admin') {
      throw new ForbiddenException('Only hyper_admin can remove hyper roles');
    }

    await this.setUserRole(userId, 'user');
  }

  // ─── MANAGER PERMISSION ASSIGNMENT ─────────────────────────────────────

  async setManagerPermissions(
    adminId: number,
    managerId: number,
    permissions: {
      backendPermissionKey: string;
      frontendPermissionKey?: string;
      scope: PermissionScope;
      isGranted: boolean;
      properties?: string[];
      services?: string[];
      propertyGroups?: string[];
      serviceGroups?: string[];
    }[],
  ): Promise<ManagerPermission[]> {
    const adminRole = await this.getUserRole(adminId);
    if (!['hyper_admin', 'hyper_manager', 'admin'].includes(adminRole)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const managerRole = await this.getUserRole(managerId);
    if (managerRole !== 'manager') {
      throw new ForbiddenException('Target user must have manager role');
    }

    if (adminRole === 'admin') {
      const invitedIds = await this.getInvitedUserIds(adminId);
      if (!invitedIds.includes(managerId)) {
        throw new ForbiddenException('Admin can only manage permissions for their own managers');
      }
    }

    await this.managerPermRepo.delete({ managerId, assignedById: adminId });

    const newPerms = permissions.map(p =>
      this.managerPermRepo.create({
        managerId,
        assignedById: adminId,
        backendPermissionKey: p.backendPermissionKey,
        frontendPermissionKey: p.frontendPermissionKey || null,
        scope: p.scope,
        isGranted: p.isGranted,
        properties: p.scope === 'properties' ? p.properties : null,
        services: p.scope === 'services' ? p.services : null,
        propertyGroups: p.scope === 'property_groups' ? p.propertyGroups : null,
        serviceGroups: p.scope === 'service_groups' ? p.serviceGroups : null,
      }),
    );

    return this.managerPermRepo.save(newPerms);
  }

  // ─── HYPER MANAGER PERMISSION ASSIGNMENT ───────────────────────────────

  async setHyperManagerPermissions(
    hyperAdminId: number,
    hyperManagerId: number,
    permissions: {
      backendPermissionKey: string;
      frontendPermissionKey?: string;
      scope: HyperManagerPermissionScope;
      isGranted: boolean;
      properties?: string[];
      services?: string[];
      propertyGroups?: string[];
      serviceGroups?: string[];
      admins?: number[];
    }[],
  ): Promise<HyperManagerPermission[]> {
    const callerRole = await this.getUserRole(hyperAdminId);
    if (callerRole !== 'hyper_admin') {
      throw new ForbiddenException('Only hyper_admin can assign hyper_manager permissions');
    }

    const targetRole = await this.getUserRole(hyperManagerId);
    if (targetRole !== 'hyper_manager') {
      throw new ForbiddenException('Target user must have hyper_manager role');
    }

    await this.hyperPermRepo.delete({ hyperManagerId, assignedById: hyperAdminId });

    const newPerms = permissions.map(p =>
      this.hyperPermRepo.create({
        hyperManagerId,
        assignedById: hyperAdminId,
        backendPermissionKey: p.backendPermissionKey,
        frontendPermissionKey: p.frontendPermissionKey || null,
        scope: p.scope,
        isGranted: p.isGranted,
        properties: p.scope === 'properties' ? p.properties : null,
        services: p.scope === 'services' ? p.services : null,
        propertyGroups: p.scope === 'property_groups' ? p.propertyGroups : null,
        serviceGroups: p.scope === 'service_groups' ? p.serviceGroups : null,
        admins: p.scope === 'admins' ? p.admins : null,
      }),
    );

    return this.hyperPermRepo.save(newPerms);
  }

  // ─── GUEST PERMISSION ASSIGNMENT ──────────────────────────────────────

  async setGuestPermissions(
    assignerId: number,
    guestId: number,
    permissions: {
      backendPermissionKey: string;
      frontendPermissionKey?: string;
      scope: GuestPermissionScope;
      isGranted: boolean;
      properties?: string[];
      services?: string[];
      propertyGroups?: string[];
      serviceGroups?: string[];
    }[],
  ): Promise<GuestPermission[]> {
    const callerRole = await this.getUserRole(assignerId);
    if (!['hyper_admin', 'hyper_manager', 'admin', 'manager'].includes(callerRole)) {
      throw new ForbiddenException('Insufficient permissions to manage guest permissions');
    }

    const targetRole = await this.getUserRole(guestId);
    if (targetRole !== 'guest') {
      throw new ForbiddenException('Target user must have guest role');
    }

    await this.guestPermRepo.delete({ guestId, assignedById: assignerId });

    const newPerms = permissions.map(p =>
      this.guestPermRepo.create({
        guestId,
        assignedById: assignerId,
        backendPermissionKey: p.backendPermissionKey,
        frontendPermissionKey: p.frontendPermissionKey || null,
        scope: p.scope,
        isGranted: p.isGranted,
        properties: p.scope === 'properties' ? p.properties : null,
        services: p.scope === 'services' ? p.services : null,
        propertyGroups: p.scope === 'property_groups' ? p.propertyGroups : null,
        serviceGroups: p.scope === 'service_groups' ? p.serviceGroups : null,
      }),
    );

    return this.guestPermRepo.save(newPerms);
  }

  // ─── PERMISSION CHECKS ────────────────────────────────────────────────

  async hasPermissionForProperty(
    managerId: number,
    propertyId: string,
    permissionKey: string,
  ): Promise<boolean> {
    const perms = await this.managerPermRepo.find({
      where: { managerId, backendPermissionKey: permissionKey, isGranted: true },
    });

    for (const perm of perms) {
      if (perm.scope === 'all') {
        // Inherit inviter admin's properties.
        if (await this.isPropertyOwnedBy(propertyId, perm.assignedById)) return true;
        continue;
      }
      if (perm.scope === 'properties') {
        if (perm.properties && perm.properties.length > 0) {
          if (perm.properties.includes(propertyId)) return true;
        } else if (await this.isPropertyOwnedBy(propertyId, perm.assignedById)) {
          return true;
        }
      }
      if (perm.scope === 'property_groups') {
        if (perm.propertyGroups && perm.propertyGroups.length > 0) {
          for (const groupId of perm.propertyGroups) {
            const group = await this.propGroupRepo.findOne({
              where: { id: groupId },
              relations: ['properties'],
            });
            if (group?.properties?.some(p => p.id === propertyId)) return true;
          }
        } else if (await this.isPropertyOwnedBy(propertyId, perm.assignedById)) {
          return true;
        }
      }
    }
    return false;
  }

  /** Check property ownership by a given admin id (used for inviter-inherit fallback). */
  private async isPropertyOwnedBy(propertyId: string, adminId?: number): Promise<boolean> {
    if (!adminId) return false;
    const row = await this.userRepo.manager.query(
      'SELECT 1 FROM properties WHERE id = ? AND `hostId` = ? LIMIT 1',
      [propertyId, adminId],
    );
    return row.length > 0;
  }

  /** Fetch all property ids owned by the given admin ids. */
  private async propertyIdsOwnedBy(adminIds: number[]): Promise<string[]> {
    if (adminIds.length === 0) return [];
    const rows = await this.userRepo.manager.query(
      'SELECT id FROM properties WHERE `hostId` IN (?)',
      [adminIds],
    );
    return rows.map((r: any) => String(r.id));
  }

  /** Fetch all service ids owned by the given admin ids. */
  private async serviceIdsOwnedBy(adminIds: number[]): Promise<string[]> {
    if (adminIds.length === 0) return [];
    const rows = await this.userRepo.manager.query(
      'SELECT id FROM tourism_services WHERE `providerId` IN (?)',
      [adminIds],
    );
    return rows.map((r: any) => String(r.id));
  }

  async hasHyperManagerPermission(
    hyperManagerId: number,
    permissionKey: string,
  ): Promise<boolean> {
    const perm = await this.hyperPermRepo.findOne({
      where: { hyperManagerId, backendPermissionKey: permissionKey, isGranted: true },
    });
    return !!perm;
  }

  async hasGuestPermission(
    guestId: number,
    permissionKey: string,
  ): Promise<boolean> {
    const perm = await this.guestPermRepo.findOne({
      where: { guestId, backendPermissionKey: permissionKey, isGranted: true },
    });
    return !!perm;
  }

  // ─── MANAGER / HYPER / GUEST PERMISSION QUERIES ────────────────────────

  async getManagerPermissions(managerId: number, callerId?: number): Promise<ManagerPermission[]> {
    let where: any = { managerId, isGranted: true };
    if (callerId) {
      const callerRole = await this.getUserRole(callerId);
      if (callerRole === 'admin') {
        where.assignedById = callerId;
      }
    }
    return this.managerPermRepo.find({ where });
  }

  async getHyperManagerPermissions(hyperManagerId: number): Promise<HyperManagerPermission[]> {
    return this.hyperPermRepo.find({ where: { hyperManagerId, isGranted: true } });
  }

  async getGuestPermissions(guestId: number, callerId?: number): Promise<GuestPermission[]> {
    let where: any = { guestId, isGranted: true };
    if (callerId) {
      const callerRole = await this.getUserRole(callerId);
      if (callerRole === 'admin' || callerRole === 'manager') {
        where.assignedById = callerId;
      }
    }
    return this.guestPermRepo.find({ where });
  }

  // ─── SCOPE RESOLUTION ─────────────────────────────────────────────────

  async getManagerProperties(managerId: number): Promise<string[] | null> {
    const perms = await this.managerPermRepo.find({
      where: { managerId, isGranted: true },
    });
    if (perms.length === 0) return [];

    const propertyIds = new Set<string>();
    const inheritFromInviters = new Set<number>();

    for (const perm of perms) {
      if (perm.scope === 'all') {
        if (perm.assignedById) inheritFromInviters.add(perm.assignedById);
        continue;
      }
      if (perm.scope === 'properties') {
        if (perm.properties && perm.properties.length > 0) {
          perm.properties.forEach(id => propertyIds.add(id));
        } else if (perm.assignedById) {
          inheritFromInviters.add(perm.assignedById);
        }
        continue;
      }
      if (perm.scope === 'property_groups') {
        if (perm.propertyGroups && perm.propertyGroups.length > 0) {
          for (const groupId of perm.propertyGroups) {
            const group = await this.propGroupRepo.findOne({
              where: { id: groupId },
              relations: ['properties'],
            });
            if (group?.properties) group.properties.forEach(p => propertyIds.add(p.id));
          }
        } else if (perm.assignedById) {
          inheritFromInviters.add(perm.assignedById);
        }
        continue;
      }
      // Scope refers to services-only — still inherit inviter's property scope
      // so the manager can see the host's properties tied to those services.
      if (perm.assignedById) inheritFromInviters.add(perm.assignedById);
    }

    if (inheritFromInviters.size > 0) {
      const inviterIds = Array.from(inheritFromInviters);
      const ids = await this.propertyIdsOwnedBy(inviterIds);
      ids.forEach(id => propertyIds.add(id));
      logScopeFallback({
        source: 'RolesService.getManagerProperties',
        role: 'manager',
        userId: managerId,
        inviterIds,
        resolvedCount: ids.length,
        resourceKind: 'property',
        reason:
          'Manager has granted permissions without explicit property/group target — inheriting inviter admin\'s properties.',
      });
    }

    return Array.from(propertyIds);
  }

  async getGuestAccessibleProperties(guestId: number): Promise<string[] | null> {
    const perms = await this.guestPermRepo.find({
      where: { guestId, isGranted: true },
    });
    if (perms.length === 0) return [];

    const propertyIds = new Set<string>();
    const inheritFromInviters = new Set<number>();

    for (const perm of perms) {
      if (perm.scope === 'all') {
        if (perm.assignedById) inheritFromInviters.add(perm.assignedById);
        continue;
      }
      if (perm.scope === 'properties') {
        if (perm.properties && perm.properties.length > 0) {
          perm.properties.forEach(id => propertyIds.add(id));
        } else if (perm.assignedById) {
          inheritFromInviters.add(perm.assignedById);
        }
        continue;
      }
      if (perm.scope === 'property_groups') {
        if (perm.propertyGroups && perm.propertyGroups.length > 0) {
          for (const groupId of perm.propertyGroups) {
            const group = await this.propGroupRepo.findOne({
              where: { id: groupId },
              relations: ['properties'],
            });
            if (group?.properties) group.properties.forEach(p => propertyIds.add(p.id));
          }
        } else if (perm.assignedById) {
          inheritFromInviters.add(perm.assignedById);
        }
        continue;
      }
      if (perm.assignedById) inheritFromInviters.add(perm.assignedById);
    }

    if (inheritFromInviters.size > 0) {
      const inviterIds = Array.from(inheritFromInviters);
      const ids = await this.propertyIdsOwnedBy(inviterIds);
      ids.forEach(id => propertyIds.add(id));
      logScopeFallback({
        source: 'RolesService.getGuestAccessibleProperties',
        role: 'guest',
        userId: guestId,
        inviterIds,
        resolvedCount: ids.length,
        resourceKind: 'property',
        reason:
          'Guest has granted permissions without explicit property/group target — inheriting inviter\'s properties.',
      });
    }

    return Array.from(propertyIds);
  }

  async getGuestAccessibleServices(guestId: number): Promise<string[] | null> {
    const perms = await this.guestPermRepo.find({
      where: { guestId, isGranted: true },
    });
    if (perms.length === 0) return [];

    const serviceIds = new Set<string>();
    const inheritFromInviters = new Set<number>();

    for (const perm of perms) {
      if (perm.scope === 'all') {
        if (perm.assignedById) inheritFromInviters.add(perm.assignedById);
        continue;
      }
      if (perm.scope === 'services') {
        if (perm.services && perm.services.length > 0) {
          perm.services.forEach(id => serviceIds.add(id));
        } else if (perm.assignedById) {
          inheritFromInviters.add(perm.assignedById);
        }
        continue;
      }
      if (perm.scope === 'service_groups') {
        // Resolved elsewhere; if empty, inherit inviter's full service list.
        if (!perm.serviceGroups || perm.serviceGroups.length === 0) {
          if (perm.assignedById) inheritFromInviters.add(perm.assignedById);
        }
        continue;
      }
      // Property-scoped perms: still grant access to the inviter's services.
      if (perm.assignedById) inheritFromInviters.add(perm.assignedById);
    }

    if (inheritFromInviters.size > 0) {
      const inviterIds = Array.from(inheritFromInviters);
      const ids = await this.serviceIdsOwnedBy(inviterIds);
      ids.forEach(id => serviceIds.add(id));
      logScopeFallback({
        source: 'RolesService.getGuestAccessibleServices',
        role: 'guest',
        userId: guestId,
        inviterIds,
        resolvedCount: ids.length,
        resourceKind: 'service',
        reason:
          'Guest has granted permissions without explicit service/group target — inheriting inviter\'s services.',
      });
    }

    return Array.from(serviceIds);
  }

  async createGuestPermissionsFromInviter(
    inviterId: number,
    guestId: number,
  ): Promise<void> {
    const inviterRole = await this.getUserRole(inviterId);

    if (inviterRole === 'hyper_admin') {
      const perm = this.guestPermRepo.create({
        guestId,
        assignedById: inviterId,
        backendPermissionKey: 'view_property',
        scope: 'all' as GuestPermissionScope,
        isGranted: true,
      });
      await this.guestPermRepo.save(perm);
    } else if (inviterRole === 'admin') {
      const adminPropertyIds = await this.getAdminPropertyIds(inviterId);
      if (adminPropertyIds.length === 0) return;

      const perm = this.guestPermRepo.create({
        guestId,
        assignedById: inviterId,
        backendPermissionKey: 'view_property',
        scope: 'properties' as GuestPermissionScope,
        properties: adminPropertyIds,
        isGranted: true,
      });
      await this.guestPermRepo.save(perm);
    } else if (inviterRole === 'hyper_manager' || inviterRole === 'manager') {
      const inviterPerms = inviterRole === 'hyper_manager'
        ? await this.hyperPermRepo.find({ where: { hyperManagerId: inviterId, isGranted: true } })
        : await this.managerPermRepo.find({ where: { managerId: inviterId, isGranted: true } });

      for (const src of inviterPerms) {
        const perm = this.guestPermRepo.create({
          guestId,
          assignedById: inviterId,
          backendPermissionKey: src.backendPermissionKey,
          frontendPermissionKey: src.frontendPermissionKey,
          scope: src.scope as GuestPermissionScope,
          properties: src.properties,
          services: src.services,
          propertyGroups: src.propertyGroups,
          serviceGroups: src.serviceGroups,
          isGranted: true,
        });
        await this.guestPermRepo.save(perm);
      }
    }
  }

  // ─── USER MANAGEMENT ──────────────────────────────────────────────────

  async getAllUsersWithRoles(
    callerId?: number,
    pagination?: { page?: number; pageSize?: number; search?: string; role?: string },
  ) {
    const callerRole = callerId ? await this.getUserRole(callerId) : 'hyper_admin';
    const isHyper = callerRole === 'hyper_admin' || callerRole === 'hyper_manager';

    let users;
    if (isHyper) {
      users = await this.userRepo.find({ where: { isActive: true } });
      users = users.filter(u => !(callerRole === 'hyper_manager' && u.getRole() === 'hyper_admin'));
    } else {
      const invitedIds = await this.getInvitedUserIds(callerId);
      if (invitedIds.length === 0) {
        return pagination?.page ? { data: [], total: 0, page: pagination.page, pageSize: pagination.pageSize ?? 20 } : [];
      }
      users = await this.userRepo.find({ where: invitedIds.map(id => ({ id })) });
      users = users.filter(u => {
        if (callerRole === 'admin') return ['manager', 'guest'].includes(u.getRole());
        if (callerRole === 'manager') return u.getRole() === 'guest';
        return true;
      });
    }

    let mapped = users.map(u => ({
      id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName,
      role: u.getRole(), isActive: u.isActive,
    }));

    if (pagination?.search) {
      const q = pagination.search.toLowerCase();
      mapped = mapped.filter(u =>
        (u.email || '').toLowerCase().includes(q) ||
        (u.firstName || '').toLowerCase().includes(q) ||
        (u.lastName || '').toLowerCase().includes(q));
    }
    if (pagination?.role) mapped = mapped.filter(u => u.role === pagination.role);

    if (!pagination?.page) return mapped;

    const page = Math.max(1, pagination.page);
    const pageSize = Math.max(1, Math.min(200, pagination.pageSize ?? 20));
    const total = mapped.length;
    const data = mapped.slice((page - 1) * pageSize, page * pageSize);
    return { data, total, page, pageSize };
  }

  async getAllAssignments(callerId?: string | number, pagination?: { page?: number; pageSize?: number; type?: 'manager' | 'hyper_manager' | 'guest' }) {
    if (typeof callerId === 'string') callerId = parseInt(callerId, 10);
    const callerRole = callerId ? await this.getUserRole(callerId) : 'hyper_admin';
    const isHyper = callerRole === 'hyper_admin' || callerRole === 'hyper_manager';

    let result: { managerPermissions: any[]; hyperManagerPermissions: any[]; guestPermissions: any[] };
    if (isHyper) {
      const [managerPerms, hyperPerms, guestPerms] = await Promise.all([
        this.managerPermRepo.find({ where: { isGranted: true }, relations: ['manager'] }),
        this.hyperPermRepo.find({ where: { isGranted: true }, relations: ['hyperManager'] }),
        this.guestPermRepo.find({ where: { isGranted: true }, relations: ['guest'] }),
      ]);
      result = { managerPermissions: managerPerms, hyperManagerPermissions: hyperPerms, guestPermissions: guestPerms };
    } else if (callerRole === 'admin') {
      const [managerPerms, guestPerms] = await Promise.all([
        this.managerPermRepo.find({ where: { assignedById: callerId, isGranted: true }, relations: ['manager'] }),
        this.guestPermRepo.find({ where: { assignedById: callerId, isGranted: true }, relations: ['guest'] }),
      ]);
      result = { managerPermissions: managerPerms, hyperManagerPermissions: [], guestPermissions: guestPerms };
    } else if (callerRole === 'manager') {
      const managerPerms = await this.managerPermRepo.find({ where: { managerId: callerId, isGranted: true } });
      const guestPerms = await this.guestPermRepo.find({ where: { assignedById: callerId, isGranted: true }, relations: ['guest'] });
      result = { managerPermissions: managerPerms, hyperManagerPermissions: [], guestPermissions: guestPerms };
    } else {
      result = { managerPermissions: [], hyperManagerPermissions: [], guestPermissions: [] };
    }

    if (!pagination?.page) return result;
    const page = Math.max(1, pagination.page);
    const pageSize = Math.max(1, Math.min(200, pagination.pageSize ?? 20));
    const slice = (arr: any[]) => arr.slice((page - 1) * pageSize, page * pageSize);
    const t = pagination.type;
    return {
      managerPermissions: !t || t === 'manager' ? slice(result.managerPermissions) : [],
      hyperManagerPermissions: !t || t === 'hyper_manager' ? slice(result.hyperManagerPermissions) : [],
      guestPermissions: !t || t === 'guest' ? slice(result.guestPermissions) : [],
      totals: {
        managerPermissions: result.managerPermissions.length,
        hyperManagerPermissions: result.hyperManagerPermissions.length,
        guestPermissions: result.guestPermissions.length,
      },
      page,
      pageSize,
    };
  }

  async removePermission(adminId: number, permissionId: string, type: 'manager' | 'hyper_manager' | 'guest'): Promise<void> {
    const adminRole = await this.getUserRole(adminId);
    if (!['hyper_admin', 'hyper_manager', 'admin'].includes(adminRole)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    if (type === 'manager') {
      const perm = await this.managerPermRepo.findOne({ where: { id: permissionId } });
      if (!perm) throw new NotFoundException('Permission not found');
      if (adminRole === 'admin' && perm.assignedById !== adminId) {
        throw new ForbiddenException('Admin can only manage their own permissions');
      }
      await this.managerPermRepo.delete(permissionId);
    } else if (type === 'hyper_manager') {
      if (adminRole !== 'hyper_admin') throw new ForbiddenException('Only hyper_admin can manage hyper_manager permissions');
      await this.hyperPermRepo.delete(permissionId);
    } else if (type === 'guest') {
      const perm = await this.guestPermRepo.findOne({ where: { id: permissionId } });
      if (!perm) throw new NotFoundException('Permission not found');
      if (adminRole === 'admin' && perm.assignedById !== adminId) {
        throw new ForbiddenException('Admin can only manage their own permissions');
      }
      await this.guestPermRepo.delete(permissionId);
    }
  }

  async updateUserStatus(adminId: number, userId: number, status: string): Promise<void> {
    const adminRole = await this.getUserRole(adminId);
    if (!['hyper_admin', 'hyper_manager', 'admin'].includes(adminRole)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    if (adminRole === 'admin') {
      const targetRole = await this.getUserRole(userId);
      if (targetRole !== 'manager' && targetRole !== 'guest') {
        throw new ForbiddenException('Admin can only manage manager and guest accounts');
      }
      const invitedIds = await this.getInvitedUserIds(adminId);
      if (!invitedIds.includes(userId)) {
        throw new ForbiddenException('Admin can only manage their own invitees');
      }
    }

    await this.userRepo.update(userId, { isActive: status === 'active' });
  }

  async deleteUser(adminId: number, userId: number): Promise<void> {
    const adminRole = await this.getUserRole(adminId);
    if (adminRole !== 'hyper_admin' && adminRole !== 'hyper_manager') {
      throw new ForbiddenException('Only hyper_admin or hyper_manager can delete users');
    }
    await this.userRepo.delete(userId);
  }

  // ─── MVP HELPERS ──────────────────────────────────────────────────────

  async removeAllPermissions(userId: number): Promise<void> {
    await Promise.all([
      this.managerPermRepo.delete({ managerId: userId }),
      this.hyperPermRepo.delete({ hyperManagerId: userId }),
      this.guestPermRepo.delete({ guestId: userId }),
    ]);
  }

  async setUserRoleDirect(userId: number, role: AppRole): Promise<void> {
    await this.setUserRole(userId, role);
  }

  // ─── OWNERSHIP CHECKS ─────────────────────────────────────────────────

  async isPropertyOwner(adminId: number, propertyId: string): Promise<boolean> {
    const role = await this.getUserRole(adminId);
    // Only hyper_admin has unrestricted global access.
    // hyper_manager is bounded by hyper_manager_permissions and must
    // pass through scope-aware checks (handled in services via ScopeFilterService).
    if (role === 'hyper_admin') return true;

    const result = await this.userRepo.manager.query(
      `SELECT COUNT(*) as count FROM properties WHERE id = $1 AND "hostId" = $2`,
      [propertyId, adminId],
    );
    return parseInt(result?.[0]?.count, 10) > 0;
  }

  async isServiceOwner(adminId: number, serviceId: string): Promise<boolean> {
    const role = await this.getUserRole(adminId);
    if (role === 'hyper_admin') return true;

    const result = await this.userRepo.manager.query(
      `SELECT COUNT(*) as count FROM tourism_services WHERE id = $1 AND "providerId" = $2`,
      [serviceId, adminId],
    );
    return parseInt(result?.[0]?.count, 10) > 0;
  }

  async getAdminPropertyIds(adminId: number): Promise<string[]> {
    const result = await this.userRepo.manager.query(
      `SELECT id FROM properties WHERE "hostId" = $1`,
      [adminId],
    );
    return result.map((r: any) => String(r.id));
  }

  async getAdminServiceIds(adminId: number): Promise<string[]> {
    const result = await this.userRepo.manager.query(
      `SELECT id FROM tourism_services WHERE "providerId" = $1`,
      [adminId],
    );
    return result.map((r: any) => String(r.id));
  }
}
