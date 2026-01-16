import {
  FIELD_DEFINITION,
  MOCK_DATE,
  MOCK_DATE_INPUT,
  MOCK_DATE_INPUT_VALUES,
  RESELLER_POST_MOCK,
  RESELLER_RAW_MOCK,
  VALUES_MOCK
} from '__mocks__/formMocks';
import { FORM_FIELDS } from 'constants/forms';
import { getAdditionalField, getContactDates, getValidDates, processResellerForm } from 'services/FormServices';

describe('processResellerForm function test', () => {
  test('passing raw data will process in a way that be can handle the post request', () => {
    const processedResellerData = processResellerForm(RESELLER_RAW_MOCK);

    expect(processedResellerData).toStrictEqual(RESELLER_POST_MOCK);
  });
});

describe('getAdditionalField function test', () => {
  test('passing raw data will process in a way that be can handle the post request', () => {
    const additionalFieldDefinition = getAdditionalField(FORM_FIELDS.WEBSITE_URL);

    expect(additionalFieldDefinition).toStrictEqual(FIELD_DEFINITION);
  });
});

describe('getAdditionalField function test', () => {
  test('passing raw data will process in a way that be can handle the post request', () => {
    const additionalFieldDefinition = getValidDates(MOCK_DATE_INPUT, MOCK_DATE_INPUT_VALUES);

    expect(additionalFieldDefinition).toBe(1);
  });
});

describe('getContactDates function test', () => {
  test('function should return the correct dates', () => {
    const dates = getContactDates(VALUES_MOCK);

    expect(`${dates}`).toBe(MOCK_DATE);
  });
});
