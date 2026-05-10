import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { Content } from './Content';
import { LayoutProps } from '@/types/component.types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { generateUiPermissionKey } from '@/utils/rbac/generate-ui-permission-key';
import {
  LayoutDashboard,
  Home,
  Building2,
  CalendarCheck,
  Settings,
  Palette,
  History,
  MessageSquare,
  Headphones,
  Compass,
  Trophy,
  Calendar,
  Shield,
  Bug,
  Receipt,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PUBLIC_ROUTES,
  PROPERTY_ROUTES,
  SERVICE_ROUTES,
  BOOKING_ROUTES,
  DASHBOARD_ROUTES,
  SUPPORT_ROUTES,
  ADMIN_ROUTES,
  DEMO_ROUTES,
} from '@/routes/routes.constants';

interface MainLayoutProps {
  headerProps?: LayoutProps;
  footerProps?: LayoutProps;
  sidebarProps?: LayoutProps & { collapsible?: boolean };
  contentProps?: LayoutProps;
  children: React.ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  requireAuth?: boolean;
  /** Sidebar permission key: ui.Sidebar.<section>.Link.View */
  sidebarSection: string;
  roles?: string[];
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  headerProps = {},
  footerProps = {},
  sidebarProps = {},
  contentProps = {},
  children,
}) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { canUI, role, frontendPermCache } = useRoleAccess();
  const user = role ? { role } : null;

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, [isMobile]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems: NavItem[] = [
    { path: PUBLIC_ROUTES.HOME, label: t('nav.home') || 'Home', icon: Home, sidebarSection: 'Home' },
    { path: DASHBOARD_ROUTES.ROOT, label: t('nav.dashboard') || 'Dashboard', icon: LayoutDashboard, requireAuth: true, sidebarSection: 'Dashboard' },
    { path: PROPERTY_ROUTES.LIST, label: t('nav.properties') || 'Properties', icon: Building2, sidebarSection: 'Properties' },
    { path: SERVICE_ROUTES.LIST, label: t('nav.services') || 'Services', icon: Compass, sidebarSection: 'Services' },
    { path: BOOKING_ROUTES.LIST, label: t('nav.bookings') || 'Bookings', icon: CalendarCheck, requireAuth: true, sidebarSection: 'Bookings' },
    { path: BOOKING_ROUTES.CALENDAR, label: t('nav.bookingCalendar') || 'Calendar', icon: Calendar, requireAuth: true, sidebarSection: 'Calendar' },
    { path: DASHBOARD_ROUTES.POINTS, label: t('nav.points', 'Points') || 'Points', icon: Trophy, requireAuth: true, sidebarSection: 'Points' },
    { path: BOOKING_ROUTES.HOST, label: t('nav.bookingRequests') || 'Requests', icon: MessageSquare, requireAuth: true, sidebarSection: 'Requests' },
    { path: BOOKING_ROUTES.HISTORY, label: t('nav.bookingHistory') || 'History', icon: History, requireAuth: true, sidebarSection: 'History' },
    { path: DASHBOARD_ROUTES.SETTINGS, label: t('nav.settings') || 'Settings', icon: Settings, requireAuth: true, sidebarSection: 'Settings' },
    { path: SUPPORT_ROUTES.INBOX, label: t('nav.support') || 'Support', icon: Headphones, requireAuth: true, sidebarSection: 'Support' },
    { path: ADMIN_ROUTES.RBAC_SETTINGS, label: t('nav.rbacSettings') || 'RBAC Settings', icon: Shield, requireAuth: true, sidebarSection: 'RbacSettings' },
    { path: ADMIN_ROUTES.RBAC_DEBUG, label: t('nav.rbacDebug', 'RBAC Debug') || 'RBAC Debug', icon: Bug, requireAuth: true, sidebarSection: 'RbacDebug' },
    { path: ADMIN_ROUTES.ESCROW, label: t('nav.escrow', 'Escrow') || 'Escrow', icon: Receipt, requireAuth: true, sidebarSection: 'Escrow' },
    { path: ADMIN_ROUTES.HOST_REACTIVATION, label: t('nav.hostReactivation', 'Host Reactivation') || 'Host Reactivation', icon: RotateCcw, requireAuth: true, sidebarSection: 'HostReactivation' },
    { path: ADMIN_ROUTES.MY_DISPUTES, label: t('nav.myDisputes', 'My Disputes') || 'My Disputes', icon: AlertTriangle, requireAuth: true, sidebarSection: 'MyDisputes' },
    { path: DEMO_ROUTES.ROOT, label: t('nav.demo') || 'Components', icon: Palette, requireAuth: true, sidebarSection: 'Demo' },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (item.requireAuth && !user) return false;
    if (item.roles && !item.roles.includes(role)) return false;
    // Dynamic RBAC: check ui.Sidebar.<section>.Link.View
    const permKey = generateUiPermissionKey('Sidebar', item.sidebarSection, 'Link', 'View');
    if (frontendPermCache.loaded) {
      const permEntry = frontendPermCache.byKey[permKey];
      if (permEntry) {
        return canUI(permKey);
      }
    }
    // Not in DB yet — allow by default
    return true;
  });

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/bookings') return location.pathname === '/bookings';
    return location.pathname.startsWith(path);
  };

  const sidebarNav = (
    <nav className="space-y-1">
      {filteredNavItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setSidebarOpen(false);
            }}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className={cn('h-[18px] w-[18px] shrink-0', active && 'text-primary-foreground')} />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      {!headerProps.hidden && (
        <Header 
          {...headerProps} 
          onMenuToggle={toggleSidebar}
          showMenuButton={!sidebarProps.hidden}
        >
          {headerProps.children || (
            <div className="flex items-center justify-between w-full">
              <h1 className="text-lg sm:text-xl font-heading font-semibold truncate">ByootDZ</h1>
            </div>
          )}
        </Header>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        {isMobile && sidebarOpen && !sidebarProps.hidden && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {!sidebarProps.hidden && (
          <Sidebar 
            {...sidebarProps} 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isMobile={isMobile}
          >
            {sidebarNav}
          </Sidebar>
        )}

        <Content {...contentProps}>
          {children}
        </Content>
      </div>

      {!footerProps.hidden && (
        <Footer {...footerProps}>
          {footerProps.children || (
            <p className="text-xs sm:text-sm text-center text-muted-foreground">© 2024 ByootDZ. All rights reserved.</p>
          )}
        </Footer>
      )}
    </div>
  );
};
