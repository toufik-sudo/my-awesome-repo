// -----------------------------------------------------------------------------
// Initial Launch State
// Migrated from old_app/src/store/initialState/initialLaunchState.ts
// -----------------------------------------------------------------------------

import {
  CUBE,
  DECLARATION_FORM,
  FILE_IMPORT,
  RESULTS_CHANNEL,
  BASE_GOAL_VALUE,
  MANUAL_VALIDATION,
  RESULTS_MANUAL_VALIDATION,
  EMAIL_NOTIFY
} from '@/constants/wall/launch';
import { IArrayKey } from '@/types/store';

export const initialLaunchState: IArrayKey<unknown> = Object.freeze({
  [RESULTS_CHANNEL]: {
    [DECLARATION_FORM]: false,
    [FILE_IMPORT]: false
  },
  [EMAIL_NOTIFY]: false,
  [MANUAL_VALIDATION]: false,
  [RESULTS_MANUAL_VALIDATION]: false,
  simpleAllocation: {
    min: '',
    max: '',
    value: '',
    type: ''
  },
  [CUBE]: {
    goals: [{ ...BASE_GOAL_VALUE, validated: { ...BASE_GOAL_VALUE.validated } }],
    acceptedCorrelatedGoals: [],
    cubeValidated: {
      frequencyAllocation: false,
      spendType: false,
      validityPoints: false,
      rewardPeopleManagers: false
    },
    frequencyAllocation: '',
    spendType: '',
    rewardPeopleManagers: 0,
    rewardPeopleManagerAccepted: true,
    validityPoints: { value: '1y', label: '1 Year' }
  }
});
