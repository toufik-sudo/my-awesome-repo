// -----------------------------------------------------------------------------
// IconButton Atom Component
// Consolidated from ButtonClose, ButtonDelete, ButtonBack, ButtonWithIcon
// -----------------------------------------------------------------------------

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  X,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Send,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Minus,
  Edit,
  Check,
  LucideIcon,
} from 'lucide-react';

const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-transparent hover:bg-muted text-foreground',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        close: 'bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground',
      },
      size: {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Map of icon names to components for easy lookup
const iconMap: Record<string, LucideIcon> = {
  close: X,
  delete: Trash2,
  trash: Trash2,
  back: ArrowLeft,
  arrowLeft: ArrowLeft,
  forward: ArrowRight,
  arrowRight: ArrowRight,
  send: Send,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  download: Download,
  plus: Plus,
  add: Plus,
  minus: Minus,
  edit: Edit,
  check: Check,
};

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: keyof typeof iconMap | LucideIcon;
  label?: string;
  iconClassName?: string;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, icon, label, iconClassName, ...props }, ref) => {
    // Determine the icon component
    const IconComponent = typeof icon === 'string' ? iconMap[icon] : icon;

    if (!IconComponent) {
      console.warn(`Icon "${icon}" not found in iconMap`);
      return null;
    }

    const iconSize = size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

    return (
      <button
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        aria-label={label || (typeof icon === 'string' ? icon : 'icon button')}
        {...props}
      >
        <IconComponent className={cn('shrink-0', iconClassName)} size={iconSize} />
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

// Convenience components for common use cases
export const CloseButton = forwardRef<HTMLButtonElement, Omit<IconButtonProps, 'icon'>>(
  (props, ref) => <IconButton ref={ref} icon="close" variant="close" {...props} />
);
CloseButton.displayName = 'CloseButton';

export const DeleteButton = forwardRef<HTMLButtonElement, Omit<IconButtonProps, 'icon'>>(
  (props, ref) => <IconButton ref={ref} icon="delete" variant="destructive" {...props} />
);
DeleteButton.displayName = 'DeleteButton';

export const BackButton = forwardRef<HTMLButtonElement, Omit<IconButtonProps, 'icon'>>(
  (props, ref) => <IconButton ref={ref} icon="back" variant="ghost" {...props} />
);
BackButton.displayName = 'BackButton';

export { IconButton, iconButtonVariants };
export default IconButton;
