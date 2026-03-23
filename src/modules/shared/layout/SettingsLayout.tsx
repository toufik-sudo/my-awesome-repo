import React, { memo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ErrorBoundary } from '@/modules/shared/components/ErrorBoundary';
import { ChevronLeft } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SettingsSection {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  description?: string;
  content: React.ReactNode;
  disabled?: boolean;
  hidden?: boolean;
}

export interface SettingsGroup {
  label: string;
  sections: SettingsSection[];
}

export interface SettingsLayoutProps {
  /** Page title */
  title?: string;
  /** Description */
  description?: string;
  /** Sections (flat) */
  sections?: SettingsSection[];
  /** Grouped sections */
  groups?: SettingsGroup[];
  /** Default active section id */
  defaultSection?: string;
  /** Controlled active section */
  activeSection?: string;
  /** Back button handler */
  onBack?: () => void;
  /** Section change callback */
  onSectionChange?: (sectionId: string) => void;
  /** Sidebar variant */
  variant?: 'sidebar' | 'tabs' | 'stacked';
  /** Header actions */
  headerActions?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const SettingsLayout: React.FC<SettingsLayoutProps> = memo(({
  title,
  description,
  sections = [],
  groups = [],
  defaultSection,
  activeSection: controlledSection,
  onBack,
  onSectionChange,
  variant = 'sidebar',
  headerActions,
  footer,
  className,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  // Flatten groups into sections if provided
  const allSections = groups.length > 0
    ? groups.flatMap(g => g.sections)
    : sections;
  const visibleSections = allSections.filter(s => !s.hidden);

  const [internalSection, setInternalSection] = useState(
    defaultSection || visibleSections[0]?.id || ''
  );
  const activeSectionId = controlledSection ?? internalSection;

  const [showMobileContent, setShowMobileContent] = useState(false);

  const handleSectionChange = useCallback((id: string) => {
    setInternalSection(id);
    onSectionChange?.(id);
    if (isMobile) setShowMobileContent(true);
  }, [onSectionChange, isMobile]);

  const handleMobileBack = useCallback(() => {
    setShowMobileContent(false);
  }, []);

  const activeContent = visibleSections.find(s => s.id === activeSectionId);

  // ─── Stacked Variant ────────────────────────────────────
  if (variant === 'stacked') {
    return (
      <div className={cn('space-y-6', className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 gap-1">
                <ChevronLeft className="h-4 w-4" /> {t('common.back')}
              </Button>
            )}
            {title && <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>}
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>
          {headerActions}
        </div>

        {/* Stacked sections */}
        {(groups.length > 0 ? groups : [{ label: '', sections: visibleSections }]).map((group, gi) => (
          <div key={gi} className="space-y-4">
            {group.label && (
              <div>
                <h2 className="text-lg font-semibold">{group.label}</h2>
                <Separator className="mt-2" />
              </div>
            )}
            {group.sections.filter(s => !s.hidden).map(section => (
              <ErrorBoundary key={section.id}>
                <div id={section.id}>{section.content}</div>
              </ErrorBoundary>
            ))}
          </div>
        ))}
        {footer}
      </div>
    );
  }

  // ─── Sidebar Navigation ─────────────────────────────────
  const renderNav = () => (
    <nav className="space-y-1">
      {(groups.length > 0 ? groups : [{ label: '', sections: visibleSections }]).map((group, gi) => (
        <div key={gi}>
          {group.label && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 mt-3 first:mt-0">
              {group.label}
            </p>
          )}
          {group.sections.filter(s => !s.hidden).map(section => (
            <button
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              disabled={section.disabled}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left',
                activeSectionId === section.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                section.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {section.icon && <span className="shrink-0">{section.icon}</span>}
              <span className="flex-1 truncate">{section.label}</span>
              {section.badge != null && (
                <Badge variant="secondary" className="text-xs">{section.badge}</Badge>
              )}
            </button>
          ))}
        </div>
      ))}
    </nav>
  );

  // Mobile: list → detail pattern
  if (isMobile) {
    if (showMobileContent && activeContent) {
      return (
        <div className={cn('min-h-full', className)}>
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="icon" onClick={handleMobileBack}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="font-semibold">{activeContent.label}</h2>
              {activeContent.description && (
                <p className="text-xs text-muted-foreground">{activeContent.description}</p>
              )}
            </div>
          </div>
          <ErrorBoundary>{activeContent.content}</ErrorBoundary>
        </div>
      );
    }

    return (
      <div className={cn('min-h-full', className)}>
        <div className="flex items-center justify-between mb-4">
          <div>
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 gap-1">
                <ChevronLeft className="h-4 w-4" /> {t('common.back')}
              </Button>
            )}
            {title && <h1 className="text-2xl font-bold">{title}</h1>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {headerActions}
        </div>
        {renderNav()}
      </div>
    );
  }

  // Desktop sidebar layout
  return (
    <div className={cn('min-h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 gap-1">
              <ChevronLeft className="h-4 w-4" /> {t('common.back')}
            </Button>
          )}
          {title && <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>}
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        {headerActions}
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <ScrollArea className="w-56 shrink-0">
          {renderNav()}
        </ScrollArea>

        <Separator orientation="vertical" className="h-auto" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeContent ? (
            <ErrorBoundary>
              <div>
                <h2 className="text-xl font-semibold mb-1">{activeContent.label}</h2>
                {activeContent.description && (
                  <p className="text-sm text-muted-foreground mb-6">{activeContent.description}</p>
                )}
                {activeContent.content}
              </div>
            </ErrorBoundary>
          ) : (
            <p className="text-muted-foreground">{t('tabs.noContent')}</p>
          )}
        </div>
      </div>

      {footer && <div className="mt-8">{footer}</div>}
    </div>
  );
});

SettingsLayout.displayName = 'SettingsLayout';
