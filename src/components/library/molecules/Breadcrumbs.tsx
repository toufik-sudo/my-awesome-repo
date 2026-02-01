// -----------------------------------------------------------------------------
// Breadcrumbs Molecule Component
// Navigation breadcrumb trail
// -----------------------------------------------------------------------------

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  homeHref?: string;
  separator?: React.ReactNode;
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showHome = true,
  homeHref = '/',
  separator = <ChevronRight className="h-4 w-4" />,
  className,
}) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center gap-2 text-sm">
        {showHome && (
          <>
            <li>
              <Link
                to={homeHref}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Home className="h-4 w-4" />
              </Link>
            </li>
            {items.length > 0 && (
              <li className="text-muted-foreground">{separator}</li>
            )}
          </>
        )}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              <li>
                {item.href && !isLast ? (
                  <Link
                    to={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      isLast ? 'font-medium text-foreground' : 'text-muted-foreground'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && <li className="text-muted-foreground">{separator}</li>}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

// Auto-generate breadcrumbs from current path
interface AutoBreadcrumbsProps {
  pathLabels?: Record<string, string>;
  className?: string;
}

export const AutoBreadcrumbs: React.FC<AutoBreadcrumbsProps> = ({
  pathLabels = {},
  className,
}) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const items: BreadcrumbItem[] = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

    return {
      label,
      href: index < pathSegments.length - 1 ? href : undefined,
    };
  });

  return <Breadcrumbs items={items} className={className} />;
};

export { Breadcrumbs };
export default Breadcrumbs;
