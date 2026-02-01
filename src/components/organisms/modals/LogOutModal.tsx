/**
 * LogOutModal Component
 * Migrated from old_app/src/components/organisms/modals/LogOutModal.tsx
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
import { useLogOutModal } from '@/hooks/modals/useLogOutModal';
import { LogOut, X } from 'lucide-react';

/**
 * Logout confirmation modal
 */
export const LogOutModal: React.FC = () => {
  const { formatMessage } = useIntl();
  const { isOpen, onLogout, onClose } = useLogOutModal();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <LogOut className="h-6 w-6 text-muted-foreground" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold">
            {formatMessage({ id: 'logout.label.are.you.sure' })}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={onLogout} variant="default">
            {formatMessage({ id: 'logout.cta.yes' })}
          </Button>
          <Button variant="destructive" onClick={onClose}>
            {formatMessage({ id: 'logout.cta.no' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogOutModal;
