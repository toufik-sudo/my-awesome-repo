// -----------------------------------------------------------------------------
// useLaunchWizard Hook
// Manages the complete program launch wizard state and navigation
// -----------------------------------------------------------------------------

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import type { RootState } from '@/store';
import { setLaunchDataStep, setMultipleData, resetSpecificStepData } from '@/store/actions/launchActions';
import { LAUNCH_BASE, WALL_ROUTE } from '@/constants/routes';
import {
  PROGRAM,
  USERS,
  RESULTS,
  PRODUCTS,
  REWARDS,
  DESIGN,
  QUICK,
  FULL,
  FREEMIUM,
  CHALLENGE,
  PROGRAM_TYPES,
  PROGRAM_CREATION_TYPES,
  IA,
  ECARD,
  CONTENTS,
} from '@/constants/wall/launch';
import { launchProgram as launchProgramService } from '@/services/launch/LaunchService';

// Platform selection step constant
const PLATFORM = 'platform';
const FINAL = 'final';

// Step configuration for different program types - Updated to match old_app
const QUICK_LAUNCH_STEPS = [PLATFORM, PROGRAM, USERS, REWARDS, FINAL];
const FULL_LAUNCH_STEPS = [PLATFORM, PROGRAM, USERS, PRODUCTS, RESULTS, REWARDS, IA, ECARD, DESIGN, CONTENTS, FINAL];
const FREEMIUM_QUICK_STEPS = [PLATFORM, PROGRAM, USERS, FINAL];
const FREEMIUM_FULL_STEPS = [PLATFORM, PROGRAM, USERS, IA, DESIGN, CONTENTS, FINAL];
const CHALLENGE_QUICK_STEPS = [PLATFORM, PROGRAM, USERS, REWARDS, FINAL];
const CHALLENGE_FULL_STEPS = [PLATFORM, PROGRAM, USERS, PRODUCTS, RESULTS, REWARDS, IA, ECARD, DESIGN, CONTENTS, FINAL];

// Step details
const STEP_CONFIG: Record<string, { substeps: number; label: string }> = {
  [PLATFORM]: { substeps: 1, label: 'Select Platform' },
  [PROGRAM]: { substeps: 3, label: 'Program Details' },
  [USERS]: { substeps: 3, label: 'Users & Invitations' },
  [RESULTS]: { substeps: 3, label: 'Results Configuration' },
  [PRODUCTS]: { substeps: 2, label: 'Products' },
  [REWARDS]: { substeps: 3, label: 'Rewards & Goals' },
  [IA]: { substeps: 1, label: 'AI Assistant' },
  [ECARD]: { substeps: 1, label: 'Gift Cards' },
  [DESIGN]: { substeps: 2, label: 'Design & Branding' },
  [CONTENTS]: { substeps: 6, label: 'Content Pages' },
  [FINAL]: { substeps: 1, label: 'Launch' },
};

export interface LaunchWizardState {
  // Current step info
  currentStep: string;
  currentSubstep: number;
  totalSteps: number;
  progress: number;

  // Navigation
  canGoNext: boolean;
  canGoPrev: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;

  // Step data
  stepLabel: string;
  substepsInCurrentStep: number;

  // Launch data from store
  launchData: Record<string, unknown>;

  // Program info
  programType: string;
  programJourney: string; // 'quick' or 'full'
  isFreemium: boolean;
  isChallenge: boolean;
}

export interface UseLaunchWizardReturn extends LaunchWizardState {
  // Navigation actions
  goToNextStep: () => void;
  goToPrevStep: () => void;
  goToStep: (step: string, substep?: number) => void;

  // Data actions
  updateStepData: (key: string, value: unknown) => void;
  updateMultipleData: (values: Record<string, unknown>) => void;
  resetToStep: (step: string) => void;

  // Launch actions
  launchProgram: () => Promise<void>;
  isLaunching: boolean;

  // Validation
  isStepValid: (step: string, substep?: number) => boolean;
}

