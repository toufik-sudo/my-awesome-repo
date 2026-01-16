import React, { useContext } from 'react';

import GenericFormBuilder from 'components/organisms/form-wrappers/GenericFormBuilder';
import RegisterFormAdditional from 'components/molecules/onboarding/RegisterPage/RegisterFormAdditional';
import { RegisterFormContext } from 'components/molecules/onboarding/RegisterPage/MultiStepRegisterWrapper';

import style from 'assets/style/common/Labels.module.scss';

/**
 * Molecule component used to render register common form
 * @param formFields
 * @param additionalForm
 * @constructor
 */
const RegisterGenericForm = ({ formFields, additionalForm = null }) => {
  const { onSubmit } = useContext(RegisterFormContext);
  const { block } = style;

  return (
    <div className={`${block}`}>
      <GenericFormBuilder
        formAction={(values, props) => {
          onSubmit(props, values);
        }}
        formDeclaration={formFields}
        validateOnMount={true}
        disableSubmit={true}
        formSlot={form => <RegisterFormAdditional form={form} additionalForm={additionalForm} />}
      />
    </div>
  );
};

export default RegisterGenericForm;
