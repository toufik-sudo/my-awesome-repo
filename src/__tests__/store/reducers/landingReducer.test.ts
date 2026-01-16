import { SET_PRICING_DATA } from 'store/actions/actionTypes';
import { initialLandingState } from 'store/initialState/initialLandingState';
import landingReducer from 'store/reducers/landingReducer';

describe('landing reducer test cases', () => {
  test('dispatching set landing with the default pricing data should not change the state', () => {
    const action = { type: SET_PRICING_DATA, payload: [] };

    expect(landingReducer(initialLandingState, action)).toEqual(initialLandingState);
  });
});
