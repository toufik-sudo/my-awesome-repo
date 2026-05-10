import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { resolveImageUrl } from './BackendImage';

export interface MediaCarouselItem {
  url: string;
  type: 'image' | 'video';
}

interface MapPopupMediaCarouselProps {
  images?: string[];
  videos?: string[];
  alt: string;
  height?: number;
}

/**
 * Compact horizontal media carousel for map hover popups.
 * Renders images and videos in a single scroll-snap row with arrow controls.
 * Videos play inline on click (muted, no autoplay) so the popup stays light.
 */
export const MapPopupMediaCarousel: React.FC<MapPopupMediaCarouselProps> = ({
  images = [],
  videos = [],
  alt,
  height = 144,
}) => {
  const items: MediaCarouselItem[] = [
    ...images.map(u => ({ url: u, type: 'image' as const })),
    ...(videos || []).map(u => ({ url: u, type: 'video' as const })),
  ];

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  if (items.length === 0) return null;

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollBy({ left: dir * w, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== activeIdx) setActiveIdx(idx);
  };

  return (
    <div className="relative w-full" style={{ height }}>
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none rounded-t-xl"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((item, i) => (
          <div
            key={`${item.type}-${i}`}
            className="flex-shrink-0 w-full h-full snap-center bg-black/5 relative"
          >
            {item.type === 'image' ? (
              <img
                src={resolveImageUrl(item.url)}
                alt={`${alt} ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <video
                src={resolveImageUrl(item.url)}
                className="w-full h-full object-cover"
                muted
                playsInline
                controls
                preload="metadata"
              />
            )}
            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/40 rounded-full p-2">
                  <Play className="h-5 w-5 text-white fill-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); scrollBy(-1); }}
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1 shadow"
            aria-label="Précédent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); scrollBy(1); }}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1 shadow"
            aria-label="Suivant"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
            {items.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
