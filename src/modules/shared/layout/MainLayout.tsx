import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { Content } from './Content';
import { LayoutProps } from '@/types/component.types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Home,
  Building2,
  CalendarCheck,
  Settings,
  Shield,
  ClipboardCheck,
  Palette,
  History,
  MessageSquare,
  PlusCircle,
  Headphones,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const { user } = useAuth();

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, [isMobile]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems: NavItem[] = [
    { path: '/', label: t('nav.home') || 'Home', icon: Home },
    { path: '/dashboard', label: t('nav.dashboard') || 'Dashboard', icon: LayoutDashboard, requireAuth: true },
    { path: '/properties', label: t('nav.properties') || 'Properties', icon: Building2 },
    { path: '/properties/new', label: t('nav.addProperty') || 'Add Property', icon: PlusCircle, requireAuth: true, roles: ['admin', 'manager', 'hyper_manager', 'hyper_admin'] },
    { path: '/bookings', label: t('nav.bookings') || 'Bookings', icon: CalendarCheck, requireAuth: true },
    { path: '/bookings/host', label: t('nav.bookingRequests') || 'Requests', icon: MessageSquare, requireAuth: true, roles: ['admin', 'manager', 'hyper_manager'] },
    { path: '/bookings/history', label: t('nav.bookingHistory') || 'History', icon: History, requireAuth: true, roles: ['admin', 'manager', 'hyper_manager', 'hyper_admin'] },
    { path: '/settings', label: t('nav.settings') || 'Settings', icon: Settings, requireAuth: true },
    { path: '/support', label: t('nav.support') || 'Support', icon: Headphones, requireAuth: true },
    { path: '/admin', label: t('nav.admin') || 'Admin', icon: Shield, requireAuth: true, roles: ['admin', 'hyper_manager'] },
    { path: '/admin/verification-review', label: t('nav.verificationReview') || 'Verification', icon: ClipboardCheck, requireAuth: true, roles: ['admin', 'hyper_manager'] },
    { path: '/demo', label: t('nav.demo') || 'Components', icon: Palette, requireAuth: true },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (item.requireAuth && !user) return false;
    if (item.roles && item.roles.length > 0) {
      const userRoles = user?.roles || [];
      if (!item.roles.some((r) => userRoles.includes(r))) return false;
    }
    return true;
  });

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
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
