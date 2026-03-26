import React, { useState, useCallback } from 'react';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { invitationsApi } from '../admin.api';
import type { AppRole } from '../admin.types';
import { Send, Mail, Phone, UserPlus, Loader2 } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface InvitationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allowedRoles: AppRole[];
  onSuccess?: () => void;
}

export const InvitationForm: React.FC<InvitationFormProps> = ({
  open,
  onOpenChange,
  allowedRoles,
  onSuccess,
}) => {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<AppRole | ''>('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const ROLE_LABELS: Record<string, string> = {
    hyper_manager: 'Hyper Manager',
    admin: 'Admin (Host)',
    manager: 'Manager',
    user: 'Guest',
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast.error('Please select a role');
      return;
    }
    const contact = method === 'email' ? email : phone;
    if (!contact) {
      toast.error(`Please enter ${method === 'email' ? 'an email address' : 'a phone number'}`);
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
      toast.success(`Invitation sent successfully via ${method}`);
      onOpenChange(false);
      resetForm();
      onSuccess?.();
    } catch {
      toast.error('Failed to send invitation');
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
      title="Send Invitation"
      description="Invite a new user to join the platform"
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
            <Phone className="h-4 w-4" /> Phone
          </Button>
        </div>

        {/* Contact Field */}
        {method === 'email' ? (
          <div className="space-y-2">
            <Label htmlFor="inv-email">Email Address</Label>
            <Input
              id="inv-email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="inv-phone">Phone Number</Label>
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
          <Label>Role to Assign</Label>
          <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
            <SelectTrigger>
              <SelectValue placeholder="Select role..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border">
              {allowedRoles.map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_LABELS[r] || r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Message */}
        <div className="space-y-2">
          <Label htmlFor="inv-message">Personal Message (optional)</Label>
          <Textarea
            id="inv-message"
            placeholder="Welcome to our platform! We'd love to have you on board..."
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
            Cancel
          </Button>
          <Button type="submit" className="flex-1 gap-2" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send Invitation
          </Button>
        </div>
      </form>
    </DynamicModal>
  );
};
