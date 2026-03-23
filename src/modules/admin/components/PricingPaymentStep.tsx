import React, { useCallback, useRef } from 'react';
import {
  CreditCard,
  Banknote,
  Upload,
  AlertTriangle,
  Percent,
  X,
  HandCoins,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type PaymentMethodType =
  | 'visa_master'
  | 'dahabia'
  | 'algiers_bank'
  | 'postal_bank_transfer'
  | 'hand_to_hand';

export interface PricingData {
  pricePerNight: string;
  pricePerWeek: string;
  pricePerMonth: string;
  weeklyDiscount: string;
  monthlyDiscount: string;
  customDiscount: string;
  customDiscountMinNights: string;
  currency: string;
  paymentMethods: PaymentMethodType[];
  paymentProofFiles: { id: string; file: File; preview: string }[];
  serviceFeePercent: number;
}

export const INITIAL_PRICING_DATA: PricingData = {
  pricePerNight: '',
  pricePerWeek: '',
  pricePerMonth: '',
  weeklyDiscount: '',
  monthlyDiscount: '',
  customDiscount: '',
  customDiscountMinNights: '',
  currency: 'DZD',
  paymentMethods: [],
  paymentProofFiles: [],
  serviceFeePercent: 5,
};

const PAYMENT_METHODS: {
  value: PaymentMethodType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: 'visa_master',
    label: 'Credit Card (VISA / MasterCard)',
    description: 'Accept international credit and debit cards',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    value: 'dahabia',
    label: 'Edahabia Card',
    description: 'Algérie Poste electronic payment card',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    value: 'algiers_bank',
    label: 'CIB (Algiers Bank)',
    description: 'Inter-bank card payment via CIB network',
    icon: <Banknote className="h-5 w-5" />,
  },
  {
    value: 'postal_bank_transfer',
    label: 'Postal / Bank Transfer',
    description: 'CCP, Baridi Mob, or bank wire — client uploads proof of payment',
    icon: <Banknote className="h-5 w-5" />,
  },
  {
    value: 'hand_to_hand',
    label: 'Hand to Hand (Cash)',
    description: 'Cash payment on arrival — special service fee rules apply',
    icon: <HandCoins className="h-5 w-5" />,
  },
];

// Platform payment account info displayed when postal/bank transfer is selected
const PLATFORM_ACCOUNTS = [
  { label: 'CCP Account', value: '00799999 00 clé 42' },
  { label: 'Baridi Mob', value: '00799999 0000000042' },
  { label: 'Bank (BNA)', value: 'RIB: 007 00100 3000000042 88' },
];

interface PricingPaymentStepProps {
  data: PricingData;
  onChange: (data: PricingData) => void;
  disabled?: boolean;
}

