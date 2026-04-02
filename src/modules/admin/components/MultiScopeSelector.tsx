import React, { memo, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, X, ChevronDown } from 'lucide-react';
import { useScopeEntities, type ScopeEntity } from '@/modules/admin/hooks/useScopeEntities';

interface MultiScopeSelectorProps {
  scope: string;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  label?: string;
  placeholder?: string;
}

/**
 * Multi-select component for property/service scope targets.
 * Replaces single-select when scope is 'property' or 'service'.
 */
export const MultiScopeSelector: React.FC<MultiScopeSelectorProps> = memo(({
  scope,
  selectedIds,
  onSelectionChange,
  label,
  placeholder = 'Sélectionner...',
}) => {
  const { entities, loading } = useScopeEntities(scope);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return entities;
    const q = search.toLowerCase();
    return entities.filter(e => e.label.toLowerCase().includes(q));
  }, [entities, search]);

  const selectedEntities = useMemo(() => {
    return entities.filter(e => selectedIds.includes(e.id));
  }, [entities, selectedIds]);

  const toggleItem = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const selectAll = () => onSelectionChange(filtered.map(e => e.id));
  const clearAll = () => onSelectionChange([]);

  return (
    <div>
      {label && <Label className="text-sm mb-1.5 block">{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between font-normal h-auto min-h-[36px] py-1.5">
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedEntities.length === 0 ? (
                <span className="text-muted-foreground">{loading ? 'Chargement...' : placeholder}</span>
              ) : selectedEntities.length <= 2 ? (
                selectedEntities.map(e => (
                  <Badge key={e.id} variant="secondary" className="text-[10px] gap-1">
                    {e.label}
                    <X className="h-2.5 w-2.5 cursor-pointer" onClick={(ev) => { ev.stopPropagation(); toggleItem(e.id); }} />
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary" className="text-[10px]">
                  {scope === 'property' ? 'propriétés' : scope === 'service' ? 'services' : scope === 'property_group' ? 'groupes' : 'éléments'} ({selectedEntities.length})
                </Badge>
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] p-0" align="start">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="pl-8 h-8 text-sm"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="ghost" size="sm" className="text-xs h-6" onClick={selectAll}>Tout</Button>
              <Button variant="ghost" size="sm" className="text-xs h-6" onClick={clearAll}>Aucun</Button>
              <span className="ml-auto text-[10px] text-muted-foreground self-center">{selectedIds.length}/{entities.length}</span>
            </div>
          </div>
          <ScrollArea className="max-h-[250px]">
            <div className="p-1">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {loading ? 'Chargement...' : 'Aucun élément'}
                </p>
              ) : (
                filtered.map(entity => (
                  <div
                    key={entity.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleItem(entity.id)}
                  >
                    <Checkbox checked={selectedIds.includes(entity.id)} className="pointer-events-none" />
                    <span className="text-sm truncate">{entity.label}</span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
});

MultiScopeSelector.displayName = 'MultiScopeSelector';
