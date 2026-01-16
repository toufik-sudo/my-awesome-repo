import { FORM_FIELDS, INPUT_TYPE } from 'constants/forms';
import { BASE_INPUT_CONSTRAINT_GROUP } from 'constants/validation';
import { IResellerForm } from 'interfaces/IModals';

export const MOCK_DATE = '2018-12-24T10:33:30.000Z';
export const MOCK_DATE_INPUT = [FORM_FIELDS.CONTACT_DATE];
export const MOCK_DATE_INPUT_VALUES = { contactDate: new Date(MOCK_DATE) };

export const RESELLER_RAW_MOCK: IResellerForm = {
  lastName: 'test',
  firstName: 'test',
  companyName: 'test',
  email: 'test@test.com',
  phoneNumber: '112',
  targetedMarkets: 'test',
  exclusiveMarket: 'refuseExclusiveMarket',
  startDate: new Date(MOCK_DATE),
  whyPromote: 'because reasons'
};

export const RESELLER_POST_MOCK = {
  lastName: 'test',
  firstName: 'test',
  email: 'test@test.com',
  type: 1,
  data: {
    exclusiveMarket: false,
    phoneNumber: '112',
    targetedMarkets: 'test',
    companyName: 'test',
    startDate: new Date(MOCK_DATE).toISOString(),
    whyPromote: 'because reasons'
  }
};

export const FIELD_DEFINITION = {
  additionalField: true,
  label: FORM_FIELDS.WEBSITE_URL,
  type: INPUT_TYPE.TEXT,
  constraints: BASE_INPUT_CONSTRAINT_GROUP
};

export const BAD_CREDENTIALS = {
  global: 'Bad credentials.'
};

export const VALUES_MOCK = {
  contactDate: new Date(MOCK_DATE)
};

export const GENERIC_FORM = {
  values: { [FORM_FIELDS.FIRST_NAME]: '' },
  errors: {},
  touched: {},
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
  setFieldValue: jest.fn()
};