export const PricingPaymentStep: React.FC<PricingPaymentStepProps> = ({
  data,
  onChange,
  disabled,
}) => {
  const proofInputRef = useRef<HTMLInputElement>(null);

  const update = useCallback(
    <K extends keyof PricingData>(key: K, value: PricingData[K]) => {
      onChange({ ...data, [key]: value });
    },
    [data, onChange]
  );

  const togglePayment = useCallback(
    (method: PaymentMethodType) => {
      const current = data.paymentMethods;
      const next = current.includes(method)
        ? current.filter((m) => m !== method)
        : [...current, method];
      update('paymentMethods', next);
    },
    [data.paymentMethods, update]
  );

  const handleProofUpload = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const newFiles = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      }));
      update('paymentProofFiles', [...data.paymentProofFiles, ...newFiles]);
    },
    [data.paymentProofFiles, update]
  );

  const removeProof = useCallback(
    (id: string) => {
      const file = data.paymentProofFiles.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      update(
        'paymentProofFiles',
        data.paymentProofFiles.filter((f) => f.id !== id)
      );
    },
    [data.paymentProofFiles, update]
  );

  const isHandToHand = data.paymentMethods.includes('hand_to_hand');
  const isPostalBank = data.paymentMethods.includes('postal_bank_transfer');

  // Auto-calculate weekly/monthly from nightly if empty
  const nightPrice = parseFloat(data.pricePerNight) || 0;
  const weekPlaceholder = nightPrice ? `${(nightPrice * 7 * 0.9).toFixed(0)} (10% off)` : '7 nights price';
  const monthPlaceholder = nightPrice ? `${(nightPrice * 30 * 0.75).toFixed(0)} (25% off)` : '30 nights price';

  return (
    <div className="space-y-6">
      {/* Pricing Tiers */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            Pricing
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Set your prices per night, week, and month. Weekly and monthly prices are optional — if left empty, they'll be calculated from the nightly rate.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Price per Night (DZD) *</Label>
              <Input
                type="number"
                value={data.pricePerNight}
                onChange={(e) => update('pricePerNight', e.target.value)}
                placeholder="5000"
                min={0}
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Price per Week (DZD)</Label>
              <Input
                type="number"
                value={data.pricePerWeek}
                onChange={(e) => update('pricePerWeek', e.target.value)}
                placeholder={weekPlaceholder}
                min={0}
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Price per Month (DZD)</Label>
              <Input
                type="number"
                value={data.pricePerMonth}
                onChange={(e) => update('pricePerMonth', e.target.value)}
                placeholder={monthPlaceholder}
                min={0}
                disabled={disabled}
              />
            </div>
          </div>

          <Separator />

          {/* Discounts */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Percent className="h-4 w-4 text-primary" />
              Discounts (Optional)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Weekly Discount (%)</Label>
                <Input
                  type="number"
                  value={data.weeklyDiscount}
                  onChange={(e) => update('weeklyDiscount', e.target.value)}
                  placeholder="e.g. 10"
                  min={0}
                  max={90}
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Monthly Discount (%)</Label>
                <Input
                  type="number"
                  value={data.monthlyDiscount}
                  onChange={(e) => update('monthlyDiscount', e.target.value)}
                  placeholder="e.g. 25"
                  min={0}
                  max={90}
                  disabled={disabled}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Custom Discount (%)</Label>
                <Input
                  type="number"
                  value={data.customDiscount}
                  onChange={(e) => update('customDiscount', e.target.value)}
                  placeholder="e.g. 15"
                  min={0}
                  max={90}
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Min Nights for Custom Discount</Label>
                <Input
                  type="number"
                  value={data.customDiscountMinNights}
                  onChange={(e) => update('customDiscountMinNights', e.target.value)}
                  placeholder="e.g. 3"
                  min={1}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Accepted Payment Methods *
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select which payment methods you accept. You must choose at least one.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {PAYMENT_METHODS.map((method) => {
            const isSelected = data.paymentMethods.includes(method.value);
            return (
              <div
                key={method.value}
                className={cn(
                  'border rounded-lg p-4 cursor-pointer transition-all',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/30'
                )}
                onClick={() => !disabled && togglePayment(method.value)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => togglePayment(method.value)}
                    disabled={disabled}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{method.icon}</span>
                      <span className="text-sm font-medium text-foreground">{method.label}</span>
                      {method.value === 'hand_to_hand' && (
                        <Badge variant="outline" className="text-[10px] text-accent border-accent">
                          Special rules
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Postal / Bank Transfer — Account Info */}
      {isPostalBank && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-foreground text-base">
              Payment Account Information
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              These are the platform accounts that clients will use to send payments. The client uploads proof of payment after transfer.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {PLATFORM_ACCOUNTS.map((acc) => (
              <div
                key={acc.label}
                className="flex items-center justify-between border border-border rounded-md p-3 bg-card"
              >
                <span className="text-sm font-medium text-foreground">{acc.label}</span>
                <code className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                  {acc.value}
                </code>
              </div>
            ))}
            <p className="text-xs text-muted-foreground italic">
              The client will be required to upload a proof of payment (receipt screenshot or transfer confirmation) before the booking is confirmed.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Hand to Hand — Warning & Fee Split */}
      {isHandToHand && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Hand-to-Hand Payment — Important Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Fee split explanation */}
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Service Fee Split</h4>
              <p className="text-sm text-muted-foreground">
                For hand-to-hand (cash) payments, the platform service fee ({data.serviceFeePercent}%) is
                <strong className="text-foreground"> divided equally</strong> between the client and the property owner:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-border rounded-md p-3 text-center bg-muted/30">
                  <p className="text-xs text-muted-foreground">Client pays</p>
                  <p className="text-lg font-bold text-foreground">{(data.serviceFeePercent / 2).toFixed(1)}%</p>
                  <p className="text-[10px] text-muted-foreground">via online payment method</p>
                </div>
                <div className="border border-border rounded-md p-3 text-center bg-muted/30">
                  <p className="text-xs text-muted-foreground">Owner pays</p>
                  <p className="text-lg font-bold text-foreground">{(data.serviceFeePercent / 2).toFixed(1)}%</p>
                  <p className="text-[10px] text-muted-foreground">via online payment method</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Each party must pay their share of the service fee using one of the other accepted payment methods
                (VISA/Master, Edahabia, CIB, or postal/bank transfer). Cash is <strong>not accepted</strong> for the service fee.
              </p>
            </div>

            {/* Warning */}
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-destructive">Client Responsibility Warning</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By choosing hand-to-hand payment, the <strong className="text-foreground">client assumes full responsibility</strong> for any issues 
                    that may arise during the transaction. The platform cannot guarantee the security of cash payments 
                    and will not be held liable for disputes related to hand-to-hand transactions. 
                    We strongly recommend using secure online payment methods for your protection.
                  </p>
                  <p className="text-xs text-destructive font-medium">
                    ⚠ This warning will be displayed to clients at booking time.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PricingPaymentStep;
