// -----------------------------------------------------------------------------
// Button Atom Component
// Migrated from old_app/src/components/atoms/ui/Button.tsx
// -----------------------------------------------------------------------------

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full border border-transparent cursor-pointer min-h-[3rem] leading-inherit text-base transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-secondary text-white hover:shadow-md',
        primaryInverted: 'bg-white text-secondary border-secondary hover:shadow-md',
        secondary: 'bg-primary text-white hover:shadow-md',
        secondaryInverted: 'bg-white text-muted-foreground border-muted-foreground',
        third: 'bg-accent text-white hover:shadow-md',
        thirdInverted: 'bg-white text-primary border-primary',
        danger: 'bg-destructive text-destructive-foreground hover:shadow-md',
        alt: 'bg-primary text-white hover:shadow-md',
        textOnly: 'bg-transparent text-primary',
        textOnlyInverted: 'bg-transparent text-white border-none',
        withIcon: 'bg-transparent text-primary flex-col p-1 text-sm',
        withIconDisabled: 'bg-transparent text-muted-foreground p-1',
        disabled: 'bg-muted text-muted-foreground border-muted cursor-not-allowed pointer-events-none',
      },
      size: {
        default: 'px-10 py-1',
        sm: 'px-6 py-1 text-sm',
        lg: 'px-12 py-2 text-lg',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export default Button;
