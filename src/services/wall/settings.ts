import { PLATFORM_INVITATION_STATUS } from 'constants/api/platforms';
import { ROLE } from 'constants/security/access';
import {
  ACCOUNT,
  CHANGE_PASSWORD,
  ADMINISTRATORS,
  GDPR,
  PAYMENT,
  PLATFORM_SETTINGS_TABS
} from 'constants/wall/settings';
import {
  isBlockedStatus,
  isExpiredStatus,
  isAnyKindOfAdmin,
  getUserAuthorizations,
  canManagePlatformUser,
  isAnyKindOfManager
} from 'services/security/accessServices';
import { isIndependentPlatform } from 'services/HyperProgramService';

export const getSettingsTabComponent = (userRights, status, platformHierarchicType) => {
  const adminOnlyFields = [];
  const hasAdminRights = isAnyKindOfAdmin(userRights);
  const hasManagerRights = isAnyKindOfManager(userRights);

  // user is not beneficiary and platform is blocked for admins/beneficiaries, then admin only has access to payment tab
  // if (hasAdminRights && !hasManagerRights && (isBlockedStatus(status) || isExpiredStatus(status))) {
  //   return [PAYMENT];
  // }

  if (hasAdminRights) {
    adminOnlyFields.push(ADMINISTRATORS);
  }

  // if (shouldIncludePayment(userRights, status, platformHierarchicType) && !hasManagerRights) {
  //   adminOnlyFields.push(PAYMENT);
  // }

  return [ACCOUNT, CHANGE_PASSWORD, ...adminOnlyFields, GDPR];
};

export const getPlatformSettingTabs = ({ role, status, hierarchicType }) => {
  if (!shouldIncludePayment(getUserAuthorizations(role), status, hierarchicType)) {
    return PLATFORM_SETTINGS_TABS.filter(tab => tab !== PAYMENT);
  }

  return PLATFORM_SETTINGS_TABS;
};

/**
 * Returns whether payment tab should be included in platform settings:
 * - user is any kind of admin;
 * - if independent platform and user is admin, platform should not be blocked
 * @param userRights
 * @param status
 * @param platformHierarchicType
 */
const shouldIncludePayment = (userRights, status, platformHierarchicType) =>
  isAnyKindOfAdmin(userRights) &&
  !(userRights.isAdmin && isIndependentPlatform(platformHierarchicType) && isBlockedStatus(status));

export const canManageAdminOrCommunityManager = (
  userToManage,
  currentUser,
  platformHierarchicType,
  withDelete?: boolean
) => {
  const { uuid, cannotBeDeleted, status, role } = userToManage;

  const shouldButtonAppear =
    currentUser.uuid !== uuid &&
    status !== PLATFORM_INVITATION_STATUS.PENDING &&
    // role is relative to platform and check if logged user has at least a role higher than the user he wants to change
    currentUser.role !== ROLE.BENEFICIARY &&
    canManagePlatformUser(currentUser.role, role, platformHierarchicType);

  return withDelete ? shouldButtonAppear && !cannotBeDeleted : shouldButtonAppear;
};
