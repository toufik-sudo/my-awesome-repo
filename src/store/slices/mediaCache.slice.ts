import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MediaCacheEntry {
  url: string;
  type: 'image' | 'video' | 'file';
  timestamp: number;
  size?: number;
}

interface MediaCacheState {
  cache: Record<string, MediaCacheEntry>;
  maxEntries: number;
}

const initialState: MediaCacheState = {
  cache: {},
  maxEntries: 200,
};

export const mediaCacheSlice = createSlice({
  name: 'mediaCache',
  initialState,
  reducers: {
    cacheMedia: (state, action: PayloadAction<{ key: string; entry: Omit<MediaCacheEntry, 'timestamp'> }>) => {
      const { key, entry } = action.payload;

      // Evict oldest entries if at capacity
      const keys = Object.keys(state.cache);
      if (keys.length >= state.maxEntries && !state.cache[key]) {
        const oldest = keys.reduce((a, b) =>
          state.cache[a].timestamp < state.cache[b].timestamp ? a : b
        );
        delete state.cache[oldest];
      }

      state.cache[key] = { ...entry, timestamp: Date.now() };
    },
    removeMedia: (state, action: PayloadAction<string>) => {
      delete state.cache[action.payload];
    },
    clearMediaCache: (state) => {
      state.cache = {};
    },
    setMaxEntries: (state, action: PayloadAction<number>) => {
      state.maxEntries = action.payload;
    },
  },
});

export const { cacheMedia, removeMedia, clearMediaCache, setMaxEntries } = mediaCacheSlice.actions;

// Selectors
export const selectCachedMedia = (key: string) => (state: { mediaCache: MediaCacheState }) =>
  state.mediaCache.cache[key] || null;

export const selectMediaCacheSize = (state: { mediaCache: MediaCacheState }) =>
  Object.keys(state.mediaCache.cache).length;
