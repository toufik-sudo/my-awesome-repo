import { RESELLER_MODAL, SUCCESS_MODAL } from 'constants/modal';
import { SET_MODAL_STATE } from 'store/actions/actionTypes';
import { setModalState } from 'store/actions/modalActions';

describe('modal actions test cases', () => {
  test('calling setModalState with state and a target should return the expected payload', () => {
    const actionResultReseller = setModalState(true, RESELLER_MODAL);
    const actionResultSuccess = setModalState(false, SUCCESS_MODAL);

    expect(actionResultReseller).toStrictEqual({
      payload: { state: true, target: RESELLER_MODAL, data: {} },
      type: SET_MODAL_STATE
    });
    expect(actionResultSuccess).toStrictEqual({
      payload: { state: false, target: SUCCESS_MODAL, data: {} },
      type: SET_MODAL_STATE
    });
  });
});
