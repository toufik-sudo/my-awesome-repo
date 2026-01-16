import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import FormikWrapper from 'components/stories/utility/FormikWrapper';
import DefaultInputField from 'components/molecules/forms/fields/DefaultInputField';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import DropdownInputField from 'components/molecules/forms/fields/DropdownInputField';
import DatePickerDefault from 'components/molecules/forms/fields/DatePickerDefault';
import DynamicDatePickerDefault from 'components/molecules/forms/fields/DynamicDatePickerDefault';
import { FORM_FIELDS_TYPES } from 'constants/stories';
import {
  CONTACT_FORM_FIELDS,
  TAILORED_FORM_FIELDS,
  CHALLENGE_REVENUE_FIELDS
} from 'constants/formDefinitions/formDeclarations';
import {
  CONTACT_DATE_FIELD,
  INCENTIVE_MONTHLY_BUDGET_FIELD,
  START_DATE_FIELD,
  REVENUE_REWARD_AMOUNT_FIELD
} from 'constants/formDefinitions/genericFields';

const FormFieldsStory = storiesOf('Molecules/Forms/Form fields', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(FORM_FIELDS_TYPES.DEFAULT, () => (
    <ProvidersWrapper>
      <FormikWrapper formDeclaration={TAILORED_FORM_FIELDS}>
        {props => <DefaultInputField form={props} field={TAILORED_FORM_FIELDS[0]} />}
      </FormikWrapper>
    </ProvidersWrapper>
  ))
  .add(FORM_FIELDS_TYPES.DATE_PICKER, () => (
    <ProvidersWrapper>
      <FormikWrapper formDeclaration={TAILORED_FORM_FIELDS}>
        {props => <DatePickerDefault form={props} field={START_DATE_FIELD} />}
      </FormikWrapper>
    </ProvidersWrapper>
  ))
  .add(FORM_FIELDS_TYPES.DROPDOWN, () => (
    <ProvidersWrapper>
      <FormikWrapper formDeclaration={CONTACT_FORM_FIELDS}>
        {props => <DropdownInputField form={props} field={INCENTIVE_MONTHLY_BUDGET_FIELD} />}
      </FormikWrapper>
    </ProvidersWrapper>
  ))
  .add(FORM_FIELDS_TYPES.DYNAMIC_DATE_PICKER, () => (
    <ProvidersWrapper>
      <FormikWrapper formDeclaration={CONTACT_FORM_FIELDS}>
        {props => <DynamicDatePickerDefault form={props} field={CONTACT_DATE_FIELD} />}
      </FormikWrapper>
    </ProvidersWrapper>
  ))
  .add(FORM_FIELDS_TYPES.EXTENDED_INPUT_FIELD, () => (
    <ProvidersWrapper>
      <FormikWrapper formDeclaration={CHALLENGE_REVENUE_FIELDS}>
        {props => <DefaultInputField form={props} field={REVENUE_REWARD_AMOUNT_FIELD} />}
      </FormikWrapper>
    </ProvidersWrapper>
  ));

export default FormFieldsStory;
