// -----------------------------------------------------------------------------
// PageIndexList Component
// Migrated from old_app/src/components/organisms/launch/PageIndexList.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { cn } from '@/lib/utils';
import { 
  LAUNCH_STEP_TYPES, 
  EXCLUDED_INTERMEDIARY_STEPS,
  PROGRAM_CONFIDENTIALITY_OPEN,
  USERS
} from '@/constants/wall/launch';
import type { RootState } from '@/store';
import PageIndexItem from './PageIndexItem';

interface IPageIndexListProps {
  className?: string;
}

/**
 * Organism component used to render page index (step indicator) functionality
 */
const PageIndexList: React.FC<IPageIndexListProps> = ({ className }) => {
  const launchState = useSelector((state: RootState & { launchReducer?: { confidentiality?: string; type?: number } }) => 
    state.launchReducer
  );
  
  const confidentiality = launchState?.confidentiality;
  const type = launchState?.type;
  
  const { step, stepIndex } = useParams<{ step: string; stepIndex: string }>();

  // Return null if step is not defined or not in LAUNCH_STEP_TYPES
  if (!step || !LAUNCH_STEP_TYPES[step]) return null;

  let launchSteps = [...LAUNCH_STEP_TYPES[step].steps];

  // Filter out last step if open confidentiality and on users step
  if (confidentiality === PROGRAM_CONFIDENTIALITY_OPEN && step === USERS) {
    launchSteps = launchSteps.slice(0, -1);
  }

  // Hide index if configured
  if (LAUNCH_STEP_TYPES[step].hideIndex) return null;

  // Hide for intermediary steps at index 1
  if (EXCLUDED_INTERMEDIARY_STEPS.includes(step) && stepIndex && parseInt(stepIndex) === 1) {
    return null;
  }

  // Hide if only one step or no steps
  if (!launchSteps || launchSteps.length <= 1) {
    return null;
  }

  const currentStepIndex = stepIndex ? parseInt(stepIndex, 10) : 1;

  return (
    <div className={cn('flex justify-center py-4', className)}>
      <ul className="flex items-center gap-2">
        {launchSteps.map((stepItem, index) => (
          <PageIndexItem 
            key={index} 
            index={stepItem.index} 
            type={type}
            isActive={stepItem.index === currentStepIndex}
            isCompleted={stepItem.index < currentStepIndex}
          />
        ))}
      </ul>
    </div>
  );
};

export default PageIndexList;
