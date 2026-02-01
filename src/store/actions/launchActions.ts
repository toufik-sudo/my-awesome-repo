// -----------------------------------------------------------------------------
// Launch Actions
// Migrated from old_app/src/store/actions/launchActions.ts
// -----------------------------------------------------------------------------

import {
  CREATE_NEW_GOAL,
  DELETE_GOAL,
  RESET_STEP_DATA,
  SET_LAUNCH_STEP_DATA,
  SET_MULTIPLE_STEP_DATA,
  SET_STORE_DATA
} from './actionTypes';
import { CUBE, CUBE_SECTIONS, PROGRAM_JOURNEY, QUICK, FULL } from '@/constants/wall/launch';

// Re-export constants for DOT_SEPARATOR
const DOT = '.';

/**
 * Action used to set data step to store
 */
export const setLaunchDataStep = (step: { key: string; value: unknown }) => ({
  type: SET_LAUNCH_STEP_DATA,
  payload: step
});

/**
 * Action used to set multiple data steps to store
 */
export const setMultipleData = (steps: { values: Record<string, unknown> }) => ({
  type: SET_MULTIPLE_STEP_DATA,
  payload: steps
});

/**
 * Action used to reset a specific part of step data based on the current selections
 */
export const resetSpecificStepData = (
  currentType: string,
  value: unknown,
  platform: unknown
) => ({
  type: RESET_STEP_DATA,
  payload: { currentType, value, platform }
});

/**
 * Set store data for app store
 */
export const setStoreData = (data: unknown) => ({
  type: SET_STORE_DATA,
  payload: data
});

/**
 * Method adds to program journey the current launch type (quick || full)
 */
export const setJourneyType = (
  journey: string | undefined,
  dispatch: (action: unknown) => void
) => {
  if (journey && (journey.includes(QUICK) || journey.includes(FULL))) {
    const journeyInfo = journey.split(DOT);
    dispatch(
      setLaunchDataStep({
        key: PROGRAM_JOURNEY,
        value: journeyInfo[journeyInfo.length - 1]
      })
    );
  }
};

/**
 * Action used to set specific product on store (cube key)
 */
export const setSpecificProducts = (
  index: number,
  state: boolean,
  dispatch: (action: unknown) => void,
  launch: Record<string, unknown>
) => {
  const cube = launch.cube as Record<string, unknown>;
  const productIds = launch.productIds as number[];
  const goals = cube.goals as Array<Record<string, unknown>>;
  const updatedGoals = [...goals];

  updatedGoals[index].specificProducts = state;
  updatedGoals[index][CUBE_SECTIONS.MEASUREMENT_TYPE] = null;
  updatedGoals[index][CUBE_SECTIONS.MEASUREMENT_NAME] = null;
  (updatedGoals[index].validated as Record<string, boolean>)[CUBE_SECTIONS.MEASUREMENT_TYPE] = false;

  if (!state) {
    updatedGoals[index].productIds = state ? productIds : [];
  }

  dispatch(setLaunchDataStep({ key: CUBE, value: { ...cube, goals: updatedGoals } }));
};

/**
 * Action used to set bracket values on a goal
 */
export const setBracketValues = (
  index: number,
  state: unknown[],
  dispatch: (action: unknown) => void,
  cube: Record<string, unknown>
) => {
  const goals = cube.goals as Array<Record<string, unknown>>;
  const updatedGoals = [...goals];
  updatedGoals[index].brackets = state;
  dispatch(setLaunchDataStep({ key: CUBE, value: { ...cube, goals: updatedGoals } }));
};

/**
 * Method used to validate a section
 */
export const validateItem = (
  cube: Record<string, unknown>,
  target: string,
  index: number,
  dispatch: (action: unknown) => void
) => {
  const goals = cube.goals as Array<Record<string, unknown>>;
  const updatedGoals = [...goals];
  const validated = updatedGoals[index].validated as Record<string, boolean>;
  validated[target] = !validated[target];
  dispatch(setLaunchDataStep({ key: CUBE, value: { ...cube, goals: updatedGoals } }));
};
