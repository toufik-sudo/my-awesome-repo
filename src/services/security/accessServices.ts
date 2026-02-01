/**
 * Access & Security Services
 * Migrated from old_app/src/services/security/accessServices.ts
 */

import { ROLE, HIERARCHIC_ROLE, ALL_ADMIN_ROLES, ALL_MANAGER_ROLES } from '@/constants/security/access';
import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';

// -----------------------------------------------------------------------------
// Role Check Functions
// -----------------------------------------------------------------------------

/**
 * Check if user role is beneficiary
 */
export const isUserBeneficiary = (role: number): boolean => {
  return !role || role === ROLE.BENEFICIARY;
};

/**
 * Check if user has admin role (regular admin only)
 */
export const isUserAdmin = (role: number): boolean => {
  return role === ROLE.ADMIN;
};

/**
 * Check if user has manager role (regular manager only)
 */
export const isUserManager = (role: number): boolean => {
  return role === ROLE.TEAM_MANAGER || role === ROLE.MANAGER;
};

/**
 * Check if user has super admin role
 */
export const isUserSuperAdmin = (role: number): boolean => {
  return role === ROLE.SUPER_ADMIN;
};

/**
 * Check if user has super community manager role
 */
export const isUserSuperCommunityManager = (role: number): boolean => {
  return role === ROLE.SUPER_COMMUNITY_MANAGER;
};

/**
 * Check if user has hyper admin role
 */
export const isUserHyperAdmin = (role: number): boolean => {
  return role === ROLE.HYPER_ADMIN;
};

/**
 * Check if user has hyper community manager role
 */
export const isUserHyperCommunityManager = (role: number): boolean => {
  return role === ROLE.HYPER_COMMUNITY_MANAGER;
};

// -----------------------------------------------------------------------------
// Combined Role Checks
// -----------------------------------------------------------------------------

/**
 * Check if user has any admin role (admin, super admin, or hyper admin)
 */
export const isAnyKindOfAdmin = (role: number): boolean => {
  return ALL_ADMIN_ROLES.includes(role);
};

/**
 * Check if user has any manager role (manager, super manager, or hyper manager)
 */
export const isAnyKindOfManager = (role: number): boolean => {
  return ALL_MANAGER_ROLES.includes(role);
};

/**
 * Check if user has at least super role (super admin+ or super manager+)
 */
export const hasAtLeastSuperRole = (role: number): boolean => {
  return role >= ROLE.SUPER_ADMIN;
};

/**
 * Check if user has hyper role (hyper admin or hyper manager)
 */
export const hasHyperRole = (role: number): boolean => {
  return role === ROLE.HYPER_ADMIN || role === ROLE.HYPER_COMMUNITY_MANAGER;
};

// -----------------------------------------------------------------------------
// User Authorizations
// -----------------------------------------------------------------------------

/**
 * User authorization interface
 */
export interface UserAuthorizations {
  isBeneficiary: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isSuperAdmin: boolean;
  isSuperManager: boolean;
  isHyperAdmin: boolean;
  isHyperManager: boolean;
  isSuperRole: boolean;
  isHyperRole: boolean;
}

/**
 * Get user authorizations based on role
 * Returns current authorizations for given role
 */
export const getUserAuthorizations = (role: number | undefined): UserAuthorizations => {
  const safeRole = role ?? ROLE.BENEFICIARY;
  return {
    isBeneficiary: isUserBeneficiary(safeRole),
    isAdmin: isUserAdmin(safeRole),
    isManager: isUserManager(safeRole),
    isSuperAdmin: isUserSuperAdmin(safeRole),
    isSuperManager: isUserSuperCommunityManager(safeRole),
    isHyperAdmin: isUserHyperAdmin(safeRole),
    isHyperManager: isUserHyperCommunityManager(safeRole),
    isSuperRole: hasAtLeastSuperRole(safeRole),
    isHyperRole: hasHyperRole(safeRole)
  };
};

/**
 * Returns whether user has admin rights at any level (regular/super/hyper)
 */
export const isAnyKindOfAdminAuth = (auth: UserAuthorizations): boolean => {
  return auth.isAdmin || auth.isSuperAdmin || auth.isHyperAdmin;
};

/**
 * Returns whether user has community manager rights at any level (regular/super/hyper)
 */
export const isAnyKindOfManagerAuth = (auth: UserAuthorizations): boolean => {
  return auth.isManager || auth.isSuperManager || auth.isHyperManager;
};

/**
 * Returns whether user has super admin role or higher.
 */
export const isAtLeastSuperAdmin = (auth: UserAuthorizations): boolean => {
  return auth.isHyperAdmin || auth.isSuperAdmin;
};

/**
 * Returns whether user has super community manager role or higher.
 */
export const isAtLeastSuperCommunityManager = (auth: UserAuthorizations): boolean => {
  return auth.isHyperManager || auth.isSuperManager;
};

// -----------------------------------------------------------------------------
// Role Extraction Functions
// -----------------------------------------------------------------------------

/**
 * User data with roles interface
 */
export interface UserDataWithRoles {
  roles?: Array<{ platformId: number; role: number }>;
  hierarchicRole?: number;
  highestRole?: number;
  hr?: number;
  role?: number;
}

/**
 * Returns user's role for given platform, if found
 * @param userData - User data object with roles array
 * @param platformId - Platform ID to find role for
 */
