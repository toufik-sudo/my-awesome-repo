import React, { useState, useEffect, memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { rewardsApi, REWARD_TYPE_LABELS, REWARD_CATEGORIES, type Reward, type RewardType } from '@/modules/rewards/rewards.api';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reward?: Reward | null;
  onSuccess: () => void;
}

const ICONS = ['🏷️', '⬆️', '🎁', '🌙', '💰', '🎀', '💵', '🥐', '👑', '🎉', '⭐', '🏆'];

export const RewardFormDialog: React.FC<Props> = memo(({ open, onOpenChange, reward, onSuccess }) => {
  const isEdit = !!reward;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<Reward>>({});

  useEffect(() => {
    if (open) {
      setForm({
        name: reward?.name || '',
        description: reward?.description || '',
        type: reward?.type || 'discount',
        pointsCost: reward?.pointsCost || 100,
        discountPercent: reward?.discountPercent || 0,
        discountAmount: reward?.discountAmount || 0,
        currency: reward?.currency || 'DZD',
        icon: reward?.icon || '🎁',
        imageUrl: reward?.imageUrl || '',
        requiredTier: reward?.requiredTier || undefined,
        maxRedemptions: reward?.maxRedemptions || undefined,
        maxPerUser: reward?.maxPerUser || undefined,
        validFrom: reward?.validFrom || undefined,
        validTo: reward?.validTo || undefined,
        status: reward?.status || 'active',
        category: reward?.category || 'general',
        sortOrder: reward?.sortOrder || 100,
      });
    }
  }, [open, reward]);

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.name?.trim()) {
      toast.error('Le nom est requis');
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await rewardsApi.update(reward!.id, form);
        toast.success('Récompense mise à jour');
      } else {
        await rewardsApi.create(form);
        toast.success('Récompense créée');
      }
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const showDiscount = form.type === 'discount' || form.type === 'cashback';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier la récompense' : 'Nouvelle récompense'}</DialogTitle>
          <DialogDescription>Configurez les détails de la récompense</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name + Icon */}
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <div>
              <Label className="text-sm">Nom</Label>
              <Input value={form.name || ''} onChange={e => update('name', e.target.value)} placeholder="Nom de la récompense" />
            </div>
            <div>
              <Label className="text-sm">Icône</Label>
              <Select value={form.icon} onValueChange={v => update('icon', v)}>
                <SelectTrigger className="w-16"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ICONS.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Type + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Type</Label>
              <Select value={form.type} onValueChange={v => update('type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(REWARD_TYPE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.icon} {v.fr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Catégorie</Label>
              <Select value={form.category} onValueChange={v => update('category', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(REWARD_CATEGORIES).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.fr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Points Cost + Tier */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Coût en points</Label>
              <Input type="number" value={form.pointsCost ?? ''} onChange={e => update('pointsCost', Number(e.target.value))} min={1} />
            </div>
            <div>
              <Label className="text-sm">Tier requis</Label>
              <Select value={form.requiredTier || 'none'} onValueChange={v => update('requiredTier', v === 'none' ? undefined : v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="diamond">Diamond</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Discount fields */}
          {showDiscount && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-sm">Réduction (%)</Label>
                <Input type="number" value={form.discountPercent ?? ''} onChange={e => update('discountPercent', Number(e.target.value))} min={0} max={100} />
              </div>
              <div>
                <Label className="text-sm">Montant fixe</Label>
                <Input type="number" value={form.discountAmount ?? ''} onChange={e => update('discountAmount', Number(e.target.value))} min={0} />
              </div>
              <div>
                <Label className="text-sm">Devise</Label>
                <Select value={form.currency} onValueChange={v => update('currency', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DZD">DZD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Limits */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-sm">Max échanges</Label>
              <Input type="number" value={form.maxRedemptions || ''} onChange={e => update('maxRedemptions', Number(e.target.value) || undefined)} placeholder="Illimité" />
            </div>
            <div>
              <Label className="text-sm">Max/utilisateur</Label>
              <Input type="number" value={form.maxPerUser || ''} onChange={e => update('maxPerUser', Number(e.target.value) || undefined)} placeholder="Illimité" />
            </div>
            <div>
              <Label className="text-sm">Ordre d'affichage</Label>
              <Input type="number" value={form.sortOrder ?? 100} onChange={e => update('sortOrder', Number(e.target.value))} />
            </div>
          </div>

          {/* Validity Period */}
          <div>
            <Label className="text-sm">Période de validité</Label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal", !form.validFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.validFrom ? format(new Date(form.validFrom), 'dd/MM/yyyy') : 'Date début'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={form.validFrom ? new Date(form.validFrom) : undefined}
                    onSelect={d => update('validFrom', d ? d.toISOString().split('T')[0] : undefined)}
                    className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal", !form.validTo && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.validTo ? format(new Date(form.validTo), 'dd/MM/yyyy') : 'Date fin'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={form.validTo ? new Date(form.validTo) : undefined}
                    onSelect={d => update('validTo', d ? d.toISOString().split('T')[0] : undefined)}
                    className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm">Description</Label>
            <Textarea value={form.description || ''} onChange={e => update('description', e.target.value)} rows={2} />
          </div>

          {/* Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={form.status === 'active'} onCheckedChange={v => update('status', v ? 'active' : 'paused')} />
              <Label className="text-sm">Actif</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

RewardFormDialog.displayName = 'RewardFormDialog';
