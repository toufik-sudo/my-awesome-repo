import { 
  Home, 
  LayoutDashboard, 
  Settings, 
  Users, 
  FileText, 
  Calendar, 
  Map, 
  Grid3X3, 
  Filter, 
  Image, 
  Bell, 
  HelpCircle,
  LogOut,
  User,
  Shield,
  CreditCard,
  Building2,
  MessageSquare,
  BarChart3,
  Layers,
  Palette,
  Wallet,
  AlertTriangle,
  Receipt,
  Bug,
  RotateCcw
} from 'lucide-react';
import { 
  NavMenuGroup, 
  NavMenuItem, 
  LayoutThemeConfig, 
  NavigationConfig 
} from '@/types/navigation.types';
import { UI_PERM } from '@/utils/rbac/ui-permission-keys';

// Layout theme configurations
export const layoutThemes: Record<string, LayoutThemeConfig> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    translationKey: 'layouts.classic',
    icon: '📐',
    layoutVariant: 'sidebar-left',
    sidebarStyle: 'default',
    navMenuStyle: 'default',
    sidebarWidth: { collapsed: '64px', expanded: '280px' },
    sidebarPosition: 'fixed',
    headerPosition: 'sticky',
    showLogo: true,
    showUserMenu: true,
    showSearch: true,
    showBreadcrumbs: true,
    animations: {
      sidebar: 'transition-all duration-300 ease-in-out',
      menu: 'transition-all duration-200 ease-out',
      hover: 'hover:scale-[1.02] transition-transform'
    }
  },
  compact: {
    id: 'compact',
    name: 'Compact',
    translationKey: 'layouts.compact',
    icon: '📦',
    layoutVariant: 'sidebar-mini',
    sidebarStyle: 'compact',
    navMenuStyle: 'minimal',
    sidebarWidth: { collapsed: '48px', expanded: '200px' },
    sidebarPosition: 'fixed',
    headerPosition: 'sticky',
    showLogo: false,
    showUserMenu: true,
    showSearch: false,
    showBreadcrumbs: false,
    animations: {
      sidebar: 'transition-all duration-200 ease-out',
      menu: 'transition-all duration-150 ease-out',
      hover: 'hover:bg-accent/50 transition-colors'
    }
  },
  floating: {
    id: 'floating',
    name: 'Floating',
    translationKey: 'layouts.floating',
    icon: '🎈',
    layoutVariant: 'sidebar-left',
    sidebarStyle: 'floating',
    navMenuStyle: 'pills',
    sidebarWidth: { collapsed: '72px', expanded: '260px' },
    sidebarPosition: 'fixed',
    headerPosition: 'fixed',
    showLogo: true,
    showUserMenu: true,
    showSearch: true,
    showBreadcrumbs: true,
    animations: {
      sidebar: 'transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]',
      menu: 'transition-all duration-200 ease-out',
      hover: 'hover:translate-x-1 transition-transform'
    }
  },
  glass: {
    id: 'glass',
    name: 'Glass',
    translationKey: 'layouts.glass',
    icon: '🔮',
    layoutVariant: 'sidebar-left',
    sidebarStyle: 'glass',
    navMenuStyle: 'underline',
    sidebarWidth: { collapsed: '64px', expanded: '280px' },
    sidebarPosition: 'fixed',
    headerPosition: 'sticky',
    showLogo: true,
    showUserMenu: true,
    showSearch: true,
    showBreadcrumbs: true,
    animations: {
      sidebar: 'transition-all duration-400 ease-out backdrop-blur-lg',
      menu: 'transition-all duration-250 ease-out',
      hover: 'hover:bg-white/10 transition-colors'
    }
  },
  topNav: {
    id: 'topNav',
    name: 'Top Navigation',
    translationKey: 'layouts.topNav',
    icon: '📊',
    layoutVariant: 'topnav-only',
    sidebarStyle: 'default',
    navMenuStyle: 'tabs',
    sidebarWidth: { collapsed: '0px', expanded: '0px' },
    sidebarPosition: 'static',
    headerPosition: 'sticky',
    showLogo: true,
    showUserMenu: true,
    showSearch: true,
    showBreadcrumbs: true,
    animations: {
      sidebar: '',
      menu: 'transition-all duration-200 ease-out',
      hover: 'hover:text-primary transition-colors'
    }
  },
  dualSidebar: {
    id: 'dualSidebar',
    name: 'Dual Sidebar',
    translationKey: 'layouts.dualSidebar',
    icon: '📚',
    layoutVariant: 'dual-sidebar',
    sidebarStyle: 'bordered',
    navMenuStyle: 'default',
    sidebarWidth: { collapsed: '64px', expanded: '240px' },
    sidebarPosition: 'fixed',
    headerPosition: 'sticky',
    showLogo: true,
    showUserMenu: true,
    showSearch: true,
    showBreadcrumbs: true,
    animations: {
      sidebar: 'transition-all duration-300 ease-in-out',
      menu: 'transition-all duration-200 ease-out',
      hover: 'hover:border-primary transition-colors'
    }
  },
  gradient: {
    id: 'gradient',
    name: 'Gradient',
    translationKey: 'layouts.gradient',
    icon: '🌈',
    layoutVariant: 'sidebar-left',
    sidebarStyle: 'gradient',
    navMenuStyle: 'pills',
    sidebarWidth: { collapsed: '64px', expanded: '280px' },
    sidebarPosition: 'fixed',
    headerPosition: 'sticky',
    showLogo: true,
    showUserMenu: true,
    showSearch: true,
    showBreadcrumbs: true,
    animations: {
      sidebar: 'transition-all duration-350 ease-out',
      menu: 'transition-all duration-200 ease-out',
      hover: 'hover:shadow-lg transition-shadow'
    }
  }
};

