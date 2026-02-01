// -----------------------------------------------------------------------------
// UserProgramRoleModal Component
// Migrated from old_app/src/components/organisms/modals/UserProgramRoleModal.tsx
// -----------------------------------------------------------------------------

import React, { useState, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Users, Check } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usersApi } from '@/api/UsersApi';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface ManagedUser {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  isManaged: boolean;
}

interface Program {
  id: number;
  name: string;
}

interface UserDetails {
  uuid: string;
  firstName: string;
  lastName: string;
}

interface UserProgramRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDetails: UserDetails;
  program: Program | null;
  onRoleUpdated?: (wasChanged: boolean) => void;
}

/**
 * Modal for managing user program roles and managed users
 */
const UserProgramRoleModal: React.FC<UserProgramRoleModalProps> = ({
  isOpen,
  onClose,
  userDetails,
  program,
  onRoleUpdated
}) => {
  const { formatMessage } = useIntl();
  const [isPeopleManager, setIsPeopleManager] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [allManaged, setAllManaged] = useState(false);

  const handleUserToggle = useCallback((userId: string) => {
    setUsers(prev => prev.map(user => 
      user.uuid === userId ? { ...user, isManaged: !user.isManaged } : user
    ));
  }, []);

  const handleAllToggle = useCallback(() => {
    setAllManaged(prev => {
      const newValue = !prev;
      setUsers(prevUsers => prevUsers.map(user => ({ ...user, isManaged: newValue })));
      return newValue;
    });
  }, []);

  const handleValidate = async () => {
    if (!program?.id) return;
    
    setIsValidating(true);
    try {
      const managedUserIds = users.filter(u => u.isManaged).map(u => u.uuid);
      await usersApi.updateProgramUser(program.id, userDetails.uuid, isPeopleManager ? 'SET_MANAGER' : 'REMOVE_MANAGER');
      toast.success('Role updated successfully');
      onRoleUpdated?.(true);
      onClose();
    } catch (error) {
      console.error('Failed to update role:', error);
      toast.error('Failed to update role');
    } finally {
      setIsValidating(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 text-primary">
            <Users className="h-6 w-6" />
            <DialogTitle>
              <FormattedMessage id="wall.user.program.role" defaultMessage="User Program Role" />
            </DialogTitle>
          </div>
          <DialogDescription>
            <FormattedMessage 
              id="wall.user.program.role.description" 
              defaultMessage="Configure the role for {name} in {program}"
              values={{ 
                name: `${userDetails.firstName} ${userDetails.lastName}`,
                program: program?.name || 'this program'
              }}
            />
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* People Manager Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="people-manager" className="text-base">
                <FormattedMessage id="wall.user.role.peopleManager" defaultMessage="People Manager" />
              </Label>
              <p className="text-sm text-muted-foreground">
                <FormattedMessage 
                  id="wall.user.role.peopleManager.description" 
                  defaultMessage="Allow this user to manage other team members" 
                />
              </p>
            </div>
            <Switch
              id="people-manager"
              checked={isPeopleManager}
              onCheckedChange={setIsPeopleManager}
            />
          </div>

          {/* Managed Users List */}
          {isPeopleManager && users.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  <FormattedMessage id="wall.user.role.managedUsers" defaultMessage="Managed Users" />
                </Label>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleAllToggle}
                >
                  {allManaged ? (
                    <FormattedMessage id="common.deselectAll" defaultMessage="Deselect All" />
                  ) : (
                    <FormattedMessage id="common.selectAll" defaultMessage="Select All" />
                  )}
                </Button>
              </div>
              
              <ScrollArea className="h-48 rounded-md border p-2">
                <div className="space-y-2">
                  {users.map((user) => (
                    <div 
                      key={user.uuid}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                      onClick={() => handleUserToggle(user.uuid)}
                    >
                      <Checkbox 
                        checked={user.isManaged} 
                        onCheckedChange={() => handleUserToggle(user.uuid)}
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isValidating}>
            <FormattedMessage id="common.cancel" defaultMessage="Cancel" />
          </Button>
          <Button onClick={handleValidate} disabled={isValidating}>
            {isValidating ? (
              <FormattedMessage id="common.validating" defaultMessage="Validating..." />
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                <FormattedMessage id="label.button.validate" defaultMessage="Validate" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProgramRoleModal;
