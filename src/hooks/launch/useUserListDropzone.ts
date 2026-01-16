import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { fileToFormData } from 'services/FileServices';
import { handleUserListOnDrop } from 'services/LaunchServices';
import { handleAvailableExtension } from 'utils/general';
import { useSelector } from 'react-redux';
import { IStore } from 'interfaces/store/IStore';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';

/**
 * Hook used to handle user list userInviteList
 */
export const useUserListDropzone = () => {
  const { invitedUserData } = useSelector((store: IStore) => store.launchReducer);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const userFileId = uploadResponse && (uploadResponse.data.invitedUsersFile || '');
  const platformId = usePlatformIdSelection();
  const callback = handleUserListOnDrop(
    userFileId,
    fileToFormData,
    {
      setUploadResponse,
      setFileUploading,
      setServerError
    },
    platformId
  );
  const onDrop = useCallback(callback, [userFileId]);
  const dropPayload = useDropzone({ onDrop, accept: handleAvailableExtension() });

  useEffect(() => {
    if (invitedUserData) {
      setUploadResponse({ ...uploadResponse, data: invitedUserData });
    }
  }, [invitedUserData]);

  return { ...dropPayload, uploadResponse, fileUploading, serverError, setUploadResponse };
};