// Default menu groups configuration
export const defaultMenuGroups: NavMenuGroup[] = [
  {
    id: 'main',
    translationKey: 'navigation.groups.main',
    collapsible: false,
    defaultOpen: true,
    items: [
      { id: 'my-bookings', label: 'My Bookings', translationKey: 'navigation.myBookings', url: '/bookings', icon: CreditCard, permissionKey: UI_PERM.NAV_MY_BOOKINGS },
      { id: 'dashboard', label: 'Dashboard', translationKey: 'navigation.dashboard', url: '/dashboard', icon: LayoutDashboard, badge: 'New', badgeVariant: 'success', permissionKey: UI_PERM.NAV_DASHBOARD }
    ]
  },
  {
    id: 'demos',
    translationKey: 'navigation.groups.demos',
    collapsible: true,
    defaultOpen: true,
    items: [
      { id: 'grid', label: 'Grid Demo', translationKey: 'navigation.gridDemo', url: '/demo/grid', icon: Grid3X3, permissionKey: UI_PERM.NAV_GRID_DEMO },
      { id: 'filter', label: 'Filter Demo', translationKey: 'navigation.filterDemo', url: '/demo/filter', icon: Filter, permissionKey: UI_PERM.NAV_FILTER_DEMO },
      {
        id: 'map', label: 'Map Search', translationKey: 'navigation.mapSearch', url: '/map', icon: Map, permissionKey: UI_PERM.NAV_MAP,
        children: [
          { id: 'map-search', label: 'Search Properties', translationKey: 'navigation.searchProperties', url: '/map/search', icon: Map, permissionKey: UI_PERM.NAV_MAP_SEARCH },
          { id: 'map-saved', label: 'Saved Locations', translationKey: 'navigation.savedLocations', url: '/map/saved', icon: Building2, permissionKey: UI_PERM.NAV_MAP_SAVED }
        ]
      },
      {
        id: 'calendar', label: 'Calendar', translationKey: 'navigation.calendar', url: '/calendar', icon: Calendar, permissionKey: UI_PERM.NAV_CALENDAR,
        children: [
          { id: 'calendar-events', label: 'Events', translationKey: 'navigation.events', url: '/calendar/events', icon: Calendar, permissionKey: UI_PERM.NAV_CALENDAR_EVENTS },
          { id: 'calendar-bookings', label: 'Bookings', translationKey: 'navigation.bookings', url: '/calendar/bookings', icon: CreditCard, badge: 3, badgeVariant: 'warning', permissionKey: UI_PERM.NAV_CALENDAR_BOOKINGS }
        ]
      }
    ]
  },
  {
    id: 'content',
    translationKey: 'navigation.groups.content',
    collapsible: true,
    defaultOpen: false,
    items: [
      {
        id: 'pages', label: 'Pages', translationKey: 'navigation.pages', icon: FileText, permissionKey: UI_PERM.NAV_PAGES,
        children: [
          { id: 'page-list', label: 'All Pages', translationKey: 'navigation.allPages', url: '/pages', permissionKey: UI_PERM.NAV_PAGES_LIST },
          { id: 'page-create', label: 'Create Page', translationKey: 'navigation.createPage', url: '/pages/new', permissionKey: UI_PERM.NAV_PAGES_CREATE }
        ]
      },
      { id: 'media', label: 'Media', translationKey: 'navigation.media', url: '/media', icon: Image, permissionKey: UI_PERM.NAV_MEDIA },
      { id: 'messages', label: 'Messages', translationKey: 'navigation.messages', url: '/messages', icon: MessageSquare, badge: 12, badgeVariant: 'error', permissionKey: UI_PERM.NAV_MESSAGES }
    ]
  },
  {
    id: 'payments',
    translationKey: 'navigation.groups.payments',
    label: 'Payments',
    collapsible: true,
    defaultOpen: true,
    items: [
      { id: 'my-disputes', label: 'My Disputes', translationKey: 'navigation.myDisputes', url: '/my-disputes', icon: AlertTriangle, permissionKey: UI_PERM.NAV_MY_DISPUTES },
      { id: 'payment-validation', label: 'Payment Validation', translationKey: 'navigation.paymentValidation', url: '/admin/payment-validation', icon: CreditCard, permissionKey: UI_PERM.NAV_PAYMENT_VALIDATION },
      { id: 'payouts-dashboard', label: 'Payouts', translationKey: 'navigation.payouts', url: '/admin/payouts', icon: Wallet, permissionKey: UI_PERM.NAV_PAYOUTS },
      { id: 'escrow-admin', label: 'Escrow & Disputes', translationKey: 'navigation.escrow', url: '/admin/escrow', icon: Receipt, permissionKey: UI_PERM.NAV_ESCROW },
      { id: 'host-reactivation', label: 'Host Reactivation', translationKey: 'navigation.hostReactivation', url: '/host/reactivation', icon: RotateCcw, permissionKey: UI_PERM.NAV_HOST_REACTIVATION }
    ]
  },
  {
    id: 'admin',
    translationKey: 'navigation.groups.admin',
    collapsible: true,
    defaultOpen: true,
    items: [
      { id: 'booking-calendar', label: 'Booking Calendar', translationKey: 'navigation.bookingCalendar', url: '/booking-calendar', icon: Calendar, permissionKey: UI_PERM.NAV_BOOKING_CALENDAR },
      { id: 'admin-dashboard', label: 'Administration', translationKey: 'navigation.administration', url: '/admin', icon: Shield, permissionKey: UI_PERM.NAV_ADMIN_DASHBOARD },
      { id: 'cancellation-rules', label: 'Cancellation Rules', translationKey: 'navigation.cancellationRules', url: '/admin/cancellation-rules', icon: Shield, permissionKey: UI_PERM.NAV_CANCELLATION_RULES },
      { id: 'admin-chat', label: 'Support Chat', translationKey: 'navigation.supportChat', url: '/support', icon: MessageSquare, badge: 'Live', badgeVariant: 'success', permissionKey: UI_PERM.NAV_SUPPORT_CHAT },
      { id: 'users', label: 'Users', translationKey: 'navigation.users', url: '/admin/users', icon: Users, permissionKey: UI_PERM.NAV_USERS },
      { id: 'analytics', label: 'Analytics', translationKey: 'navigation.analytics', url: '/admin/analytics', icon: BarChart3, permissionKey: UI_PERM.NAV_ANALYTICS },
      { id: 'security', label: 'Security', translationKey: 'navigation.security', url: '/admin/security', icon: Shield, permissionKey: UI_PERM.NAV_SECURITY },
      { id: 'appearance', label: 'Appearance', translationKey: 'navigation.appearance', url: '/admin/appearance', icon: Palette, permissionKey: UI_PERM.NAV_APPEARANCE },
      { id: 'rbac-settings', label: 'RBAC Settings', translationKey: 'navigation.rbacSettings', url: '/admin/rbac-settings', icon: Shield, permissionKey: UI_PERM.NAV_RBAC_SETTINGS },
      { id: 'rbac-debug', label: 'RBAC Debug', translationKey: 'navigation.rbacDebug', url: '/admin/rbac-debug', icon: Bug, permissionKey: UI_PERM.NAV_RBAC_DEBUG },
      { id: 'settings', label: 'Settings', translationKey: 'navigation.settings', url: '/settings', icon: Settings, permissionKey: UI_PERM.NAV_SETTINGS }
    ]
  }
];

