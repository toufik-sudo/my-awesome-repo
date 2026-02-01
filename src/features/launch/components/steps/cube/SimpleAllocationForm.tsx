// -----------------------------------------------------------------------------
// SimpleAllocationForm Component
// Fixed points per unit allocation form
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimpleAllocationFormProps {
  goalIndex: number;
  measurementType: number | null;
  measurementName: string | null;
  programType: string;
  value: { min: string; max: string; value: string };
  onChange: (values: { min: string; max: string; value: string }) => void;
  disabled?: boolean;
}

export const SimpleAllocationForm: React.FC<SimpleAllocationFormProps> = ({
  goalIndex,
  measurementType,
  measurementName,
  programType,
  value,
  onChange,
  disabled = false,
}) => {
  const { formatMessage } = useIntl();
  
  const unitLabel = measurementName === 'revenue' || measurementType === 2
    ? formatMessage({ id: 'launch.cube.perEuro', defaultMessage: 'per euro' })
    : formatMessage({ id: 'launch.cube.perUnit', defaultMessage: 'per unit' });

  const handleChange = (field: 'min' | 'max' | 'value', val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <Card className={cn(disabled && 'opacity-60')}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-4 w-4 text-primary" />
          <FormattedMessage id="launch.cube.simpleAllocation" defaultMessage="Simple Allocation" />
        </CardTitle>
        <CardDescription>
          <FormattedMessage 
            id="launch.cube.simpleAllocationDesc" 
            defaultMessage="Set fixed points earned per unit of performance" 
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>
            <FormattedMessage id="launch.cube.pointsPerUnit" defaultMessage="Points {unit}" values={{ unit: unitLabel }} />
          </Label>
          <Input
            type="number"
            value={value.value}
            onChange={(e) => handleChange('value', e.target.value)}
            placeholder={formatMessage({ id: 'launch.cube.pointsPlaceholder', defaultMessage: 'e.g., 100' })}
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label>
            <FormattedMessage id="launch.cube.minThreshold" defaultMessage="Minimum Threshold" />
          </Label>
          <Input
            type="number"
            value={value.min}
            onChange={(e) => handleChange('min', e.target.value)}
            placeholder={formatMessage({ id: 'launch.cube.optional', defaultMessage: 'Optional' })}
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label>
            <FormattedMessage id="launch.cube.maxThreshold" defaultMessage="Maximum Cap" />
          </Label>
          <Input
            type="number"
            value={value.max}
            onChange={(e) => handleChange('max', e.target.value)}
            placeholder={formatMessage({ id: 'launch.cube.optional', defaultMessage: 'Optional' })}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleAllocationForm;
