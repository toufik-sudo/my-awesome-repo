// -----------------------------------------------------------------------------
// Cube Options Page
// Migrated from old_app/src/components/pages/CubeOptionsPage.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, Box, Clock, Wallet, Star, Users } from 'lucide-react';
import type { RootState } from '@/store';
import { useLaunchWizard } from '../hooks/useLaunchWizard';

interface CubeState {
  cubeValidated?: {
    frequencyAllocation?: boolean;
    spendType?: boolean;
    validityPoints?: boolean;
    rewardPeopleManagers?: boolean;
  };
  frequencyAllocation?: string;
  spendType?: string;
  validityPoints?: { value: string; label: string };
  rewardPeopleManagers?: number;
}

const CubeOptionsPage: React.FC = () => {
  const { formatMessage } = useIntl();
  const { goToNextStep, updateStepData } = useLaunchWizard();
  
  const launchState = useSelector((state: RootState & { 
    launchReducer?: { cube?: CubeState } 
  }) => state.launchReducer);
  
  const cube = launchState?.cube;
  const rewardsPeopleManagersValidated = cube?.cubeValidated?.rewardPeopleManagers || false;

  const handleNext = () => {
    // Save cube configuration and navigate to next step
    updateStepData('cubeOptionsCompleted', true);
    goToNextStep();
  };

  return (
    <div className="space-y-6">
      {/* Frequency Allocation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {formatMessage({ id: 'cube.frequencyAllocation', defaultMessage: 'Frequency Allocation' })}
          </CardTitle>
          <CardDescription>
            {formatMessage({ id: 'cube.frequencyAllocation.description', defaultMessage: 'How often points are allocated' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select defaultValue="monthly">
            <SelectTrigger>
              <SelectValue placeholder={formatMessage({ id: 'cube.selectFrequency', defaultMessage: 'Select frequency' })} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">
                {formatMessage({ id: 'cube.frequency.weekly', defaultMessage: 'Weekly' })}
              </SelectItem>
              <SelectItem value="monthly">
                {formatMessage({ id: 'cube.frequency.monthly', defaultMessage: 'Monthly' })}
              </SelectItem>
              <SelectItem value="quarterly">
                {formatMessage({ id: 'cube.frequency.quarterly', defaultMessage: 'Quarterly' })}
              </SelectItem>
              <SelectItem value="yearly">
                {formatMessage({ id: 'cube.frequency.yearly', defaultMessage: 'Yearly' })}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Spend Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            {formatMessage({ id: 'cube.spendType', defaultMessage: 'Spend Type' })}
          </CardTitle>
          <CardDescription>
            {formatMessage({ id: 'cube.spendType.description', defaultMessage: 'How points can be spent' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select defaultValue="gift-cards">
            <SelectTrigger>
              <SelectValue placeholder={formatMessage({ id: 'cube.selectSpendType', defaultMessage: 'Select spend type' })} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gift-cards">
                {formatMessage({ id: 'cube.spendType.giftCards', defaultMessage: 'Gift Cards' })}
              </SelectItem>
              <SelectItem value="products">
                {formatMessage({ id: 'cube.spendType.products', defaultMessage: 'Products' })}
              </SelectItem>
              <SelectItem value="experiences">
                {formatMessage({ id: 'cube.spendType.experiences', defaultMessage: 'Experiences' })}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Points Validity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            {formatMessage({ id: 'cube.validityPoints', defaultMessage: 'Points Validity' })}
          </CardTitle>
          <CardDescription>
            {formatMessage({ id: 'cube.validityPoints.description', defaultMessage: 'How long points remain valid' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select defaultValue="1y">
            <SelectTrigger>
              <SelectValue placeholder={formatMessage({ id: 'cube.selectValidity', defaultMessage: 'Select validity period' })} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">
                {formatMessage({ id: 'cube.validity.6months', defaultMessage: '6 Months' })}
              </SelectItem>
              <SelectItem value="1y">
                {formatMessage({ id: 'cube.validity.1year', defaultMessage: '1 Year' })}
              </SelectItem>
              <SelectItem value="2y">
                {formatMessage({ id: 'cube.validity.2years', defaultMessage: '2 Years' })}
              </SelectItem>
              <SelectItem value="unlimited">
                {formatMessage({ id: 'cube.validity.unlimited', defaultMessage: 'Unlimited' })}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Reward People Managers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {formatMessage({ id: 'cube.rewardPeopleManagers', defaultMessage: 'Reward People Managers' })}
          </CardTitle>
          <CardDescription>
            {formatMessage({ id: 'cube.rewardPeopleManagers.description', defaultMessage: 'Include managers in the reward program' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="reward-managers">
              {formatMessage({ id: 'cube.enableManagerRewards', defaultMessage: 'Enable manager rewards' })}
            </Label>
            <Switch id="reward-managers" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Next Button */}
      {rewardsPeopleManagersValidated && (
        <div className="flex justify-center">
          <Button onClick={handleNext} size="lg">
            {formatMessage({ id: 'form.submit.next', defaultMessage: 'Next' })}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CubeOptionsPage;
