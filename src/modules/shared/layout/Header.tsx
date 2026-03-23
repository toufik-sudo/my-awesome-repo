import React from 'react';
import { LayoutProps } from '@/types/component.types';
import { buildComponentStyles } from '@/utils/styleBuilder';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { NotificationCenter } from '@/components/NotificationCenter';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { ThemeCustomizer } from '@/components/ThemeCustomizer';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { clearJWT } from '@/utils/jwt';

interface HeaderProps extends LayoutProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  children, 
  content, 
  htmlContent, 
  onMenuToggle,
  showMenuButton = false,
  ...baseProps 
}) => {
  const { style, className } = buildComponentStyles(
    baseProps,
    'bg-layout-header-bg text-layout-header-fg border-b transition-base sticky top-0 z-30'
  );
  const { isAuthenticated, logout, user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      clearJWT();
      toast.success(t('auth.logoutSuccess'));
      navigate('/login');
    } catch (error) {
      // Even if the API call fails, clear local state and redirect
      // clearJWT();
      toast.error(t('auth.logoutError'));
      // navigate('/login');
    }
  };

  if (baseProps.hidden) return null;

  return (
    <header
      className={className}
      style={{ ...style, minHeight: '56px' }}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 h-full flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile menu button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {showMenuButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden shrink-0"
              onClick={onMenuToggle}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex-1 min-w-0">
            {htmlContent ? (
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            ) : content ? (
              <div>{content}</div>
            ) : (
              children
            )}
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {isAuthenticated ? (
            <>
              <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline truncate max-w-[150px] lg:max-w-none">
                {user?.email}
              </span>
              <NotificationCenter />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-xs sm:text-sm px-2 sm:px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{t('auth.logout')}</span>
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/login')}
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              {t('auth.login')}
            </Button>
          )}
          <ThemeCustomizer />
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};
