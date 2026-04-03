import React, { useState, useCallback, useEffect } from 'react';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { invitationsApi } from '../admin.api';
import type { AppRole } from '../admin.types';
import { ROLE_LABELS } from '../admin.types';
import { Send, Mail, Phone, UserPlus, Loader2, Info } from 'lucide-react';

interface InvitationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** If provided, use these roles. Otherwise fetch from API. */
  allowedRoles?: AppRole[];
  onSuccess?: () => void;
}

const GUEST_SCOPE_INFO: Record<string, string> = {
  hyper_admin: 'Le guest aura accès à toutes les propriétés/services.',
  hyper_manager: 'Le guest aura accès aux propriétés/services dont vous avez les permissions.',
  admin: 'Le guest aura accès uniquement à vos propriétés et services (lecture seule).',
  manager: 'Le guest aura accès uniquement aux propriétés/services que vous contrôlez (lecture seule).',
};

export const InvitationForm: React.FC<InvitationFormProps> = ({
  open,
  onOpenChange,
  allowedRoles: propAllowedRoles,
  onSuccess,
}) => {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<AppRole | ''>('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchedRoles, setFetchedRoles] = useState<AppRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const allowedRoles = propAllowedRoles || fetchedRoles;

  // Fetch allowed roles from API if not provided via props
  useEffect(() => {
    if (!propAllowedRoles && open) {
      setLoadingRoles(true);
      invitationsApi.getAllowedRoles()
        .then(roles => setFetchedRoles(roles))
        .catch(() => setFetchedRoles([]))
        .finally(() => setLoadingRoles(false));
    }
  }, [open, propAllowedRoles]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast.error('Veuillez sélectionner un rôle');
      return;
    }
    const contact = method === 'email' ? email : phone;
    if (!contact) {
      toast.error(`Veuillez saisir ${method === 'email' ? 'une adresse email' : 'un numéro de téléphone'}`);
      return;
    }

    setLoading(true);
    try {
      await invitationsApi.create({
        method,
        email: method === 'email' ? email : undefined,
        phone: method === 'phone' ? phone : undefined,
        role: role as AppRole,
        message: message || undefined,
      });
      toast.success(`Invitation envoyée avec succès via ${method}`);
      onOpenChange(false);
      resetForm();
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Échec de l\'envoi de l\'invitation');
    } finally {
      setLoading(false);
    }
  }, [method, email, phone, role, message, onOpenChange, onSuccess]);

  const resetForm = () => {
    setEmail('');
    setPhone('');
    setRole('');
    setMessage('');
  };

  return (
    <DynamicModal
      open={open}
      onOpenChange={(o) => { if (!o) resetForm(); onOpenChange(o); }}
      title="Envoyer une invitation"
      description="Inviter un nouvel utilisateur à rejoindre la plateforme"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Method Toggle */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={method === 'email' ? 'default' : 'outline'}
            className="flex-1 gap-2"
            onClick={() => setMethod('email')}
          >
            <Mail className="h-4 w-4" /> Email
          </Button>
          <Button
            type="button"
            variant={method === 'phone' ? 'default' : 'outline'}
            className="flex-1 gap-2"
            onClick={() => setMethod('phone')}
          >
            <Phone className="h-4 w-4" /> Téléphone
          </Button>
        </div>

        {/* Contact Field */}
        {method === 'email' ? (
          <div className="space-y-2">
            <Label htmlFor="inv-email">Adresse email</Label>
            <Input
              id="inv-email"
              type="email"
              placeholder="utilisateur@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="inv-phone">Numéro de téléphone</Label>
            <Input
              id="inv-phone"
              type="tel"
              placeholder="+213 555 123 456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        )}

        {/* Role Selection */}
        <div className="space-y-2">
          <Label>Rôle à attribuer</Label>
          {loadingRoles ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Chargement des rôles...
            </div>
          ) : allowedRoles.length === 0 ? (
            <p className="text-sm text-destructive">Vous n'êtes pas autorisé à envoyer des invitations.</p>
          ) : (
            <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border">
                {allowedRoles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {ROLE_LABELS[r] || r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Guest scope info */}
        {role === 'guest' && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50 border border-border text-sm">
            <Info className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <span className="text-muted-foreground">
              Le guest héritera de votre périmètre d'accès en lecture seule.
              Il pourra voir les propriétés/services, le calendrier, faire des réservations et contacter le support.
            </span>
          </div>
        )}

        {/* Custom Message */}
        <div className="space-y-2">
          <Label htmlFor="inv-message">Message personnel (optionnel)</Label>
          <Textarea
            id="inv-message"
            placeholder="Bienvenue sur notre plateforme ! Nous serions ravis de vous accueillir..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => { resetForm(); onOpenChange(false); }}
          >
            Annuler
          </Button>
          <Button type="submit" className="flex-1 gap-2" disabled={loading || allowedRoles.length === 0}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Envoyer l'invitation
          </Button>
        </div>
      </form>
    </DynamicModal>
  );
};
