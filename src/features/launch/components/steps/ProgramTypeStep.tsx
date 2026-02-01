// -----------------------------------------------------------------------------
// ProgramTypeStep Component
// First step: Select program type (Standard, Quick, Freemium, Challenge)
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, Zap, Gift, Trophy, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLaunchWizard } from '../../hooks/useLaunchWizard';
import { QUICK, FULL, FREEMIUM, CHALLENGE, STANDARD } from '@/constants/wall/launch';

interface ProgramTypeOption {
  id: string;
  titleId: string;
  descriptionId: string;
  icon: React.ReactNode;
  journey?: string;
  badge?: string;
  recommended?: boolean;
}

const PROGRAM_TYPES: ProgramTypeOption[] = [
  {
    id: STANDARD,
    titleId: 'launch.program.type.standard',
    descriptionId: 'launch.program.type.standard.desc',
    icon: <Rocket className="h-8 w-8" />,
    journey: FULL,
    recommended: true,
  },
  {
    id: QUICK,
    titleId: 'launch.program.type.quick',
    descriptionId: 'launch.program.type.quick.desc',
    icon: <Zap className="h-8 w-8" />,
    journey: QUICK,
    badge: 'Fast',
  },
  {
    id: FREEMIUM,
    titleId: 'launch.program.type.freemium',
    descriptionId: 'launch.program.type.freemium.desc',
    icon: <Gift className="h-8 w-8" />,
    journey: QUICK,
    badge: 'Free',
  },
  {
    id: CHALLENGE,
    titleId: 'launch.program.type.challenge',
    descriptionId: 'launch.program.type.challenge.desc',
    icon: <Trophy className="h-8 w-8" />,
    journey: FULL,
  },
];

const ProgramTypeStep: React.FC = () => {
  const { formatMessage } = useIntl();
  const { updateMultipleData, goToNextStep, programType } = useLaunchWizard();
  
  const handleSelectType = (type: ProgramTypeOption) => {
    updateMultipleData({
      type: type.id,
      programJourney: type.journey || FULL,
    });
    goToNextStep();
  };
  
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10">
          <Rocket className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            <FormattedMessage 
              id="launch.step.type.title" 
              defaultMessage="Choose Your Program Type" 
            />
          </h2>
          <p className="text-muted-foreground mt-2">
            <FormattedMessage 
              id="launch.step.type.description" 
              defaultMessage="Select the type of program that best fits your needs" 
            />
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {PROGRAM_TYPES.map((type) => (
          <Card
            key={type.id}
            className={cn(
              'relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 overflow-hidden group',
              programType === type.id 
                ? 'border-primary ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg' 
                : 'border-border/50 hover:border-primary/50'
            )}
            onClick={() => handleSelectType(type)}
          >
            {/* Background gradient on hover */}
            <div className={cn(
              'absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-300',
              'group-hover:opacity-100'
            )} />
            
            {type.recommended && (
              <Badge 
                className="absolute -top-0 -right-0 rounded-none rounded-bl-lg bg-gradient-to-r from-primary to-secondary shadow-md"
              >
                <FormattedMessage id="common.recommended" defaultMessage="Recommended" />
              </Badge>
            )}
            {type.badge && !type.recommended && (
              <Badge 
                variant="secondary"
                className="absolute -top-0 -right-0 rounded-none rounded-bl-lg shadow-md"
              >
                {type.badge}
              </Badge>
            )}
            <CardHeader className="flex flex-row items-center gap-4 pb-2 relative">
              <div className={cn(
                'p-4 rounded-xl transition-all duration-300',
                programType === type.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                  : 'bg-gradient-to-br from-primary/10 to-secondary/10 text-primary group-hover:shadow-md'
              )}>
                {type.icon}
              </div>
              <div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  <FormattedMessage 
                    id={type.titleId} 
                    defaultMessage={type.id} 
                  />
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <CardDescription className="text-base">
                <FormattedMessage 
                  id={type.descriptionId} 
                  defaultMessage="Launch a program with this configuration" 
                />
              </CardDescription>
              <Button 
                variant={programType === type.id ? "default" : "ghost"}
                className={cn(
                  'mt-6 w-full justify-between transition-all',
                  programType === type.id && 'shadow-md'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectType(type);
                }}
              >
                <FormattedMessage id="common.select" defaultMessage="Select" />
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export { ProgramTypeStep };
export default ProgramTypeStep;
