// -----------------------------------------------------------------------------
// Wall Settings Services
// Migrated from old_app/src/services/wall/settings.ts
// -----------------------------------------------------------------------------

import { PLATFORM_INVITATION_STATUS } from '@/constants/api/platforms';
import { ROLE } from '@/constants/security/access';
import {
  ACCOUNT,
  CHANGE_PASSWORD,
  ADMINISTRATORS,
  GDPR,
  PAYMENT,
  PLATFORM_SETTINGS_TABS
} from '@/constants/wall/settings';
import {
  isBlockedStatus,
  isAnyKindOfAdmin,
  getUserAuthorizations,
  canManagePlatformUser,
  isAnyKindOfManager,
  UserAuthorizations
} from '@/services/security/accessServices';
import { isIndependentPlatform } from '@/services/HyperProgramService';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface UserToManage {
  uuid: string;
  cannotBeDeleted?: boolean;
  status: number;
  role: number;
}

export interface CurrentUser {
  uuid: string;
  role: number;
}

// -----------------------------------------------------------------------------
// Settings Tab Functions
// -----------------------------------------------------------------------------

/**
 * Get the available settings tabs based on user rights
 */
export const getSettingsTabComponent = (
  userRights: UserAuthorizations,
  status: number,
  platformHierarchicType: string
): string[] => {
  const adminOnlyFields: string[] = [];
  const hasAdminRights = userRights.isAdmin;
  const hasManagerRights = userRights.isManager;

  if (hasAdminRights) {
    adminOnlyFields.push(ADMINISTRATORS);
  }

  return [ACCOUNT, CHANGE_PASSWORD, ...adminOnlyFields, GDPR];
};

/**
 * Get platform settings tabs based on role and status
 */
export const getPlatformSettingTabs = ({ 
  role, 
  status, 
  hierarchicType 
}: { 
  role: number; 
  status: number; 
  hierarchicType: string; 
}): string[] => {
  const userRights = getUserAuthorizations(role);
  if (!shouldIncludePayment(userRights, status, hierarchicType)) {
    return PLATFORM_SETTINGS_TABS.filter(tab => tab !== PAYMENT);
  }

  return PLATFORM_SETTINGS_TABS;
};

/**
 * Returns whether payment tab should be included in platform settings:
 * - user is any kind of admin;
 * - if independent platform and user is admin, platform should not be blocked
 */
const shouldIncludePayment = (
  userRights: UserAuthorizations,
  status: number,
  platformHierarchicType: string
): boolean =>
  userRights.isAdmin &&
  !(userRights.isAdmin && isIndependentPlatform(platformHierarchicType) && isBlockedStatus(status));

// -----------------------------------------------------------------------------
// User Management Functions
// -----------------------------------------------------------------------------

/**
 * Check if current user can manage another admin or community manager
 */
export const canManageAdminOrCommunityManager = (
  userToManage: UserToManage,
  currentUser: CurrentUser,
  platformHierarchicType: string | number,
  withDelete?: boolean
): boolean => {
  const { uuid, cannotBeDeleted, status, role } = userToManage;

  // Convert string hierarchic type to number if needed
  const hierarchicTypeNum = typeof platformHierarchicType === 'string' 
    ? parseInt(platformHierarchicType, 10) 
    : platformHierarchicType;

  const shouldButtonAppear =
    currentUser.uuid !== uuid &&
    status !== PLATFORM_INVITATION_STATUS.PENDING &&
    // role is relative to platform and check if logged user has at least a role higher than the user he wants to change
    currentUser.role !== ROLE.BENEFICIARY &&
    canManagePlatformUser(currentUser.role, role, hierarchicTypeNum);

  return withDelete ? shouldButtonAppear && !cannotBeDeleted : shouldButtonAppear;
};
