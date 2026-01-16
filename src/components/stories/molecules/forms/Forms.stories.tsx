import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import TailoredForm from 'components/molecules/forms/TailoredForm';
import FormikWrapper from 'components/stories/utility/FormikWrapper';
import ResellerForm from 'components/molecules/forms/ResellerForm';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { FORMS_TYPES } from 'constants/stories';
import {
  CONTACT_FORM_FIELDS,
  CREATE_ACCOUNT_FIELDS,
  RESELLER_FORM_FIELDS,
  TAILORED_FORM_FIELDS
} from 'constants/formDefinitions/formDeclarations';
import CreateAccountForm from 'components/molecules/forms/CreateAccountForm';
import ContactForm from 'components/molecules/forms/ContactForm';
import { setBackgrounds } from 'services/StoriesServices';

const FormsStory = storiesOf('Molecules/Forms/Forms', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(FORMS_TYPES.TAILORED, () => (
    <ProvidersWrapper>
      <FormikWrapper formDeclaration={TAILORED_FORM_FIELDS}>{props => <TailoredForm form={props} />}</FormikWrapper>
    </ProvidersWrapper>
  ))
  .add(FORMS_TYPES.RESELLER, () => (
    <ProvidersWrapper>
      <FormikWrapper formDeclaration={RESELLER_FORM_FIELDS}>{props => <ResellerForm form={props} />}</FormikWrapper>
    </ProvidersWrapper>
  ))
  .add(FORMS_TYPES.CREATE_ACCOUNT_FORM, () => (
    <ProvidersWrapper>
      <FormikWrapper formDeclaration={CREATE_ACCOUNT_FIELDS}>
        {props => <CreateAccountForm form={props} formLoading={false} />}
      </FormikWrapper>
    </ProvidersWrapper>
  ))

  .addParameters(setBackgrounds())
  .add(FORMS_TYPES.CONTACT_FORM, () => (
    <ProvidersWrapper>
      <FormikWrapper formDeclaration={CONTACT_FORM_FIELDS}>{props => <ContactForm form={props} />}</FormikWrapper>
    </ProvidersWrapper>
  ));

export default FormsStory;
