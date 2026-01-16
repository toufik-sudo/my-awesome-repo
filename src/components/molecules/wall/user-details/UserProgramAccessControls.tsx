import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import { BLOCK_USER_MODAL } from 'constants/modal';
import { setModalState } from 'store/actions/modalActions';

import style from 'sass-boilerplate/stylesheets/components/wall/WallUserDetails.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Component used to render program row actions for blocking/unblocking a user
 * @param rowData
 * @param rowStyle
 * @param actionHandlers
 * @constructor
 */
const UserProgramAccessControls = ({ rowData, rowStyle, ...actionHandlers }) => {
  const { userDetailsDanger, userDetailsSmIcon } = style;
  const dispatch = useDispatch();

  const handlePendingModal = ({ rowData, ...actionHandlers }) => {
    dispatch(
      setModalState(true, BLOCK_USER_MODAL, {
        ...{ programId: rowData.id, status: rowData.status || 'Active', ...actionHandlers }
      })
    );
  };

  return (
    <FontAwesomeIcon
      onClick={() => handlePendingModal({ ...{ rowData, ...actionHandlers } })}
      className={`${rowStyle ? rowStyle.iconClass : userDetailsDanger} ${userDetailsSmIcon} ${coreStyle.mx1}`}
      icon={rowStyle ? rowStyle.icon : faTimesCircle}
    />
  );
};

export default UserProgramAccessControls;
