import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-scroll';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LOGIN, CREATE_ACCOUNT, LANDING_NAV_ELEMENTS } from '@/constants/routes';
import { cn } from '@/lib/utils';

/**
 * Navigation bar for landing page
 */
const Navbar: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'services', labelId: 'nav.services' },
    { id: 'features', labelId: 'nav.features' },
    { id: 'pricing', labelId: 'nav.pricing' },
    { id: 'contact', labelId: 'nav.contact' },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur-sm shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="landing" 
            spy 
            smooth
            className="text-xl font-bold text-primary cursor-pointer"
          >
            RewardzAi
          </Link>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.id}
                spy
                smooth
                offset={-64}
                className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                activeClass="text-primary"
              >
                {intl.formatMessage({ id: item.labelId })}
              </Link>
            ))}
          </div>
          
          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(LOGIN)}
            >
              {intl.formatMessage({ id: 'nav.login' })}
            </Button>
            <Button onClick={() => navigate(CREATE_ACCOUNT)}>
              {intl.formatMessage({ id: 'nav.signUp' })}
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.id}
                spy
                smooth
                offset={-64}
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {intl.formatMessage({ id: item.labelId })}
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  navigate(LOGIN);
                  setIsMobileMenuOpen(false);
                }}
              >
                {intl.formatMessage({ id: 'nav.login' })}
              </Button>
              <Button 
                className="w-full"
                onClick={() => {
                  navigate(CREATE_ACCOUNT);
                  setIsMobileMenuOpen(false);
                }}
              >
                {intl.formatMessage({ id: 'nav.signUp' })}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
