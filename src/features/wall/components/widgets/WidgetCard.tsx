// -----------------------------------------------------------------------------
// WidgetCard Component
// Reusable widget card wrapper with unified styling
// -----------------------------------------------------------------------------

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface WidgetCardProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  accentColor?: 'primary' | 'secondary' | 'accent' | 'muted';
  hideOnMobile?: boolean;
  onClick?: () => void;
}

const accentColorClasses = {
  primary: 'before:bg-gradient-to-r before:from-primary before:to-primary/70',
  secondary: 'before:bg-gradient-to-r before:from-secondary before:to-secondary/70',
  accent: 'before:bg-gradient-to-r before:from-accent before:to-accent/70',
  muted: 'before:bg-gradient-to-r before:from-muted-foreground before:to-muted-foreground/70',
};

const WidgetCard: React.FC<WidgetCardProps> = ({
  children,
  title,
  className,
  headerClassName,
  contentClassName,
  accentColor = 'primary',
  hideOnMobile = false,
  onClick,
}) => {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-0.5',
        'before:absolute before:top-0 before:left-0 before:right-0 before:h-1',
        accentColorClasses[accentColor],
        hideOnMobile && 'hidden lg:block',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {title && (
        <CardHeader className={cn('pb-2', headerClassName)}>
          {typeof title === 'string' ? (
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </CardTitle>
          ) : (
            title
          )}
        </CardHeader>
      )}
      <CardContent className={cn('pt-0', !title && 'pt-6', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};

export { WidgetCard };
export default WidgetCard;
