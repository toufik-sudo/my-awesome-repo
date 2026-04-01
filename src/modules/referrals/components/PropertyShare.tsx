import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Share2, Copy, Mail, MessageCircle, Facebook, Twitter, Link, Check } from 'lucide-react';
import { referralsApi } from '../referrals.api';
import { swalAlert } from '@/modules/shared/services/alert.service';

interface PropertyShareProps {
  propertyId: string;
  propertyTitle: string;
  propertyUrl?: string;
  className?: string;
}

const SHARE_METHODS = [
  { id: 'copy_link', label: 'Copier le lien', icon: Link },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'facebook', label: 'Facebook', icon: Facebook },
  { id: 'twitter', label: 'Twitter/X', icon: Twitter },
] as const;

export const PropertyShare: React.FC<PropertyShareProps> = ({
  propertyId,
  propertyTitle,
  propertyUrl,
  className,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recipient, setRecipient] = useState('');

  const shareUrl = propertyUrl || `${window.location.origin}/property/${propertyId}`;

  const handleShare = useCallback(async (method: string) => {
    try {
      // Track share
      await referralsApi.shareProperty({ propertyId, method, recipient: recipient || undefined });

      switch (method) {
        case 'copy_link':
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          swalAlert.success('Lien copié !');
          break;
        case 'email':
          window.open(`mailto:${recipient}?subject=${encodeURIComponent(propertyTitle)}&body=${encodeURIComponent(`Découvrez cette propriété : ${shareUrl}`)}`);
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(`${propertyTitle} - ${shareUrl}`)}`);
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(propertyTitle)}&url=${encodeURIComponent(shareUrl)}`);
          break;
      }
    } catch {
      // Share tracking failed silently, share still works
    }
  }, [propertyId, propertyTitle, shareUrl, recipient]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Share2 className="h-4 w-4 mr-2" />
          Partager
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Partager cette propriété
          </DialogTitle>
          <DialogDescription>
            Partagez "{propertyTitle}" et gagnez des points !
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Share URL */}
          <div className="flex items-center gap-2">
            <Input value={shareUrl} readOnly className="text-xs" />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShare('copy_link')}
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {/* Email recipient */}
          <div>
            <Label className="text-sm">Email du destinataire (optionnel)</Label>
            <Input
              type="email"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              placeholder="ami@example.com"
              className="mt-1"
            />
          </div>

          {/* Share buttons */}
          <div className="grid grid-cols-2 gap-2">
            {SHARE_METHODS.filter(m => m.id !== 'copy_link').map(method => (
              <Button
                key={method.id}
                variant="outline"
                onClick={() => handleShare(method.id)}
                className="gap-2 justify-start"
              >
                <method.icon className="h-4 w-4" />
                {method.label}
              </Button>
            ))}
          </div>

          <div className="text-xs text-muted-foreground text-center pt-2">
            🎁 Gagnez des points à chaque partage !
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
