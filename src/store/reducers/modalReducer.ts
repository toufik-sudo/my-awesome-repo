// -----------------------------------------------------------------------------
// Modal Reducer
// Migrated from old_app/src/store/reducers/modalReducer.ts
// -----------------------------------------------------------------------------

import { AnyAction } from 'redux';
import { SET_MODAL_STATE } from '../actions/actionTypes';
import { IModalReducer, initialModalState } from '../initialState/initialModalState';

/**
 * Modal reducer - manages modal states
 * Supports both old format (target, state, data) and new format (modalType, modalData)
 */
const modalReducer = (
  state: IModalReducer = initialModalState,
  action: AnyAction
): IModalReducer => {
  switch (action.type) {
    case SET_MODAL_STATE:
      // Support new format
      if (action.payload.modalType !== undefined) {
        return {
          ...state,
          [action.payload.modalType]: action.payload.modalData
        };
      }
      // Support legacy format
      if (action.payload.target !== undefined) {
        return {
          ...state,
          [action.payload.target]: { 
            active: action.payload.state, 
            data: action.payload.data 
          }
        };
      }
      return state;
    default:
      return state;
  }
};

export default modalReducer;
