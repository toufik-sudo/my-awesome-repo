// -----------------------------------------------------------------------------
// ValidityPointsSelector Component
// Select points validity period for cube configuration
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Clock, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidityPointsSelectorProps {
  value: { value: string; label: string };
  onChange: (value: { value: string; label: string }) => void;
  autoRollover?: boolean;
  onRolloverChange?: (checked: boolean) => void;
}

const VALIDITY_OPTIONS = [
  { value: '3m', label: '3 Months' },
  { value: '6m', label: '6 Months' },
  { value: '1y', label: '1 Year' },
  { value: '2y', label: '2 Years' },
  { value: 'never', label: 'Never Expires' },
];

export const ValidityPointsSelector: React.FC<ValidityPointsSelectorProps> = ({
  value,
  onChange,
  autoRollover = false,
  onRolloverChange
}) => {
  const { formatMessage } = useIntl();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          <FormattedMessage id="launch.cube.validity" defaultMessage="Points Validity" />
        </CardTitle>
        <CardDescription>
          <FormattedMessage 
            id="launch.cube.validityDesc" 
            defaultMessage="How long are earned points valid before expiring?" 
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={value.value}
          onValueChange={(v) => {
            const option = VALIDITY_OPTIONS.find(o => o.value === v);
            if (option) {
              onChange({ value: option.value, label: option.label });
            }
          }}
          className="grid grid-cols-2 md:grid-cols-5 gap-3"
        >
          {VALIDITY_OPTIONS.map(option => (
            <Label
              key={option.value}
              className={cn(
                'flex flex-col items-center justify-center gap-1 p-4 border-2 rounded-lg cursor-pointer transition-all text-center min-h-[80px]',
                value.value === option.value 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted hover:border-primary/50'
              )}
            >
              <RadioGroupItem value={option.value} className="sr-only" />
              <span className="font-medium">{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
        
        {onRolloverChange && value.value !== 'never' && (
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-primary" />
              <div>
                <Label className="font-medium">
                  <FormattedMessage id="launch.cube.autoRollover" defaultMessage="Auto Rollover" />
                </Label>
                <p className="text-xs text-muted-foreground">
                  <FormattedMessage 
                    id="launch.cube.autoRolloverDesc" 
                    defaultMessage="Automatically extend expiring points to the next period" 
                  />
                </p>
              </div>
            </div>
            <Switch
              checked={autoRollover}
              onCheckedChange={onRolloverChange}
            />
          </div>
        )}
        
        {value.value !== 'never' && (
          <p className="text-xs text-muted-foreground">
            <FormattedMessage 
              id="launch.cube.validityHint" 
              defaultMessage="Points will expire {period} after they are earned. Users will be notified before expiration."
              values={{ period: value.label.toLowerCase() }}
            />
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ValidityPointsSelector;
