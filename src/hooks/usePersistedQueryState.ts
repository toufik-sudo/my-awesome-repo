import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Persist a string value across refresh / navigation / shared links.
 * Priority on init: URL search param > localStorage > defaultValue.
 * Updates write to BOTH localStorage and the URL (replaceState, no history spam).
 *
 * @param key       Param + storage key (e.g. 'status', 'page')
 * @param defaultValue Initial value when nothing persisted
 * @param storageNs Optional namespace prefix for localStorage (e.g. 'my-disputes')
 */
export function usePersistedQueryState<T extends string>(
  key: string,
  defaultValue: T,
  storageNs?: string,
): [T, (v: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const storageKey = storageNs ? `${storageNs}:${key}` : key;

  const readInitial = (): T => {
    const fromUrl = searchParams.get(key);
    if (fromUrl) return fromUrl as T;
    try {
      const fromLs = localStorage.getItem(storageKey);
      if (fromLs) return fromLs as T;
    } catch {
      /* ignore */
    }
    return defaultValue;
  };

  const [value, setValue] = useState<T>(readInitial);

  // Sync URL with current value on mount (so shareable links always work)
  useEffect(() => {
    if (searchParams.get(key) !== value) {
      const next = new URLSearchParams(searchParams);
      if (value && value !== defaultValue) next.set(key, value);
      else next.delete(key);
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = useCallback(
    (v: T) => {
      setValue(v);
      try {
        if (v && v !== defaultValue) localStorage.setItem(storageKey, v);
        else localStorage.removeItem(storageKey);
      } catch {
        /* ignore */
      }
      const next = new URLSearchParams(searchParams);
      if (v && v !== defaultValue) next.set(key, v);
      else next.delete(key);
      setSearchParams(next, { replace: true });
    },
    [defaultValue, key, searchParams, setSearchParams, storageKey],
  );

  return [value, update];
}
