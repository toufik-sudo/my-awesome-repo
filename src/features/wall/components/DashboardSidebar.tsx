// -----------------------------------------------------------------------------
// Dashboard Sidebar Component
// Modern sidebar using shadcn/ui Sidebar component
// -----------------------------------------------------------------------------

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { LogOut, FileText } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavItems } from '../hooks/useNavItems';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { NavItem } from '../types';

interface DashboardSidebarProps {
  className?: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ className }) => {
  const { formatMessage } = useIntl();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { wall, widgets } = useNavItems();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const isActive = (url: string) => {
    return location.pathname === url || location.pathname.startsWith(url + '/');
  };

  const renderNavItem = (item: NavItem, index: number) => {
    const Icon = item.icon;
    const title = formatMessage({ 
      id: `nav.${item.title}`, 
      defaultMessage: item.title.charAt(0).toUpperCase() + item.title.slice(1) 
    });

    if (item.external) {
      return (
        <SidebarMenuItem key={`${item.title}-${index}`}>
          <SidebarMenuButton asChild>
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:bg-muted/50"
            >
              {Icon && <Icon className="h-5 w-5" />}
              {!collapsed && <span>{title}</span>}
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={`${item.title}-${index}`}>
        <SidebarMenuButton 
          asChild 
          isActive={isActive(item.url)}
          disabled={item.isDisabled}
        >
          <NavLink 
            to={item.url} 
            className={`flex items-center gap-3 ${item.isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/50'}`}
            activeClassName="bg-primary/10 text-primary font-medium"
          >
            {Icon && <Icon className="h-5 w-5" />}
            {!collapsed && <span>{title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className={className}>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          {!collapsed && (
            <span className="font-bold text-lg text-primary">RewardzAI</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && formatMessage({ id: 'nav.main', defaultMessage: 'Main' })}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {wall.map((item, index) => renderNavItem(item, index))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Widgets Navigation (secondary) */}
        {widgets.length > 0 && (
          <SidebarGroup>
            <Separator className="my-2" />
            <SidebarGroupLabel>
              {!collapsed && formatMessage({ id: 'nav.widgets', defaultMessage: 'Quick Access' })}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {widgets.map((item, index) => renderNavItem(item, index))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Separator className="mb-4" />
        {/* Legal Link */}
        {!collapsed && (
          <a 
            href="https://cr-prod-tc-eu.s3.eu-central-1.amazonaws.com/mentions_legales.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3"
          >
            <FileText className="h-4 w-4" />
            {formatMessage({ id: 'nav.legal', defaultMessage: 'Legal' })}
          </a>
        )}
        
        {/* Logout Button */}
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && formatMessage({ id: 'nav.logout', defaultMessage: 'Logout' })}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
