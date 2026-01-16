import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimesCircle, faUserTag } from '@fortawesome/free-solid-svg-icons';

import UserProgramStatusActions from 'components/molecules/wall/user-details/UserProgramStatusActions';
import { USER_DETAILS_STYLE } from 'constants/wall/design';
import { ONGOING, PENDING } from 'constants/wall/users';
import { canChangeUserProgramRole } from 'services/UsersServices';

import style from 'sass-boilerplate/stylesheets/components/wall/WallUserDetails.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render user detials program row
 * @param row
 * @param type
 * @param setUserBlockingError
 * @constructor
 */
const UserDetailsProgramRow = ({ row, type, ...actions }) => {
  const {
    userDetailsProgramsRow,
    userDetailsProgramsRowElement,
    userDetailsDanger,
    userDetailsCheck,
    userDetailsSmIcon
  } = style;
  const { withGrayAccentColor, withGrayAccentLightColor, flexSpace1, pointer, flexSpace2 } = coreStyle;

  const rowStyle = USER_DETAILS_STYLE[row.status];
  const displayUserRoleCta = type === ONGOING && canChangeUserProgramRole(row);

  return (
    <div className={userDetailsProgramsRow}>
      <p className={flexSpace1}>{row.name}</p>
      <p className={flexSpace1}>{row.date}</p>
      <p className={flexSpace1}>
        {type !== PENDING && (
          <FontAwesomeIcon
            className={`${row.subscribed ? userDetailsCheck : userDetailsDanger} ${userDetailsSmIcon}`}
            icon={row.subscribed ? faCheck : faTimesCircle}
          />
        )}
      </p>
      <p className={`${flexSpace1} ${userDetailsProgramsRowElement}`}>
        <span>{row.role}</span>
        {displayUserRoleCta && (
          <FontAwesomeIcon
            className={`${withGrayAccentColor} ${pointer}`}
            icon={faUserTag}
            onClick={() => actions.openRoleModal(row)}
          />
        )}
      </p>
      <p
        className={`${
          rowStyle ? rowStyle.statusClass : withGrayAccentLightColor
        } ${flexSpace2}${userDetailsProgramsRowElement}`}
      >
        <span>{row.status}</span>
        <UserProgramStatusActions {...{ type, rowStyle, rowData: row, ...actions }} />
      </p>
      <p />
    </div>
  );
};

export default UserDetailsProgramRow;
