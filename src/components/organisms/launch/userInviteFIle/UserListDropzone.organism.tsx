import React from 'react';

import UploadedFiles from 'components/molecules/launch/userInviteList/UploadedFiles';
import Dropzone from 'components/molecules/launch/userInviteList/Dropzone';
import DropzoneResultOrganism from 'components/organisms/launch/userInviteFIle/DropzoneResult.organism';
import DropzoneLoader from 'components/atoms/launch/DropzoneLoader';

/**
 * Organism component used to render user list userInviteList
 *
 * @constructor
 */
const UserListDropzoneOrganism = ({ userDropzonePayload }) => {
  const {
    acceptedFiles,
    rejectedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    uploadResponse,
    fileUploading,
    serverError,
    setUploadResponse
  } = userDropzonePayload;
  if (fileUploading) return <DropzoneLoader />;

  let dropzoneOutput = <Dropzone {...{ getInputProps, getRootProps, isDragActive }} />;

  if (uploadResponse && !uploadResponse.data.message) {
    dropzoneOutput = <DropzoneResultOrganism {...{ uploadResponse, setUploadResponse }} />;
  }

  return (
    <>
      <UploadedFiles {...{ uploadResponse, acceptedFiles, rejectedFiles, serverError }} />
      {dropzoneOutput}
    </>
  );
};

export default UserListDropzoneOrganism;
