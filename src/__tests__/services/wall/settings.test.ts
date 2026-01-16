import { canManageAdminOrCommunityManager } from 'services/wall/settings';
import { PLATFORM_INVITATION_STATUS } from 'constants/api/platforms';
import { ROLE } from 'constants/security/access';
import { PLATFORM_HIERARCHIC_TYPE } from 'constants/platforms';

describe('canManageAdminOrCommunityManager', () => {
  test('should return false when user is logged user', () => {
    const uuid = 'someRandomUUID';
    const hierarchicType = PLATFORM_HIERARCHIC_TYPE.INDEPENDENT;
    expect(canManageAdminOrCommunityManager({ uuid }, { uuid }, hierarchicType)).toBeFalsy();
  });

  test('should return false when user cannot be deleted', () => {
    const userToManage = { uuid: 'abcd', cannotBeDeleted: true };
    const loggedUser = { uuid: 'efdg' };
    const hierarchicType = PLATFORM_HIERARCHIC_TYPE.INDEPENDENT;
    expect(canManageAdminOrCommunityManager(userToManage, loggedUser, hierarchicType)).toBeFalsy();
  });

  test('should return false when user invitation is pending', () => {
    const userToManage = { uuid: 'abcd', status: PLATFORM_INVITATION_STATUS.PENDING };
    const loggedUser = { uuid: 'efdg' };
    const hierarchicType = PLATFORM_HIERARCHIC_TYPE.INDEPENDENT;
    expect(canManageAdminOrCommunityManager(userToManage, loggedUser, hierarchicType)).toBeFalsy();
  });

  test('should return false when user role belongs to parent platform', () => {
    const userToManage = { uuid: 'abcd', role: ROLE.SUPER_ADMIN };
    const loggedUser = { uuid: 'efdg' };
    const hierarchicType = PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM;
    expect(canManageAdminOrCommunityManager(userToManage, loggedUser, hierarchicType)).toBeFalsy();
  });

  test('should return false when current user has no sufficient rights', () => {
    const userToManage = { uuid: 'abcd', role: ROLE.ADMIN };
    const loggedUser = { uuid: 'efdg', role: ROLE.TEAM_MANAGER };
    const hierarchicType = PLATFORM_HIERARCHIC_TYPE.INDEPENDENT;
    expect(canManageAdminOrCommunityManager(userToManage, loggedUser, hierarchicType)).toBeFalsy();
  });

  test('should return true when platform user can be managed', () => {
    const userToManage = { uuid: 'abcd', role: ROLE.ADMIN };
    const loggedUser = { uuid: 'efdg', role: ROLE.SUPER_ADMIN };
    const hierarchicType = PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM;
    expect(canManageAdminOrCommunityManager(userToManage, loggedUser, hierarchicType)).toBeTruthy();
  });
});
