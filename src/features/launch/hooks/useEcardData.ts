// -----------------------------------------------------------------------------
// useEcardData Hook
// Migrated from old_app/src/hooks/launch/eCards/
// Manages eCard data fetching and state
// -----------------------------------------------------------------------------

import { useState, useEffect, useCallback, useMemo } from 'react';
import { eCardApi, IECardProduct, ICatalogueSortList, ECARD_CATEGORIES } from '@/api/ECardApi';

export interface IEcardFilters {
  searchTerm: string;
  countryCode: string;
  categories: string[];
}

export interface UseEcardDataReturn {
  // Data
  eCards: IECardProduct[];
  filteredCards: IECardProduct[];
  selectedCards: IECardProduct[];
  countries: string[];
  categories: typeof ECARD_CATEGORIES;
  
  // State
  isLoading: boolean;
  error: string | null;
  filters: IEcardFilters;
  
  // Actions
  setFilters: (filters: Partial<IEcardFilters>) => void;
  resetFilters: () => void;
  toggleCardSelection: (card: IECardProduct) => void;
  selectAllCards: () => void;
  deselectAllCards: () => void;
  isCardSelected: (cardId: number) => boolean;
  getSelectedCardIds: () => number[];
  refetch: () => Promise<void>;
}

const DEFAULT_FILTERS: IEcardFilters = {
  searchTerm: '',
  countryCode: 'all',
  categories: [],
};

export const useEcardData = (
  programEcards?: IECardProduct[],
  isConversion: boolean = false
): UseEcardDataReturn => {
  const [eCards, setECards] = useState<IECardProduct[]>([]);
  const [sortList, setSortList] = useState<ICatalogueSortList | null>(null);
  const [selectedCards, setSelectedCards] = useState<IECardProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<IEcardFilters>(DEFAULT_FILTERS);

  // Fetch eCards
  const fetchECards = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // For conversion mode, use provided program eCards
      if (isConversion && programEcards?.length) {
        setECards(programEcards);
        setIsLoading(false);
        return;
      }

      // Fetch sort list first
      const sortData = await eCardApi.getCatalogueSortList();
      setSortList(sortData);

      // Fetch eCards
      const response = await eCardApi.getECards();
      let products = response.products;

      // Filter denominations and sort
      products = products.map((p) => ({
        ...p,
        denominations: eCardApi.filterDenominations(p.denominations, 250),
      }));

      // Sort products
      products = eCardApi.sortProducts(products, sortData, 'FR');

      setECards(products);
    } catch (err) {
      console.error('Failed to fetch eCards:', err);
      setError('Failed to load gift cards. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isConversion, programEcards]);

  useEffect(() => {
    fetchECards();
  }, [fetchECards]);

  // Get available countries
  const countries = useMemo(() => {
    return eCardApi.getAvailableCountries(eCards);
  }, [eCards]);

  // Filter cards based on current filters
  const filteredCards = useMemo(() => {
    let filtered = eCardApi.filterProducts(eCards, {
      searchTerm: filters.searchTerm,
      countryCode: filters.countryCode,
      categories: filters.categories,
    });

    // Sort to show selected cards first
    const selectedIds = new Set(selectedCards.map(c => c.ecardId));
    filtered = [...filtered].sort((a, b) => {
      const aSelected = selectedIds.has(a.ecardId);
      const bSelected = selectedIds.has(b.ecardId);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });

    return filtered;
  }, [eCards, filters, selectedCards]);

  // Set filters
  const setFilters = useCallback((newFilters: Partial<IEcardFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  // Toggle card selection
  const toggleCardSelection = useCallback((card: IECardProduct) => {
    setSelectedCards((prev) => {
      const exists = prev.some((c) => c.ecardId === card.ecardId);
      if (exists) {
        return prev.filter((c) => c.ecardId !== card.ecardId);
      }
      return [...prev, { ...card, isActive: true }];
    });
  }, []);

  // Select all visible cards
  const selectAllCards = useCallback(() => {
    setSelectedCards(filteredCards.map((c) => ({ ...c, isActive: true })));
  }, [filteredCards]);

  // Deselect all cards
  const deselectAllCards = useCallback(() => {
    setSelectedCards([]);
  }, []);

  // Check if card is selected
  const isCardSelected = useCallback((cardId: number) => {
    return selectedCards.some((c) => c.ecardId === cardId);
  }, [selectedCards]);

  // Get selected card IDs
  const getSelectedCardIds = useCallback(() => {
    return selectedCards.map((c) => c.ecardId);
  }, [selectedCards]);

  return {
    eCards,
    filteredCards,
    selectedCards,
    countries,
    categories: ECARD_CATEGORIES,
    isLoading,
    error,
    filters,
    setFilters,
    resetFilters,
    toggleCardSelection,
    selectAllCards,
    deselectAllCards,
    isCardSelected,
    getSelectedCardIds,
    refetch: fetchECards,
  };
};

export default useEcardData;
