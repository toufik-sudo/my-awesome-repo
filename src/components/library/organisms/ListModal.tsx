// -----------------------------------------------------------------------------
// ListModal Organism Component
// Consolidated from LikesModal, SpecificUsersModal, and similar list modals
// Modal for displaying and optionally selecting from a list of items
// -----------------------------------------------------------------------------

import React, { ReactNode, useState, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { X, Search, ChevronLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Loading } from '@/components/library/atoms/Loading';

export interface ListItem {
  id: string;
  name: string;
  avatar?: string;
  subtitle?: string;
  disabled?: boolean;
}

export interface ListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  titleId?: string;
  items: ListItem[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  // Selection props
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmLabelId?: string;
  isConfirming?: boolean;
  minSelection?: number;
  // Search props
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchPlaceholderId?: string;
  // Custom rendering
  renderItem?: (item: ListItem, isSelected: boolean) => ReactNode;
  // Styling
  className?: string;
  accentColor?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const ListModal: React.FC<ListModalProps> = ({
  isOpen,
  onClose,
  title,
  titleId,
  items,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  onConfirm,
  confirmLabel,
  confirmLabelId = 'wall.posts.confidentiality.confirm',
  isConfirming = false,
  minSelection = 0,
  searchable = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder,
  searchPlaceholderId = 'wall.posts.confidentiality.selectUsers.search.placeholder',
  renderItem,
  className,
  accentColor,
  showBackButton = false,
  onBack,
}) => {
  const handleSelect = useCallback((itemId: string) => {
    if (!onSelectionChange) return;
    
    const newSelection = selectedIds.includes(itemId)
      ? selectedIds.filter((id) => id !== itemId)
      : [...selectedIds, itemId];
    
    onSelectionChange(newSelection);
  }, [selectedIds, onSelectionChange]);

  const isValidSelection = selectedIds.length >= minSelection;

  const defaultRenderItem = (item: ListItem, isSelected: boolean) => (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg transition-colors',
        selectable && 'cursor-pointer hover:bg-muted',
        isSelected && 'bg-primary/10'
      )}
      onClick={() => selectable && handleSelect(item.id)}
    >
      {selectable && (
        <Checkbox
          checked={isSelected}
          disabled={item.disabled}
          onCheckedChange={() => handleSelect(item.id)}
        />
      )}
      {item.avatar && (
        <img
          src={item.avatar}
          alt={item.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{item.name}</p>
        {item.subtitle && (
          <p className="text-sm text-muted-foreground truncate">{item.subtitle}</p>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn('max-w-md', className)}>
        <DialogHeader className="flex-row items-center gap-2">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack || onClose}
              className={cn(accentColor)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          {(title || titleId) && (
            <DialogTitle>
              {title || <FormattedMessage id={titleId} defaultMessage="" />}
            </DialogTitle>
          )}
        </DialogHeader>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>

        {searchable && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-10"
            />
          </div>
        )}

        <ScrollArea className="h-[300px] pr-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loading size="lg" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FormattedMessage id="common.noResults" defaultMessage="No results found" />
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id}>
                  {renderItem
                    ? renderItem(item, selectedIds.includes(item.id))
                    : defaultRenderItem(item, selectedIds.includes(item.id))}
                </div>
              ))}
              {hasMore && (
                <Button
                  variant="ghost"
                  onClick={onLoadMore}
                  className="w-full"
                >
                  <FormattedMessage id="common.loadMore" defaultMessage="Load more" />
                </Button>
              )}
            </div>
          )}
        </ScrollArea>

        {selectable && (
          <>
            <div className="text-sm text-muted-foreground">
              <FormattedMessage
                id="wall.posts.confidentiality.selectUsers.selected"
                defaultMessage="{value} selected"
                values={{ value: selectedIds.length }}
              />
            </div>
            {!isValidSelection && minSelection > 0 && (
              <p className="text-sm text-destructive">
                <FormattedMessage
                  id="wall.posts.confidentiality.selectUsers.validation.min"
                  defaultMessage="Please select at least {min} items"
                  values={{ min: minSelection }}
                />
              </p>
            )}
          </>
        )}

        {(selectable && onConfirm) && (
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose} disabled={isConfirming}>
              <FormattedMessage id="wall.posts.confidentiality.cancel" defaultMessage="Cancel" />
            </Button>
            <Button
              onClick={onConfirm}
              disabled={!isValidSelection || isConfirming}
            >
              {isConfirming ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <FormattedMessage id="label.loading" defaultMessage="Loading..." />
                </span>
              ) : (
                confirmLabel || <FormattedMessage id={confirmLabelId} defaultMessage="Confirm" />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Preset variant for likes display
export const LikesModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  likes: Array<{ id: string; name: string; avatar?: string }>;
  accentColor?: string;
}> = ({ isOpen, onClose, likes, accentColor }) => (
  <ListModal
    isOpen={isOpen}
    onClose={onClose}
    titleId="wall.posts.likes"
    items={likes}
    showBackButton
    accentColor={accentColor}
  />
);

export { ListModal };
export default ListModal;
