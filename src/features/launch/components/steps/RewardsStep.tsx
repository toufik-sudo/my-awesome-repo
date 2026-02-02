// -----------------------------------------------------------------------------
// RewardsStep Component
// Rewards configuration step: Configure allocation, frequency, and reward rules
// Integrated with Redux store and Allocation Types API
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Gift, 
  Calendar, 
  Users, 
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Award,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLaunchWizard } from '../../hooks/useLaunchWizard';
import { useAllocationTypes } from '@/api/hooks/useLaunchApi';
import {
  SIMPLE,
  BRACKET,
  GROWTH,
  RANKING,
  FREQUENCY_TYPE,
  CUBE
} from '@/constants/wall/launch';

type AllocationType = 'fixed' | 'variable' | 'tiered';
type FrequencyType = 'instantaneously' | 'weekly' | 'monthly' | 'quarter';
type SpendType = 'points' | 'currency';

interface RewardsConfig {
  allocationType: AllocationType;
  frequency: FrequencyType;
  spendType: SpendType;
  minAllocation: number;
  maxAllocation: number;
  fixedValue: number;
  rewardManagers: boolean;
  managerPercentage: number;
  validityPeriod: string;
  autoRollover: boolean;
}

const VALIDITY_OPTIONS = [
  { value: '3m', label: '3 Months' },
  { value: '6m', label: '6 Months' },
  { value: '1y', label: '1 Year' },
  { value: '2y', label: '2 Years' },
  { value: 'never', label: 'Never Expires' },
];

const FREQUENCY_OPTIONS = [
  { value: FREQUENCY_TYPE.INSTANTANEOUSLY, label: 'Instantaneously' },
  { value: FREQUENCY_TYPE.WEEKLY, label: 'Weekly' },
  { value: FREQUENCY_TYPE.MONTHLY, label: 'Monthly' },
  { value: FREQUENCY_TYPE.QUARTER, label: 'Quarterly' },
];

