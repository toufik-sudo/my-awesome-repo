import React, { useState } from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { hasValidEmailFormat } from 'utils/general';
import { HTML_TAGS } from 'constants/general';
import { EMAIL } from 'constants/validation';

import inputStyle from 'sass-boilerplate/stylesheets/layout/Input.module.scss';
import style from 'assets/style/common/Input.module.scss';

/**
 * Molecule component used to render email invitation section
 * @param id
 * @param translationKey
 * @param setUserEmail
 * @param userEmail
 * @constructor
 */
const UserEmail = ({ id, translationKey, setUserEmail, userEmail }) => {
  const { container, defaultInputStyle, noIcon, floating, hasValue } = style;
  const [newEmail, setEmail] = useState(userEmail);
  const [error, setEmailError] = useState('');

  const handleSubmit = e => {
    if (hasValidEmailFormat(e.target.value)) {
      setUserEmail(e.target.value);
      setEmailError('');
    }
  };

  const handleChange = e => {
    if (!hasValidEmailFormat(e.target.value)) {
      setEmailError('form.validation.invalid.email');
    }
    setEmail(e.target.value);
  };

  return (
    <div className={`${container} ${noIcon} ${floating} ${hasValue}`}>
      <input
        className={defaultInputStyle}
        onKeyUp={handleSubmit}
        onChange={e => handleChange(e)}
        value={newEmail}
        type={EMAIL}
        id={id}
        name={'userEmail'}
        disabled={true}
      />
      <DynamicFormattedMessage tag={HTML_TAGS.LABEL} className="inputLabel" id={`${translationKey}`} />
      {!!error.length && <DynamicFormattedMessage tag={HTML_TAGS.DIV} id={error} className={inputStyle.error} />}
    </div>
  );
};

export default UserEmail;
