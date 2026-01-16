import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import Loading from 'components/atoms/ui/Loading';
import { LOADER_TYPE } from 'constants/general';
import { HEIGHT, THRESHOLD } from 'constants/wall/posts';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Wraps an infinite scroll component
 *
 * @param hasMore
 * @param loadMore
 * @param scrollRef
 * @param children
 * @param didLoadData
 * @param height
 * @param className
 * @constructor
 */
const GenericInfiniteScroll = ({
  hasMore,
  loadMore,
  scrollRef = '',
  children,
  isLoading = false,
  height = coreStyle.height400,
  className = ''
}) => {
  const { overflowYauto, mt2 } = coreStyle;

  return (
    <div className={`${height} ${overflowYauto} ${className}`}>
      <InfiniteScroll
        hasMore={!isLoading && hasMore}
        threshold={THRESHOLD}
        height={HEIGHT}
        useWindow={false}
        loadMore={loadMore}
        initialLoad={false}
        isReverse={false}
        scrollref={scrollRef}
      >
        <>
          {children}
          {(isLoading || hasMore) && <Loading type={LOADER_TYPE.DROPZONE} className={mt2} />}
        </>
      </InfiniteScroll>
    </div>
  );
};

export default GenericInfiniteScroll;
