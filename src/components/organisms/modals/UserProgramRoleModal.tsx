/**
 * UserProgramRoleModal Component
 * Migrated from old_app/src/components/organisms/modals/UserProgramRoleModal.tsx
 * Modern implementation using shadcn Dialog
 */

import React, { useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserProgramRoleModal } from '@/hooks/modals/useUserProgramRoleModal';
import { Users, UserCog } from 'lucide-react';

interface UserDetails {
  uuid: string;
  name?: string;
}

interface UserProgramRoleModalProps {
  userDetails: UserDetails;
  refreshPrograms?: () => void;
}

/**
 * Modal for managing user program roles
 */
export const UserProgramRoleModal: React.FC<UserProgramRoleModalProps> = ({
  userDetails,
  refreshPrograms,
}) => {
  const { formatMessage } = useIntl();
  const { isOpen, data, onClose } = useUserProgramRoleModal();
  const [isPeopleManager, setIsPeopleManager] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = useCallback(async () => {
    setIsValidating(true);
    try {
      // Note: Role update API would be called here
      refreshPrograms?.();
      onClose();
    } finally {
      setIsValidating(false);
    }
  }, [refreshPrograms, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isValidating && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <UserCog className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold text-primary">
            {formatMessage({ id: 'wall.user.program.role' })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Role Selection */}
          <RadioGroup
            value={isPeopleManager ? 'manager' : 'member'}
            onValueChange={(value) => setIsPeopleManager(value === 'manager')}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted">
              <RadioGroupItem value="member" id="member" />
              <Label htmlFor="member" className="flex-1 cursor-pointer">
                <div className="font-medium">
                  {formatMessage({ id: 'wall.user.role.member' })}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatMessage({ id: 'wall.user.role.member.description' })}
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted">
              <RadioGroupItem value="manager" id="manager" />
              <Label htmlFor="manager" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2 font-medium">
                  <Users className="h-4 w-4" />
                  {formatMessage({ id: 'wall.user.role.manager' })}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatMessage({ id: 'wall.user.role.manager.description' })}
                </p>
              </Label>
            </div>
          </RadioGroup>

          {/* Managed Users (shown when manager role is selected) */}
          {isPeopleManager && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  {formatMessage({ id: 'wall.user.manage.users' })}
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox id="select-all" />
                  <Label htmlFor="select-all" className="text-sm">
                    {formatMessage({ id: 'wall.user.select.all' })}
                  </Label>
                </div>
              </div>
              <ScrollArea className="h-[150px] rounded-md border p-3">
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {formatMessage({ id: 'wall.user.manage.users.empty' })}
                </p>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            onClick={handleValidate}
            disabled={isValidating}
            className="min-w-[120px]"
          >
            {isValidating ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              formatMessage({ id: 'label.button.validate' })
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProgramRoleModal;
