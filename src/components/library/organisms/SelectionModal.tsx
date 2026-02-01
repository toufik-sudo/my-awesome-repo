// -----------------------------------------------------------------------------
// SelectionModal Organism Component
// Consolidated from ChangeZoneModal, AddUserDeclarationModal, and similar
// Generic modal for selecting from a list of options
// -----------------------------------------------------------------------------

import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SelectionOption {
  id: string;
  label?: string;
  labelId?: string;
  description?: string;
  descriptionId?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (optionId: string) => void;
  options: SelectionOption[];
  title?: string;
  titleId?: string;
  description?: string;
  descriptionId?: string;
  showCloseButton?: boolean;
  className?: string;
  optionClassName?: string;
  layout?: 'vertical' | 'horizontal' | 'grid';
}

const SelectionModal: React.FC<SelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  options,
  title,
  titleId,
  description,
  descriptionId,
  showCloseButton = true,
  className,
  optionClassName,
  layout = 'vertical',
}) => {
  const layoutClasses = {
    vertical: 'flex flex-col gap-3',
    horizontal: 'flex flex-row gap-3 flex-wrap',
    grid: 'grid grid-cols-2 gap-3',
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn('max-w-md', className)}>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <DialogHeader>
          {(title || titleId) && (
            <DialogTitle>
              {title || <FormattedMessage id={titleId} defaultMessage="" />}
            </DialogTitle>
          )}
          {(description || descriptionId) && (
            <DialogDescription>
              {description || <FormattedMessage id={descriptionId} defaultMessage="" />}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className={cn('py-4', layoutClasses[layout])}>
          {options.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              onClick={() => onSelect(option.id)}
              disabled={option.disabled}
              className={cn(
                'h-auto py-4 px-6 justify-start text-left',
                optionClassName
              )}
            >
              {option.icon && <span className="mr-3">{option.icon}</span>}
              <div className="flex flex-col">
                <span className="font-medium">
                  {option.label || (option.labelId && <FormattedMessage id={option.labelId} defaultMessage="" />)}
                </span>
                {(option.description || option.descriptionId) && (
                  <span className="text-sm text-muted-foreground">
                    {option.description || <FormattedMessage id={option.descriptionId} defaultMessage="" />}
                  </span>
                )}
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Preset variants
export const ZoneSelectionModal: React.FC<{
  isOpen: boolean;
  onSelect: (zone: string) => void;
}> = ({ isOpen, onSelect }) => (
  <SelectionModal
    isOpen={isOpen}
    onClose={() => {}}
    onSelect={onSelect}
    titleId="modal.changeZone"
    showCloseButton={false}
    options={[
      { id: 'EU', labelId: 'modal.changeZone.EU' },
      { id: 'US', labelId: 'modal.changeZone.US' },
    ]}
    layout="horizontal"
  />
);

export const DeclarationTypeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectForm: () => void;
  onSelectUpload: () => void;
}> = ({ isOpen, onClose, onSelectForm, onSelectUpload }) => (
  <SelectionModal
    isOpen={isOpen}
    onClose={onClose}
    onSelect={(id) => (id === 'form' ? onSelectForm() : onSelectUpload())}
    titleId="wall.userDeclarations.add.new.result"
    options={[
      { id: 'form', labelId: 'wall.userDeclarations.add.form' },
      { id: 'upload', labelId: 'wall.userDeclarations.add.fileUpload' },
    ]}
  />
);

export { SelectionModal };
export default SelectionModal;