export function useLaunchWizard(): UseLaunchWizardReturn {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { step = PLATFORM, stepIndex = '1' } = useParams<{ step: string; stepIndex: string }>();
  const [searchParams] = useSearchParams();
  const [isLaunching, setIsLaunching] = useState(false);

  const launchData = useSelector((state: RootState & { launchReducer?: Record<string, unknown> }) =>
    state.launchReducer || {}
  );

  // Read platformId from URL query params and set in launch data
  const platformIdFromUrl = searchParams.get('platformId');

  useEffect(() => {
    if (platformIdFromUrl && !launchData.platformId) {
      dispatch(setLaunchDataStep({ key: 'platformId', value: parseInt(platformIdFromUrl, 10) }));
      // If platformId is pre-selected, skip to program step
      if (step === PLATFORM) {
        navigate(`/launch/${PROGRAM}/1`, { replace: true });
      }
    }
  }, [platformIdFromUrl, launchData.platformId, dispatch, step, navigate]);

  const programType = (launchData.type as string) || '';
  const programJourney = (launchData.programJourney as string) || QUICK;
  const isFreemium = programType === FREEMIUM;
  const isChallenge = programType === CHALLENGE;

  // Determine available steps based on program type and journey
  const availableSteps = useMemo(() => {
    if (isFreemium) {
      return programJourney === QUICK ? FREEMIUM_QUICK_STEPS : FREEMIUM_FULL_STEPS;
    }
    if (isChallenge) {
      return programJourney === QUICK ? CHALLENGE_QUICK_STEPS : CHALLENGE_FULL_STEPS;
    }
    return programJourney === QUICK ? QUICK_LAUNCH_STEPS : FULL_LAUNCH_STEPS;
  }, [isFreemium, isChallenge, programJourney]);

  const currentStepIndex = availableSteps.indexOf(step);
  const currentSubstep = parseInt(stepIndex, 10) || 1;
  const stepConfig = STEP_CONFIG[step] || { substeps: 1, label: 'Unknown' };

  // Calculate progress
  const totalSubsteps = availableSteps.reduce((sum, s) => sum + (STEP_CONFIG[s]?.substeps || 1), 0);
  const completedSubsteps = availableSteps.slice(0, currentStepIndex).reduce(
    (sum, s) => sum + (STEP_CONFIG[s]?.substeps || 1), 0
  ) + currentSubstep - 1;
  const progress = Math.round((completedSubsteps / totalSubsteps) * 100);

  // Navigation state
  const isFirstStep = currentStepIndex === 0 && currentSubstep === 1;
  const isLastStep = currentStepIndex === availableSteps.length - 1 &&
    currentSubstep === stepConfig.substeps;

  // Navigation actions
  const goToNextStep = useCallback(() => {
    if (currentSubstep < stepConfig.substeps) {
      navigate(`${LAUNCH_BASE}/${step}/${currentSubstep + 1}`);
    } else if (currentStepIndex < availableSteps.length - 1) {
      const nextStep = availableSteps[currentStepIndex + 1];
      navigate(`${LAUNCH_BASE}/${nextStep}/1`);
    } else {
      // Launch complete - navigate to wall
      navigate(WALL_ROUTE);
    }
  }, [currentSubstep, stepConfig.substeps, currentStepIndex, availableSteps, step, navigate]);

  const goToPrevStep = useCallback(() => {
    if (currentSubstep > 1) {
      navigate(`${LAUNCH_BASE}/${step}/${currentSubstep - 1}`);
    } else if (currentStepIndex > 0) {
      const prevStep = availableSteps[currentStepIndex - 1];
      const prevConfig = STEP_CONFIG[prevStep];
      navigate(`${LAUNCH_BASE}/${prevStep}/${prevConfig.substeps}`);
    }
  }, [currentSubstep, currentStepIndex, availableSteps, step, navigate]);

  const goToStep = useCallback((targetStep: string, substep = 1) => {
    navigate(`${LAUNCH_BASE}/${targetStep}/${substep}`);
  }, [navigate]);

  // Data actions
  const updateStepData = useCallback((key: string, value: unknown) => {
    dispatch(setLaunchDataStep({ key, value }));
  }, [dispatch]);

  const updateMultipleData = useCallback((values: Record<string, unknown>) => {
    dispatch(setMultipleData({ values }));
  }, [dispatch]);

  const resetToStep = useCallback((targetStep: string) => {
    // Reset data and navigate
    goToStep(targetStep, 1);
  }, [goToStep]);

  // Validation (substep-aware)
  const isStepValid = useCallback((checkStep: string, substep?: number): boolean => {
    const currentSub = substep ?? currentSubstep;

    switch (checkStep) {
      case PLATFORM:
        return !!(launchData.platform || launchData.platformId);
      case PROGRAM:
        // Substep 1: Program type selection
        if (currentSub === 1) {
          return !!(launchData.type);
        }
        // Substep 2: Program details (name, dates)
        if (currentSub === 2) {
          const programName = launchData.programName as string;
          const duration = launchData.duration as { start?: string; end?: string } | undefined;
          return !!(programName && programName.length >= 3 && duration?.start);
        }
        // Substep 3: Confidentiality
        if (currentSub === 3) {
          return !!(launchData.confidentiality);
        }
        return !!(launchData.programName && launchData.type && launchData.confidentiality);
      case USERS:
        // Substep 1: Field selection - always valid after selecting fields
        if (currentSub === 1) {
          const fields = launchData.invitedUsersFields as string[] | undefined;
          return !!(fields && fields.length >= 3); // At least 3 mandatory fields
        }
        // Substep 2: Invitation method - valid if user selected a method and provided data
        if (currentSub === 2) {
          const invitationMethod = launchData.invitationMethod as string | undefined;
          const emailList = launchData.linkedEmailsData as string[] | undefined;
          const userData = launchData.invitedUserData as { invitedUsersFile?: string } | undefined;

          // If method is EMAIL, need at least one email
          if (invitationMethod === 'email') {
            return !!(emailList && emailList.length > 0);
          }
          // If method is FILE, need uploaded file
          if (invitationMethod === 'file') {
            return !!(userData?.invitedUsersFile);
          }
          // If method is ALL_USERS, always valid
          if (invitationMethod === 'allUsers') {
            return true;
          }
          // Default: valid if any method has data (for flexibility)
          return !!(
            (emailList && emailList.length > 0) ||
            userData?.invitedUsersFile ||
            invitationMethod === 'allUsers'
          );
        }
        // Substep 3: Validation settings - always valid
        return true;
      case RESULTS:
        // Substep 1: Must have at least one result channel selected
        if (currentSub === 1) {
          const resultChannel = launchData.resultChannel as { declarationForm?: boolean; fileImport?: boolean } | undefined;
          return !!(resultChannel?.declarationForm || resultChannel?.fileImport);
        }
        // Substeps 2 & 3: Preview and summary - always valid
        return true;
      case PRODUCTS:
        // Substep 1: Products or categories selected
        if (currentSub === 1) {
          const productIds = launchData.productIds as string[] | undefined;
          const categoryIds = launchData.categoryIds as string[] | undefined;
          // Optional step - valid even without selections
          return true;
        }
        // Substep 2: Preview - always valid
        return true;
      case REWARDS:
        // Substep 1: Allocation type must be selected
        if (currentSub === 1) {
          // const allocationType = launchData.allocationType as string | undefined;
          // const fixedValue = launchData.fixedValue as number | undefined;
          // const minAllocation = launchData.minAllocation as number | undefined;

          // if (!allocationType) return true; // Optional, defaults are set
          // if (allocationType === 'fixed') {
          //   return fixedValue !== undefined && fixedValue > 0;
          // }
          // launchData.cube = null; // Reset cube data if changing allocation type
          return true; // Variable/tiered have defaults
        }
        // Substep 2: Goal allocation - check cube goals
        if (currentSub === 2) {
          const cube = launchData.cube as { goals?: Array<{ measurementType?: number; allocationCategory?: string }> } | undefined;
          if (!cube?.goals || cube.goals.length === 0) return true; // Optional
          // At least first goal should have measurement type
          return !!(cube.goals[0]?.measurementType);
        }
        // Substep 3: Preview - always valid
        return true;
      case DESIGN:
        // Substep 1: Design options - always valid (all have defaults)
        if (currentSub === 1) {
          return true;
        }
        // Substep 2: Preview - always valid
        return true;
      default:
        return true;
    }
  }, [launchData, currentSubstep]);

  // Launch program
  const launchProgram = useCallback(async () => {
    setIsLaunching(true);
    try {
      const result = await launchProgramService(launchData as Record<string, any>);

      if (result.success) {
        toast.success('Program launched successfully!');
        navigate(WALL_ROUTE);
      } else {
        toast.error(result.error || 'Failed to launch program');
      }
    } catch (error) {
      console.error('Failed to launch program:', error);
      toast.error('An unexpected error occurred while launching the program');
    } finally {
      setIsLaunching(false);
    }
  }, [launchData, navigate]);

  return {
    // State
    currentStep: step,
    currentSubstep,
    totalSteps: availableSteps.length,
    progress,
    canGoNext: !isLastStep,
    canGoPrev: !isFirstStep,
    isFirstStep,
    isLastStep,
    stepLabel: stepConfig.label,
    substepsInCurrentStep: stepConfig.substeps,
    launchData,
    programType,
    programJourney,
    isFreemium,
    isChallenge,

    // Actions
    goToNextStep,
    goToPrevStep,
    goToStep,
    updateStepData,
    updateMultipleData,
    resetToStep,
    launchProgram,
    isLaunching,
    isStepValid,
  };
}

export default useLaunchWizard;
