import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import ButtonSubmitForm from 'components/atoms/ui/ButtonSubmitForm';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { WALL_PROGRAM_ROUTE } from 'constants/routes';

import buttonStyle from 'assets/style/common/Button.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
/**
 * Component used on program join form
 * @param form
 * @param setFormDataChanged
 * @constructor
 */
const ProgramJoinFormAdditional = ({ form, setFormDataChanged }) => {
  const history = useHistory();
  const { validateForm, isSubmitting, isValid, dirty } = form;

  useEffect(() => {
    validateForm && validateForm();
  }, [validateForm]);

  useEffect(() => {
    setFormDataChanged(dirty);
  }, [setFormDataChanged, dirty]);

  return (
    <div className={coreStyle.btnCenter}>
      <ButtonFormatted
        buttonText="form.label.back"
        type={BUTTON_MAIN_TYPE.DANGER}
        className={coreStyle.mr05}
        onClick={() => history.replace(WALL_PROGRAM_ROUTE)}
      />
      <ButtonSubmitForm
        {...{
          isSubmitting: isSubmitting,
          loading: isSubmitting,
          buttonText: 'form.submit.next',
          className: isValid ? buttonStyle.primary : buttonStyle.disabled,
          nextStepDisabled: !isValid
        }}
      />
    </div>
  );
};

export default ProgramJoinFormAdditional;
