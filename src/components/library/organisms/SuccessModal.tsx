// -----------------------------------------------------------------------------
// SuccessModal Organism Component
// Migrated from old_app/src/components/organisms/modals/SuccessModal.tsx
// -----------------------------------------------------------------------------

import React, { useEffect, useState, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, PartyPopper } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AUTO_CLOSE_TIME = 5000; // 5 seconds

export type SuccessModalType = 'default' | 'reset' | 'onboarding' | 'celebration';

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: SuccessModalType;
  title?: string;
  titleId?: string;
  message?: string;
  messageId?: string;
  buttonLabel?: string;
  buttonLabelId?: string;
  redirectPath?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
  showCloseButton?: boolean;
  onButtonClick?: () => void;
  customStyle?: string;
}

const successIcons: Record<SuccessModalType, React.ReactNode> = {
  default: <CheckCircle className="h-16 w-16 text-primary" />,
  reset: <CheckCircle className="h-16 w-16 text-primary" />,
  onboarding: <PartyPopper className="h-16 w-16 text-accent-foreground" />,
  celebration: <PartyPopper className="h-16 w-16 text-primary" />,
};

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  type = 'default',
  title,
  titleId,
  message,
  messageId,
  buttonLabel,
  buttonLabelId,
  redirectPath,
  autoClose = true,
  autoCloseDelay = AUTO_CLOSE_TIME,
  showCloseButton = true,
  onButtonClick,
  customStyle,
}) => {
  const navigate = useNavigate();
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout | null>(null);

  const handleClose = useCallback(() => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }
    onClose();
  }, [onClose, timeoutRef]);

  const handleButtonClick = useCallback(() => {
    handleClose();
    if (onButtonClick) {
      onButtonClick();
    } else if (redirectPath) {
      navigate(redirectPath);
    }
  }, [handleClose, onButtonClick, redirectPath, navigate]);

  useEffect(() => {
    if (isOpen && autoClose) {
      const timeout = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      setTimeoutRef(timeout);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isOpen, autoClose, autoCloseDelay, handleClose]);

  const getTitleId = () => {
    if (titleId) return titleId;
    return `modal.success.title${type !== 'default' ? `.${type}` : ''}`;
  };

  const getMessageId = () => {
    if (messageId) return messageId;
    return `modal.success.body${type !== 'default' ? `.${type}` : ''}`;
  };

  const getButtonLabelId = () => {
    if (buttonLabelId) return buttonLabelId;
    return `modal.success.button${type !== 'default' ? `.${type}` : ''}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className={cn(
          'flex flex-col items-center justify-center text-center p-8 max-w-md',
          customStyle
        )}
      >
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}

        <div className="mb-6 animate-bounce-once">
          {successIcons[type]}
        </div>

        <h2 className="text-2xl font-bold mb-4">
          {title || <FormattedMessage id={getTitleId()} defaultMessage="Success!" />}
        </h2>

        <p className="text-muted-foreground mb-6">
          {message || <FormattedMessage id={getMessageId()} defaultMessage="Your action was completed successfully." />}
        </p>

        <Button onClick={handleButtonClick} className="min-w-32">
          {buttonLabel || <FormattedMessage id={getButtonLabelId()} defaultMessage="Continue" />}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export { SuccessModal };
export default SuccessModal;
