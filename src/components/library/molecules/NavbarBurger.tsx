// -----------------------------------------------------------------------------
// NavbarBurger Molecule Component
// Migrated from old_app/src/components/molecules/navigation/NavbarBurger.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

export interface NavbarBurgerProps {
  isChecked?: boolean;
  toggleClass?: () => void;
  isOnLanding?: boolean;
  isOnOnboarding?: boolean;
  disableOverlay?: boolean;
  className?: string;
}

const NavbarBurger: React.FC<NavbarBurgerProps> = ({
  toggleClass,
  isChecked = false,
  isOnLanding = false,
  isOnOnboarding = false,
  disableOverlay = false,
  className = ''
}) => {
  return (
    <>
      {/* Hidden checkbox for state management */}
      <input 
        type="checkbox" 
        id="navToggler" 
        className="sr-only peer" 
        checked={isChecked}
        onChange={() => {}}
        aria-hidden="true"
      />
      
      {/* Burger/Close button */}
      <label
        className={cn(
          'z-50 cursor-pointer p-2 rounded-md transition-all duration-200',
          'hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-ring',
          'md:hidden', // Only show on mobile
          isOnLanding && 'absolute right-4 top-4',
          isOnOnboarding && 'fixed right-4 top-4',
          className
        )}
        onClick={toggleClass}
        htmlFor="navToggler"
        aria-label={isChecked ? 'Close menu' : 'Open menu'}
      >
        {isChecked ? (
          <X className="h-6 w-6 text-foreground" />
        ) : (
          <Menu className="h-6 w-6 text-foreground" />
        )}
      </label>

      {/* Overlay */}
      {!disableOverlay && isChecked && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleClass}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export { NavbarBurger };
export default NavbarBurger;
