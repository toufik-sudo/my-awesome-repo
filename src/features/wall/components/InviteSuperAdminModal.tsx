// -----------------------------------------------------------------------------
// Invite Super Admin Modal
// Modal for Hyper Admin to invite/create Super Admin users
// Migrated from old_app invitation flow
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus, Shield, Mail } from 'lucide-react';
import { IPlatform } from '../types';

interface InviteSuperAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: IPlatform | null;
  onInviteSent?: (email: string) => void;
}

export const InviteSuperAdminModal: React.FC<InviteSuperAdminModalProps> = ({
  isOpen,
  onClose,
  platform,
  onInviteSent
}) => {
  const { formatMessage } = useIntl();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canSubmit = email && validateEmail(email) && firstName && lastName && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit || !platform) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Implement actual API call to invite super admin
      // await platformApi.inviteSuperAdmin({
      //   platformId: platform.id,
      //   email: email.trim(),
      //   firstName: firstName.trim(),
      //   lastName: lastName.trim(),
      //   role: ROLE.SUPER_ADMIN
      // });

      // Simulate success for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onInviteSent?.(email);
      handleClose();
    } catch (err) {
      setError(formatMessage({
        id: 'invite.superAdmin.error',
        defaultMessage: 'Failed to send invitation. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setFirstName('');
    setLastName('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">
            {formatMessage({
              id: 'invite.superAdmin.title',
              defaultMessage: 'Invite Super Admin'
            })}
          </DialogTitle>
          <DialogDescription className="text-center">
            {formatMessage(
              {
                id: 'invite.superAdmin.description',
                defaultMessage: 'Invite a user to manage {platformName} as Super Admin'
              },
              { platformName: platform?.name || 'the platform' }
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                {formatMessage({ id: 'form.firstName', defaultMessage: 'First Name' })}
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={formatMessage({ 
                  id: 'form.firstName.placeholder', 
                  defaultMessage: 'First name' 
                })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                {formatMessage({ id: 'form.lastName', defaultMessage: 'Last Name' })}
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={formatMessage({ 
                  id: 'form.lastName.placeholder', 
                  defaultMessage: 'Last name' 
                })}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              {formatMessage({ id: 'form.email', defaultMessage: 'Email Address' })}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder={formatMessage({ 
                  id: 'form.email.placeholder', 
                  defaultMessage: 'admin@company.com' 
                })}
                className={`pl-10 ${error ? 'border-destructive' : ''}`}
                disabled={isSubmitting}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          {/* Platform info */}
          {platform && (
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">
                {formatMessage({ id: 'invite.platform', defaultMessage: 'Platform' })}
              </p>
              <p className="text-sm font-medium">{platform.name}</p>
            </div>
          )}

          <div className="rounded-lg bg-muted/50 border border-border p-3">
            <p className="text-xs text-muted-foreground">
              {formatMessage({
                id: 'invite.superAdmin.note',
                defaultMessage: 'The invited user will receive an email with instructions to set up their Super Admin account.'
              })}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            {formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' })}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!canSubmit}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4 mr-2" />
            )}
            {formatMessage({ id: 'invite.send', defaultMessage: 'Send Invitation' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteSuperAdminModal;
