import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import listStyle from 'sass-boilerplate/stylesheets/components/notifications/NotificationList.module.scss';

/**
 * Component used to render notification list header element
 * @param notificationHeaderElement
 * @constructor
 */
const NotificationsListHeaderElement = ({ group, category, setCategory }) => {
  const keyPrefix = 'notifications.list.header.';
  const { notificationListHeaderItem, active } = listStyle;
  const isSelected = group.id === category;

  return (
    <div className={`${notificationListHeaderItem} ${isSelected ? active : ''}`}>
      <DynamicFormattedMessage
        id={`${keyPrefix}${group.value}`}
        tag={HTML_TAGS.SPAN}
        onClick={() => setCategory(group.id)}
      />
    </div>
  );
};

export default NotificationsListHeaderElement;
