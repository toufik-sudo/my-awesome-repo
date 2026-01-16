import React from 'react';

import InviteByEmail from './InviteByEmail';
import { EMAIL } from 'constants/validation';
import useUpdateUserData from 'hooks/wall/useUpdateUserData';

const InviteByEmailContainer = () => {
  const userData = useUpdateUserData();

  return (
    <InviteByEmail
      translationKey={'wall.send.invitation.'}
      id={EMAIL}
      userEmail={userData.userEmail}
      userData={userData}
    />
  );
};

export default InviteByEmailContainer;
