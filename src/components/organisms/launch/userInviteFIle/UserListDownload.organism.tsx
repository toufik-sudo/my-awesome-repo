import React from 'react';

import UserListDropzoneOrganism from 'components/organisms/launch/userInviteFIle/UserListDropzone.organism';
import UserListAcceptedType from 'components/molecules/launch/userInviteList/UserListAcceptedType';

/**
 * Organism component used to render user list download
 *
 * @constructor
 */
const UserListDownloadOrganism = ({ userDropzonePayload }) => {
  return (
    <>
      <UserListDropzoneOrganism {...{ userDropzonePayload }} />
      <UserListAcceptedType />
    </>
  );
};

export default UserListDownloadOrganism;
