import React from 'react';

import { DynamicFormattedMessage } from '../../atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { emptyFn } from 'utils/general';
import { NOTIFICATION_ID_TYPE } from 'constants/notifications/notifications';

import componentStyle from 'sass-boilerplate/stylesheets/components/notifications/NotificationDropdown.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import listStyle from 'sass-boilerplate/stylesheets/components/notifications/NotificationList.module.scss';
import logoNoText from 'assets/images/logo/logo-no-text.png';

/**
 * Component used to render notification list element
 * @param notification
 * @param notificationMapper
 * @constructor
 */
const NotificationsListItem = ({ notification, notificationMapper }) => {
  const {
    notificationsDropdownItem,
    notificationsDropdownItemImage,
    notificationsDropdownItemContent,
    notificationsDropdownItemRow,
    notificationsDropdownNew
  } = componentStyle;
  const {
    withBoldFont,
    withSecondaryColor,
    withGrayLightAccentColor,
    pr05,
    withLightFont,
    pointer,
    textDecorationUnderline
  } = coreStyle;
  const {
    url,
    username,
    date,
    hour,
    isNew,
    title,
    id,
    isTitleFirst,
    intlValues,
    onHandle,
    role,
    isIntl
  } = notificationMapper.mapNotificationData(notification);
  if (!id) {
    return null;
  }

  const titleClass = withSecondaryColor;
  let notificationTranslationMessageId = `notifications.actions.${id}`;
  if (role && id === NOTIFICATION_ID_TYPE.PLATFORM_ROLE_UPDATED) {
    notificationTranslationMessageId = `notifications.actions.${id}.${role}`;
  }

  if (role && id === NOTIFICATION_ID_TYPE.NEW_SECURITY_ROLE) {
    notificationTranslationMessageId = `notifications.actions.${id}.${role}`;
  }

  return (
    <div className={listStyle.notificationListContainer}>
      <div className={notificationsDropdownItem}>
        <div className={notificationsDropdownItemImage} style={{ backgroundImage: `url(${url || logoNoText})` }} />
        <div className={notificationsDropdownItemContent}>
          <div className={notificationsDropdownItemRow}>
            <span className={listStyle.notificationListWrapper}>
              {username && <span className={`${withBoldFont} ${pr05}`}>{username}</span>}
              {isTitleFirst && (
                <span
                  className={`${titleClass} ${textDecorationUnderline} ${onHandle ? pointer : ''} ${pr05}`}
                  onClick={onHandle || emptyFn}
                >
                  {(isIntl && <DynamicFormattedMessage id={title} tag={HTML_TAGS.SPAN} />) || title}
                </span>
              )}
              <DynamicFormattedMessage
                className={withGrayLightAccentColor}
                id={notificationTranslationMessageId}
                values={intlValues}
                tag={HTML_TAGS.SPAN}
              />
              {!isTitleFirst && (
                <span
                  className={`${titleClass} ${textDecorationUnderline} ${onHandle ? pointer : ''} ${pr05}`}
                  onClick={onHandle || emptyFn}
                >
                  {(isIntl && <DynamicFormattedMessage id={title} tag={HTML_TAGS.SPAN} />) || title}
                </span>
              )}
            </span>
            <span className={`${withGrayLightAccentColor} ${withLightFont}`}>
              <span>{`${date}  `}</span>
              <span className={titleClass}>{hour}</span>
              {isNew && (
                <DynamicFormattedMessage
                  className={notificationsDropdownNew}
                  id={`notifications.label.new`}
                  tag={HTML_TAGS.SPAN}
                />
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsListItem;