export const extractUserRoleForPlatform = (
  userData: UserDataWithRoles | null | undefined,
  platformId: number | undefined
): number | undefined => {
  if (!userData || !platformId) return undefined;
  const roleEntry = (userData.roles || []).find(({ platformId: id }) => id === platformId);
  return roleEntry?.role;
};

/**
 * Get the max possible role for a user from roles array
 */
export const getGlobalUserRole = (roles: number[]): number => {
  if (!roles || roles.length === 0) return ROLE.BENEFICIARY;
  return Math.max(...roles);
};

/**
 * Returns user's highest role
 * Considers hierarchicRole first, then calculates from platform roles
 */
export const extractHighestUserRole = (userData: UserDataWithRoles): number => {
  // Check for hierarchicRole indicating hyper admin
  if (userData.hierarchicRole === HIERARCHIC_ROLE.HYPER_ADMIN) {
    return ROLE.HYPER_ADMIN;
  }

  // Check for hierarchicRole indicating hyper community manager
  if (userData.hierarchicRole === HIERARCHIC_ROLE.HYPER_COMMUNITY_MANAGER) {
    return ROLE.HYPER_COMMUNITY_MANAGER;
  }

  // Check for hr (highest role) from token
  if (userData.hr !== undefined) {
    return userData.hr;
  }

  // Check for direct role
  if (userData.role !== undefined) {
    return userData.role;
  }

  // Extract from platform roles array
  const userRoles = (userData.roles || []).map(platformRole => platformRole.role);
  return getGlobalUserRole(userRoles);
};

/**
 * Get the platform super user is logged into
 */
export const getPlatformSuperUserIsLoggedInto = (userData: {
  highestRole?: number;
  roles?: Array<{ platformId: number; role: number }>;
}): { id: number | undefined; role: number | undefined; hierarchicType: PLATFORM_HIERARCHIC_TYPE } | undefined => {
  if (!userData.highestRole || !hasAtLeastSuperRole(userData.highestRole)) {
    return undefined;
  }

  const matchingRole = (userData.roles || []).find(
    platformRole => platformRole.role === userData.highestRole
  );

  const hierarchicType =
    userData.highestRole >= ROLE.HYPER_ADMIN
      ? PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM
      : PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM;

  return {
    id: matchingRole?.platformId,
    role: matchingRole?.role,
    hierarchicType
  };
};

// -----------------------------------------------------------------------------
// Account Status Functions
// -----------------------------------------------------------------------------

/**
 * Account status constants
 */
export const ACCOUNT_STATUS = {
  NOT_VERIFIED: 0
};

/**
 * Check if account is not verified
 */
export const isAccountNotVerified = (status: number): boolean => {
  return status === ACCOUNT_STATUS.NOT_VERIFIED;
};

/**
 * Check if status indicates blocked
 */
export const isBlockedStatus = (status: number | string | null | undefined): boolean => {
  if (typeof status === 'string') {
    return status === 'blocked' || status === 'suspended';
  }
  // Status codes: 0 = active, 1 = blocked, 2 = expired
  return status === 1;
};

/**
 * Check if status indicates expired
 */
export const isExpiredStatus = (status: number | string | null | undefined): boolean => {
  if (typeof status === 'string') {
    return status === 'expired';
  }
  return status === 2;
};

// -----------------------------------------------------------------------------
// Admin Rights Functions
// -----------------------------------------------------------------------------

/**
 * Returns whether user has any admin rights on that platform
 */
export const hasAdminRights = (platform: { role: number }): boolean => {
  const rights = getUserAuthorizations(platform.role);
  return isAnyKindOfAdminAuth(rights);
};

/**
 * Check if user can manage another platform user based on role hierarchy
 * @param platformRole current user's role on platform
 * @param roleToManage role of user to manage
 * @param platformHierarchicType hierarchic type of the platform
 */
export const canManagePlatformUser = (
  platformRole: number,
  roleToManage: number,
  platformHierarchicType?: PLATFORM_HIERARCHIC_TYPE
): boolean => {
  const hierarchicType = platformHierarchicType ?? PLATFORM_HIERARCHIC_TYPE.INDEPENDENT;

  // Check if logged user has admin rights, and the user he tries to edit/delete is not of a higher role than him
  if (isUserAdmin(platformRole)) {
    return !hasAtLeastSuperRole(roleToManage);
  }

  // If the logged user is SuperAdmin, we need to check if the user he tries to edit/delete has a lower role than his,
  // and the platform on which this happens is at most a superPlatform (SuperAdmin can do actions on superPlatforms)
  if (isUserSuperAdmin(platformRole)) {
    return (
      (roleToManage < ROLE.SUPER_ADMIN && hierarchicType <= PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM) ||
      (roleToManage < ROLE.HYPER_ADMIN && hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM)
    );
  }

  // If the logged user is a HyperAdmin, we need to check if the user he tries to edit/delete has a lower role than his,
  // and the platform on which this happens is at most a SuperPlatform, or if the user he tries to manage is another
  // HyperAdmin, we need to check that the platform is a HyperPlatform
  if (isUserHyperAdmin(platformRole)) {
    return (
      (roleToManage < ROLE.SUPER_ADMIN && hierarchicType <= PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM) ||
      (roleToManage < ROLE.HYPER_ADMIN && hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM) ||
      hierarchicType === PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM
    );
  }

  return false;
};
