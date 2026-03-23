/**
 * VirtualList - Reusable virtualized list component using TanStack Virtual
 * Efficiently renders large lists by only rendering visible items.
 *
 * @example
 * <VirtualList
 *   items={data}
 *   estimateSize={50}
 *   renderItem={(item, index) => <div>{item.name}</div>}
 * />
 */

import React, { useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';

export interface VirtualListProps<T> {
  /** Array of items to render */
  items: T[];
  /** Estimated height of each item in pixels */
  estimateSize: number;
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Container height (CSS value) */
  height?: string;
  /** Additional class names for the container */
  className?: string;
  /** Number of items to overscan (render outside viewport) */
  overscan?: number;
  /** Unique key extractor */
  getItemKey?: (index: number) => string | number;
  /** Called when scrolling near the end */
  onEndReached?: () => void;
  /** Threshold for triggering onEndReached (0-1) */
  endReachedThreshold?: number;
  /** Whether a horizontal list */
  horizontal?: boolean;
  /** Gap between items in pixels */
  gap?: number;
}

export function VirtualList<T>({
  items,
  estimateSize,
  renderItem,
  height = '400px',
  className,
  overscan = 5,
  getItemKey,
  onEndReached,
  endReachedThreshold = 0.8,
  horizontal = false,
  gap = 0,
}: VirtualListProps<T>): React.ReactElement {
  const parentRef = useRef<HTMLDivElement>(null);
  const onEndReachedCalled = useRef(false);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize + gap,
    overscan,
    getItemKey: getItemKey
      ? getItemKey
      : (index: number) => index,
    horizontal,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  // Infinite scroll support
  const handleScroll = useCallback(() => {
    if (!onEndReached || !parentRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage >= endReachedThreshold && !onEndReachedCalled.current) {
      onEndReachedCalled.current = true;
      onEndReached();
      // Reset after a short delay to allow re-trigger
      setTimeout(() => {
        onEndReachedCalled.current = false;
      }, 500);
    }
  }, [onEndReached, endReachedThreshold]);

  return (
    <div
      ref={parentRef}
      className={cn('overflow-auto', className)}
      style={{ height, contain: 'strict' }}
      onScroll={handleScroll}
    >
      <div
        style={{
          height: horizontal ? '100%' : `${totalSize}px`,
          width: horizontal ? `${totalSize}px` : '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: horizontal ? undefined : '100%',
              height: horizontal ? '100%' : undefined,
              transform: horizontal
                ? `translateX(${virtualItem.start}px)`
                : `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualList;
