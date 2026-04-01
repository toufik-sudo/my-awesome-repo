import React, { useState, useMemo, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingUp, DollarSign, Percent, Info } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface FeeSimulatorProps {
  className?: string;
}

export const FeeSimulator: React.FC<FeeSimulatorProps> = memo(({ className }) => {
  const [bookingAmount, setBookingAmount] = useState(10000);
  const [nights, setNights] = useState(3);
  const [feeType, setFeeType] = useState<'percentage' | 'fixed' | 'percentage_plus_fixed'>('percentage');
  const [percentageRate, setPercentageRate] = useState(5);
  const [fixedAmount, setFixedAmount] = useState(500);

  const calculation = useMemo(() => {
    const subtotal = bookingAmount * nights;
    let fee = 0;
    switch (feeType) {
      case 'percentage':
        fee = Math.round(subtotal * (percentageRate / 100));
        break;
      case 'fixed':
        fee = fixedAmount;
        break;
      case 'percentage_plus_fixed':
        fee = Math.round(subtotal * (percentageRate / 100)) + fixedAmount;
        break;
    }
    const total = subtotal + fee;
    const hostRevenue = subtotal;
    const platformRevenue = fee;
    const effectiveRate = subtotal > 0 ? ((fee / subtotal) * 100).toFixed(2) : '0';

    return { subtotal, fee, total, hostRevenue, platformRevenue, effectiveRate };
  }, [bookingAmount, nights, feeType, percentageRate, fixedAmount]);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Simulateur de frais de service
          </CardTitle>
          <CardDescription>Estimez les frais et marges pour une réservation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm mb-2 block">Prix par nuit (DA)</Label>
              <Input
                type="number"
                value={bookingAmount}
                onChange={e => setBookingAmount(Number(e.target.value) || 0)}
                min={0}
              />
            </div>
            <div>
              <Label className="text-sm mb-2 block">Nombre de nuits</Label>
              <Input
                type="number"
                value={nights}
                onChange={e => setNights(Number(e.target.value) || 1)}
                min={1}
              />
            </div>
            <div>
              <Label className="text-sm mb-2 block">Type de calcul</Label>
              <Select value={feeType} onValueChange={v => setFeeType(v as typeof feeType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Pourcentage</SelectItem>
                  <SelectItem value="fixed">Montant fixe</SelectItem>
                  <SelectItem value="percentage_plus_fixed">% + Fixe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(feeType === 'percentage' || feeType === 'percentage_plus_fixed') && (
              <div>
                <Label className="text-sm mb-2 block">Taux (%)</Label>
                <Input
                  type="number"
                  value={percentageRate}
                  onChange={e => setPercentageRate(Number(e.target.value) || 0)}
                  min={0}
                  max={100}
                  step={0.5}
                />
              </div>
            )}
            {(feeType === 'fixed' || feeType === 'percentage_plus_fixed') && (
              <div>
                <Label className="text-sm mb-2 block">Montant fixe (DA)</Label>
                <Input
                  type="number"
                  value={fixedAmount}
                  onChange={e => setFixedAmount(Number(e.target.value) || 0)}
                  min={0}
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Results */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <GlassCard className="p-4 text-center">
              <DollarSign className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Sous-total</p>
              <p className="text-lg font-bold">{calculation.subtotal.toLocaleString()} DA</p>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <Percent className="h-5 w-5 text-accent mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Frais plateforme</p>
              <p className="text-lg font-bold text-accent">{calculation.fee.toLocaleString()} DA</p>
              <Badge variant="outline" className="text-[10px] mt-1">{calculation.effectiveRate}%</Badge>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <TrendingUp className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Revenu hôte</p>
              <p className="text-lg font-bold text-emerald-600">{calculation.hostRevenue.toLocaleString()} DA</p>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <DollarSign className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Total guest</p>
              <p className="text-lg font-bold">{calculation.total.toLocaleString()} DA</p>
            </GlassCard>
          </div>

          <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Le guest paie <strong>{calculation.total.toLocaleString()} DA</strong>. 
              L'hôte reçoit <strong>{calculation.hostRevenue.toLocaleString()} DA</strong>. 
              La plateforme perçoit <strong>{calculation.fee.toLocaleString()} DA</strong> ({calculation.effectiveRate}% effectif).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

FeeSimulator.displayName = 'FeeSimulator';
