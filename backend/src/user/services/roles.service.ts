import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserRole, AppRole, INCOMPATIBLE_ROLES } from '../entity/user-role.entity';
import { ManagerAssignment, AssignmentScope } from '../entity/manager-assignment.entity';
import { ManagerPermission, PermissionType } from '../entity/manager-permission.entity';
import { PropertyGroupMembership } from '../../properties/entity/property-group-membership.entity';
import { User } from '../entity/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
    @InjectRepository(ManagerAssignment)
    private readonly assignmentRepo: Repository<ManagerAssignment>,
    @InjectRepository(ManagerPermission)
    private readonly permissionRepo: Repository<ManagerPermission>,
    @InjectRepository(PropertyGroupMembership)
    private readonly membershipRepo: Repository<PropertyGroupMembership>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Dashboard stats
  async getDashboardStats() {
    const [totalUsers, totalGroups, activeManagers, totalAssignments] = await Promise.all([
      this.userRoleRepo.createQueryBuilder('ur')
        .select('COUNT(DISTINCT ur.userId)', 'count')
        .getRawOne()
        .then(r => parseInt(r.count, 10) || 0),
      this.membershipRepo.createQueryBuilder('m')
        .select('COUNT(DISTINCT m.groupId)', 'count')
        .getRawOne()
        .then(r => parseInt(r.count, 10) || 0),
      this.userRoleRepo.count({ where: { role: 'manager' as AppRole } }),
      this.assignmentRepo.count({ where: { isActive: true } }),
    ]);
    return { totalUsers, totalGroups, activeManagers, totalAssignments };
  }

  // Check if user has a specific role
  async hasRole(userId: number, role: AppRole): Promise<boolean> {
    const count = await this.userRoleRepo.count({ where: { userId, role } });
    return count > 0;
  }

  // Get all roles for a user
  async getUserRoles(userId: number): Promise<AppRole[]> {
    const roles = await this.userRoleRepo.find({ where: { userId } });
    return roles.map(r => r.role);
  }

  // Assign role to user (hyper_manager can assign any, admin can assign manager)
  async assignRole(assignerId: number, userId: number, role: AppRole): Promise<UserRole> {
    const assignerRoles = await this.getUserRoles(assignerId);
    
    // Permission checks
    if ((role === 'hyper_admin' || role === 'hyper_manager') && !assignerRoles.includes('hyper_admin')) {
      throw new ForbiddenException('Only hyper_admin can assign hyper_admin or hyper_manager roles');
    }
    
    if (role === 'admin' && !assignerRoles.includes('hyper_admin') && !assignerRoles.includes('hyper_manager')) {
      throw new ForbiddenException('Only hyper_admin or hyper_manager can assign admin role');
    }
    
    if (role === 'manager' && !assignerRoles.includes('hyper_admin') && !assignerRoles.includes('hyper_manager') && !assignerRoles.includes('admin')) {
      throw new ForbiddenException('Only hyper_admin, hyper_manager, or admin can assign manager role');
    }

    // Enforce mutual exclusivity: check if user already has incompatible roles
    const incompatible = INCOMPATIBLE_ROLES[role] || [];
    if (incompatible.length > 0) {
      const existingRoles = await this.getUserRoles(userId);
      const conflicts = existingRoles.filter(r => incompatible.includes(r));
      if (conflicts.length > 0) {
        throw new ForbiddenException(
          `Cannot assign '${role}' — user already has incompatible role(s): ${conflicts.join(', ')}. Remove them first.`
        );
      }
    }

    const existing = await this.userRoleRepo.findOne({ where: { userId, role } });
    if (existing) return existing;

    const userRole = this.userRoleRepo.create({ userId, role });
    return this.userRoleRepo.save(userRole);
  }

  // Remove role from user
  async removeRole(removerId: number, userId: number, role: AppRole): Promise<void> {
    const removerRoles = await this.getUserRoles(removerId);
    
    if (!removerRoles.includes('hyper_admin') && !removerRoles.includes('hyper_manager') && !removerRoles.includes('admin')) {
      throw new ForbiddenException('Insufficient permissions to remove roles');
    }

    // Only hyper_admin can remove hyper_admin or hyper_manager roles
    if ((role === 'hyper_admin' || role === 'hyper_manager') && !removerRoles.includes('hyper_admin')) {
      throw new ForbiddenException('Only hyper_admin can remove hyper_admin or hyper_manager roles');
    }
    
    await this.userRoleRepo.delete({ userId, role });
  }

  // Assign manager to property/group
  async assignManager(
    adminId: number,
    managerId: number,
    scope: AssignmentScope,
    propertyId?: string,
    propertyGroupId?: string,
  ): Promise<ManagerAssignment> {
    // Verify admin has permission
    const adminRoles = await this.getUserRoles(adminId);
    if (!adminRoles.includes('hyper_admin') && !adminRoles.includes('hyper_manager') && !adminRoles.includes('admin')) {
      throw new ForbiddenException('Only hyper_admin, hyper_manager, or admin can assign managers');
    }

    // Verify target user has manager role
    const isManager = await this.hasRole(managerId, 'manager');
    if (!isManager) {
      throw new ForbiddenException('User must have manager role to be assigned');
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

  // Set permissions for a manager assignment
  async setPermissions(
    adminId: number,
    assignmentId: string,
    permissions: { permission: PermissionType; isGranted: boolean }[],
  ): Promise<ManagerPermission[]> {
    const assignment = await this.assignmentRepo.findOne({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    // Verify admin has permission
    const adminRoles = await this.getUserRoles(adminId);
    if (!adminRoles.includes('hyper_admin') && !adminRoles.includes('hyper_manager') && !adminRoles.includes('admin')) {
      throw new ForbiddenException('Only hyper_admin, hyper_manager, or admin can set permissions');
    }

    // Delete existing permissions
    await this.permissionRepo.delete({ assignmentId });

    // Create new permissions
    const newPermissions = permissions.map(p => 
      this.permissionRepo.create({
        assignmentId,
        permission: p.permission,
        isGranted: p.isGranted,
      })
    );

    return this.permissionRepo.save(newPermissions);
  }

  // Check if manager has specific permission for a property
  async hasPermissionForProperty(
    managerId: number,
    propertyId: string,
    permission: PermissionType,
  ): Promise<boolean> {
    // Get all active assignments for this manager
    const assignments = await this.assignmentRepo.find({
      where: { managerId, isActive: true },
      relations: ['propertyGroup'],
    });

    for (const assignment of assignments) {
      // Check if assignment covers this property
      let coversProperty = false;

      if (assignment.scope === 'all') {
        coversProperty = true;
      } else if (assignment.scope === 'property' && assignment.propertyId === propertyId) {
        coversProperty = true;
      } else if (assignment.scope === 'property_group' && assignment.propertyGroupId) {
        // Check if property is in the group
        const membership = await this.membershipRepo.findOne({
          where: { propertyId, groupId: assignment.propertyGroupId },
        });
        coversProperty = !!membership;
      }

      if (coversProperty) {
        // Check if permission is granted
        const perm = await this.permissionRepo.findOne({
          where: { assignmentId: assignment.id, permission, isGranted: true },
        });
        if (perm) return true;
      }
    }

    return false;
  }

  // Get all permissions for a manager across all assignments
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

  // Get properties a manager can access
  async getManagerProperties(managerId: number): Promise<string[]> {
    const assignments = await this.assignmentRepo.find({
      where: { managerId, isActive: true },
    });

    const propertyIds = new Set<string>();

    for (const assignment of assignments) {
      if (assignment.scope === 'all') {
        // Return null to indicate all properties
        return null;
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

  // ─── Missing: getAllUsersWithRoles, getAllAssignments, removeAssignment ───

  async getAllUsersWithRoles(): Promise<{ id: number; email: string; firstName: string; lastName: string; isActive: boolean; phoneNbr: string; city: string; roles: AppRole[] }[]> {
    const users = await this.userRepo.find(); // Include inactive users for management
    const allRoles = await this.userRoleRepo.find();
    const roleMap = new Map<number, AppRole[]>();
    allRoles.forEach(r => {
      if (!roleMap.has(r.userId)) roleMap.set(r.userId, []);
      roleMap.get(r.userId)!.push(r.role);
    });
    return users.map(u => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      isActive: u.isActive,
      phoneNbr: u.phoneNbr,
      city: u.city,
      roles: roleMap.get(u.id) || ['user'],
    }));
  }

  async getAllAssignments(): Promise<ManagerAssignment[]> {
    return this.assignmentRepo.find({
      where: { isActive: true },
      relations: ['manager', 'property', 'propertyGroup'],
    });
  }

  async removeAssignment(adminId: number, assignmentId: string): Promise<void> {
    const adminRoles = await this.getUserRoles(adminId);
    if (!adminRoles.includes('hyper_admin') && !adminRoles.includes('hyper_manager') && !adminRoles.includes('admin')) {
      throw new ForbiddenException('Insufficient permissions');
    }
    const assignment = await this.assignmentRepo.findOne({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');
    await this.assignmentRepo.update(assignmentId, { isActive: false });
  }

  async updateUserStatus(adminId: number, userId: number, status: string): Promise<void> {
    const adminRoles = await this.getUserRoles(adminId);
    if (!adminRoles.includes('hyper_admin') && !adminRoles.includes('hyper_manager') && !adminRoles.includes('admin')) {
      throw new ForbiddenException('Insufficient permissions');
    }
    await this.userRepo.update(userId, { isActive: status === 'active' });
  }

  async deleteUser(adminId: number, userId: number): Promise<void> {
    const adminRoles = await this.getUserRoles(adminId);
    if (!adminRoles.includes('hyper_admin') && !adminRoles.includes('hyper_manager')) {
      throw new ForbiddenException('Only hyper_admin or hyper_manager can delete users');
    }
    await this.userRepo.delete(userId);
  }
}
