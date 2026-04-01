import React from 'react';
import {
  CreditCard,
  Banknote,
  Smartphone,
  HandCoins,
  Percent,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export type PaymentMethodType =
  | 'visa_master'
  | 'dahabia'
  | 'algiers_bank'
  | 'postal_bank_transfer'
  | 'hand_to_hand'
  | 'baridi_mob'
  | 'ccp'
  | 'cib'
  | 'bank_transfer';

export interface PricingBreakdownProps {
  pricePerNight: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  weeklyDiscount?: number;
  monthlyDiscount?: number;
  customDiscount?: number;
  customDiscountMinNights?: number;
  acceptedPaymentMethods: PaymentMethodType[];
  currency: string;
}

const PAYMENT_METHOD_CONFIG: Record<PaymentMethodType, { 
  label: string; 
  icon: React.ComponentType<any>; 
  description: string;
}> = {
  visa_master: { 
    label: 'VISA / MasterCard', 
    icon: CreditCard, 
    description: 'International credit/debit cards' 
  },
  dahabia: { 
    label: 'Edahabia', 
    icon: Smartphone, 
    description: 'Algérie Poste electronic card' 
  },
  algiers_bank: { 
    label: 'CIB (Algiers Bank)', 
    icon: Banknote, 
    description: 'Inter-bank card payment' 
  },
  postal_bank_transfer: { 
    label: 'Postal / Bank Transfer', 
    icon: Banknote, 
    description: 'CCP, Baridi Mob, bank wire' 
  },
  hand_to_hand: { 
    label: 'Hand to Hand (Cash)', 
    icon: HandCoins, 
    description: 'Cash payment on arrival' 
  },
  baridi_mob: {
    label: 'Baridi Mob',
    icon: Smartphone,
    description: 'Mobile payment via Algérie Poste app'
  },
  ccp: {
    label: 'CCP',
    icon: Banknote,
    description: 'Compte CCP (Algérie Poste)'
  },
  cib: {
    label: 'CIB',
    icon: CreditCard,
    description: 'Carte Interbancaire (Algérie)'
  },
  bank_transfer: {
    label: 'Bank Transfer',
    icon: Banknote,
    description: 'Domestic or international bank transfer'
  },
};

export const PricingBreakdownSection: React.FC<PricingBreakdownProps> = ({
  pricePerNight,
  pricePerWeek,
  pricePerMonth,
  weeklyDiscount,
  monthlyDiscount,
  customDiscount,
  customDiscountMinNights,
  acceptedPaymentMethods,
  currency = 'DZD',
}) => {
  // Calculate effective weekly/monthly rates
  const standardWeeklyPrice = pricePerNight * 7;
  const standardMonthlyPrice = pricePerNight * 30;
  
  const effectiveWeeklyPrice = pricePerWeek || (weeklyDiscount ? standardWeeklyPrice * (1 - weeklyDiscount / 100) : standardWeeklyPrice);
  const effectiveMonthlyPrice = pricePerMonth || (monthlyDiscount ? standardMonthlyPrice * (1 - monthlyDiscount / 100) : standardMonthlyPrice);
  
  const weeklyNightlyRate = effectiveWeeklyPrice / 7;
  const monthlyNightlyRate = effectiveMonthlyPrice / 30;
  
  const weeklySavings = ((standardWeeklyPrice - effectiveWeeklyPrice) / standardWeeklyPrice) * 100;
  const monthlySavings = ((standardMonthlyPrice - effectiveMonthlyPrice) / standardMonthlyPrice) * 100;

  const hasHandToHand = acceptedPaymentMethods.includes('hand_to_hand');

  return (
    <div className="space-y-6">
      {/* Pricing Tiers */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Pricing Options</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose your stay duration for the best rates
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Nightly */}
            <div className="border border-border rounded-lg p-4 text-center">
              <h4 className="font-semibold text-foreground mb-2">Per Night</h4>
              <div className="text-2xl font-bold text-primary mb-1">
                {pricePerNight.toLocaleString()} {currency}
              </div>
              <p className="text-xs text-muted-foreground">Standard rate</p>
            </div>
            
            {/* Weekly */}
            <div className={cn(
              'border rounded-lg p-4 text-center relative',
              weeklySavings > 0 ? 'border-green-500/50 bg-green-50/50' : 'border-border'
            )}>
              <h4 className="font-semibold text-foreground mb-2">Per Week</h4>
              <div className="text-2xl font-bold text-primary mb-1">
                {weeklyNightlyRate.toFixed(0).toLocaleString()} {currency}
              </div>
              <p className="text-xs text-muted-foreground">/night (7+ nights)</p>
              {weeklySavings > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-green-600 text-green-50 text-[10px]">
                  {weeklySavings.toFixed(0)}% off
                </Badge>
              )}
            </div>
            
            {/* Monthly */}
            <div className={cn(
              'border rounded-lg p-4 text-center relative',
              monthlySavings > 0 ? 'border-green-500/50 bg-green-50/50' : 'border-border'
            )}>
              <h4 className="font-semibold text-foreground mb-2">Per Month</h4>
              <div className="text-2xl font-bold text-primary mb-1">
                {monthlyNightlyRate.toFixed(0).toLocaleString()} {currency}
              </div>
              <p className="text-xs text-muted-foreground">/night (28+ nights)</p>
              {monthlySavings > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-green-600 text-green-50 text-[10px]">
                  {monthlySavings.toFixed(0)}% off
                </Badge>
              )}
            </div>
          </div>

          {/* Custom Discount Info */}
          {customDiscount && customDiscountMinNights && (
            <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Percent className="h-4 w-4 text-accent" />
                <span className="font-medium text-foreground">
                  {customDiscount}% off for {customDiscountMinNights}+ night stays
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accepted Payment Methods */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Accepted Payment Methods</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose your preferred payment option during booking
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {acceptedPaymentMethods.map((method) => {
              const config = PAYMENT_METHOD_CONFIG[method];
              if (!config) return null;
              const Icon = config.icon;
              
              return (
                <div
                  key={method}
                  className={cn(
                    'flex items-center gap-3 p-3 border rounded-lg',
                    method === 'hand_to_hand' 
                      ? 'border-amber-500/30 bg-amber-50/50' 
                      : 'border-border bg-muted/20'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-md flex items-center justify-center',
                    method === 'hand_to_hand' 
                      ? 'bg-amber-500/20' 
                      : 'bg-primary/10'
                  )}>
                    <Icon className={cn(
                      'h-4 w-4',
                      method === 'hand_to_hand' 
                        ? 'text-amber-600' 
                        : 'text-primary'
                    )} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {config.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {config.description}
                    </p>
                  </div>
                  {method === 'hand_to_hand' && (
                    <Badge variant="outline" className="text-amber-600 border-amber-600 text-[10px]">
                      Special rules
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>

          {/* Hand-to-Hand Warning */}
          {hasHandToHand && (
            <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-amber-800">Hand-to-Hand Payment Notice</h4>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <strong>Service fee split:</strong> Both client and host pay 2.5% each via online methods. 
                    <strong className="block mt-1">Client responsibility:</strong> You assume full responsibility for cash transactions. 
                    The platform cannot guarantee security of hand-to-hand payments.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingBreakdownSection;