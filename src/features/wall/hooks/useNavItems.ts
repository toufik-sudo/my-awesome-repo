// -----------------------------------------------------------------------------
// useNavItems Hook
// Migrated from old_app/src/hooks/nav/useNavItems.ts
// -----------------------------------------------------------------------------

import { useMemo } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  UsersRound, 
  Coins, 
  BarChart3, 
  CircleHelp, 
  Sparkles,
  Settings,
  Bell,
  Trophy,
  Rocket,
  FileText,
} from 'lucide-react';
import { useUserRole } from '@/hooks/auth';
import { useWallSelection, useIsFreemiumProgram } from '@/hooks/wall';
import { NavItem, ISelectedPlatform } from '../types';
import { ROLE } from '@/constants/security/access';
import { 
  getUserAuthorizations, 
  hasAtLeastSuperRole,
  isAnyKindOfAdminAuth
} from '@/services/security/accessServices';

// Route constants
const WALL_ROUTE = '/wall';
const WALL_PROGRAM_ROUTE = '/programs';
const LAUNCH_BASE = '/launch';
const METRICS_ROUTE = '/metrics';
const PAYOUT_ROUTE = '/payout';
const AI_ROUTE = '/ai';
const USERS_ROUTE = '/users';
const DASHBOARD_ROUTE = '/wall/dashboard';
const USER_DECLARATIONS_ROUTE = '/user-declarations';
const WALL_BENEFICIARY_CREATE_DECLARATION_ROUTE = '/wall/create-declaration';
const WALL_BENEFICIARY_POINTS_ROUTE = '/wall/points';
const WALL_BENEFICIARY_RANKING_ROUTE = '/wall/ranking';
const WALL_BENEFICIARY_DECLARATIONS_ROUTE = '/declarations';
const SETTINGS_ROUTE = '/settings';
const NOTIFICATIONS_ROUTE = '/notifications';
const DECLARATIONS_ADMIN_ROUTE = '/declarations';

// Help URLs
const HELP_URL = 'mailto:support@rewardzai.com';

/**
 * Build a navigation item
 */
const buildNavItem = (
  title: string,
  icon: NavItem['icon'],
  url: string,
  options: Partial<NavItem> = {}
): NavItem => ({
  title,
  icon,
  url,
  ...options,
});

/**
 * Get main menu items based on user role
 * @param isFreemium - Whether the selected program is freemium (hides declarations)
 */
export const getMenuItems = (
  role: number | undefined | null, 
  selectedPlatform: ISelectedPlatform,
  isFreemium: boolean = false
): NavItem[] => {
  const authorizations = getUserAuthorizations(role ?? undefined);
  const { isBeneficiary, isAdmin, isHyperAdmin, isSuperAdmin } = authorizations;
  const isSuperUser = hasAtLeastSuperRole(role ?? ROLE.BENEFICIARY);

  const WALL_ITEM = buildNavItem('wall', LayoutDashboard, WALL_ROUTE);
  const PROGRAMS_ITEM = buildNavItem('programs', Layers, WALL_PROGRAM_ROUTE);
  const LAUNCH_ITEM = buildNavItem('launch', Rocket, LAUNCH_BASE);
  const DECLARE_ITEM = buildNavItem('declare', Coins, WALL_BENEFICIARY_CREATE_DECLARATION_ROUTE);
  const METRICS_ITEM = buildNavItem('metrics', BarChart3, METRICS_ROUTE);
  const PAYOUT_ITEM = buildNavItem('payout', BarChart3, PAYOUT_ROUTE);
  const AI_ITEM = buildNavItem('ai', Sparkles, AI_ROUTE);
  const USERS_ITEM = buildNavItem('users', UsersRound, USERS_ROUTE);
  const DECLARATIONS_ADMIN_ITEM = buildNavItem('declarations', FileText, DECLARATIONS_ADMIN_ROUTE);
  const HELP_ITEM = buildNavItem('help', CircleHelp, HELP_URL, { external: true });

  const items: NavItem[] = isSuperUser ? [PROGRAMS_ITEM] : [WALL_ITEM, PROGRAMS_ITEM];

  if (isHyperAdmin) {
    items.unshift(METRICS_ITEM);
    items.push(PAYOUT_ITEM);
  }

  // Hide declarations for freemium programs
  if ((isAdmin || isHyperAdmin || isSuperAdmin) && !isFreemium) {
    items.push(USERS_ITEM);
    items.push(DECLARATIONS_ADMIN_ITEM);
    items.push(AI_ITEM);
    items.push({ ...LAUNCH_ITEM, isDisabled: !selectedPlatform.id });
  } else if (isAdmin || isHyperAdmin || isSuperAdmin) {
    // For freemium, add users and launch but not declarations
    items.push(USERS_ITEM);
    items.push(AI_ITEM);
    items.push({ ...LAUNCH_ITEM, isDisabled: !selectedPlatform.id });
  }

  // Hide declare for beneficiaries on freemium
  if (isBeneficiary && !isFreemium) {
    items.push(DECLARE_ITEM);
  }

  items.push(HELP_ITEM);

  return items;
};

/**
 * Get widget menu items based on user role (shown on mobile)
 */
export const getWidgetsMenuItems = (role: number | undefined | null): NavItem[] => {
  const userRights = getUserAuthorizations(role ?? undefined);
  const items: NavItem[] = [];

  const SETTINGS_ITEM = buildNavItem('settings', Settings, SETTINGS_ROUTE);
  const NOTIFICATIONS_ITEM = buildNavItem('notifications', Bell, NOTIFICATIONS_ROUTE);
  const DASHBOARD_ITEM = buildNavItem('dashboard', LayoutDashboard, DASHBOARD_ROUTE);
  const BENEFICIARY_POINTS_ITEM = buildNavItem('points', Coins, WALL_BENEFICIARY_POINTS_ROUTE);
  const BENEFICIARY_RANKING_ITEM = buildNavItem('ranking', Trophy, WALL_BENEFICIARY_RANKING_ROUTE);
  const BENEFICIARY_DECLARATIONS_ITEM = buildNavItem('myDeclarations', FileText, WALL_BENEFICIARY_DECLARATIONS_ROUTE);

  // Common items for all users
  items.push(NOTIFICATIONS_ITEM, SETTINGS_ITEM);

  if (!userRights.isBeneficiary) {
    items.push(DASHBOARD_ITEM);
  }

  if (userRights.isBeneficiary) {
    items.push(BENEFICIARY_POINTS_ITEM, BENEFICIARY_RANKING_ITEM, BENEFICIARY_DECLARATIONS_ITEM);
  }

  return items;
};

/**
 * Hook to get navigation items based on user role and selected platform
 */
export const useNavItems = () => {
  const { selectedPlatform } = useWallSelection();
  const userRole = useUserRole();
  const isFreemium = useIsFreemiumProgram();

  const menuItems = useMemo(() => ({
    wall: getMenuItems(userRole, selectedPlatform, isFreemium),
    widgets: getWidgetsMenuItems(userRole),
  }), [userRole, selectedPlatform, isFreemium]);

  return menuItems;
};

export default useNavItems;
