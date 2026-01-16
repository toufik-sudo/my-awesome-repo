import React from 'react';

import NotificationsListHeaderElement from 'components/organisms/notifications/NotificationsListHeaderElement';
import { NOTIFICATION_GROUPS } from 'constants/notifications/notifications';

import listStyle from 'sass-boilerplate/stylesheets/components/notifications/NotificationList.module.scss';

/**
 * Component used to render notifications list header
 * @constructor
 */
const NotificationsListHeader = ({ setCategory, category }) => {
  const { notificationListHeader } = listStyle;
  const groups = NOTIFICATION_GROUPS;

  return (
    <div className={notificationListHeader}>
      {Object.values(groups).map((group, key) => (
        <NotificationsListHeaderElement key={key} {...{ group, setCategory, category }} />
      ))}
    </div>
  );
};

export default NotificationsListHeader;
