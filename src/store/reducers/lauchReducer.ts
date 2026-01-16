/* eslint-disable quotes */
import {
  CREATE_NEW_GOAL,
  DELETE_GOAL,
  RESET_STEP_DATA,
  SET_LAUNCH_STEP_DATA,
  SET_MULTIPLE_STEP_DATA,
  SET_STORE_DATA
} from 'store/actions/actionTypes';
import { initialLaunchState } from 'store/initialState/initialLaunchState';
import {
  BASE_GOAL_VALUE,
  DECLARATION_FORM,
  EMAIL_NOTIFY,
  FILE_IMPORT,
  LAUNCH_TYPES,
  MANUAL_VALIDATION,
  PROGRAM_JOURNEY,
  RESULTS_CHANNEL
} from 'constants/wall/launch';

/**
 * Quick launch reducer -> manages launch step data
 *
 * @param state
 * @param action
 */
export default (state = initialLaunchState, { type, payload }) => {
  switch (type) {
    case SET_LAUNCH_STEP_DATA: {
      const { key, value } = payload;

      return {
        ...state,
        [key]: value
      };
    }
    case SET_MULTIPLE_STEP_DATA: {
      return {
        ...state,
        ...payload.values
      };
    }
    case RESET_STEP_DATA: {
      const { currentType, value, platform } = payload;
      const { CONFIDENTIALITY, TYPE } = LAUNCH_TYPES;
      let result: any = {
        ...initialLaunchState,
        [PROGRAM_JOURNEY]: state[PROGRAM_JOURNEY],
        [currentType]: value,
        platform: platform
      };

      if (CONFIDENTIALITY === currentType) {
        result = {
          ...result,
          [TYPE]: state[TYPE],
          [MANUAL_VALIDATION]: false,
          [EMAIL_NOTIFY]: false,
          [RESULTS_CHANNEL]: {
            [DECLARATION_FORM]: false,
            [FILE_IMPORT]: false
          },
          cube: {
            ...result.cube,
            goals: [{ ...BASE_GOAL_VALUE, validated: { ...BASE_GOAL_VALUE.validated } }],
            acceptedCorrelatedGoals: []
          }
        };
      }

      return result;
    }
    case CREATE_NEW_GOAL: {
      return {
        ...state,
        cube: {
          ...state.cube,
          goals: [...state.cube.goals, { ...BASE_GOAL_VALUE, validated: { ...BASE_GOAL_VALUE.validated } }],
          acceptedCorrelatedGoals: payload
        }
      };
    }

    case DELETE_GOAL: {
      const updatedCubeGoals = [...state.cube.goals];
      updatedCubeGoals.pop();

      return {
        ...state,
        cube: {
          ...state.cube,
          goals: updatedCubeGoals,
          acceptedCorrelatedGoals: payload
        }
      };
    }
    case SET_STORE_DATA: {
      return payload;
    }
    default:
      return state;
  }
};
