import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { IArrayKey } from 'interfaces/IGeneral';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { LAUNCH_PROGRAM } from 'constants/wall/launch';
import { getDropzoneTitle } from 'services/LaunchServices';
import { HTML_TAGS } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import style from 'assets/style/components/launch/UserListDownload.module.scss';

/**
 * Atom component used to render the uploaded files
 *
 * @param files
 * @constructor
 */
const UploadedFiles = ({
  acceptedFiles,
  rejectedFiles,
  serverError,
  uploadResponse,
  onRemove = undefined,
  messagesPrefix = `${LAUNCH_PROGRAM}.users.download`
}) => {
  const { userListDropzoneTitle, userListDropzoneTitleError } = style;
  const { className, type } = getDropzoneTitle(rejectedFiles, serverError, {
    userListDropzoneTitle,
    userListDropzoneTitleError
  });

  if (!acceptedFiles.length || serverError || !uploadResponse) {
    return <DynamicFormattedMessage className={className} tag={HTML_TAGS.P} id={`${messagesPrefix}.${type}`} />;
  }

  return (
    <div className={`${coreStyle.displayFlex} ${coreStyle['flex-center-vertical']}`}>
      {onRemove && (
        <FontAwesomeIcon icon={faTimes} onClick={onRemove} className={`${coreStyle.mr1} ${coreStyle.pointer}`} />
      )}
      <div className={userListDropzoneTitle}>{(acceptedFiles[0] as IArrayKey<any>).path}</div>
    </div>
  );
};
export default UploadedFiles;
