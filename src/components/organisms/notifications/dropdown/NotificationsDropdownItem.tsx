import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { emptyFn } from 'utils/general';
import { NOTIFICATION_ID_TYPE } from 'constants/notifications/notifications';

import componentStyle from 'sass-boilerplate/stylesheets/components/notifications/NotificationDropdown.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import logoNoText from 'assets/images/logo/logo-no-text.png';

/**
 * Component used to render one dropdown notification row
 * @param notification
 * @param notificationMapper
 * @constructor
 */
const NotificationsDropdownItem = ({ notification, notificationMapper }) => {
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
    textDecorationUnderline,
    pointer
  } = coreStyle;
  const {
    url,
    username,
    date,
    hour,
    isNew,
    title,
    id,
    onHandle,
    intlValues,
    isTitleFirst,
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
    <div className={notificationsDropdownItem}>
      <div className={notificationsDropdownItemImage} style={{ backgroundImage: `url(${url || logoNoText})` }} />
      <div className={notificationsDropdownItemContent}>
        {isTitleFirst && (
          <div
            className={`${notificationsDropdownItemRow} ${titleClass} ${textDecorationUnderline}  ${pr05}
            ${onHandle ? pointer : ''}`}
            onClick={onHandle || emptyFn}
          >
            {(isIntl && <DynamicFormattedMessage id={title} tag={HTML_TAGS.SPAN} />) || title}
          </div>
        )}
        <div className={notificationsDropdownItemRow}>
          {username && <span className={`${withBoldFont} ${pr05}`}>{username}</span>}
          <DynamicFormattedMessage
            className={withGrayLightAccentColor}
            id={notificationTranslationMessageId}
            tag={HTML_TAGS.SPAN}
            values={intlValues}
          />
        </div>
        {!isTitleFirst && (
          <div
            className={`${notificationsDropdownItemRow} ${titleClass} ${textDecorationUnderline}  ${pr05}
            ${onHandle ? pointer : ''}`}
            onClick={onHandle || emptyFn}
          >
            {(isIntl && <DynamicFormattedMessage id={title} tag={HTML_TAGS.SPAN} />) || title}
          </div>
        )}
        <div className={`${notificationsDropdownItemRow} ${withGrayLightAccentColor} ${withLightFont}`}>
          <span>{`${date}  `}</span>
          <span className={titleClass}>{hour}</span>
          {isNew && (
            <DynamicFormattedMessage
              className={notificationsDropdownNew}
              id={`notifications.label.new`}
              tag={HTML_TAGS.SPAN}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsDropdownItem;
