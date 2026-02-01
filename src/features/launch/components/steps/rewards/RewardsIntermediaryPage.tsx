// -----------------------------------------------------------------------------
// RewardsIntermediaryPage Component
// Intermediary page explaining rewards before configuration
// Migrated from old_app/src/components/organisms/launch/rewards/RewardsIntermediaryPage.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Target, TrendingUp, Award, ExternalLink, ArrowRight } from 'lucide-react';

interface RewardsIntermediaryPageProps {
  onContinue: () => void;
  termsUrl?: string;
}

const REWARDS_FEATURES = [
  {
    icon: Target,
    titleId: 'launch.rewards.feature.goals',
    defaultTitle: 'Goal-Based Rewards',
    descId: 'launch.rewards.feature.goals.desc',
    defaultDesc: 'Set up specific performance goals and reward achievements'
  },
  {
    icon: TrendingUp,
    titleId: 'launch.rewards.feature.flexible',
    defaultTitle: 'Flexible Allocation',
    descId: 'launch.rewards.feature.flexible.desc',
    defaultDesc: 'Choose from fixed, tiered, or growth-based reward structures'
  },
  {
    icon: Award,
    titleId: 'launch.rewards.feature.ranking',
    defaultTitle: 'Competition & Rankings',
    descId: 'launch.rewards.feature.ranking.desc',
    defaultDesc: 'Create competitive programs with leaderboards and prizes'
  },
  {
    icon: Gift,
    titleId: 'launch.rewards.feature.catalog',
    defaultTitle: 'Reward Catalog',
    descId: 'launch.rewards.feature.catalog.desc',
    defaultDesc: 'Let participants choose from a variety of rewards'
  }
];

export const RewardsIntermediaryPage: React.FC<RewardsIntermediaryPageProps> = ({
  onContinue,
  termsUrl
}) => {
  const { formatMessage } = useIntl();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Gift className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">
          <FormattedMessage id="launch.rewards.intro.title" defaultMessage="Configure Your Rewards" />
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          <FormattedMessage 
            id="launch.rewards.intro.description" 
            defaultMessage="Set up an engaging rewards program that motivates your team and drives performance" 
          />
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REWARDS_FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="bg-muted/30">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">
                    <FormattedMessage id={feature.titleId} defaultMessage={feature.defaultTitle} />
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <FormattedMessage id={feature.descId} defaultMessage={feature.defaultDesc} />
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action */}
      <div className="text-center space-y-4">
        <Button onClick={onContinue} size="lg" className="gap-2">
          <FormattedMessage id="launch.rewards.continue" defaultMessage="Configure Rewards" />
          <ArrowRight className="h-4 w-4" />
        </Button>
        
        {termsUrl && (
          <p className="text-sm text-muted-foreground">
            <a 
              href={termsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors underline"
            >
              <FormattedMessage id="launch.rewards.termsAndConditions" defaultMessage="Terms & Conditions" />
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default RewardsIntermediaryPage;
