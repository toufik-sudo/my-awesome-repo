import React from 'react';

import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { PUBLIC_URL } from 'constants/general';
import { LAUNCH_PROGRAM } from 'constants/wall/launch';
import style from 'assets/style/components/launch/UserListDownload.module.scss';

/**
 * Molecule component used to display a single download button for quick launch program
 *
 * @param type
 * @constructor
 */
const ButtonDownload = ({ type }) => {
  const file = `${PUBLIC_URL}/template${type}`;

  return (
    <li>
      <a href={file} download={file}>
        <DynamicFormattedMessage
          className={style.listItem}
          tag={Button}
          id={`${LAUNCH_PROGRAM}.users.download.type${type}`}
        />
      </a>
    </li>
  );
};

export default ButtonDownload;
