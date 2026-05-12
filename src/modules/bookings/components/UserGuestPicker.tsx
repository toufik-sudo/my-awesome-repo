import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Loader2, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { rolesApi } from '@/modules/admin/admin.api';
import type { UserWithRoles } from '@/modules/admin/admin.types';

export interface GuestPickerValue {
  id: number;
  label: string;
  email?: string;
}

interface UserGuestPickerProps {
  value: GuestPickerValue | null;
  onChange: (value: GuestPickerValue | null) => void;
  disabled?: boolean;
}

/**
 * Autocomplete picker that lets an admin/manager pick a target user with
 * role guest/user to create a booking on behalf of.
 */
export const UserGuestPicker: React.FC<UserGuestPickerProps> = ({ value, onChange, disabled }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(value?.label ?? '');
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!open) return;
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const guestsRes = await rolesApi
          .getAllUsersPaginated({ page: 1, pageSize: 8, search: query || undefined, role: 'guest' as any })
          .catch(() => null);
        const usersRes = await rolesApi
          .getAllUsersPaginated({ page: 1, pageSize: 8, search: query || undefined, role: 'user' as any })
          .catch(() => null);
        if (cancelled) return;
        const merged: UserWithRoles[] = [];
        const seen = new Set<number>();
        [...(guestsRes?.data || []), ...(usersRes?.data || [])].forEach((u: any) => {
          if (!seen.has(u.id)) { seen.add(u.id); merged.push(u); }
        });
        setUsers(merged);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(handle); };
  }, [query, open]);

  const formatLabel = (u: any): string => {
    const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim();
    return name || u.email || `#${u.id}`;
  };

  const suggestions = useMemo(() => users, [users]);

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            disabled={disabled}
            value={query}
            onChange={(e) => { setQuery(e.target.value); onChange(null); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder={t('bookings.adminCreate.guestPlaceholder', 'Search a guest by name or email…')}
            className="pl-9"
          />
          {loading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        className="w-[--radix-popover-trigger-width] p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandList>
            {!loading && suggestions.length === 0 && (
              <CommandEmpty>{t('bookings.adminCreate.noUsers', 'No matching guest')}</CommandEmpty>
            )}
            <CommandGroup>
              {suggestions.map((u) => {
                const label = formatLabel(u);
                return (
                  <CommandItem
                    key={u.id}
                    value={`${label}-${u.id}`}
                    onSelect={() => {
                      const v: GuestPickerValue = { id: Number(u.id), label, email: (u as any).email };
                      onChange(v);
                      setQuery(label);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm truncate">{label}</span>
                      {(u as any).email && <span className="text-[11px] text-muted-foreground truncate">{(u as any).email}</span>}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
