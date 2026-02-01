// -----------------------------------------------------------------------------
// Final Step Page
// Migrated from old_app/src/components/pages/FinalStepPage.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Rocket, PartyPopper, Loader2 } from 'lucide-react';
import type { RootState } from '@/store';
import { FULL } from '@/constants/wall/launch';
import { useLaunchWizard } from '../hooks/useLaunchWizard';

const FinalStepPage: React.FC = () => {
  const { formatMessage } = useIntl();
  const { launchProgram, isLaunching, launchData } = useLaunchWizard();
  
  const launchState = useSelector((state: RootState & { 
    launchReducer?: { programName?: string; programJourney?: string } 
  }) => state.launchReducer);
  
  const programName = launchState?.programName || '';
  const programJourney = launchState?.programJourney || 'quick';

  const handleLaunch = async () => {
    await launchProgram();
  };

  const summaryItems = [
    { label: 'Program Name', value: programName || 'My Program', completed: true },
    { label: 'Program Type', value: programJourney === FULL ? 'Full Launch' : 'Quick Launch', completed: true },
    { label: 'Goals Configured', value: '3 goals', completed: true },
    { label: 'Products Selected', value: '12 products', completed: true },
    { label: 'Design Customized', value: 'Yes', completed: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
          <PartyPopper className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">
          {formatMessage({ id: 'launchProgram.title', defaultMessage: 'Launch Program' })}
        </h1>
        <p className="text-muted-foreground mt-2">
          {formatMessage({ 
            id: `welcome.page.launch.${programJourney}${programJourney === FULL ? 'launch' : ''}`,
            defaultMessage: 'Final step before launching'
          })}
        </p>
      </div>

      {/* Program Name Display */}
      <Card className="bg-primary/5 border-primary">
        <CardContent className="py-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {formatMessage({ id: 'launchProgram.finalStep.subtitle', defaultMessage: 'You are about to launch' })}
          </p>
          <h2 className="text-2xl font-bold text-primary">{programName || 'My Reward Program'}</h2>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>
            {formatMessage({ id: 'launchProgram.finalStep.summary', defaultMessage: 'Program Summary' })}
          </CardTitle>
          <CardDescription>
            {formatMessage({ id: 'launchProgram.finalStep.review', defaultMessage: 'Review your program configuration' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summaryItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-muted-foreground">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.value}</span>
                  {item.completed && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Launch Button */}
      <div className="flex flex-col items-center gap-4 pt-4">
        <Button size="lg" className="gap-2" onClick={handleLaunch} disabled={isLaunching}>
          {isLaunching ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Rocket className="h-5 w-5" />
          )}
          {isLaunching 
            ? formatMessage({ id: 'launchProgram.launching', defaultMessage: 'Launching...' })
            : formatMessage({ id: 'launchProgram.launch', defaultMessage: 'Launch Program' })}
        </Button>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          {formatMessage({ 
            id: 'launchProgram.finalStep.disclaimer', 
            defaultMessage: 'By launching, your program will be available to all participants immediately.' 
          })}
        </p>
      </div>
    </div>
  );
};

export default FinalStepPage;
