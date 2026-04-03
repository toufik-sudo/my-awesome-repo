import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AppRole, ROLE_HIERARCHY } from '../entity/user.entity';
import { ManagerAssignment, AssignmentScope } from '../entity/manager-assignment.entity';
import { ManagerPermission, PermissionType } from '../entity/manager-permission.entity';
import { PropertyGroupMembership } from '../../properties/entity/property-group-membership.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ManagerAssignment)
    private readonly assignmentRepo: Repository<ManagerAssignment>,
    @InjectRepository(ManagerPermission)
    private readonly permissionRepo: Repository<ManagerPermission>,
    @InjectRepository(PropertyGroupMembership)
    private readonly membershipRepo: Repository<PropertyGroupMembership>,
  ) {}

  // ─── Role helpers (read from users.role) ──────────────────────────────

  async getUserRole(userId: number): Promise<AppRole> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return 'user';
    return user.getRole();
  }

  /**
   * @deprecated Use getUserRole() — returns array for backward compat
   */
  async getUserRoles(userId: number): Promise<AppRole[]> {
    const role = await this.getUserRole(userId);
    return [role];
  }

  async hasRole(userId: number, role: AppRole): Promise<boolean> {
    const userRole = await this.getUserRole(userId);
    return userRole === role;
  }

  private async setUserRole(userId: number, role: AppRole): Promise<void> {
    await this.userRepo.update(userId, { role });
  }

  // ─── Dashboard stats ──────────────────────────────────────────────────

  async getDashboardStats() {
    const users = await this.userRepo.find({ where: { isActive: true } });

    let totalAdmins = 0;
    let totalManagers = 0;
    let totalRegularUsers = 0;
    let totalGuests = 0;
    let hyperAdmins = 0;
    let hyperManagers = 0;

    for (const u of users) {
      const role = u.getRole();
      if (role === 'hyper_admin') hyperAdmins++;
      else if (role === 'hyper_manager') hyperManagers++;
      else if (role === 'admin') totalAdmins++;
      else if (role === 'manager') totalManagers++;
      else if (role === 'guest') totalGuests++;
      else totalRegularUsers++;
    }

    const totalGroups = await this.membershipRepo.createQueryBuilder('m')
      .select('COUNT(DISTINCT m.groupId)', 'count')
      .getRawOne()
      .then(r => parseInt(r.count, 10) || 0);

    const totalAssignments = await this.assignmentRepo.count({ where: { isActive: true } });

    return {
      totalUsers: users.length,
      totalGroups,
      activeManagers: totalManagers,
      totalAssignments,
      totalAdmins,
      totalManagers,
      totalRegularUsers,
      totalGuests,
      hyperAdmins,
      hyperManagers,
    };
  }

  // ─── Role assignment ──────────────────────────────────────────────────

  async assignRole(assignerId: number, userId: number, role: AppRole) {
    const assignerRole = await this.getUserRole(assignerId);

    // Permission checks
    if ((role === 'hyper_admin' || role === 'hyper_manager') && assignerRole !== 'hyper_admin') {
      throw new ForbiddenException('Only hyper_admin can assign hyper_admin or hyper_manager roles');
    }

    if (role === 'admin' && assignerRole !== 'hyper_admin' && assignerRole !== 'hyper_manager') {
      throw new ForbiddenException('Only hyper_admin or hyper_manager can assign admin role');
    }

    if (role === 'manager' && !['hyper_admin', 'hyper_manager', 'admin'].includes(assignerRole)) {
      throw new ForbiddenException('Only hyper_admin, hyper_manager, or admin can assign manager role');
    }

    if (role === 'guest' && ['user', 'guest'].includes(assignerRole)) {
      throw new ForbiddenException('Users and guests cannot assign guest role');
    }

    const currentRole = await this.getUserRole(userId);
    if (currentRole === role) {
      return { userId, role: currentRole };
    }

    // Check hierarchy — can only promote to roles below assigner
    if (ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[assignerRole] && assignerRole !== 'hyper_admin') {
      throw new ForbiddenException(`Cannot assign role '${role}' — insufficient hierarchy level`);
    }

    await this.setUserRole(userId, role);
    return { userId, role };
  }

  async removeRole(removerId: number, userId: number, _role: AppRole): Promise<void> {
    const removerRole = await this.getUserRole(removerId);

    if (!['hyper_admin', 'hyper_manager', 'admin'].includes(removerRole)) {
      throw new ForbiddenException('Insufficient permissions to remove roles');
    }

    const currentRole = await this.getUserRole(userId);
    if ((currentRole === 'hyper_admin' || currentRole === 'hyper_manager') && removerRole !== 'hyper_admin') {
      throw new ForbiddenException('Only hyper_admin can remove hyper_admin or hyper_manager roles');
    }

    // Demote to 'user'
    await this.setUserRole(userId, 'user');
  }

  // ─── Manager assignment ───────────────────────────────────────────────

  async assignManager(
    adminId: number,
    managerId: number,
    scope: AssignmentScope,
    propertyId?: string,
    propertyGroupId?: string,
  ): Promise<ManagerAssignment> {
    const adminRole = await this.getUserRole(adminId);
    if (!['hyper_admin', 'hyper_manager', 'admin'].includes(adminRole)) {
      throw new ForbiddenException('Only hyper_admin, hyper_manager, or admin can assign managers');
    }

    const managerRole = await this.getUserRole(managerId);

    // Hyper admin can only assign hyper_managers
    if (adminRole === 'hyper_admin' || adminRole === 'hyper_manager') {
      if (managerRole !== 'hyper_manager') {
        throw new ForbiddenException('Hyper admin can only assign hyper_managers');
      }
    } else {
      // Admin can only assign managers
      if (managerRole !== 'manager') {
        throw new ForbiddenException('User must have manager role to be assigned');
      }
    }

    const assignment = this.assignmentRepo.create({
      managerId,
      assignedByAdminId: adminId,
      scope,
      propertyId: scope === 'property' ? propertyId : null,
      propertyGroupId: scope === 'property_group' ? propertyGroupId : null,
    });

    return this.assignmentRepo.save(assignment);
  }

  // ─── Permissions ──────────────────────────────────────────────────────

  async setPermissions(
    adminId: number,
    assignmentId: string,
    permissions: { permission: PermissionType; isGranted: boolean }[],
  ): Promise<ManagerPermission[]> {
    const assignment = await this.assignmentRepo.findOne({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    const adminRole = await this.getUserRole(adminId);
    if (!['hyper_admin', 'hyper_manager', 'admin'].includes(adminRole)) {
      throw new ForbiddenException('Only hyper_admin, hyper_manager, or admin can set permissions');
    }

    // Admin can only set permissions on their own assignments
    if (adminRole === 'admin' && assignment.assignedByAdminId !== adminId) {
      throw new ForbiddenException('Admin can only manage permissions for their own managers');
    }

    await this.permissionRepo.delete({ assignmentId });

    const newPermissions = permissions.map(p =>
      this.permissionRepo.create({
        assignmentId,
        permission: p.permission,
        isGranted: p.isGranted,
      })
    );

    return this.permissionRepo.save(newPermissions);
  }

  async hasPermissionForProperty(
    managerId: number,
    propertyId: string,
    permission: PermissionType,
  ): Promise<boolean> {
    const assignments = await this.assignmentRepo.find({
      where: { managerId, isActive: true },
      relations: ['propertyGroup'],
    });

    for (const assignment of assignments) {
      let coversProperty = false;

      if (assignment.scope === 'all') {
        coversProperty = true;
      } else if (assignment.scope === 'property' && assignment.propertyId === propertyId) {
        coversProperty = true;
      } else if (assignment.scope === 'property_group' && assignment.propertyGroupId) {
        const membership = await this.membershipRepo.findOne({
          where: { propertyId, groupId: assignment.propertyGroupId },
        });
        coversProperty = !!membership;
      }

      if (coversProperty) {
        const perm = await this.permissionRepo.findOne({
          where: { assignmentId: assignment.id, permission, isGranted: true },
        });
        if (perm) return true;
      }
    }

    return false;
  }

  async getManagerPermissions(managerId: number): Promise<{
    assignment: ManagerAssignment;
    permissions: ManagerPermission[];
  }[]> {
    const assignments = await this.assignmentRepo.find({
      where: { managerId, isActive: true },
      relations: ['property', 'propertyGroup'],
    });

    const result = [];
    for (const assignment of assignments) {
      const permissions = await this.permissionRepo.find({
        where: { assignmentId: assignment.id },
      });
      result.push({ assignment, permissions });
    }

    return result;
  }

  async getManagerProperties(managerId: number): Promise<string[]> {
    const assignments = await this.assignmentRepo.find({
      where: { managerId, isActive: true },
    });

    const propertyIds = new Set<string>();

    for (const assignment of assignments) {
      if (assignment.scope === 'all') {
        return null; // All properties
      } else if (assignment.scope === 'property' && assignment.propertyId) {
        propertyIds.add(assignment.propertyId);
      } else if (assignment.scope === 'property_group' && assignment.propertyGroupId) {
        const memberships = await this.membershipRepo.find({
          where: { groupId: assignment.propertyGroupId },
        });
        memberships.forEach(m => propertyIds.add(m.propertyId));
      }
    }

    return Array.from(propertyIds);
  }

  // ─── Guest scope resolution ───────────────────────────────────────────

  /**
   * Creates read-only assignments for a guest based on the inviter's scope.
   * - hyper_admin → scope 'all'
   * - hyper_manager → copy hyper_manager's assignments
   * - admin → scope 'all' (within admin's own hostId — enforced at query level)
   * - manager → copy manager's assignments
   */
  async createGuestAssignmentsFromInviter(
    inviterId: number,
    guestId: number,
  ): Promise<void> {
    const inviterRole = await this.getUserRole(inviterId);

    if (inviterRole === 'hyper_admin') {
      // Guest gets access to all properties
      const assignment = this.assignmentRepo.create({
        managerId: guestId,
        assignedByAdminId: inviterId,
        scope: 'all' as AssignmentScope,
      });
      await this.assignmentRepo.save(assignment);
    } else if (inviterRole === 'admin') {
      // Guest gets access to all of this admin's properties
      const assignment = this.assignmentRepo.create({
        managerId: guestId,
        assignedByAdminId: inviterId,
        scope: 'all' as AssignmentScope,
      });
      await this.assignmentRepo.save(assignment);
    } else if (inviterRole === 'hyper_manager' || inviterRole === 'manager') {
      // Copy the inviter's own assignments to the guest
      const inviterAssignments = await this.assignmentRepo.find({
        where: { managerId: inviterId, isActive: true },
      });

      for (const src of inviterAssignments) {
        const assignment = this.assignmentRepo.create({
          managerId: guestId,
          assignedByAdminId: src.assignedByAdminId,
          scope: src.scope,
          propertyId: src.propertyId,
          propertyGroupId: src.propertyGroupId,
        });
        await this.assignmentRepo.save(assignment);
      }
    }
  }

  /**
   * Get all property IDs a guest can access (read-only).
   * Uses assignments table — guests get assignments like managers.
   */
  async getGuestAccessibleProperties(guestId: number): Promise<string[] | null> {
    const assignments = await this.assignmentRepo.find({
      where: { managerId: guestId, isActive: true },
    });

    if (assignments.length === 0) return [];

    const propertyIds = new Set<string>();

    for (const assignment of assignments) {
      if (assignment.scope === 'all') {
        return null; // All properties
      } else if (assignment.scope === 'property' && assignment.propertyId) {
        propertyIds.add(assignment.propertyId);
      } else if (assignment.scope === 'property_group' && assignment.propertyGroupId) {
        const memberships = await this.membershipRepo.find({
          where: { groupId: assignment.propertyGroupId },
        });
        memberships.forEach(m => propertyIds.add(m.propertyId));
      }
    }

    return Array.from(propertyIds);
  }

  // ─── User management ─────────────────────────────────────────────────

  async getAllUsersWithRoles(): Promise<{ id: number; email: string; firstName: string; lastName: string; role: AppRole; isActive: boolean }[]> {
    const users = await this.userRepo.find({ where: { isActive: true } });
    return users.map(u => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.getRole(),
      isActive: u.isActive,
    }));
  }

  async getAllAssignments(): Promise<ManagerAssignment[]> {
    return this.assignmentRepo.find({
      where: { isActive: true },
      relations: ['manager', 'property', 'propertyGroup'],
    });
  }

  async removeAssignment(adminId: number, assignmentId: string): Promise<void> {
    const adminRole = await this.getUserRole(adminId);
    if (!['hyper_admin', 'hyper_manager', 'admin'].includes(adminRole)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const assignment = await this.assignmentRepo.findOne({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    // Admin can only remove their own assignments
    if (adminRole === 'admin' && assignment.assignedByAdminId !== adminId) {
      throw new ForbiddenException('Admin can only manage their own assignments');
    }

    await this.assignmentRepo.update(assignmentId, { isActive: false });
  }

  async updateUserStatus(adminId: number, userId: number, status: string): Promise<void> {
    const adminRole = await this.getUserRole(adminId);
    if (!['hyper_admin', 'hyper_manager', 'admin'].includes(adminRole)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Admin can only manage users they invited (managers/guests)
    if (adminRole === 'admin') {
      const targetRole = await this.getUserRole(userId);
      if (targetRole !== 'manager' && targetRole !== 'guest') {
        throw new ForbiddenException('Admin can only manage manager and guest accounts');
      }
      // Check if this admin assigned this user
      const assignment = await this.assignmentRepo.findOne({
        where: { managerId: userId, assignedByAdminId: adminId, isActive: true },
      });
      if (!assignment) {
        throw new ForbiddenException('Admin can only manage their own managers');
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
}
