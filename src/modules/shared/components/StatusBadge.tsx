import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type ResourceStatus =
  | 'draft'
  | 'published'
  | 'archived'
  | 'suspended'
  | 'paused'
  | string;

interface StatusBadgeProps {
  status: ResourceStatus | undefined | null;
  hostCascade?: boolean;
  className?: string;
}

/**
 * Color-coded pill for property/service status. Visible mainly to
 * privileged roles (hyper_admin, hyper_manager, admin, manager) on
 * listing/detail screens. Uses semantic Tailwind tokens; the few
 * status-specific accents are kept inline because they don't exist
 * in the theme palette yet.
 */
const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  published:  { label: 'Publié',     cls: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-300' },
  draft:      { label: 'Brouillon',  cls: 'bg-muted text-muted-foreground border-border' },
  suspended:  { label: 'En pause',   cls: 'bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-300' },
  paused:     { label: 'En pause',   cls: 'bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-300' },
  archived:   { label: 'Archivé',    cls: 'bg-destructive/15 text-destructive border-destructive/30' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, hostCascade, className }) => {
  if (!status) return null;
  const config = STATUS_STYLES[status] || { label: status, cls: 'bg-muted text-muted-foreground border-border' };
  return (
    <Badge
      variant="outline"
      className={cn('font-medium border', config.cls, className)}
      title={hostCascade ? 'Statut hérité de l\'hôte (en pause/archivé)' : undefined}
    >
      {config.label}
      {hostCascade && <span className="ml-1 opacity-70">· hôte</span>}
    </Badge>
  );
};
