import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { favoritesApi, FavoriteItem } from '@/services/favorites.api';
import { toast } from 'sonner';

export const useFavorites = () => {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) return;
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
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = useCallback(
    async (propertyId: string) => {
      if (!isAuthenticated) {
        toast.error('Please log in to save favorites');
        return;
      }

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
        // Revert optimistic update
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (next.has(propertyId)) {
            next.delete(propertyId);
          } else {
            next.add(propertyId);
          }
          return next;
        });
        toast.error('Failed to update favorite');
      }
    },
    [isAuthenticated],
  );

  const isFavorite = useCallback(
    (propertyId: string) => favoriteIds.has(propertyId),
    [favoriteIds],
  );

  return { favorites, favoriteIds, loading, toggleFavorite, isFavorite, refetch: fetchFavorites };
};
