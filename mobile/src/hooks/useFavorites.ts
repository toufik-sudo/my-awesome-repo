import { useState, useEffect, useCallback } from 'react';
import { favoritesApi, FavoriteItem } from '@/services/favorites.api';

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const data = await favoritesApi.getMyFavorites();
      setFavorites(data);
      setFavoriteIds(new Set(data.map((f) => f.propertyId)));
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = useCallback(async (propertyId: string) => {
    // Optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(propertyId)) {
        next.delete(propertyId);
      } else {
        next.add(propertyId);
      }
      return next;
    });

    try {
      await favoritesApi.toggleFavorite(propertyId);
    } catch (error) {
      // Revert
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(propertyId)) {
          next.delete(propertyId);
        } else {
          next.add(propertyId);
        }
        return next;
      });
    }
  }, []);

  const isFavorite = useCallback(
    (propertyId: string) => favoriteIds.has(propertyId),
    [favoriteIds],
  );

  return { favorites, favoriteIds, loading, toggleFavorite, isFavorite, refetch: fetchFavorites };
};
