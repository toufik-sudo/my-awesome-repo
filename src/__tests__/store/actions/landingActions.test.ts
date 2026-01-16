import { SET_PRICING_DATA } from 'store/actions/actionTypes';
import { setPricingData } from 'store/actions/landingActions';

describe('landing actions test cases', () => {
  test('calling setLanguage with a language should return the corresponding action + payload', () => {
    const actionResult = setPricingData([]);
    expect(actionResult).toStrictEqual({ payload: [], type: SET_PRICING_DATA });
  });
});
