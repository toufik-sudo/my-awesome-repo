// -----------------------------------------------------------------------------
// Loading Atom Component
// Migrated from old_app/src/components/atoms/ui/Loading.tsx
// Enhanced version with Tailwind styling
// -----------------------------------------------------------------------------

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const loadingVariants = cva('flex items-center justify-center', {
  variants: {
    type: {
      local: 'p-4',
      global: 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50',
      inline: 'inline-flex',
      page: 'min-h-[200px]',
      fullScreen: 'min-h-screen',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
  },
  defaultVariants: {
    type: 'local',
    size: 'md',
  },
});

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

export interface LoadingProps extends VariantProps<typeof loadingVariants> {
  className?: string;
  iconClassName?: string;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  type = 'local', 
  size = 'md', 
  className = '',
  iconClassName = '',
  text
}) => (
  <div className={cn(loadingVariants({ type, size }), className)}>
    <div className="flex flex-col items-center gap-2">
      <Loader2 className={cn('animate-spin text-primary', iconSizes[size || 'md'], iconClassName)} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  </div>
);

export { Loading, loadingVariants };
export default Loading;
