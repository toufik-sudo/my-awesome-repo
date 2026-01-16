import React from 'react';
import { FormattedMessage } from 'react-intl';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';

/**
 * Molecule component used to render email invitation Label
 *
 * @constructor
 */
const SendInvitationsLabel = () => {
  return (
    <>
      <FormattedMessage id="launchProgram.users.sendEmailInvitations" />
      <DynamicFormattedMessage tag="span" className={style.bold} id="launchProgram.users.emailInvitations" />
      <FormattedMessage id="launchProgram.users.to" />
      <DynamicFormattedMessage tag="span" className={style.bold} id="launchProgram.users.existingDatabase" />
    </>
  );
};

export default SendInvitationsLabel;
