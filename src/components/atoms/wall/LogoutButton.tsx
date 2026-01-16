import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut } from 'lucide-react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { setModalState } from 'store/actions/modalActions';
import { LOG_OUT_MODAL } from 'constants/modal';
import { USER_DATA_COOKIE } from 'constants/general';
import { IStore } from 'interfaces/store/IStore';

import style from 'assets/style/components/wall/LeftNavigation.module.scss';

/**
 * Atom component used to render logout button
 *
 * @constructor
 *
 * @see LogoutButtonStory
 */
const LogoutButton = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((store: IStore) => store.generalReducer.userLoggedIn);
  const logoutUser = () => {
    localStorage.removeItem(USER_DATA_COOKIE);
    dispatch(setModalState(true, LOG_OUT_MODAL));
  };

  return (
    <>
      {isAuthenticated && (
        <span className={style.logoutButton} onClick={logoutUser}>
          <LogOut size={18} strokeWidth={1.75} />
          <DynamicFormattedMessage tag="span" id="wall.navigation.logout" />
        </span>
      )}
    </>
  );
};

export default LogoutButton;
