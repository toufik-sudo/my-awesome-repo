import { SET_LAUNCH_STEP_DATA } from 'store/actions/actionTypes';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { mockLaunchSelection } from '__mocks__/launchMocks';

describe('launch actions test cases', () => {
  test('calling setLaunchDataStep should return the expected payload', () => {
    const actionResultReseller = setLaunchDataStep(mockLaunchSelection);

    expect(actionResultReseller).toStrictEqual({
      payload: mockLaunchSelection,
      type: SET_LAUNCH_STEP_DATA
    });
  });
});
