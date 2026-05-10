/**
 * Returns a Tailwind class string adding a colored left/full border to a
 * resource card based on its lifecycle status. `published` returns empty
 * (no special border). Used by PropertyCard / ServiceCard etc.
 */
export const getStatusBorderClass = (status?: string | null): string => {
  if (!status || status === 'published') return '';
  switch (status) {
    case 'draft':
      return 'border-2 border-muted-foreground/40';
    case 'paused':
    case 'suspended':
      return 'border-2 border-amber-500/60';
    case 'archived':
      return 'border-2 border-destructive/60';
    default:
      return 'border-2 border-border';
  }
};

export const STATUS_BORDER_TITLE: Record<string, string> = {
  draft: 'Brouillon',
  paused: 'En pause',
  suspended: 'Suspendu',
  archived: 'Archivé',
};
