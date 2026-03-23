import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RolesService } from '../roles.service';
import { UserRole, AppRole } from '../../entity/user-role.entity';
import { ManagerAssignment, AssignmentScope } from '../../entity/manager-assignment.entity';
import { ManagerPermission, PermissionType } from '../../entity/manager-permission.entity';
import { PropertyGroupMembership } from '../../../properties/entity/property-group-membership.entity';

describe('RolesService', () => {
  let service: RolesService;

  // Mock repositories
  let userRoleRepo: Record<string, jest.Mock>;
  let assignmentRepo: Record<string, jest.Mock>;
  let permissionRepo: Record<string, jest.Mock>;
  let membershipRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    userRoleRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
      create: jest.fn((d) => d),
      save: jest.fn((d) => Promise.resolve({ id: 'ur-1', ...d })),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    assignmentRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn((d) => d),
      save: jest.fn((d) => Promise.resolve({ id: 'a-1', ...d })),
      count: jest.fn(),
    };
    permissionRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn((d) => d),
      save: jest.fn((d) => Promise.resolve(d)),
      delete: jest.fn(),
    };
    membershipRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: getRepositoryToken(UserRole), useValue: userRoleRepo },
        { provide: getRepositoryToken(ManagerAssignment), useValue: assignmentRepo },
        { provide: getRepositoryToken(ManagerPermission), useValue: permissionRepo },
        { provide: getRepositoryToken(PropertyGroupMembership), useValue: membershipRepo },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  // ─── hasPermissionForProperty ──────────────────────────────────────

  describe('hasPermissionForProperty', () => {
    const managerId = 10;
    const propertyId = 'prop-abc';
    const permission: PermissionType = 'modify_prices';

    it('should return false when manager has no active assignments', async () => {
      assignmentRepo.find.mockResolvedValue([]);

      const result = await service.hasPermissionForProperty(managerId, propertyId, permission);
      expect(result).toBe(false);
    });

    it('should return true for "all" scope assignment with granted permission', async () => {
      assignmentRepo.find.mockResolvedValue([
        { id: 'a-1', managerId, scope: 'all' as AssignmentScope, isActive: true, propertyId: null, propertyGroupId: null },
      ]);
      permissionRepo.findOne.mockResolvedValue({ permission, isGranted: true });

      const result = await service.hasPermissionForProperty(managerId, propertyId, permission);
      expect(result).toBe(true);
      expect(permissionRepo.findOne).toHaveBeenCalledWith({
        where: { assignmentId: 'a-1', permission, isGranted: true },
      });
    });

    it('should return false for "all" scope assignment without the specific permission', async () => {
      assignmentRepo.find.mockResolvedValue([
        { id: 'a-1', managerId, scope: 'all' as AssignmentScope, isActive: true },
      ]);
      permissionRepo.findOne.mockResolvedValue(null);

      const result = await service.hasPermissionForProperty(managerId, propertyId, permission);
      expect(result).toBe(false);
    });

    it('should return true for direct property scope matching the property', async () => {
      assignmentRepo.find.mockResolvedValue([
        { id: 'a-2', managerId, scope: 'property' as AssignmentScope, propertyId, isActive: true, propertyGroupId: null },
      ]);
      permissionRepo.findOne.mockResolvedValue({ permission, isGranted: true });

      const result = await service.hasPermissionForProperty(managerId, propertyId, permission);
      expect(result).toBe(true);
    });

    it('should return false for direct property scope on a different property', async () => {
      assignmentRepo.find.mockResolvedValue([
        { id: 'a-2', managerId, scope: 'property' as AssignmentScope, propertyId: 'other-prop', isActive: true, propertyGroupId: null },
      ]);

      const result = await service.hasPermissionForProperty(managerId, propertyId, permission);
      expect(result).toBe(false);
      expect(permissionRepo.findOne).not.toHaveBeenCalled();
    });

    // ─── Property group scoping ────────────────────────────────────

    it('should return true when property is in the assigned group and permission is granted', async () => {
      const groupId = 'group-1';
      assignmentRepo.find.mockResolvedValue([
        { id: 'a-3', managerId, scope: 'property_group' as AssignmentScope, propertyGroupId: groupId, propertyId: null, isActive: true },
      ]);
      // Property IS in the group
      membershipRepo.findOne.mockResolvedValue({ propertyId, groupId });
      permissionRepo.findOne.mockResolvedValue({ permission, isGranted: true });

      const result = await service.hasPermissionForProperty(managerId, propertyId, permission);
      expect(result).toBe(true);
      expect(membershipRepo.findOne).toHaveBeenCalledWith({
        where: { propertyId, groupId },
      });
    });

    it('should return false when property is NOT in the assigned group', async () => {
      const groupId = 'group-2';
      assignmentRepo.find.mockResolvedValue([
        { id: 'a-4', managerId, scope: 'property_group' as AssignmentScope, propertyGroupId: groupId, propertyId: null, isActive: true },
      ]);
      // Property is NOT in the group
      membershipRepo.findOne.mockResolvedValue(null);

      const result = await service.hasPermissionForProperty(managerId, propertyId, permission);
      expect(result).toBe(false);
      expect(permissionRepo.findOne).not.toHaveBeenCalled();
    });

    it('should return false when property IS in the group but permission is not granted', async () => {
      const groupId = 'group-3';
      assignmentRepo.find.mockResolvedValue([
        { id: 'a-5', managerId, scope: 'property_group' as AssignmentScope, propertyGroupId: groupId, propertyId: null, isActive: true },
      ]);
      membershipRepo.findOne.mockResolvedValue({ propertyId, groupId });
      // Permission NOT granted
      permissionRepo.findOne.mockResolvedValue(null);

      const result = await service.hasPermissionForProperty(managerId, propertyId, permission);
      expect(result).toBe(false);
    });

    // ─── Multiple assignments ──────────────────────────────────────

    it('should return true if ANY assignment grants the permission (first denies, second grants)', async () => {
      assignmentRepo.find.mockResolvedValue([
        // First: property scope on a different property — no match
        { id: 'a-10', managerId, scope: 'property' as AssignmentScope, propertyId: 'other-prop', isActive: true, propertyGroupId: null },
        // Second: group scope where property IS a member
        { id: 'a-11', managerId, scope: 'property_group' as AssignmentScope, propertyGroupId: 'g-1', propertyId: null, isActive: true },
      ]);
      membershipRepo.findOne.mockResolvedValue({ propertyId, groupId: 'g-1' });
      permissionRepo.findOne.mockResolvedValue({ permission, isGranted: true });

      const result = await service.hasPermissionForProperty(managerId, propertyId, permission);
      expect(result).toBe(true);
    });

    it('should return false if all assignments fail to cover the property', async () => {
      assignmentRepo.find.mockResolvedValue([
        { id: 'a-20', managerId, scope: 'property' as AssignmentScope, propertyId: 'wrong-1', isActive: true, propertyGroupId: null },
        { id: 'a-21', managerId, scope: 'property_group' as AssignmentScope, propertyGroupId: 'g-x', propertyId: null, isActive: true },
      ]);
      membershipRepo.findOne.mockResolvedValue(null); // not in group

      const result = await service.hasPermissionForProperty(managerId, propertyId, permission);
      expect(result).toBe(false);
    });

    it('should check different permission types independently', async () => {
      assignmentRepo.find.mockResolvedValue([
        { id: 'a-30', managerId, scope: 'all' as AssignmentScope, isActive: true },
      ]);

      // Has modify_prices but NOT refund_users
      permissionRepo.findOne
        .mockResolvedValueOnce({ permission: 'modify_prices', isGranted: true })
        .mockResolvedValueOnce(null);

      expect(await service.hasPermissionForProperty(managerId, propertyId, 'modify_prices')).toBe(true);
      expect(await service.hasPermissionForProperty(managerId, propertyId, 'refund_users')).toBe(false);
    });
  });

  // ─── getUserRoles ─────────────────────────────────────────────────

  describe('getUserRoles', () => {
    it('should return array of role strings', async () => {
      userRoleRepo.find.mockResolvedValue([
        { userId: 1, role: 'admin' },
        { userId: 1, role: 'manager' },
      ]);

      const roles = await service.getUserRoles(1);
      expect(roles).toEqual(['admin', 'manager']);
    });

    it('should return empty array for user with no roles', async () => {
      userRoleRepo.find.mockResolvedValue([]);
      expect(await service.getUserRoles(99)).toEqual([]);
    });
  });

  // ─── hasRole ──────────────────────────────────────────────────────

  describe('hasRole', () => {
    it('should return true when user has the role', async () => {
      userRoleRepo.count.mockResolvedValue(1);
      expect(await service.hasRole(1, 'admin')).toBe(true);
    });

    it('should return false when user does not have the role', async () => {
      userRoleRepo.count.mockResolvedValue(0);
      expect(await service.hasRole(1, 'hyper_manager')).toBe(false);
    });
  });
});
