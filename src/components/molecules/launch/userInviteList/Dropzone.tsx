import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { LAUNCH_PROGRAM } from 'constants/wall/launch';
import { HTML_TAGS } from 'constants/general';

import style from 'assets/style/components/launch/UserListDownload.module.scss';

/**
 * Molecule component used to render userInviteList
 * NOTE: might change when we add functionality
 *
 * @param getRootProps
 * @param getInputProps
 * @param isDragActive
 * @constructor
 */
const Dropzone = ({ getRootProps, getInputProps, isDragActive }) => {
  const { userListDropzone, userListDropzoneInside, userListDropzoneActive } = style;

  return (
    <div {...getRootProps({ className: `${userListDropzone} ${[isDragActive ? userListDropzoneActive : '']}` })}>
      <input {...getInputProps()} />
      <DynamicFormattedMessage
        className={userListDropzoneInside}
        id={`${LAUNCH_PROGRAM}.users.download.dropHere`}
        tag={HTML_TAGS.P}
      />
    </div>
  );
};

export default Dropzone;
