import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AppRole, ROLE_HIERARCHY } from '../entity/user.entity';
import { ManagerPermission, PermissionScope } from '../entity/manager-permission.entity';
import { HyperManagerPermission, HyperManagerPermissionScope } from '../entity/hyper-manager-permission.entity';
import { GuestPermission, GuestPermissionScope } from '../entity/guest-permission.entity';
import { PropertyGroupMembership } from '../../properties/entity/property-group-membership.entity';
import { Invitation } from '../entity/invitation.entity';


// ─────────────────────────────────────────────────────────────────────────────
// INVITATION RULES
// ─────────────────────────────────────────────────────────────────────────────
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
    @InjectRepository(PropertyGroupMembership)
    private readonly membershipRepo: Repository<PropertyGroupMembership>,
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
  ) {}


  // ─────────────────────────────────────────────────────────────────────────
  // ROLE HELPERS
  // ─────────────────────────────────────────────────────────────────────────

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


  // ─────────────────────────────────────────────────────────────────────────
  // HELPERS — invited user IDs
  // ─────────────────────────────────────────────────────────────────────────

  private async getInvitedUserIds(inviterId: number): Promise<number[]> {
    const invitations = await this.invitationRepo.find({
      where: { invitedBy: inviterId, status: 'accepted' as any },
    });

    // Get manager IDs from manager_permissions assigned by this user
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


  // ─────────────────────────────────────────────────────────────────────────
  // DASHBOARD STATS
  // ─────────────────────────────────────────────────────────────────────────

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

      const totalGroups = await this.membershipRepo
        .createQueryBuilder('m')
        .select('COUNT(DISTINCT m.groupId)', 'count')
        .getRawOne()
        .then(r => parseInt(r.count, 10) || 0);

      const totalManagerPerms = await this.managerPermRepo.count({ where: { isGranted: true } });
      const totalHyperPerms = await this.hyperPermRepo.count({ where: { isGranted: true } });

      return {
        totalUsers: users.length,
        totalGroups,
        activeManagers: totalManagers,
        totalAssignments: totalManagerPerms + totalHyperPerms,
        totalAdmins,
        totalManagers,
        totalRegularUsers,
        totalGuests,
        hyperAdmins,
        hyperManagers,
      };
    }

    // Admin/Manager: scoped stats
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
      totalAdmins: 0,
      totalManagers: managersCount,
      totalRegularUsers: 0,
      totalGuests: guestsCount,
      hyperAdmins: 0,
      hyperManagers: 0,
    };
  }


  // ─────────────────────────────────────────────────────────────────────────
  // ROLE ASSIGNMENT
  // ─────────────────────────────────────────────────────────────────────────

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


  // ─────────────────────────────────────────────────────────────────────────
  // MANAGER PERMISSION ASSIGNMENT
  // ─────────────────────────────────────────────────────────────────────────

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

    // Remove existing permissions assigned by this admin for this manager
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


  // ─────────────────────────────────────────────────────────────────────────
  // HYPER MANAGER PERMISSION ASSIGNMENT
  // ─────────────────────────────────────────────────────────────────────────

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


  // ─────────────────────────────────────────────────────────────────────────
  // GUEST PERMISSION ASSIGNMENT
  // ─────────────────────────────────────────────────────────────────────────

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


  // ─────────────────────────────────────────────────────────────────────────
  // PERMISSION CHECKS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Check if a manager has a specific backend permission for a property.
   */
  async hasPermissionForProperty(
    managerId: number,
    propertyId: string,
    permissionKey: string,
  ): Promise<boolean> {
    const perms = await this.managerPermRepo.find({
      where: { managerId, backendPermissionKey: permissionKey, isGranted: true },
    });

    for (const perm of perms) {
      if (perm.scope === 'all') return true;
      if (perm.scope === 'properties' && perm.properties?.includes(propertyId)) return true;
      if (perm.scope === 'property_groups' && perm.propertyGroups?.length) {
        for (const groupId of perm.propertyGroups) {
          const membership = await this.membershipRepo.findOne({
            where: { propertyId, groupId },
          });
          if (membership) return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if a hyper_manager has a specific permission.
   */
  async hasHyperManagerPermission(
    hyperManagerId: number,
    permissionKey: string,
  ): Promise<boolean> {
    const perm = await this.hyperPermRepo.findOne({
      where: { hyperManagerId, backendPermissionKey: permissionKey, isGranted: true },
    });
    return !!perm;
  }

  /**
   * Get manager permissions with their scopes.
   */
  async getManagerPermissions(
    managerId: number,
    callerId?: number,
  ): Promise<ManagerPermission[]> {
    let where: any = { managerId, isGranted: true };

    if (callerId) {
      const callerRole = await this.getUserRole(callerId);
      if (callerRole === 'admin') {
        where.assignedById = callerId;
      }
    }

    return this.managerPermRepo.find({ where });
  }

  /**
   * Get hyper_manager permissions.
   */
  async getHyperManagerPermissions(hyperManagerId: number): Promise<HyperManagerPermission[]> {
    return this.hyperPermRepo.find({
      where: { hyperManagerId, isGranted: true },
    });
  }

  /**
   * Get guest permissions.
   */
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


  // ─────────────────────────────────────────────────────────────────────────
  // SCOPE RESOLUTION — get accessible resource IDs
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Returns property IDs in a manager's scope, or null for global scope.
   */
  async getManagerProperties(managerId: number): Promise<string[] | null> {
    const perms = await this.managerPermRepo.find({
      where: { managerId, isGranted: true },
    });

    const propertyIds = new Set<string>();

    for (const perm of perms) {
      if (perm.scope === 'all') return null;
      if (perm.scope === 'properties' && perm.properties) {
        perm.properties.forEach(id => propertyIds.add(id));
      }
      if (perm.scope === 'property_groups' && perm.propertyGroups) {
        for (const groupId of perm.propertyGroups) {
          const memberships = await this.membershipRepo.find({ where: { groupId } });
          memberships.forEach(m => propertyIds.add(m.propertyId));
        }
      }
    }

    return Array.from(propertyIds);
  }

  /**
   * Returns property IDs accessible by a guest, or null for global.
   */
  async getGuestAccessibleProperties(guestId: number): Promise<string[] | null> {
    const perms = await this.guestPermRepo.find({
      where: { guestId, isGranted: true },
    });

    if (perms.length === 0) return [];
    const propertyIds = new Set<string>();

    for (const perm of perms) {
      if (perm.scope === 'all') return null;
      if (perm.scope === 'properties' && perm.properties) {
        perm.properties.forEach(id => propertyIds.add(id));
      }
      if (perm.scope === 'property_groups' && perm.propertyGroups) {
        for (const groupId of perm.propertyGroups) {
          const memberships = await this.membershipRepo.find({ where: { groupId } });
          memberships.forEach(m => propertyIds.add(m.propertyId));
        }
      }
    }

    return Array.from(propertyIds);
  }

  /**
   * Returns service IDs accessible by a guest, or null for global.
   */
  async getGuestAccessibleServices(guestId: number): Promise<string[] | null> {
    const perms = await this.guestPermRepo.find({
      where: { guestId, isGranted: true },
    });

    if (perms.length === 0) return [];
    if (perms.some(p => p.scope === 'all')) return null;

    const serviceIds = new Set<string>();
    for (const perm of perms) {
      if (perm.scope === 'services' && perm.services) {
        perm.services.forEach(id => serviceIds.add(id));
      }
    }

    // Also derive services from assigned admins
    const assignerIds = [...new Set(perms.map(p => p.assignedById))];
    for (const adminId of assignerIds) {
      const result = await this.userRepo.manager.query(
        `SELECT id FROM tourism_services WHERE "providerId" = $1`,
        [adminId],
      );
      result.forEach((r: any) => serviceIds.add(String(r.id)));
    }

    return Array.from(serviceIds);
  }

  /**
   * Create guest permissions from inviter's scope.
   */
  async createGuestPermissionsFromInviter(
    inviterId: number,
    guestId: number,
  ): Promise<void> {
    const inviterRole = await this.getUserRole(inviterId);

    if (inviterRole === 'hyper_admin') {
      // Global scope
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
      // Copy inviter's scope
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


  // ─────────────────────────────────────────────────────────────────────────
  // USER MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────

  async getAllUsersWithRoles(callerId?: number): Promise<{
    id: number; email: string; firstName: string; lastName: string; role: AppRole; isActive: boolean;
  }[]> {
    const callerRole = callerId ? await this.getUserRole(callerId) : 'hyper_admin';
    const isHyper = callerRole === 'hyper_admin' || callerRole === 'hyper_manager';

    if (isHyper) {
      const users = await this.userRepo.find({ where: { isActive: true } });
      return users
        .filter(u => !(callerRole === 'hyper_manager' && u.getRole() === 'hyper_admin'))
        .map(u => ({
          id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName,
          role: u.getRole(), isActive: u.isActive,
        }));
    }

    const invitedIds = await this.getInvitedUserIds(callerId);
    if (invitedIds.length === 0) return [];

    const users = await this.userRepo.find({ where: invitedIds.map(id => ({ id })) });
    return users
      .filter(u => {
        if (callerRole === 'admin') return ['manager', 'guest'].includes(u.getRole());
        if (callerRole === 'manager') return u.getRole() === 'guest';
        return true;
      })
      .map(u => ({
        id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName,
        role: u.getRole(), isActive: u.isActive,
      }));
  }

  async getAllAssignments(callerId?: string | number) {
    if (typeof callerId === 'string') callerId = parseInt(callerId, 10);
    const callerRole = callerId ? await this.getUserRole(callerId) : 'hyper_admin';
    const isHyper = callerRole === 'hyper_admin' || callerRole === 'hyper_manager';

    if (isHyper) {
      const [managerPerms, hyperPerms, guestPerms] = await Promise.all([
        this.managerPermRepo.find({ where: { isGranted: true }, relations: ['manager'] }),
        this.hyperPermRepo.find({ where: { isGranted: true }, relations: ['hyperManager'] }),
        this.guestPermRepo.find({ where: { isGranted: true }, relations: ['guest'] }),
      ]);
      return { managerPermissions: managerPerms, hyperManagerPermissions: hyperPerms, guestPermissions: guestPerms };
    }

    if (callerRole === 'admin') {
      const [managerPerms, guestPerms] = await Promise.all([
        this.managerPermRepo.find({ where: { assignedById: callerId, isGranted: true }, relations: ['manager'] }),
        this.guestPermRepo.find({ where: { assignedById: callerId, isGranted: true }, relations: ['guest'] }),
      ]);
      return { managerPermissions: managerPerms, hyperManagerPermissions: [], guestPermissions: guestPerms };
    }

    if (callerRole === 'manager') {
      const managerPerms = await this.managerPermRepo.find({
        where: { managerId: callerId, isGranted: true },
      });
      const guestPerms = await this.guestPermRepo.find({
        where: { assignedById: callerId, isGranted: true }, relations: ['guest'],
      });
      return { managerPermissions: managerPerms, hyperManagerPermissions: [], guestPermissions: guestPerms };
    }

    return { managerPermissions: [], hyperManagerPermissions: [], guestPermissions: [] };
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


  // ─────────────────────────────────────────────────────────────────────────
  // MVP HELPERS
  // ─────────────────────────────────────────────────────────────────────────

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


  // ─────────────────────────────────────────────────────────────────────────
  // OWNERSHIP CHECKS
  // ─────────────────────────────────────────────────────────────────────────

  async isPropertyOwner(adminId: number, propertyId: string): Promise<boolean> {
    const role = await this.getUserRole(adminId);
    if (role === 'hyper_admin' || role === 'hyper_manager') return true;

    const result = await this.userRepo.manager.query(
      `SELECT COUNT(*) as count FROM properties WHERE id = $1 AND "hostId" = $2`,
      [propertyId, adminId],
    );
    return parseInt(result?.[0]?.count, 10) > 0;
  }

  async isServiceOwner(adminId: number, serviceId: string): Promise<boolean> {
    const role = await this.getUserRole(adminId);
    if (role === 'hyper_admin' || role === 'hyper_manager') return true;

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