// User menu items
export const defaultUserMenuItems: NavMenuItem[] = [
  { id: 'profile', label: 'Profile', translationKey: 'navigation.profile', url: '/settings', icon: User, permissionKey: UI_PERM.NAV_PROFILE },
  { id: 'notifications', label: 'Notifications', translationKey: 'navigation.notifications', url: '/notifications', icon: Bell, badge: 5, permissionKey: UI_PERM.NAV_NOTIFICATIONS },
  { id: 'help', label: 'Help & Support', translationKey: 'navigation.help', url: '/help', icon: HelpCircle, permissionKey: UI_PERM.NAV_HELP },
  { id: 'logout', label: 'Logout', translationKey: 'auth.logout', icon: LogOut },
];

// Quick action items
export const defaultQuickActions: NavMenuItem[] = [
  {
    id: 'new-booking',
    label: 'New Booking',
    translationKey: 'navigation.newBooking',
    url: '/bookings/new',
    icon: Calendar
  },
  {
    id: 'add-property',
    label: 'Add Property',
    translationKey: 'navigation.addProperty',
    url: '/properties/new',
    icon: Building2
  }
];

// Default navigation configuration
export const getDefaultNavigationConfig = (
  layoutThemeId: string = 'classic',
  hiddenItems: string[] = [],
  disabledItems: string[] = []
): NavigationConfig => ({
  layoutTheme: layoutThemes[layoutThemeId] || layoutThemes.classic,
  menuGroups: defaultMenuGroups,
  hiddenItems,
  disabledItems,
  userMenuItems: defaultUserMenuItems,
  quickActions: defaultQuickActions
});

