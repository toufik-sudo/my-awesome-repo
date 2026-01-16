import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import SendInvitationsControls from 'components/molecules/launch/userInviteInfo/SendInvitationsControls';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { DEFAULT } from 'constants/stories';
import { getSampleAction } from 'services/StoriesServices';

const SendInvitationsControlsStory = storiesOf('Molecules/Launch/Send invitations controls', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <SendInvitationsControls
        submitUserInviteFieldList={getSampleAction()}
        submitUserInviteListDecline={getSampleAction()}
      />
    </ProvidersWrapper>
  ));

export default SendInvitationsControlsStory;
