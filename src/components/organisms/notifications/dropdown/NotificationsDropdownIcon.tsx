import React from 'react';

import NotificationsDropdown from 'components/organisms/notifications/dropdown/NotificationsDropdown';
import useNotificationsDropdownData from 'hooks/notifications/useNotificationsDropdownData';

import componentStyle from 'sass-boilerplate/stylesheets/components/notifications/NotificationDropdown.module.scss';
import componentListStyle from 'sass-boilerplate/stylesheets/components/notifications/NotificationList.module.scss';

/**
 * Organism component used to render modification button and dropdown
 * @param icon
 * @constructor
 */
const NotificationsDropdownIcon = ({ icon }) => {
  const { notificationsDropdownIcon, notificationsDropdownWrapper, notificationsDropdownBackdrop } = componentStyle;
  const { dropdownIcon, badge } = componentListStyle;

  const {
    notifications,
    isOpen,
    isLoading,
    openNotifications,
    closeNotifications,
    notificationsCount,
    lastNotificationsCount
  } = useNotificationsDropdownData();

  return (
    <div className={notificationsDropdownWrapper}>
      <div className={notificationsDropdownIcon} onClick={openNotifications}>
        {icon}
        {!!notificationsCount && <span className={`${badge} ${dropdownIcon}`}>{notificationsCount}</span>}
      </div>
      {isOpen && (
        <div onClick={closeNotifications}>
          <div className={notificationsDropdownBackdrop} />
          <NotificationsDropdown {...{ notifications, isLoading, lastNotificationsCount }} />
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdownIcon;
