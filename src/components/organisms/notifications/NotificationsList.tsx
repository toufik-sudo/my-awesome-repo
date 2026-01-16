import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import NotificationMapper from 'services/notifications/NotificationMapper';
import GeneralBlock from 'components/molecules/block/GeneralBlock';
import NotificationsListHeader from 'components/organisms/notifications/NotificationsListHeader';
import NotificationsListItem from 'components/organisms/notifications/NotificationsListItem';
import GenericInfiniteScroll from 'components/atoms/list/GenericInfiniteScroll';
import useNotificationsData from 'hooks/notifications/useNotificationsData';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import listStyle from 'sass-boilerplate/stylesheets/components/notifications/NotificationList.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render notification page
 * @constructor
 */
const NotificationsList = () => {
  const { isLoading, scrollRef, setCategory, hasMore, notifications, loadMore, category } = useNotificationsData();
  const history = useHistory();
  const dispatch = useDispatch();
  const notificationMapper = useMemo(() => new NotificationMapper(dispatch, history), [dispatch, history]);
  const { scrollXContainer, height710: height, mt2, mt0, withDangerColor, textCenter } = coreStyle;

  return (
    <GeneralBlock className={`${scrollXContainer} ${mt0}`}>
      <div className={listStyle.notificationList}>
        <NotificationsListHeader {...{ setCategory, category, isLoading }} />
        <GenericInfiniteScroll
          {...{
            hasMore,
            loadMore,
            scrollRef,
            isLoading,
            height
          }}
        >
          <>
            {notifications.map((notification, index) => (
              <NotificationsListItem key={index} {...{ notification, notificationMapper }} />
            ))}
            {!isLoading && !notifications.length && (
              <DynamicFormattedMessage
                className={`${textCenter} ${withDangerColor} ${mt2}`}
                tag={HTML_TAGS.P}
                id="notifications.list.none"
              />
            )}
          </>
        </GenericInfiniteScroll>
      </div>
    </GeneralBlock>
  );
};

export default NotificationsList;
