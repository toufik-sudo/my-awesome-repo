// -----------------------------------------------------------------------------
// InfoModal Organism Component
// Consolidated from FraudInfoModal, LocalModal, and similar info modals
// -----------------------------------------------------------------------------

import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { X, Info, AlertTriangle, HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loading } from '@/components/library/atoms/Loading';

export type InfoModalType = 'info' | 'warning' | 'help' | 'custom';

export interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  titleId?: string;
  type?: InfoModalType;
  children?: ReactNode;
  showConfirmButton?: boolean;
  confirmLabel?: string;
  confirmLabelId?: string;
  isLoading?: boolean;
  className?: string;
  icon?: ReactNode;
}

const typeIcons: Record<InfoModalType, ReactNode> = {
  info: <Info className="h-6 w-6 text-primary" />,
  warning: <AlertTriangle className="h-6 w-6 text-destructive" />,
  help: <HelpCircle className="h-6 w-6 text-muted-foreground" />,
  custom: null,
};

const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  title,
  titleId,
  type = 'info',
  children,
  showConfirmButton = true,
  confirmLabel,
  confirmLabelId = 'modal.confirmation.ok',
  isLoading = false,
  className,
  icon,
}) => {
  const displayIcon = icon ?? typeIcons[type];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className={cn('max-w-md', className)}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            {displayIcon}
            <DialogTitle>
              {title || (titleId && <FormattedMessage id={titleId} defaultMessage="Information" />)}
            </DialogTitle>
          </div>
        </DialogHeader>

        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loading size="lg" />
            </div>
          ) : (
            children
          )}
        </div>

        {showConfirmButton && !isLoading && (
          <DialogFooter>
            <Button onClick={onClose}>
              {confirmLabel || <FormattedMessage id={confirmLabelId} defaultMessage="OK" />}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Preset variants
export const FraudInfoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => (
  <InfoModal
    isOpen={isOpen}
    onClose={onClose}
    titleId="personalInformation.info.fraud.modal.title"
    type="warning"
  >
    <div className="space-y-4">
      <p>
        <FormattedMessage id="personalInformation.info.fraud.modal.content1" defaultMessage="" />
      </p>
      <p>
        <FormattedMessage id="personalInformation.info.fraud.modal.content2" defaultMessage="" />
      </p>
    </div>
  </InfoModal>
);

export { InfoModal };
export default InfoModal;
