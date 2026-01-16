import React from 'react';

import UserListTemplateButtonsOrganism from 'components/organisms/launch/userInviteFIle/UserListTemplateButtons.organism';
import UserListDownloadOrganism from 'components/organisms/launch/userInviteFIle/UserListDownload.organism';
import UserListMainTitle from 'components/molecules/launch/userInviteList/UserListMainTitle';
import { useUserListDropzone } from 'hooks/launch/useUserListDropzone';
import { UserInviteErrorDisplay } from 'components/organisms/launch/userInviteFIle/UserInviteErrorDisplay.organism';
import style from 'assets/style/components/launch/UserListDownload.module.scss';

/**
 * Template component used to render launch program users upload
 *
 * @constructor
 */
const LaunchProgramUsersUploadTemplate = () => {
  const { userList, userUploadContainer } = style;
  const userDropzonePayload = useUserListDropzone();

  return (
    <div className={userUploadContainer}>
      <div className={userList}>
        <UserListMainTitle />
        <UserListTemplateButtonsOrganism />
        <UserListDownloadOrganism {...{ userDropzonePayload }} />
      </div>
      <UserInviteErrorDisplay uploadResponse={userDropzonePayload.uploadResponse} />
    </div>
  );
};

export default LaunchProgramUsersUploadTemplate;
