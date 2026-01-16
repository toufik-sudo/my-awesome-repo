import React from 'react';

import UploadedFiles from 'components/molecules/launch/userInviteList/UploadedFiles';
import UserDeclarationUploadErrors from './UserDeclarationUploadErrors';
import Dropzone from 'components/molecules/launch/userInviteList/Dropzone';
import DropzoneLoader from 'components/atoms/launch/DropzoneLoader';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { convertBytesToMb } from 'utils/files';
import { buildEmbbededHtmlPart } from 'services/IntlServices';

/**
 * Molecule component used to render user declaration file dropzone
 * @param fileDropzoneProps
 * @constructor
 */
const UserDeclarationFileDropzone = ({ fileDropzoneProps }) => {
  const {
    acceptedFiles,
    rejectedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    fileUploading,
    uploadResponse,
    fileError,
    accept,
    maxSize,
    onRemove
  } = fileDropzoneProps;

  if (fileUploading) {
    return <DropzoneLoader />;
  }

  return (
    <>
      <UploadedFiles
        {...{
          uploadResponse: true,
          acceptedFiles,
          rejectedFiles,
          onRemove,
          serverError: fileError,
          messagesPrefix: 'wall.userDeclaration.upload'
        }}
      />
      <Dropzone {...{ getInputProps, getRootProps, isDragActive }} />
      <DynamicFormattedMessage
        id="wall.userDeclaration.upload.acceptedTypesAndSize"
        tag={HTML_TAGS.P}
        values={{
          extensions: accept.join(', '),
          maxMbSize: convertBytesToMb(maxSize),
          strong: buildEmbbededHtmlPart({ tag: HTML_TAGS.STRONG })
        }}
      />
      {uploadResponse && <UserDeclarationUploadErrors uploadResponse={uploadResponse} />}
    </>
  );
};

export default UserDeclarationFileDropzone;
