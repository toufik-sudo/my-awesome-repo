import { LayoutDashboard, Layers, UsersRound, Coins, BarChart3, CircleHelp, Sparkles, CheckCircle2 } from 'lucide-react';

import {
  DASHBOARD_ROUTE,
  DASHBOARD_WALL,
  DECLARATIONS_WALL,
  LAUNCH_BASE,
  METRICS,
  METRICS_ROUTE,
  PAYMENT_SETTINGS_ROUTE,
  PAYMENT_WALL,
  USER_DECLARATIONS_ROUTE,
  USERS_ROUTE,
  USERS_WALL,
  WALL_BENEFICIARY_POINTS_ROUTE,
  WALL_BENEFICIARY_RANKING_ROUTE,
  WALL_BENEFICIARY_DECLARATIONS_ROUTE,
  WALL_BENEFICIARY_CREATE_DECLARATION_ROUTE,
  WALL_COMMUNICATION_EMAIL_CAMPAIGNS_ROUTE,
  WALL_PROGRAM_ROUTE,
  WALL_ROUTE,
  PAYOUT,
  AI,
  WALL_HYPER_ADMIN_PAYOUT_ROUTE,
  WALL_ADMIN_AI_ROUTE
} from 'constants/routes';
import { buildNavigationUrl } from 'services/WallServices';
import { BENEFICIARY_POINTS, RANKING } from 'constants/api';
import { getUserAuthorizations, hasAtLeastSuperRole, isAnyKindOfAdmin } from 'services/security/accessServices';
import { canCreateProgramsOnPlatform } from 'services/PlatformSelectionServices';

export const WALL = 'wall';
export const PROGRAMS = 'programs';
export const COMMUNICATION = 'communication';
export const LAUNCH = 'launch';
export const DECLARE = 'declare';
export const HELP = 'help';
export const HELP_URLS = {
  US: `mailto: support@rewardzai.com`,
  EU: `mailto: support@rewardzai.com`
};
export const LINK = 'link';

const WALL_ITEM = buildNavigationUrl(WALL, LayoutDashboard, WALL_ROUTE);
const PROGRAMS_ITEM = buildNavigationUrl(PROGRAMS, Layers, WALL_PROGRAM_ROUTE);
// const COMMUNICATIONS_ITEM = buildNavigationUrl(COMMUNICATION, CheckCircle2, WALL_COMMUNICATION_EMAIL_CAMPAIGNS_ROUTE);
const LAUNCH_ITEM = buildNavigationUrl(LAUNCH, UsersRound, LAUNCH_BASE);
const DECLARE_ITEM = buildNavigationUrl(DECLARE, Coins, WALL_BENEFICIARY_CREATE_DECLARATION_ROUTE);
const METRICS_ITEM = buildNavigationUrl(METRICS, BarChart3, METRICS_ROUTE);
const PAYOUT_ITEM = buildNavigationUrl(PAYOUT, BarChart3, WALL_HYPER_ADMIN_PAYOUT_ROUTE);
const AI_ITEM = buildNavigationUrl(AI, Sparkles, WALL_ADMIN_AI_ROUTE);
/**
 * Maps the menu items accordingly to the given role
 * @param role
 * @param selectedPlatform
 */
export const getMenuItems = (role, selectedPlatform) => {
  const { isBeneficiary, isAdmin, isManager, isHyperAdmin } = getUserAuthorizations(role);
  const isSuperUser = hasAtLeastSuperRole(role);
  const items = isSuperUser ? [PROGRAMS_ITEM] : [WALL_ITEM, PROGRAMS_ITEM];
  if (isHyperAdmin) {
    items.splice(0, 0, METRICS_ITEM);
    items.push(PAYOUT_ITEM);
  }
  if (isAdmin || isHyperAdmin) {
    // items.splice(0, 0, COMMUNICATIONS_ITEM);
    items.push(AI_ITEM);
    items.push(getLaunchItem(selectedPlatform));
  }
  // if (isAdmin || isManager) items.push(COMMUNICATIONS_ITEM);
  // if (isAdmin) items.push(getLaunchItem(selectedPlatform));
  if (isBeneficiary) items.push(DECLARE_ITEM);

  // if (!isSuperUser)
  items.push({ ...buildNavigationUrl(HELP, CircleHelp, `${HELP_URLS[process.env.REACT_APP_ZONE]}`), external: true });

  return items;
};

export const getExpandedMenuItemsForSuperUsers = (role, selectedPlatform) => {
  const { isSuperAdmin, isHyperAdmin } = getUserAuthorizations(role);
  const items = [WALL_ITEM, PROGRAMS_ITEM];

  if (selectedPlatform.id) {
    // items.push(COMMUNICATIONS_ITEM);
    if (isSuperAdmin || isHyperAdmin) {
      items.push(getLaunchItem(selectedPlatform));
    }
  }

  return items;
};

const getLaunchItem = selectedPlatform => {
  const isDisabled = !canCreateProgramsOnPlatform(selectedPlatform);

  return { ...LAUNCH_ITEM, isDisabled };
};

const ALL_USERS_ITEM = buildNavigationUrl(USERS_WALL, null, USERS_ROUTE);
const DASHBOARD_ITEM = buildNavigationUrl(DASHBOARD_WALL, null, DASHBOARD_ROUTE);
const DECLARATIONS_ITEM = buildNavigationUrl(DECLARATIONS_WALL, null, USER_DECLARATIONS_ROUTE);
const PAYMENT_ITEM = buildNavigationUrl(PAYMENT_WALL, null, PAYMENT_SETTINGS_ROUTE);
const BENEFICIARY_DECLARATIONS_ITEM = buildNavigationUrl(DECLARATIONS_WALL, null, WALL_BENEFICIARY_DECLARATIONS_ROUTE);
const BENEFICIARY_RANKING_ITEM = buildNavigationUrl(RANKING, null, WALL_BENEFICIARY_RANKING_ROUTE);
const BENEFICIARY_POINTS_ITEM = buildNavigationUrl(BENEFICIARY_POINTS, null, WALL_BENEFICIARY_POINTS_ROUTE);

/**
 * Maps the possible widget menu items accordingly to the current role
 * @param role
 */
export const getWidgetsMenuItems = role => {
  const userRights = getUserAuthorizations(role);
  //  When the agenda widget is implemented on mobile,
  // in order to enable it on the  mobile menu please add const items = [AGENDA_ITEM];
  const items = [];
  if (!userRights.isBeneficiary) {
    items.push(ALL_USERS_ITEM, DASHBOARD_ITEM, DECLARATIONS_ITEM);
  }

  if (userRights.isBeneficiary) {
    items.push(BENEFICIARY_POINTS_ITEM, BENEFICIARY_RANKING_ITEM, BENEFICIARY_DECLARATIONS_ITEM);
  }

  if (isAnyKindOfAdmin(userRights)) items.push(PAYMENT_ITEM);

  return items;
};