// Helper to filter menu items based on hidden/disabled arrays
export const filterMenuItems = (
  items: NavMenuItem[],
  hiddenItems: string[],
  disabledItems: string[]
): NavMenuItem[] => {
  return items
    .filter(item => !hiddenItems.includes(item.id) && !item.hidden)
    .map(item => ({
      ...item,
      disabled: disabledItems.includes(item.id) || item.disabled,
      children: item.children 
        ? filterMenuItems(item.children, hiddenItems, disabledItems)
        : undefined
    }));
};

// Helper to filter menu groups
export const filterMenuGroups = (
  groups: NavMenuGroup[],
  hiddenItems: string[],
  disabledItems: string[]
): NavMenuGroup[] => {
  return groups
    .filter(group => !hiddenItems.includes(group.id) && !group.hidden)
    .map(group => ({
      ...group,
      items: filterMenuItems(group.items, hiddenItems, disabledItems)
    }))
    .filter(group => group.items.length > 0);
};

// Helper to check if user has required permission
export const hasPermission = (
  userRoles: string[],
  requiredPermissions?: string[]
): boolean => {
  // If no permissions required, always show
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }
  // Check if user has any of the required permissions/roles
  return requiredPermissions.some(permission => 
    userRoles.includes(permission)
  );
};

// Filter menu items based on user permissions
export const filterMenuByPermissions = (
  items: NavMenuItem[],
  userRoles: string[]
): NavMenuItem[] => {
  return items
    .filter(item => hasPermission(userRoles, item.permissions) && hasPermission(userRoles, item.roles))
    .map(item => ({
      ...item,
      children: item.children 
        ? filterMenuByPermissions(item.children, userRoles)
        : undefined
    }));
};

// Filter menu groups based on user permissions
export const filterMenuGroupsByPermissions = (
  groups: NavMenuGroup[],
  userRoles: string[]
): NavMenuGroup[] => {
  return groups
    .map(group => ({
      ...group,
      items: filterMenuByPermissions(group.items, userRoles)
    }))
    .filter(group => group.items.length > 0);
};

/**
 * Filter menu items by UI permission key (preferred — DB-backed).
 * `canUI(key)` is provided by usePermissions(). Items without `permissionKey` always pass.
 */
export const filterMenuByPermissionKey = (
  items: NavMenuItem[],
  canUI: (key: string) => boolean,
): NavMenuItem[] => {
  return items
    .filter(item => !item.permissionKey || canUI(item.permissionKey))
    .map(item => ({
      ...item,
      children: item.children ? filterMenuByPermissionKey(item.children, canUI) : undefined,
    }));
};

export const filterMenuGroupsByPermissionKey = (
  groups: NavMenuGroup[],
  canUI: (key: string) => boolean,
): NavMenuGroup[] => {
  return groups
    .map(group => ({ ...group, items: filterMenuByPermissionKey(group.items, canUI) }))
    .filter(group => group.items.length > 0);
};
