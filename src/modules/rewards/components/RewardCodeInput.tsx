import React, { useState, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Tag, X, CheckCircle2, Gift } from 'lucide-react';
import { rewardsApi, type RewardRedemption } from '@/modules/rewards/rewards.api';

interface RewardCodeInputProps {
  bookingId?: string;
  referenceType?: 'booking' | 'service_booking';
  onDiscountApplied: (discount: { percent: number; amount: number; code: string; redemptionId: string }) => void;
  onDiscountRemoved: () => void;
}

export const RewardCodeInput: React.FC<RewardCodeInputProps> = memo(({
  bookingId,
  referenceType = 'booking',
  onDiscountApplied,
  onDiscountRemoved,
}) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appliedRedemption, setAppliedRedemption] = useState<RewardRedemption | null>(null);

  const handleApply = useCallback(async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');

    try {
      const redemption = await rewardsApi.useRedemption(code.trim().toUpperCase(), {
        referenceId: bookingId,
        referenceType,
      });
      setAppliedRedemption(redemption);
      onDiscountApplied({
        percent: redemption.reward?.discountPercent || 0,
        amount: redemption.reward?.discountAmount || 0,
        code: code.trim().toUpperCase(),
        redemptionId: redemption.id,
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || t('rewards.invalidCode', 'Code invalide ou expiré');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [code, bookingId, referenceType, onDiscountApplied, t]);

  const handleRemove = useCallback(() => {
    setAppliedRedemption(null);
    setCode('');
    setError('');
    onDiscountRemoved();
  }, [onDiscountRemoved]);

  if (appliedRedemption) {
    return (
      <Card className="bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  {t('rewards.codeApplied', 'Code appliqué')}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  {appliedRedemption.reward?.name || appliedRedemption.code}
                  {appliedRedemption.reward?.discountPercent ? ` (-${appliedRedemption.reward.discountPercent}%)` : ''}
                  {appliedRedemption.reward?.discountAmount ? ` (-${appliedRedemption.reward.discountAmount} DA)` : ''}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRemove}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
        <Gift className="h-3.5 w-3.5" />
        {t('rewards.promoCode', 'Code de récompense')}
      </Label>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
          placeholder="RWD-XXXXXXXX"
          className="flex-1 font-mono text-sm"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleApply}
          disabled={!code.trim() || loading}
          className="gap-1.5"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Tag className="h-3.5 w-3.5" />}
          {t('rewards.apply', 'Appliquer')}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
});

RewardCodeInput.displayName = 'RewardCodeInput';
