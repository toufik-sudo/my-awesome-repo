import { IArrayKey } from 'interfaces/IGeneral';
import { SET_MODAL_STATE } from 'store/actions/actionTypes';

/**
 * Action sets the state of the give modal string
 *
 * @param target
 * @param state
 * @param data
 * NOTE: tested
 */
export const setModalState = (state: boolean, target: string, data: IArrayKey<any> = {}) => {
  return {
    type: SET_MODAL_STATE,
    payload: { state, target, data }
  };
};
