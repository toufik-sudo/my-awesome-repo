import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut } from 'lucide-react';
import ReactTooltip from 'react-tooltip';
import { useIntl } from 'react-intl';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { setModalState } from 'store/actions/modalActions';
import { LOG_OUT_MODAL } from 'constants/modal';
import { USER_DATA_COOKIE } from 'constants/general';
import { IStore } from 'interfaces/store/IStore';
import { TOOLTIP_FIELDS } from 'constants/tootltip';

import style from 'assets/style/components/wall/LeftNavigation.module.scss';

interface LogoutButtonProps {
  isCollapsed?: boolean;
}

/**
 * Atom component used to render logout button with tooltip support
 *
 * @constructor
 *
 * @see LogoutButtonStory
 */
const LogoutButton = ({ isCollapsed = false }: LogoutButtonProps) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const isAuthenticated = useSelector((store: IStore) => store.generalReducer.userLoggedIn);
  
  const logoutUser = () => {
    localStorage.removeItem(USER_DATA_COOKIE);
    dispatch(setModalState(true, LOG_OUT_MODAL));
  };

  const tooltipId = 'nav-tooltip-logout';
  const tooltipText = formatMessage({ id: 'wall.navigation.logout' });

  return (
    <>
      {isAuthenticated && (
        <div>
          <span 
            className={style.logoutButton} 
            onClick={logoutUser}
            data-tip={tooltipText}
            data-for={tooltipId}
          >
            <LogOut size={18} strokeWidth={1.75} />
            {!isCollapsed && (
              <DynamicFormattedMessage tag="span" id="wall.navigation.logout" />
            )}
          </span>
          <ReactTooltip
            id={tooltipId}
            place={TOOLTIP_FIELDS.PLACE_RIGHT}
            effect={TOOLTIP_FIELDS.EFFECT_SOLID}
            className="nav-tooltip"
            delayShow={isCollapsed ? 200 : 400}
            delayHide={100}
          >
            {tooltipText}
          </ReactTooltip>
        </div>
      )}
    </>
  );
};

export default LogoutButton;
