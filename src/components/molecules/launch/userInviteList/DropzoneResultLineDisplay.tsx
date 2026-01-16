import React from 'react';
import { FormattedMessage } from 'react-intl';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/components/launch/UserListDownload.module.scss';

/**
 * Molecule component used to display contacts and errors lines
 *
 * @param userData
 * @constructor
 */
const DropzoneResultLineDisplay = ({ totalInvalid, totalLines }) => {
  return (
    <div className={style.dropzoneResults}>
      <DynamicFormattedMessage
        tag="p"
        values={{ total: totalLines }}
        id="launchProgram.users.database"
        className={style.userListDropzoneResultContacts}
      />

      <DynamicFormattedMessage
        tag="p"
        className={style.userListDropzoneResultContacts}
        id="launchProgram.users.contacts"
        values={{ number: totalLines - totalInvalid }}
      />
      {!!totalInvalid && <FormattedMessage id="launchProgram.users.errors" values={{ number: totalInvalid }} />}
    </div>
  );
};

export default DropzoneResultLineDisplay;
