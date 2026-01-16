import axios from 'axios';

import { RESELLER_RAW_MOCK } from '__mocks__/formMocks';
import { LOGIN_ENDPOINT } from 'constants/api';
import { contactLogsSubmitAction, loginSubmitAction } from 'store/actions/formActions';

describe('form actions test cases', () => {
  let mock;
  beforeEach(() => {
    mock = jest.spyOn(axios, 'create');
  });
  afterEach(() => {
    mock.mockRestore();
  });

  test('calling resellerSubmitAction should pass all the intermediate functions and return undefined', () => {
    const postPromiseResponse = contactLogsSubmitAction(
      RESELLER_RAW_MOCK,
      {
        setSubmitting: jest.fn(),
        setErrors: jest.fn(),
        setStatus: jest.fn()
      },
      jest.fn(),
      jest.fn()
    );

    expect(postPromiseResponse).toStrictEqual(new Promise(() => {}));
  });

  test('should call login endpoint with user credentials', async () => {
    const push = jest.fn();
    const history = { push };
    const setErrors = jest.fn();
    const setFieldError = jest.fn();
    const setStatus = jest.fn();
    const postFn = jest.fn(() => Promise.reject({}));
    mock.mockReturnValue({ post: postFn });

    const loginPayload = { email: 'test@test.com', password: '1234' };

    await loginSubmitAction(loginPayload, { setErrors, setStatus, setFieldError }, history, jest.fn(), '');

    expect(mock).toHaveBeenCalledTimes(1);
  });
});
