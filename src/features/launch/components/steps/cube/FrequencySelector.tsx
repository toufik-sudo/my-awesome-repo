// -----------------------------------------------------------------------------
// FrequencySelector Component
// Select reward frequency for cube configuration
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FREQUENCY_TYPE } from '@/constants/wall/launch';

interface FrequencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabledOptions?: string[];
}

const FREQUENCY_OPTIONS = [
  { 
    value: FREQUENCY_TYPE.INSTANTANEOUSLY, 
    label: 'Instantaneous',
    description: 'Rewards credited immediately',
    icon: Zap
  },
  { 
    value: FREQUENCY_TYPE.WEEKLY, 
    label: 'Weekly',
    description: 'Calculated every week',
    icon: Calendar
  },
  { 
    value: FREQUENCY_TYPE.MONTHLY, 
    label: 'Monthly',
    description: 'Calculated monthly',
    icon: Calendar
  },
  { 
    value: FREQUENCY_TYPE.QUARTER, 
    label: 'Quarterly',
    description: 'Calculated every quarter',
    icon: Clock
  },
];

export const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  value,
  onChange,
  disabledOptions = []
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          <FormattedMessage id="launch.cube.frequency" defaultMessage="Reward Frequency" />
        </CardTitle>
        <CardDescription>
          <FormattedMessage 
            id="launch.cube.frequencyDesc" 
            defaultMessage="How often should rewards be calculated and distributed?" 
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={value}
          onValueChange={onChange}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {FREQUENCY_OPTIONS.map(option => {
            const Icon = option.icon;
            const isDisabled = disabledOptions.includes(option.value);
            
            return (
              <Label
                key={option.value}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all text-center',
                  isDisabled 
                    ? 'cursor-not-allowed opacity-50 border-muted' 
                    : 'cursor-pointer hover:border-primary/50',
                  value === option.value && !isDisabled
                    ? 'border-primary bg-primary/5'
                    : 'border-muted'
                )}
              >
                <RadioGroupItem 
                  value={option.value} 
                  className="sr-only" 
                  disabled={isDisabled}
                />
                <Icon className="h-6 w-6 text-primary" />
                <span className="font-medium text-sm">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.description}</span>
              </Label>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default FrequencySelector;
