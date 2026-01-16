import { canManagePlatformUser, hasAdminRights } from 'services/security/accessServices';
import { ALL_ADMIN_ROLES, ROLE } from 'constants/security/access';
import { PLATFORM_HIERARCHIC_TYPE } from 'constants/platforms';

const { ADMIN, TEAM_MANAGER, SUPER_ADMIN, SUPER_COMMUNITY_MANAGER, HYPER_ADMIN, HYPER_COMMUNITY_MANAGER } = ROLE;
const NON_ADMIN_ROLES = Object.values(ROLE).filter(val => typeof val === 'number' && !ALL_ADMIN_ROLES.includes(val));

describe('hasAdminRights', () => {
  test.each(ALL_ADMIN_ROLES)('should return true when given role is %p', role => {
    expect(hasAdminRights({ role })).toBeTruthy();
  });

  test.each(NON_ADMIN_ROLES)('should return false when given role is %p', role => {
    expect(hasAdminRights({ role })).toBeFalsy();
  });
});

describe('canManagePlatformUser', () => {
  test.each([ADMIN, TEAM_MANAGER])(
    'should return true when user is platform admin and user to manage has role %p',
    role => {
      expect(canManagePlatformUser(ADMIN, role, PLATFORM_HIERARCHIC_TYPE.INDEPENDENT)).toBeTruthy();
    }
  );

  test.each([ADMIN, TEAM_MANAGER, SUPER_ADMIN, SUPER_COMMUNITY_MANAGER])(
    'should return true when user is super-admin and user to manage has role %p',
    role => {
      expect(canManagePlatformUser(SUPER_ADMIN, role, PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM)).toBeTruthy();
    }
  );

  test.each([HYPER_ADMIN, HYPER_COMMUNITY_MANAGER])(
    'should return false when user is super-admin and user to manage has hyper role: %p',
    role => {
      expect(canManagePlatformUser(SUPER_ADMIN, role, PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM)).toBeFalsy();
    }
  );

  test.each([HYPER_ADMIN, HYPER_COMMUNITY_MANAGER, SUPER_ADMIN, SUPER_COMMUNITY_MANAGER])(
    'should return false when current role is admin and user to manage has hyper/super role: %p',
    role => {
      expect(canManagePlatformUser(ADMIN, role, PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM)).toBeFalsy();
    }
  );

  test('should return false when current user is not any kind of admin', () => {
    const userRoleToManage = ADMIN;

    NON_ADMIN_ROLES.forEach(platformRole =>
      expect(
        canManagePlatformUser(platformRole as ROLE, userRoleToManage, PLATFORM_HIERARCHIC_TYPE.INDEPENDENT)
      ).toBeFalsy()
    );
  });
});
