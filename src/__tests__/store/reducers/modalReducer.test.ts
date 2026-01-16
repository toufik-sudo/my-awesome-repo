import { RESELLER_MODAL_OPENED_STATE } from '__mocks__/modalMocks';
import { RESELLER_MODAL } from 'constants/modal';
import { SET_MODAL_STATE } from 'store/actions/actionTypes';
import { initialModalState } from 'store/initialState/initialModalState';
import modalReducer from 'store/reducers/modalReducer';

describe('modal reducer test cases', () => {
  test('dispatching SET_MODAL_STATE with the reseller modal on true should open reseller modal', () => {
    const action = { type: SET_MODAL_STATE, payload: { state: true, target: RESELLER_MODAL } };

    expect(modalReducer(initialModalState, action)).toEqual(RESELLER_MODAL_OPENED_STATE);
  });
});
