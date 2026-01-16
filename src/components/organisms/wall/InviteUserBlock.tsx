import React from 'react';
import { Link } from 'react-router-dom';

import InviteUsersList from 'components/organisms/wall/InviteUsersList';
import GeneralBlock from 'components/molecules/block/GeneralBlock';
import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS, WALL_TYPE } from 'constants/general';
import { USERS_ROUTE } from 'constants/routes';
import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';
import { useHandleInvitesSubmission } from 'hooks/wall/useHandleInvitesSubmission';
import { GeneralErrorBlock } from 'components/molecules/wall/blocks/GeneralErrorBlock';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';

/**
 * Organism component used to render users invitation block
 * @constructor
 */
const InviteUserBlock = () => {
  const { mt1, mt0, mb1, m2, withPrimaryColor, withDangerColor, textCenter, px4, tLandscapeMt8 } = coreStyle;
  const {
    handleSubmitInvites,
    forceRemountKey,
    inviteError,
    isProgramValid,
    activeTab,
    setActiveTab,
    isSubmitting,
    isDisabled
  } = useHandleInvitesSubmission();

  const { withFontSmall, pl1, pt05, withGrayColor } = coreStyle;

  if (!isProgramValid) {
    return (
      <LeftSideLayout theme={WALL_TYPE} hasUserIcon>
        <div className={px4}>
          <GeneralErrorBlock id="wall.invitations.program.notSelected" />
        </div>
      </LeftSideLayout>
    );
  }

  return (
    <LeftSideLayout theme={WALL_TYPE} hasUserIcon>
      <div className={`${px4} ${tLandscapeMt8}`}>
        <GeneralBlock className={mt0}>
          <DynamicFormattedMessage
            className={`${mt1} ${mb1} ${withPrimaryColor}`}
            tag={HTML_TAGS.H1}
            id={`wall.send.invitation.title`}
          />
          {inviteError && (
            <DynamicFormattedMessage tag={HTML_TAGS.P} className={withDangerColor} id={`wall.send.invitation.error`} />
          )}
          <InviteUsersList key={forceRemountKey} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className={`${textCenter} ${m2}`}>
            <Link to={USERS_ROUTE}>
              <DynamicFormattedMessage variant={BUTTON_MAIN_VARIANT} tag={Button} id={`wall.send.invitation.back`} />
            </Link>
            <DynamicFormattedMessage
              tag={Button}
              type={isDisabled ? BUTTON_MAIN_TYPE.DISABLED : BUTTON_MAIN_TYPE.PRIMARY}
              disabled={isDisabled || isSubmitting}
              loading={isSubmitting}
              id={`wall.send.invitation.invite`}
              onClick={() => handleSubmitInvites(activeTab)}
            />
          </div>
        </GeneralBlock>
          <DynamicFormattedMessage
            className={`${pl1} ${withFontSmall} ${withGrayColor} ${pt05}`}
            tag={HTML_TAGS.P}
            id={`wall.send.invitation.warning`}
          />
      </div>
    </LeftSideLayout>
  );
};

export default InviteUserBlock;
