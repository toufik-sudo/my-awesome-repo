// -----------------------------------------------------------------------------
// Loading Component
// Migrated from old_app/src/components/atoms/ui/Loading.tsx
// Using Lucide icons instead of FontAwesome
// -----------------------------------------------------------------------------

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LOADER_TYPE } from '@/constants/general';

interface LoadingProps {
  type?: keyof typeof LOADER_TYPE | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10'
};

const typeClasses: Record<string, string> = {
  [LOADER_TYPE.FULL]: 'fixed inset-0 flex items-center justify-center bg-background/80 z-50',
  [LOADER_TYPE.FULL_PAGE]: 'fixed inset-0 flex items-center justify-center bg-background z-50',
  [LOADER_TYPE.PAGE]: 'flex items-center justify-center min-h-[200px]',
  [LOADER_TYPE.INTERMEDIARY]: 'flex items-center justify-center py-8',
  [LOADER_TYPE.LOCAL]: 'flex items-center justify-center',
  [LOADER_TYPE.DROPZONE]: 'flex items-center justify-center p-4',
  [LOADER_TYPE.COMMUNICATION]: 'flex items-center justify-center py-4',
  [LOADER_TYPE.CATEGORY]: 'flex items-center justify-center py-2',
  [LOADER_TYPE.PAYMENT]: 'flex items-center justify-center py-8'
};

/**
 * Loading spinner component
 */
const Loading: React.FC<LoadingProps> = ({ 
  type = 'local', 
  className = '',
  size = 'md'
}) => (
  <div className={cn(typeClasses[type] || typeClasses.local, className)}>
    <Loader2 className={cn(sizeClasses[size], 'animate-spin text-primary')} />
  </div>
);

export default Loading;
