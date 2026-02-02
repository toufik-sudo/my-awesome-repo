// -----------------------------------------------------------------------------
// Launch Page Component
// Main launch wizard page for creating programs
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Rocket, Check, Loader2 } from 'lucide-react';
import { PageIndexList } from '../components';
import {
  ProgramTypeStep,
  ProgramDetailsStep,
  ConfidentialityStep,
  ResultsConfigStep,
  PlatformSelectionStep,
  ProductsStep,
  RewardsStep,
  DesignStep,
  GoalAllocationStep,
  UserFieldsSelectionStep,
  UserFileUploadStep,
  UserValidationStep
} from '../components/steps';
import { useLaunchWizard } from '../hooks/useLaunchWizard';
import { useLaunchProgram } from '@/api/hooks/useLaunchApi';
import { constructQuickLaunchPayload, constructFullLaunchPayload } from '@/api/hooks/useLaunchApi';
import { PROGRAM, USERS, RESULTS, PRODUCTS, REWARDS, DESIGN, CUBE, QUICK } from '@/constants/wall/launch';
import { toast } from 'sonner';
import RewardsGoalsStep from '@/features/launch/components/steps/cube/RewardsGoalsStep';

// Platform step constant (matches hook)
const PLATFORM = 'platform';

// Step component mapping
const STEP_COMPONENTS: Record<string, Record<number, React.FC>> = {
  [PLATFORM]: {
    1: PlatformSelectionStep,
  },
  [PROGRAM]: {
    1: ProgramTypeStep,
    2: ProgramDetailsStep,
    3: ConfidentialityStep,
  },
  [USERS]: {
    1: UserFieldsSelectionStep,
    2: UserFileUploadStep,
    3: UserValidationStep,
  },
  [RESULTS]: {
    1: ResultsConfigStep,
    2: () => (
      <div className="text-center py-8 text-muted-foreground">
        <FormattedMessage
          id="launch.step.results.preview"
          defaultMessage="Results preview step coming soon"
        />
      </div>
    ),
    3: () => (
      <div className="text-center py-8 text-muted-foreground">
        <FormattedMessage
          id="launch.step.results.summary"
          defaultMessage="Results summary step coming soon"
        />
      </div>
    ),
  },
  [PRODUCTS]: {
    1: ProductsStep,
    2: () => (
      <div className="text-center py-8 text-muted-foreground">
        <FormattedMessage
          id="launch.step.products.preview"
          defaultMessage="Products preview step coming soon"
        />
      </div>
    ),
  },
  [REWARDS]: {
    1: RewardsGoalsStep,
    2: RewardsStep,
    3: () => (
      <div className="text-center py-8 text-muted-foreground">
        <FormattedMessage
          id="launch.step.rewards.preview"
          defaultMessage="Rewards preview step coming soon"
        />
      </div>
    ),
  },
  [DESIGN]: {
    1: DesignStep,
    2: () => (
      <div className="text-center py-8 text-muted-foreground">
        <FormattedMessage
          id="launch.step.design.preview"
          defaultMessage="Design preview step coming soon"
        />
      </div>
    ),
  },
};

const LaunchPage: React.FC = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const {
    currentStep,
    currentSubstep,
    progress,
    isFirstStep,
    isLastStep,
    stepLabel,
    substepsInCurrentStep,
    goToNextStep,
    goToPrevStep,
    launchData,
    programJourney,
    isStepValid,
  } = useLaunchWizard();

  const { mutate: launchProgram, isPending: isLaunching } = useLaunchProgram();

  // Get the current step component
  const StepComponent = STEP_COMPONENTS[currentStep]?.[currentSubstep] || (() => (
    <div className="text-center py-8 text-muted-foreground">
      <FormattedMessage
        id="launch.step.placeholder"
        defaultMessage="Step content for {step} - {index}"
        values={{ step: currentStep, index: currentSubstep }}
      />
    </div>
  ));

  const handleNext = () => {
    if (isLastStep) {
      // Launch the program
      const payload = programJourney === QUICK
        ? constructQuickLaunchPayload(launchData)
        : constructFullLaunchPayload(launchData);

      launchProgram(payload, {
        onSuccess: () => {
          toast.success(formatMessage({
            id: 'launch.success',
            defaultMessage: 'Program launched successfully!'
          }));
          navigate('/wall');
        },
        onError: (error) => {
          toast.error(formatMessage({
            id: 'launch.error',
            defaultMessage: 'Failed to launch program. Please try again.'
          }));
          console.error('Launch error:', error);
        },
      });
    } else {
      goToNextStep();
    }
  };

  const canProceed = isStepValid(currentStep, currentSubstep);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Rocket className="h-8 w-8 text-primary" />
            <FormattedMessage id="launch.title" defaultMessage="Launch Program" />
          </h1>
          <p className="text-muted-foreground mt-1">
            {stepLabel}
            {substepsInCurrentStep > 1 && (
              <>
                {' - '}
                <FormattedMessage
                  id="launch.stepOf"
                  defaultMessage="Step {current} of {total}"
                  values={{ current: currentSubstep, total: substepsInCurrentStep }}
                />
              </>
            )}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            <FormattedMessage id="launch.progress" defaultMessage="Progress" />
          </span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <PageIndexList />

      {/* Main Content */}
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <StepComponent />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={goToPrevStep}
          disabled={isFirstStep || isLaunching}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <FormattedMessage id="launch.previous" defaultMessage="Previous" />
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed || isLaunching}
          className="min-w-[120px]"
        >
          {isLaunching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <FormattedMessage id="launch.launching" defaultMessage="Launching..." />
            </>
          ) : isLastStep ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              <FormattedMessage id="launch.finish" defaultMessage="Launch Program" />
            </>
          ) : (
            <>
              <FormattedMessage id="launch.next" defaultMessage="Next" />
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LaunchPage;
