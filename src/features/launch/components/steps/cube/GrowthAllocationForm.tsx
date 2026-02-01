// -----------------------------------------------------------------------------
// GrowthAllocationForm Component
// Growth-based allocation form (percentage increase over baseline)
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GrowthAllocationFormProps {
  goalIndex: number;
  measurementType: number | null;
  measurementName: string | null;
  programType: string;
  value: { min: string; max: string; value: string };
  onChange: (values: { min: string; max: string; value: string }) => void;
  disabled?: boolean;
}

const BASELINE_PERIODS = [
  { value: 'previous_month', label: 'Previous Month' },
  { value: 'previous_quarter', label: 'Previous Quarter' },
  { value: 'previous_year', label: 'Previous Year' },
];

export const GrowthAllocationForm: React.FC<GrowthAllocationFormProps> = ({
  goalIndex,
  measurementType,
  measurementName,
  programType,
  value,
  onChange,
  disabled = false,
}) => {
  const { formatMessage } = useIntl();
  const [baselinePeriod, setBaselinePeriod] = useState('previous_month');

  const handleChange = (field: 'min' | 'max' | 'value', val: string) => {
    onChange({ ...value, [field]: val });
  };

  // Parse value as growth config
  // value.value = points per percent
  // value.min = minimum growth percentage
  // value.max = baseline value

  return (
    <Card className={cn(disabled && 'opacity-60')}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4 text-primary" />
          <FormattedMessage id="launch.cube.growthAllocation" defaultMessage="Growth Allocation" />
        </CardTitle>
        <CardDescription>
          <FormattedMessage 
            id="launch.cube.growthAllocationDesc" 
            defaultMessage="Reward based on growth compared to a baseline period" 
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>
              <FormattedMessage id="launch.cube.baselinePeriod" defaultMessage="Baseline Period" />
            </Label>
            <Select value={baselinePeriod} onValueChange={setBaselinePeriod} disabled={disabled}>
              <SelectTrigger>
                <SelectValue placeholder={formatMessage({ id: 'launch.cube.selectPeriod', defaultMessage: 'Select period' })} />
              </SelectTrigger>
              <SelectContent>
                {BASELINE_PERIODS.map(period => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>
              <FormattedMessage id="launch.cube.baselineValue" defaultMessage="Baseline Value" />
            </Label>
            <Input
              type="number"
              value={value.max}
              onChange={(e) => handleChange('max', e.target.value)}
              placeholder={formatMessage({ id: 'launch.cube.baselinePlaceholder', defaultMessage: 'Reference value' })}
              disabled={disabled}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>
              <FormattedMessage id="launch.cube.minGrowth" defaultMessage="Minimum Growth %" />
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={value.min}
                onChange={(e) => handleChange('min', e.target.value)}
                placeholder="5"
                className="pr-8"
                disabled={disabled}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              <FormattedMessage 
                id="launch.cube.minGrowthHint" 
                defaultMessage="Minimum growth required to earn rewards" 
              />
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>
              <FormattedMessage id="launch.cube.pointsPerPercent" defaultMessage="Points per % Growth" />
            </Label>
            <Input
              type="number"
              value={value.value}
              onChange={(e) => handleChange('value', e.target.value)}
              placeholder="100"
              disabled={disabled}
            />
            <p className="text-xs text-muted-foreground">
              <FormattedMessage 
                id="launch.cube.pointsPerPercentHint" 
                defaultMessage="Points earned for each percentage of growth" 
              />
            </p>
          </div>
        </div>
        
        {/* Example calculation */}
        {value.max && value.min && value.value && (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm font-medium mb-2">
              <FormattedMessage id="launch.cube.exampleCalculation" defaultMessage="Example Calculation" />
            </p>
            <p className="text-sm text-muted-foreground">
              <FormattedMessage 
                id="launch.cube.growthExample" 
                defaultMessage="If performance grows by {growth}% from baseline {baseline}, participant earns {points} points."
                values={{
                  baseline: value.max,
                  growth: value.min,
                  points: Math.round(parseFloat(value.min) * parseFloat(value.value))
                }}
              />
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GrowthAllocationForm;
