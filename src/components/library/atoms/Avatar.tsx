// -----------------------------------------------------------------------------
// Avatar Atom Component
// Extended avatar with user initials fallback
// -----------------------------------------------------------------------------

import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { User } from 'lucide-react';

const avatarVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        default: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
        '2xl': 'h-24 w-24 text-2xl',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  showFallbackIcon?: boolean;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      size,
      src,
      alt = '',
      fallback,
      showFallbackIcon = true,
      ...props
    },
    ref
  ) => {
    const [hasError, setHasError] = React.useState(false);

    const showImage = src && !hasError;
    const initials = fallback ? getInitials(fallback) : null;

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, className }))}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || fallback || 'Avatar'}
            className="h-full w-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : initials ? (
          <span className="font-medium text-muted-foreground">{initials}</span>
        ) : showFallbackIcon ? (
          <User className="h-1/2 w-1/2 text-muted-foreground" />
        ) : null}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// Avatar group for stacked avatars
interface AvatarGroupProps {
  avatars: Array<{ src?: string; name?: string }>;
  max?: number;
  size?: VariantProps<typeof avatarVariants>['size'];
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 4,
  size = 'default',
  className,
}) => {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          fallback={avatar.name}
          size={size}
          className="border-2 border-background"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            avatarVariants({ size }),
            'border-2 border-background bg-muted font-medium text-muted-foreground'
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export { Avatar, avatarVariants };
export default Avatar;
