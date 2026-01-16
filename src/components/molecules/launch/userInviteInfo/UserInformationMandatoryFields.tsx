import React from 'react';
import { FormattedMessage } from 'react-intl';

import UserFieldRow from 'components/molecules/launch/userInviteInfo/UserFieldRow';
import UserInviteConfirmation from 'components/molecules/launch/userInviteInfo/UserInviteConfirmation';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useFormFields } from 'hooks/launch/useFormFields';
import { GET_FORM_FIELDS_API_REGISTER_TYPE } from 'constants/api';
import { INVITED_USERS_FIELDS } from 'constants/wall/launch';

import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';

/**
 * Molecule component used to render Mandatory fields for user invitation
 *
 * @constructor
 */
const UserInformationMandatoryFields = () => {
  const { formData, selectedFields, setSelectedFields } = useFormFields(
    GET_FORM_FIELDS_API_REGISTER_TYPE,
    INVITED_USERS_FIELDS
  );

  return (
    <div className={style.contentWrapper}>
      <DynamicFormattedMessage tag="p" id="launchProgram.users.extraInformation" />
      <p>
        <FormattedMessage id="launchProgram.users.mandatoryItems" />
        <DynamicFormattedMessage tag="span" className="bold accent" id="launchProgram.users.mandatory" />
        <FormattedMessage id="launchProgram.users.askTooMuch" />
      </p>
      <UserFieldRow {...{ selectedFields, setSelectedFields, formData }} isUserInformation={true} />
      <UserInviteConfirmation {...{ selectedFields }} />
    </div>
  );
};

export default UserInformationMandatoryFields;
