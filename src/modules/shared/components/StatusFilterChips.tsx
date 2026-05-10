import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { AppRole } from '@/modules/auth/auth.types';
import { cn } from '@/lib/utils';

export type ResourceStatus = 'all' | 'published' | 'draft' | 'paused' | 'suspended' | 'archived';

interface StatusFilterChipsProps {
  value: ResourceStatus | undefined;
  onChange: (next: ResourceStatus | undefined) => void;
  className?: string;
}

const PRIVILEGED_ROLES: AppRole[] = ['hyper_admin', 'hyper_manager', 'admin', 'manager'];

const CHIPS: { value: ResourceStatus; label: string; cls: string }[] = [
  { value: 'all',       label: 'Tous',        cls: 'bg-muted text-foreground border-border' },
  { value: 'published', label: 'Publié',      cls: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-300' },
  { value: 'draft',     label: 'Brouillon',   cls: 'bg-muted text-muted-foreground border-border' },
  { value: 'paused',    label: 'En pause',    cls: 'bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-300' },
  { value: 'suspended', label: 'Suspendu',    cls: 'bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-300' },
  { value: 'archived',  label: 'Archivé',     cls: 'bg-destructive/15 text-destructive border-destructive/30' },
];

/**
 * Color-coded status filter chips. Renders only for privileged roles
 * (hyper_admin / hyper_manager / admin / manager). Passing `'all'`
 * (or undefined) clears the filter.
 */
export const StatusFilterChips: React.FC<StatusFilterChipsProps> = ({ value, onChange, className }) => {
  const { user } = useAuth();
  const role = user?.role as AppRole | undefined;
  if (!role || !PRIVILEGED_ROLES.includes(role)) return null;

  const current = value ?? 'all';

  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="group" aria-label="Filtre par statut">
      {CHIPS.map(chip => {
        const active = chip.value === current;
        return (
          <button
            key={chip.value}
            type="button"
            onClick={() => onChange(chip.value === 'all' ? undefined : chip.value)}
            className={cn(
              'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all',
              chip.cls,
              active
                ? 'ring-2 ring-primary ring-offset-1 ring-offset-background'
                : 'opacity-70 hover:opacity-100',
            )}
            aria-pressed={active}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
};
