import { useEffect, useRef } from 'react';

/**
 * Returns a ref to attach to a sentinel element at the bottom of a list.
 * When the sentinel intersects the viewport, `onLoadMore` is called.
 */
export function useInfiniteScroll<T extends HTMLElement = HTMLDivElement>(
  onLoadMore: () => void,
  {
    enabled = true,
    rootMargin = '300px',
  }: { enabled?: boolean; rootMargin?: string } = {},
) {
  const ref = useRef<T | null>(null);
  const cb = useRef(onLoadMore);
  cb.current = onLoadMore;

  useEffect(() => {
    if (!enabled) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) cb.current();
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return ref;
}
