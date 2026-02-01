/**
 * BlockUserModal Component
 * Migrated from old_app/src/components/organisms/modals/BlockUserModal.tsx
 * Modern implementation using shadcn Dialog
 */

import React from 'react';
import { useIntl } from 'react-intl';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useBlockUserModal } from '@/hooks/modals/useBlockUserModal';
import { UserX, UserCheck } from 'lucide-react';

const USER_STATUS_OPERATION: Record<string, string> = {
  BLOCKED: 'unblock',
  ACTIVE: 'block',
};

/**
 * Block/Unblock user confirmation modal
 */
export const BlockUserModal: React.FC = () => {
  const { formatMessage } = useIntl();
  const { isOpen, data, onConfirm, onClose } = useBlockUserModal();

  const operation = data?.status ? USER_STATUS_OPERATION[data.status] : 'block';
  const isBlocking = operation === 'block';
  const Icon = isBlocking ? UserX : UserCheck;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
            isBlocking ? 'bg-destructive/10' : 'bg-green-100'
          }`}>
            <Icon className={`h-6 w-6 ${
              isBlocking ? 'text-destructive' : 'text-green-600'
            }`} />
          </div>
          <DialogTitle className="text-center text-lg font-semibold">
            {formatMessage({ id: `wall.user.details.programs.${operation}` })}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button 
            onClick={onConfirm} 
            variant={isBlocking ? 'destructive' : 'default'}
          >
            {formatMessage({ id: 'confirmation.cta.yes' })}
          </Button>
          <Button variant="outline" onClick={onClose}>
            {formatMessage({ id: 'confirmation.cta.no' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlockUserModal;
