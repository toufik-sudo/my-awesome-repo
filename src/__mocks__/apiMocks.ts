import { RESPONSE_MOCK } from '__mocks__/pricingMocks';
import MockAdapter from 'axios-mock-adapter';
import { mockAxiosInstance } from 'config/axiosConfig';
import {
  HTTP_POST_SUCCESS_STATUS,
  CONTACT_FORM_LOGS_ENDPOINT,
  PRICING_GET_ENDPOINT,
  HTTP_SUCCESS_STATUS
} from 'constants/api';

const mock = new MockAdapter(mockAxiosInstance);

mock.onGet(PRICING_GET_ENDPOINT).reply(HTTP_SUCCESS_STATUS, RESPONSE_MOCK);
mock.onPost(CONTACT_FORM_LOGS_ENDPOINT).reply(() => {
  return [HTTP_POST_SUCCESS_STATUS, { success: true }];
});

export const ENDPOINT_ARRAY_MOCK = ['/random'];
