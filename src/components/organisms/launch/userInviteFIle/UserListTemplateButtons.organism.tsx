import React from 'react';

import ButtonDownload from 'components/atoms/ui/ButtonDownload';
import { ACCEPTED_USERS_LIST_TYPE } from 'constants/wall/launch';

import style from 'assets/style/components/launch/UserListDownload.module.scss';

/**
 * Organism component used to render user list template download button
 *
 * @constructor
 */
const UserListTemplateButtonsOrganism = () => {
  return (
    <ul className={style.templateDownloadList}>
      {ACCEPTED_USERS_LIST_TYPE.map(type => (
        <ButtonDownload {...{ type }} key={type} />
      ))}
    </ul>
  );
};

export default UserListTemplateButtonsOrganism;
