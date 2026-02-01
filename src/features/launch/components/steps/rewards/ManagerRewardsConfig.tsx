// -----------------------------------------------------------------------------
// ManagerRewardsConfig Component
// Configuration for manager/people manager rewards
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Users, Award } from 'lucide-react';

interface ManagerRewardsConfigProps {
  enabled: boolean;
  percentage: number;
  onEnabledChange: (enabled: boolean) => void;
  onPercentageChange: (percentage: number) => void;
}

export const ManagerRewardsConfig: React.FC<ManagerRewardsConfigProps> = ({
  enabled,
  percentage,
  onEnabledChange,
  onPercentageChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          <FormattedMessage id="launch.rewards.managers" defaultMessage="Manager Rewards" />
        </CardTitle>
        <CardDescription>
          <FormattedMessage 
            id="launch.rewards.managersDesc" 
            defaultMessage="Reward people managers based on their team's performance" 
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">
              <FormattedMessage id="launch.rewards.enableManagerRewards" defaultMessage="Enable Manager Rewards" />
            </Label>
            <p className="text-sm text-muted-foreground">
              <FormattedMessage 
                id="launch.rewards.enableManagerRewardsDesc" 
                defaultMessage="Managers earn a percentage of their team's rewards" 
              />
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={onEnabledChange}
          />
        </div>

        {/* Percentage Slider */}
        {enabled && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <FormattedMessage id="launch.rewards.managerPercentage" defaultMessage="Manager Percentage" />
              </Label>
              <span className="text-lg font-bold text-primary">{percentage}%</span>
            </div>
            
            <Slider
              value={[percentage]}
              onValueChange={([value]) => onPercentageChange(value)}
              min={1}
              max={25}
              step={1}
              className="w-full"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1%</span>
              <span>25%</span>
            </div>

            {/* Example calculation */}
            <div className="p-3 bg-background rounded border">
              <p className="text-sm font-medium mb-1">
                <FormattedMessage id="launch.rewards.example" defaultMessage="Example" />
              </p>
              <p className="text-xs text-muted-foreground">
                <FormattedMessage 
                  id="launch.rewards.managerExample" 
                  defaultMessage="If a team member earns 1,000 points, their manager receives {points} bonus points."
                  values={{ points: Math.round(1000 * percentage / 100) }}
                />
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ManagerRewardsConfig;
