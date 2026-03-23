import React from 'react';
import { LayoutProps } from '@/types/component.types';
import { buildComponentStyles } from '@/utils/styleBuilder';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface SidebarProps extends LayoutProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
  logo?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  children, 
  content, 
  htmlContent, 
  isOpen = true,
  onClose,
  isMobile = false,
  logo,
  footer,
  ...baseProps 
}) => {
  const { style, className } = buildComponentStyles(
    baseProps,
    'bg-sidebar text-sidebar-foreground'
  );

  if (baseProps.hidden) return null;

  const sidebarClasses = cn(
    className,
    'flex flex-col h-full',
    'border-r border-border/50',
    'transition-all duration-300 ease-in-out',
    // Mobile styles
    isMobile && [
      'fixed inset-y-0 left-0 z-50',
      'w-[280px] max-w-[85vw]',
      'shadow-2xl',
      isOpen ? 'translate-x-0' : '-translate-x-full',
    ],
    // Desktop styles
    !isMobile && [
      'relative',
      'w-[260px] lg:w-[280px]',
      'hidden lg:flex',
    ]
  );

  return (
    <aside
      className={sidebarClasses}
      style={style}
    >
      {/* Header / Logo */}
      <div className={cn(
        'flex items-center gap-3 px-5 border-b border-border/40',
        isMobile ? 'justify-between h-14' : 'h-14'
      )}>
        {logo || (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
            </div>
            <span className="font-heading font-bold text-base tracking-tight text-foreground">
              ByootDZ
            </span>
          </div>
        )}
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation Content */}
      <ScrollArea className="flex-1">
        <div className="px-3 py-4">
          {htmlContent ? (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          ) : content ? (
            <div>{content}</div>
          ) : (
            children
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {footer && (
        <div className="px-4 py-3 border-t border-border/40">
          {footer}
        </div>
      )}
    </aside>
  );
};
