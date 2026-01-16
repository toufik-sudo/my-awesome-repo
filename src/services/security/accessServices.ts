import { ACCOUNT_STATUS, HIERARCHIC_ROLE, ROLE } from 'constants/security/access';
import { PLATFORM_HIERARCHIC_TYPE } from 'constants/platforms';
import { PLATFORM_STATUS } from 'constants/general';
import { AUTOMATIC_POST_TYPE } from 'constants/wall/points';

export const isUserBeneficiary = (role: number) => !role || ROLE.BENEFICIARY === role;
export const isUserAdmin = (role: number) => ROLE.ADMIN === role;
export const isUserManager = (role: number) => ROLE.TEAM_MANAGER === role;
export const isUserSuperAdmin = (role: number) => ROLE.SUPER_ADMIN === role;
export const isUserSuperCommunityManager = (role: number) => ROLE.SUPER_COMMUNITY_MANAGER === role;
export const isUserHyperAdmin = (role: number) => ROLE.HYPER_ADMIN === role;
export const isUserHyperCommunityManager = (role: number) => ROLE.HYPER_COMMUNITY_MANAGER === role;

/**
 * Returns current authorizations for given role
 * @param role
 */
export const getUserAuthorizations = (role: ROLE | number) => ({
  isAdmin: isUserAdmin(role),
  isManager: isUserManager(role),
  isBeneficiary: isUserBeneficiary(role),
  isSuperManager: isUserSuperCommunityManager(role),
  isSuperAdmin: isUserSuperAdmin(role),
  isHyperManager: isUserHyperCommunityManager(role),
  isHyperAdmin: isUserHyperAdmin(role)
});

export const hasAtLeastSuperRole = role => role >= ROLE.SUPER_ADMIN;

/**
 * Returns user's role for given platform, if found
 * @param userData
 * @param platformId
 */
export const extractUserRoleForPlatform = (userData, platformId) =>
  ((userData && (userData.roles || []).find(({ platformId: id }) => platformId == id)) || {}).role;

/**
 * Get the max possible role for an user
 *
 * @param roles
 */
export const getGlobalUserRole = (roles: ROLE[]) => Math.max(...roles);

/**
 * Returns user's highest role
 * @param userData
 */
export const extractHighestUserRole = ({ hierarchicRole, roles }) => {
  if (hierarchicRole === HIERARCHIC_ROLE.HYPER_ADMIN) {
    return ROLE.HYPER_ADMIN;
  }

  if (hierarchicRole === HIERARCHIC_ROLE.HYPER_COMMUNITY_MANAGER) {
    return ROLE.HYPER_COMMUNITY_MANAGER;
  }

  const userRoles = (roles || []).map(platformRole => platformRole.role);

  return getGlobalUserRole(userRoles);
};

export const getPlatformSuperUserIsLoggedInto = userData => {
  if (!hasAtLeastSuperRole(userData.highestRole)) {
    return undefined;
  }

  const { platformId: id, role } =
    (userData.roles || []).find(platformRole => platformRole.role === userData.highestRole) || {};
  const hierarchicType =
    userData.highestRole >= ROLE.HYPER_ADMIN
      ? PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM
      : PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM;

  return { id, role, hierarchicType };
};

/**
 * Asserts that the given status means that the user is not active
 * @param status
 */
export const isAccountNotVerified = status => ACCOUNT_STATUS.NOT_VERIFIED === Number(status);

/**
 * Returns whether user has admin rights at any level (regular/super/hyper)
 * @param userAuthorizations
 */
export const isAnyKindOfAdmin = ({ isAdmin, isSuperAdmin, isHyperAdmin }) => isAdmin || isHyperAdmin || isSuperAdmin;
export const isSuperAdmin = ({ isAdmin, isSuperAdmin, isHyperAdmin }) => isSuperAdmin;

/**
 * Returns whether user has community manager rights at any level (regular/super/hyper)
 * @param userAuthorizations
 */
export const isAnyKindOfManager = ({ isManager, isSuperManager, isHyperManager }) =>
  isManager || isSuperManager || isHyperManager;

/**
 * Returns whether user has super admin role or higher.
 * @param userAuthorizations
 */
export const isAtLeastSuperAdmin = userAuthorizations =>
  userAuthorizations.isHyperAdmin || userAuthorizations.isSuperAdmin;

/**
 * Returns whether user has any admin rights on that platform
 * @param userAuthorizations
 */
export const hasAdminRights = platform => {
  const rights = getUserAuthorizations(platform.role);

  return isAnyKindOfAdmin(rights);
};

/**
 * Returns whether given role grants administration rights of platform admin/CM users:
 * - user must be admin;
 * - user may not manage roles at higher levels (ie regular admins may not manage super roles)
 *
 * @param platformRole current user's role on platform
 * @param roleToManage role of user to manage
 * @param platformHierarchicType hierarchic type of the platform
 */
export const canManagePlatformUser = (
  platformRole: ROLE,
  roleToManage: ROLE,
  platformHierarchicType: PLATFORM_HIERARCHIC_TYPE
) => {
  // Check if logged user has admin rights, and the user he tries to edit/delete is not of a higher role than him
  if (isUserAdmin(platformRole)) {
    return !hasAtLeastSuperRole(roleToManage);
  }

  // If the logged user is SuperAdmin, we need to check if the user he tries to edit/delete has a lower role than his,
  // and the platform on which this happens is at most a superPlatform (SuperAdmin can do actions on superPlatforms)
  if (isUserSuperAdmin(platformRole)) {
    return (
      (roleToManage < ROLE.SUPER_ADMIN && platformHierarchicType <= PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM) ||
      (roleToManage < ROLE.HYPER_ADMIN && platformHierarchicType == PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM)
    );
  }

  // If the logged user is a HyperAdmin, we need to check if the user he tries to edit/delete has a lower role than his,
  // and the platform on which this happens is at most a SuperPlatform, or if the user he tries to manage is another
  // HyperAdmin, we need to check that the platform is a HyperPlatform
  if (isUserHyperAdmin(platformRole)) {
    return (
      (roleToManage < ROLE.SUPER_ADMIN && platformHierarchicType <= PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM) ||
      (roleToManage < ROLE.HYPER_ADMIN && platformHierarchicType == PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM) ||
      platformHierarchicType == PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM
    );
  }

  return false;
};

/**
 * Returns blocked status boolean
 * @param status
 */
export const isBlockedStatus = status => status && status === PLATFORM_STATUS.BLOCKED;

/**
 * Returns expired status boolean
 * @param status
 */
export const isExpiredStatus = status => status && status === PLATFORM_STATUS.EXPIRED;

/**
 * Returns whether platformType has super platform type or higher.
 * @param automaticType
 */
export const hasAtLeastSuperPlatformCreated = automaticType =>
  automaticType >= AUTOMATIC_POST_TYPE.SUPER_PLATFORM_CREATED;

/**
 * Returns whether user has super cummounity manager role or higher.
 * @param userAuthorizations
 */
export const isAtLeastSuperCommunityManager = userAuthorizations =>
  userAuthorizations.isHyperManager || userAuthorizations.isSuperManager;
