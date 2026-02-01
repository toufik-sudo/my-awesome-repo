// -----------------------------------------------------------------------------
// SpendTypeSelector Component
// Select spend type (points or currency) for cube configuration
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Coins, DollarSign, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpendTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SPEND_TYPE_OPTIONS = [
  { 
    value: 'points', 
    label: 'Points',
    description: 'Virtual reward points',
    icon: Coins
  },
  { 
    value: 'currency', 
    label: 'Currency',
    description: 'Real monetary value',
    icon: DollarSign
  },
  { 
    value: 'gifts', 
    label: 'Gifts',
    description: 'Physical or digital gifts',
    icon: Gift
  },
];

export const SpendTypeSelector: React.FC<SpendTypeSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5 text-primary" />
          <FormattedMessage id="launch.cube.spendType" defaultMessage="Reward Type" />
        </CardTitle>
        <CardDescription>
          <FormattedMessage 
            id="launch.cube.spendTypeDesc" 
            defaultMessage="What type of rewards will participants receive?" 
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={value}
          onValueChange={onChange}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {SPEND_TYPE_OPTIONS.map(option => {
            const Icon = option.icon;
            return (
              <Label
                key={option.value}
                className={cn(
                  'flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all',
                  value === option.value 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted hover:border-primary/50'
                )}
              >
                <RadioGroupItem value={option.value} className="sr-only" />
                <Icon className="h-8 w-8 text-primary" />
                <div>
                  <span className="font-medium block">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default SpendTypeSelector;
