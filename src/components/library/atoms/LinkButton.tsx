// -----------------------------------------------------------------------------
// LinkButton Atom Component
// Consolidated from LinkBack, LinkDownload, IconExternalLink
// -----------------------------------------------------------------------------

import React, { forwardRef, AnchorHTMLAttributes } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  ArrowLeft,
  Download,
  ExternalLink,
  LucideIcon,
} from 'lucide-react';

const linkButtonVariants = cva(
  'inline-flex items-center gap-2 transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'text-foreground hover:text-primary',
        primary: 'text-primary hover:text-primary/80',
        muted: 'text-muted-foreground hover:text-foreground',
        underline: 'text-primary underline-offset-4 hover:underline',
        button: 'bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90',
      },
      size: {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Icon map
const iconMap: Record<string, LucideIcon> = {
  back: ArrowLeft,
  download: Download,
  external: ExternalLink,
};

interface BaseLinkButtonProps extends VariantProps<typeof linkButtonVariants> {
  icon?: keyof typeof iconMap | LucideIcon;
  iconPosition?: 'left' | 'right';
  iconClassName?: string;
}

// Internal link (React Router)
export interface InternalLinkButtonProps extends BaseLinkButtonProps, Omit<LinkProps, 'className'> {
  className?: string;
}

// External link
export interface ExternalLinkButtonProps
  extends BaseLinkButtonProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> {
  href: string;
  className?: string;
  external?: boolean;
}

const renderIcon = (
  icon: keyof typeof iconMap | LucideIcon | undefined,
  className?: string
) => {
  if (!icon) return null;
  const IconComponent = typeof icon === 'string' ? iconMap[icon] : icon;
  if (!IconComponent) return null;
  return <IconComponent className={cn('h-4 w-4', className)} />;
};

export const LinkButton = forwardRef<HTMLAnchorElement, InternalLinkButtonProps>(
  (
    { className, variant, size, icon, iconPosition = 'left', iconClassName, children, ...props },
    ref
  ) => {
    return (
      <Link
        ref={ref}
        className={cn(linkButtonVariants({ variant, size, className }))}
        {...props}
      >
        {iconPosition === 'left' && renderIcon(icon, iconClassName)}
        {children}
        {iconPosition === 'right' && renderIcon(icon, iconClassName)}
      </Link>
    );
  }
);
LinkButton.displayName = 'LinkButton';

export const ExternalLinkButton = forwardRef<HTMLAnchorElement, ExternalLinkButtonProps>(
  (
    {
      className,
      variant,
      size,
      icon = 'external',
      iconPosition = 'right',
      iconClassName,
      children,
      external = true,
      ...props
    },
    ref
  ) => {
    return (
      <a
        ref={ref}
        className={cn(linkButtonVariants({ variant, size, className }))}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {iconPosition === 'left' && renderIcon(icon, iconClassName)}
        {children}
        {iconPosition === 'right' && renderIcon(icon, iconClassName)}
      </a>
    );
  }
);
ExternalLinkButton.displayName = 'ExternalLinkButton';

// Convenience components
export const BackLink = forwardRef<HTMLAnchorElement, Omit<InternalLinkButtonProps, 'icon'>>(
  (props, ref) => <LinkButton ref={ref} icon="back" variant="muted" {...props} />
);
BackLink.displayName = 'BackLink';

export const DownloadLink = forwardRef<HTMLAnchorElement, Omit<ExternalLinkButtonProps, 'icon'>>(
  (props, ref) => (
    <ExternalLinkButton ref={ref} icon="download" iconPosition="left" {...props} />
  )
);
DownloadLink.displayName = 'DownloadLink';

export { linkButtonVariants };
export default LinkButton;
