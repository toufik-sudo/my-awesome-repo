import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { WALL_INVITE_USERS_ROUTE } from 'constants/routes';
import { useWallRoute } from 'hooks/wall/useWallRoute';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import style from 'sass-boilerplate/stylesheets/components/wall/UsersHeader.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';

/**
 * Molecule component used to render Send Users Invitation CTA
 *
 * @constructor
 */
const SendUsersInvitation = () => {
  const { usersInvitationIcon, usersInvitationLabel } = style;
  const { isUsersRoute } = useWallRoute();
  const { colorSidebar } = useSelectedProgramDesign();

  return (
    <Link to={WALL_INVITE_USERS_ROUTE} className={`${coreStyle['flex-center-total']} ${tableStyle.tableHeaderElem}`}>
      <span className={`${usersInvitationIcon} ${coreStyle.mr1}`}>
        <FontAwesomeIcon style={{ color: isUsersRoute ? colorSidebar : '' }} icon={faPlus} />
      </span>
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        className={usersInvitationLabel}
        id="wall.users.sendNewInvitation.cta"
      />
    </Link>
  );
};

export default SendUsersInvitation;