const RewardsStep: React.FC = () => {
  const { formatMessage } = useIntl();
  const { updateStepData, updateMultipleData, launchData } = useLaunchWizard();
  
  const platformId = (launchData.platform as { id?: number })?.id || (launchData.platformId as number);
  const programType = launchData.type as number;
  
  // Fetch allocation types from API
  const { data: allocationTypes, isLoading: allocationLoading } = useAllocationTypes(platformId, programType);
  
  // Get config from store or use defaults
  const cube = launchData[CUBE] as Partial<RewardsConfig> | undefined;
  
  const [config, setConfig] = useState<RewardsConfig>({
    allocationType: (launchData.allocationType as AllocationType) || 'fixed',
    frequency: (cube?.frequency as FrequencyType) || (launchData.frequencyAllocation as FrequencyType) || FREQUENCY_TYPE.MONTHLY,
    spendType: (cube?.spendType as SpendType) || (launchData.spendType as SpendType) || 'points',
    minAllocation: (launchData.minAllocation as number) || 0,
    maxAllocation: (launchData.maxAllocation as number) || 1000,
    fixedValue: (launchData.fixedValue as number) || 500,
    rewardManagers: (cube?.rewardManagers as boolean) || (launchData.rewardManagers as boolean) || false,
    managerPercentage: (cube?.managerPercentage as number) || (launchData.managerPercentage as number) || 10,
    validityPeriod: (cube?.validityPeriod as string) || (launchData.validityPeriod as string) || '1y',
    autoRollover: (launchData.autoRollover as boolean) || false,
  });
  
  // Sync config to store on change
  useEffect(() => {
    const updates: Record<string, unknown> = {
      allocationType: config.allocationType,
      frequencyAllocation: config.frequency,
      spendType: config.spendType,
      minAllocation: config.minAllocation,
      maxAllocation: config.maxAllocation,
      fixedValue: config.fixedValue,
      rewardManagers: config.rewardManagers,
      managerPercentage: config.managerPercentage,
      validityPeriod: config.validityPeriod,
      autoRollover: config.autoRollover,
    };
    
    // Update cube object as well for consistency
    updateStepData(CUBE, {
      ...cube,
      frequencyAllocation: config.frequency,
      spendType: config.spendType,
      rewardPeopleManagers: config.rewardManagers,
      rewardPeopleManagerAccepted: config.rewardManagers,
      validityPoints: { value: config.validityPeriod, label: config.validityPeriod },
    });
    
    Object.entries(updates).forEach(([key, value]) => {
      updateStepData(key, value);
    });
  }, [config]);
  
  const updateConfig = (key: keyof RewardsConfig, value: unknown) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          <FormattedMessage 
            id="launch.step.rewards.title" 
            defaultMessage="Configure Rewards" 
          />
        </h2>
        <p className="text-muted-foreground">
          <FormattedMessage 
            id="launch.step.rewards.description" 
            defaultMessage="Set up how rewards are allocated and distributed" 
          />
        </p>
      </div>
      
      <div className="grid gap-6">
        {/* Allocation Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-primary" />
              <FormattedMessage id="launch.rewards.allocationType" defaultMessage="Allocation Type" />
            </CardTitle>
            <CardDescription>
              <FormattedMessage id="launch.rewards.allocationTypeDesc" defaultMessage="How should rewards be distributed?" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allocationLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : (
              <RadioGroup
                value={config.allocationType}
                onValueChange={(value) => updateConfig('allocationType', value as AllocationType)}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <Label
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all',
                    config.allocationType === 'fixed' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                  )}
                >
                  <RadioGroupItem value="fixed" className="sr-only" />
                  <DollarSign className="h-8 w-8 text-primary" />
                  <span className="font-medium">Fixed</span>
                  <span className="text-xs text-muted-foreground text-center">Same amount for everyone</span>
                </Label>
                
                <Label
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all',
                    config.allocationType === 'variable' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                  )}
                >
                  <RadioGroupItem value="variable" className="sr-only" />
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <span className="font-medium">Variable</span>
                  <span className="text-xs text-muted-foreground text-center">Based on performance</span>
                </Label>
                
                <Label
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all',
                    config.allocationType === 'tiered' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                  )}
                >
                  <RadioGroupItem value="tiered" className="sr-only" />
                  <Award className="h-8 w-8 text-primary" />
                  <span className="font-medium">Tiered</span>
                  <span className="text-xs text-muted-foreground text-center">Different levels of rewards</span>
                </Label>
              </RadioGroup>
            )}
            
            {/* Allocation values */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.allocationType === 'fixed' ? (
                <div className="space-y-2">
                  <Label>
                    <FormattedMessage id="launch.rewards.fixedValue" defaultMessage="Fixed Value" />
                  </Label>
                  <Input
                    type="number"
                    value={config.fixedValue}
                    onChange={(e) => updateConfig('fixedValue', parseInt(e.target.value) || 0)}
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>
                      <FormattedMessage id="launch.rewards.minAllocation" defaultMessage="Minimum" />
                    </Label>
                    <Input
                      type="number"
                      value={config.minAllocation}
                      onChange={(e) => updateConfig('minAllocation', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      <FormattedMessage id="launch.rewards.maxAllocation" defaultMessage="Maximum" />
                    </Label>
                    <Input
                      type="number"
                      value={config.maxAllocation}
                      onChange={(e) => updateConfig('maxAllocation', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Frequency & Spend Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <FormattedMessage id="launch.rewards.frequency" defaultMessage="Frequency" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={config.frequency}
                onValueChange={(value) => updateConfig('frequency', value as FrequencyType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCY_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gift className="h-5 w-5 text-primary" />
                <FormattedMessage id="launch.rewards.spendType" defaultMessage="Spend Type" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={config.spendType}
                onValueChange={(value) => updateConfig('spendType', value as SpendType)}
                className="flex gap-4"
              >
                <Label className={cn(
                  'flex items-center gap-2 p-3 border rounded-lg cursor-pointer flex-1',
                  config.spendType === 'points' ? 'border-primary bg-primary/5' : 'border-muted'
                )}>
                  <RadioGroupItem value="points" />
                  Points
                </Label>
                <Label className={cn(
                  'flex items-center gap-2 p-3 border rounded-lg cursor-pointer flex-1',
                  config.spendType === 'currency' ? 'border-primary bg-primary/5' : 'border-muted'
                )}>
                  <RadioGroupItem value="currency" />
                  Currency
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        
        {/* Validity Period */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" />
              <FormattedMessage id="launch.rewards.validity" defaultMessage="Points Validity" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={config.validityPeriod}
              onValueChange={(value) => updateConfig('validityPeriod', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VALIDITY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>
                  <FormattedMessage id="launch.rewards.autoRollover" defaultMessage="Auto Rollover" />
                </Label>
                <p className="text-xs text-muted-foreground">
                  <FormattedMessage id="launch.rewards.autoRolloverDesc" defaultMessage="Automatically carry over unused points" />
                </p>
              </div>
              <Switch
                checked={config.autoRollover}
                onCheckedChange={(checked) => updateConfig('autoRollover', checked)}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Manager Rewards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              <FormattedMessage id="launch.rewards.managers" defaultMessage="Manager Rewards" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>
                  <FormattedMessage id="launch.rewards.rewardManagers" defaultMessage="Reward People Managers" />
                </Label>
                <p className="text-xs text-muted-foreground">
                  <FormattedMessage id="launch.rewards.rewardManagersDesc" defaultMessage="Give managers a percentage of their team's rewards" />
                </p>
              </div>
              <Switch
                checked={config.rewardManagers}
                onCheckedChange={(checked) => updateConfig('rewardManagers', checked)}
              />
            </div>
            
            {config.rewardManagers && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Manager Percentage</span>
                  <span className="font-medium">{config.managerPercentage}%</span>
                </div>
                <Slider
                  value={[config.managerPercentage]}
                  onValueChange={([value]) => updateConfig('managerPercentage', value)}
                  max={25}
                  step={1}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { RewardsStep };
export default RewardsStep;
