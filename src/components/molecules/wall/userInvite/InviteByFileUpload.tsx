import React from 'react';

import UserListDownloadOrganism from 'components/organisms/launch/userInviteFIle/UserListDownload.organism';
import { useUserListDropzone } from 'hooks/launch/useUserListDropzone';

/**
 * Molecule component used to render file upload invitation section
 * @constructor
 */
const InviteByFileUpload = () => {
  const userDropzonePayload = useUserListDropzone();

  return (
    <div>
      <UserListDownloadOrganism {...{ userDropzonePayload }} />
    </div>
  );
};

export default InviteByFileUpload;
