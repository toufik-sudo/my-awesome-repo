/* eslint-disable quotes */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import EmailList from 'components/molecules/wall/userInvite/EmailList';
import DynamicFormattedError from 'components/atoms/ui/DynamicFormattedError';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useEmailListData } from 'hooks/wall/useEmailListData';
import { emptyFn, hasValidEmailFormat } from 'utils/general';
import { HTML_TAGS, KEYCODES } from 'constants/general';
import { INVITE_EMAIL_LIMIT } from 'constants/wall/users';
import { EMAIL } from 'constants/validation';

import style from 'assets/style/common/Input.module.scss';
import settingsStyle from 'sass-boilerplate/stylesheets/components/wall/PersonalnformationSettings.module.scss';
import { useIntl } from 'react-intl';

/**
 * Molecule component used to render email invitation section
 * @param translationKey
 * @param id
 * @param userEmail
 * @param userData
 * @constructor
 */
const InviteByEmail = ({ translationKey, id, userEmail, userData }) => {
  const { container, defaultInputStyle } = style;

  const {
    addChip,
    addChipDisabled,
    addEmailContainer,
    inputEmail,
    customAddChip,
    errorEmail,
    customLabelInput
  } = settingsStyle;
  const { emails, addEmail, setEmail, removeEmail, email, error } = useEmailListData(userEmail, userData);
  const enableAdd = hasValidEmailFormat(email);
  const handleSubmit = e => {
    if (hasValidEmailFormat(e.target.value) && e.keyCode === KEYCODES.ENTER) {
      addEmail();
    }
  };
  const { formatMessage } = useIntl();

  return (
    <>
      <div className={`${container} ${addEmailContainer}`}>
        <EmailList {...{ emails, removeEmail }} />
        <DynamicFormattedMessage
          tag={HTML_TAGS.LABEL}
          className={`inputLabel ${customLabelInput}`}
          id={`${translationKey}${id}.label`}
        />
        <input
          className={`${defaultInputStyle} ${inputEmail}`}
          onKeyUp={handleSubmit}
          onChange={e => setEmail(e.target.value)}
          value={email}
          disabled={emails.length > INVITE_EMAIL_LIMIT}
          type={EMAIL}
          id={id}
          name="inviteUser"
          placeholder={id == 'email' ? formatMessage({id : `${translationKey}${id}.placeholder`}) : ''}
        />
        <span
          className={`${addChip} ${!enableAdd ? addChipDisabled : ''} ${customAddChip}`}
          onClick={() => (enableAdd ? addEmail() : emptyFn)}
        >
          <FontAwesomeIcon icon={faPlus} />
          <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={'label.add'} />
        </span>
        <DynamicFormattedError hasError={error} id={`wall.settings.account.${error}`} className={errorEmail} />
      </div>
    </>
  );
};

export default InviteByEmail;
