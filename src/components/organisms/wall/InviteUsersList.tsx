import React from 'react';

import InviteUserElement from 'components/molecules/wall/userInvite/InviteUserElement';
import InviteByEmailContainer from 'components/molecules/wall/userInvite/InviteByEmailContainer';
import InviteByFileUpload from 'components/molecules/wall/userInvite/InviteByFileUpload';
import InviteAllUsers from 'components/molecules/wall/userInvite/InviteByFileAllUsers';
import { EMAIL, FILE, ALL_USERS } from 'constants/wall/users';

/**
 * Organism comnponent used to render user invitation list
 * @constructor
 */
const InviteUsersList = ({ activeTab, setActiveTab }) => {
  return (
    <>
      <InviteUserElement
        {...{
          active: activeTab,
          setActive: setActiveTab,
          invitationType: { id: EMAIL, component: InviteByEmailContainer }
        }}
      />
      <InviteUserElement
        {...{
          active: activeTab,
          setActive: setActiveTab,
          invitationType: { id: FILE, component: InviteByFileUpload }
        }}
      />
      <InviteUserElement
        {...{
          active: activeTab,
          setActive: setActiveTab,
          invitationType: { id: ALL_USERS, component: InviteAllUsers }
        }}
      />
    </>
  );
};

export default InviteUsersList;
