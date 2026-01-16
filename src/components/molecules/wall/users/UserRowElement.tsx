import React from 'react';
import { Link } from 'react-router-dom';
import UserProgramRole from 'components/atoms/wall/users/UserProgramRole';
import UserProgramStatus from 'components/atoms/wall/users/UserProgramStatus';
import MomentUtilities from 'utils/MomentUtilities';
import UserPendingJoin from 'components/atoms/wall/users/UserPendingJoin';
import { USERS_DETAILS_ROUTE } from 'constants/routes';
import { USER_PROGRAM_STATUS } from 'constants/api/userPrograms';

import style from 'sass-boilerplate/stylesheets/components/wall/UserRowElement.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render Users Row Element
 *
 * @constructor
 */
const UserRowElement = ({ user, onProgramOnly, ongoingProgram, isValidatingJoin, confirmJoinAction }) => {
  const { uuid: id, firstName, lastName, createdAt, status, email, ranking, croppedPicturePath, points } = user;
  const shouldDisplayJoinValidationControls = status === USER_PROGRAM_STATUS.PENDING && ongoingProgram;
  const {
    borderRadiusFull,
    width4,
    height4,
    verticalAlignMiddle,
    textRight,
    mr1,
    flex,
    flexAlignItemsCenter
  } = coreStyle;

  return (
    <>
      <tr>
        <td>
          <Link to={`${USERS_DETAILS_ROUTE}/${id}`} className={`${flex} ${flexAlignItemsCenter}`}>
            {croppedPicturePath && (
              <div className={textRight}>
                <img
                  src={croppedPicturePath}
                  className={`${borderRadiusFull} ${width4} ${height4} ${mr1} ${verticalAlignMiddle}`}
                  alt=""
                />
              </div>
            )}
            {firstName}
          </Link>
        </td>
        <td>
          <Link to={`${USERS_DETAILS_ROUTE}/${id}`}>{lastName}</Link>
        </td>
        <td>{points}</td>
        <td>{ranking ? ranking : '-'}</td>
        <td>
          <Link to={`${USERS_DETAILS_ROUTE}/${id}`}>{email}</Link>
        </td>
        <td>{MomentUtilities.formatDate(createdAt)}</td>
        <td>
          <UserProgramRole {...{ user, onProgramOnly, style }} />
        </td>
        <td>
          <UserProgramStatus {...{ userId: id, status, onProgramOnly, style }} />
          {shouldDisplayJoinValidationControls && (
            <UserPendingJoin {...{ userId: id, status, isValidatingJoin, confirmJoinAction }} />
          )}
        </td>
      </tr>
    </>
  );
};

export default UserRowElement;
