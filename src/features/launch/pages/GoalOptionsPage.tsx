// -----------------------------------------------------------------------------
// Goal Options Page
// Migrated from old_app/src/components/pages/launch/GoalOptionsPage.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import type { RootState } from '@/store';
import { FULL } from '@/constants/wall/launch';

const GoalOptionsPage: React.FC = () => {
  const { formatMessage } = useIntl();
  const launchState = useSelector((state: RootState & { 
    launchReducer?: { programJourney?: string } 
  }) => state.launchReducer);
  
  const programJourney = launchState?.programJourney || 'quick';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          {formatMessage({ id: 'launchProgram.title', defaultMessage: 'Launch Program' })}
        </h1>
        <p className="text-muted-foreground">
          {formatMessage({ 
            id: `welcome.page.launch.${programJourney}${programJourney === FULL ? 'launch' : ''}`,
            defaultMessage: 'Configure your program goals'
          })}
        </p>
      </div>

      {/* Goal Options Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {formatMessage({ id: 'launchProgram.goalOptions.subtitle', defaultMessage: 'Goal Options' })}
          </CardTitle>
          <CardDescription>
            {formatMessage({ id: 'launchProgram.goalOptions.description', defaultMessage: 'Select the goals for your program' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Goal options will be rendered here */}
            <div className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors">
              <h3 className="font-medium">
                {formatMessage({ id: 'goal.sales', defaultMessage: 'Sales Goals' })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatMessage({ id: 'goal.sales.description', defaultMessage: 'Track and reward sales performance' })}
              </p>
            </div>
            <div className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors">
              <h3 className="font-medium">
                {formatMessage({ id: 'goal.engagement', defaultMessage: 'Engagement Goals' })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatMessage({ id: 'goal.engagement.description', defaultMessage: 'Boost team engagement and participation' })}
              </p>
            </div>
            <div className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors">
              <h3 className="font-medium">
                {formatMessage({ id: 'goal.performance', defaultMessage: 'Performance Goals' })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatMessage({ id: 'goal.performance.description', defaultMessage: 'Measure and reward overall performance' })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalOptionsPage;
