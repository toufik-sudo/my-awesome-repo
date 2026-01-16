import { IModalReducer } from 'interfaces/store/IStore';
import { AnyAction } from 'redux';
import { initialModalState } from 'store/initialState/initialModalState';
import { SET_MODAL_STATE } from '../actions/actionTypes';

/**
 * General reducer -> manages loading and other app states
 *
 * @param state
 * @param action
 */
export default (state: IModalReducer = initialModalState, { type, payload }: AnyAction) => {
  switch (type) {
    case SET_MODAL_STATE:
      return {
        ...state,
        [payload.target]: { active: payload.state, data: payload.data }
      };
    default:
      return state;
  }
};
