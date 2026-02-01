// -----------------------------------------------------------------------------
// RewardsBlockList Component
// Display reward type blocks for selection (Correlated/Independent goals)
// Migrated from old_app/src/components/organisms/launch/rewards/RewardsBlockList.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link2, Unlink, Target, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RewardBlock {
  id: string;
  icon: React.ElementType;
  titleId: string;
  defaultTitle: string;
  descriptionId: string;
  defaultDescription: string;
  buttonId: string;
  defaultButton: string;
}

const REWARD_BLOCKS: RewardBlock[] = [
  {
    id: 'correlated',
    icon: Link2,
    titleId: 'launchProgram.rewards.type.correlated',
    defaultTitle: 'Correlated Goals',
    descriptionId: 'launchProgram.rewards.type.correlated.info',
    defaultDescription: 'Rewards are calculated based on the combined performance of multiple linked goals. Participants must achieve across all goals to maximize rewards.',
    buttonId: 'launchProgram.rewards.type.correlated.button',
    defaultButton: 'Use Correlated Goals'
  },
  {
    id: 'independent',
    icon: Unlink,
    titleId: 'launchProgram.rewards.type.independent',
    defaultTitle: 'Independent Goals',
    descriptionId: 'launchProgram.rewards.type.independent.info',
    defaultDescription: 'Each goal is evaluated separately. Participants earn rewards independently for each goal they achieve.',
    buttonId: 'launchProgram.rewards.type.independent.button',
    defaultButton: 'Use Independent Goals'
  }
];

interface RewardsBlockListProps {
  activeElement?: string | null;
  onSelect: (blockId: string) => void;
}

export const RewardsBlockList: React.FC<RewardsBlockListProps> = ({
  activeElement,
  onSelect
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {REWARD_BLOCKS.map((block) => {
        const Icon = block.icon;
        const isActive = activeElement === block.id;
        
        return (
          <Card 
            key={block.id}
            className={cn(
              'transition-all hover:shadow-lg cursor-pointer',
              isActive && 'border-primary ring-2 ring-primary/20'
            )}
            onClick={() => onSelect(block.id)}
          >
            <CardHeader className="text-center pb-2">
              <div className={cn(
                'h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4',
                isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}>
                <Icon className="h-8 w-8" />
              </div>
              <CardTitle className="text-lg">
                <FormattedMessage id={block.titleId} defaultMessage={block.defaultTitle} />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <CardDescription className="text-sm">
                <FormattedMessage id={block.descriptionId} defaultMessage={block.defaultDescription} />
              </CardDescription>
              <Button 
                variant={isActive ? 'default' : 'outline'}
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(block.id);
                }}
              >
                <FormattedMessage id={block.buttonId} defaultMessage={block.defaultButton} />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RewardsBlockList;
