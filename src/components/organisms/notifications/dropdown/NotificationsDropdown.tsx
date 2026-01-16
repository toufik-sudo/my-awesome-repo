import React, { useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';

import NotificationsDropdownItem from 'components/organisms/notifications/dropdown/NotificationsDropdownItem';
import NotificationMapper from 'services/notifications/NotificationMapper';
import Loading from 'components/atoms/ui/Loading';
import { LOADER_TYPE, HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { NOTIFICATIONS_ROUTE, WALL_ROUTE } from 'constants/routes';
import { NOTIFICATIONS_DROPDOWN_LIMIT } from 'constants/notifications/notifications';
import { useDispatch } from 'react-redux';

import componentStyle from 'sass-boilerplate/stylesheets/components/notifications/NotificationDropdown.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render notifications dropdown
 * @constructor
 */

const NotificationsDropdown = ({ notifications, isLoading, lastNotificationsCount }) => {
  const { notificationsDropdownElement, notificationsDropdownElementContent } = componentStyle;
  const { textCenter, withSecondaryColor, displayBlock, mt3, withDangerColor } = coreStyle;
  const history = useHistory();
  const dispatch = useDispatch();
  const notificationMapper = useMemo(() => new NotificationMapper(dispatch, history), [dispatch, history]);

  return (
    <>
      <div className={notificationsDropdownElement}>
        <div className={notificationsDropdownElementContent}>
          <DynamicFormattedMessage
            id="notifications.cta.see.all"
            tag={Link}
            to={`${WALL_ROUTE}${NOTIFICATIONS_ROUTE}`}
            className={`${textCenter} ${withSecondaryColor} ${displayBlock}`}
          />
          {isLoading && <Loading className={withSecondaryColor} type={LOADER_TYPE.DROPZONE} />}
          {!isLoading && !notifications.length && (
            <DynamicFormattedMessage
              className={`${textCenter} ${withDangerColor} ${mt3}`}
              tag={HTML_TAGS.P}
              id="notifications.preview.none"
            />
          )}
          {!isLoading &&
            notifications.map((notification, index) => (
              <NotificationsDropdownItem key={index} {...{ notification, notificationMapper }} />
            ))}
          {notifications.length && lastNotificationsCount > NOTIFICATIONS_DROPDOWN_LIMIT ? (
            <DynamicFormattedMessage
              id="notifications.dropdown.other"
              values={{ value: lastNotificationsCount - NOTIFICATIONS_DROPDOWN_LIMIT }}
              tag={HTML_TAGS.SPAN}
              className={`${textCenter} ${withSecondaryColor} ${displayBlock}`}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default NotificationsDropdown;
