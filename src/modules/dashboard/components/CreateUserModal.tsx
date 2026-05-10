import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { invitationsApi } from '@/modules/admin/admin.api';
import type { AppRole } from '@/modules/admin/admin.types';
import { ROLE_LABELS } from '@/modules/admin/admin.types';

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Roles the current user is allowed to create */
  allowedRoles: AppRole[];
  onSuccess?: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  open,
  onOpenChange,
  allowedRoles,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AppRole>(allowedRoles[0] || 'guest');
  const [loading, setLoading] = useState(false);

  // Reset role when allowedRoles changes
  useEffect(() => {
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      setRole(allowedRoles[0]);
    }
  }, [allowedRoles]);

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error('Veuillez saisir un email');
      return;
    }
    setLoading(true);
    try {
      await invitationsApi.create({
        method: 'email',
        email: email.trim(),
        role,
      });
      toast.success(`Invitation envoyée à ${email} en tant que ${ROLE_LABELS[role] || role}`);
      setEmail('');
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      const code = data?.code || data?.message?.code;
      const errMessage = typeof data?.message === 'string' ? data.message : data?.message?.message;

      if (status === 409 && (code === 'INVITATION_ALREADY_EXISTS' || data?.message?.canResend)) {
        const existingId = data?.existingInvitationId || data?.message?.existingInvitationId;
        const confirmed = window.confirm(
          (errMessage || 'Une invitation est déjà en attente pour ce contact.') +
          '\n\nVoulez-vous renvoyer l\'invitation maintenant ?'
        );
        if (confirmed && existingId) {
          try {
            await invitationsApi.resend(existingId);
            toast.success('Invitation renvoyée avec succès.');
            setEmail('');
            onOpenChange(false);
            onSuccess?.();
          } catch (resendErr: any) {
            toast.error(resendErr?.response?.data?.message || 'Échec du renvoi de l\'invitation');
          }
        }
        return;
      }

      if (status === 400 && (code === 'ROLE_CONFLICT' || data?.message?.code === 'ROLE_CONFLICT')) {
        toast.error(errMessage || 'Conflit de rôle : un utilisateur ne peut pas avoir deux rôles distincts.');
        return;
      }

      toast.error(errMessage || data?.message || 'Erreur lors de l\'envoi de l\'invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Créer un utilisateur
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="create-email" className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Email
            </Label>
            <Input
              id="create-email"
              type="email"
              placeholder="utilisateur@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-muted-foreground" />
              Rôle
            </Label>
            <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allowedRoles.map(r => (
                  <SelectItem key={r} value={r}>
                    {ROLE_LABELS[r] || r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="gap-1.5">
            {loading ? (
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Envoyer l'invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
