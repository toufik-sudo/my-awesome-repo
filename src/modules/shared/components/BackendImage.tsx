import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageOff } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8095';

/**
 * Resolves an image path: if it starts with `/media/`, prepend the backend URL.
 * Otherwise return as-is (external URLs like unsplash).
 */
export const resolveImageUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/media/')) return `${BACKEND_URL}${path}`;
  return path;
};

interface BackendImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackClassName?: string;
  skeletonClassName?: string;
}

/**
 * Image component that handles async loading from backend paths.
 * Shows a skeleton while loading and an error state on failure.
 */
export const BackendImage: React.FC<BackendImageProps> = ({
  src,
  alt,
  className,
  fallbackClassName,
  skeletonClassName,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const resolvedSrc = resolveImageUrl(src);

  if (hasError) {
    return (
      <div className={cn('flex items-center justify-center bg-muted', fallbackClassName || className)}>
        <ImageOff className="h-8 w-8 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <Skeleton className={cn('absolute inset-0', skeletonClassName || className)} />
      )}
      <img
        src={resolvedSrc}
        alt={alt}
        className={cn(isLoading && 'opacity-0 absolute', className)}
        onLoad={() => setIsLoading(false)}
        onError={() => { setIsLoading(false); setHasError(true); }}
        loading="lazy"
        {...props}
      />
    </>
  );
};

export default BackendImage;
