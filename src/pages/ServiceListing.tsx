import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useServices, useServiceCategories } from '@/modules/services/services.hooks';
import { usePermissions } from '@/hooks/usePermissions';
import type { TourismServiceFilters, TourismService } from '@/types/tourism-service.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Map as MapIcon, LayoutGrid, Plus } from 'lucide-react';
import { ServiceCard } from '@/modules/services/components/ServiceCard';
import { ServiceCategoryFilter } from '@/modules/services/components/ServiceCategoryFilter';
import { UnifiedMapSearch } from '@/modules/shared/components/UnifiedMapSearch';
import { SERVICE_ROUTES } from '@/routes/routes.constants';

const ServiceListing: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language?.split('-')[0] || 'fr';
  const { canCreateService } = usePermissions();

  const [filters, setFilters] = useState<TourismServiceFilters>({ page: 1, limit: 20 });
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const activeFilters = useMemo(() => ({
    ...filters,
    category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
    categories: selectedCategories.length > 1 ? selectedCategories : undefined,
    search: searchInput || undefined,
  }), [filters, selectedCategories, searchInput]);

  const { data, isLoading } = useServices(activeFilters);
  const { data: categoryCounts } = useServiceCategories();

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setFilters(f => ({ ...f, search: searchInput, page: 1 }));
  }, [searchInput]);

  const handleServiceSelect = useCallback((service: TourismService) => {
    navigate(`/services/${service.id}`);
  }, [navigate]);

  // Apply client-side category filtering for both views
  const filteredServices = useMemo(() => {
    let services = data?.data || [];
    // Apply category filter client-side if API doesn't handle it
    if (selectedCategories.length > 0) {
      services = services.filter(s => selectedCategories.includes(s.category));
    }
    // Apply search filter client-side
    if (searchInput) {
      const q = searchInput.toLowerCase();
      services = services.filter(s => {
        const title = typeof s.title === 'string' ? s.title : Object.values(s.title).join(' ');
        return title.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q) || s.wilaya?.toLowerCase().includes(q);
      });
    }
    return services;
  }, [data, selectedCategories, searchInput]);

  // Filter services for map (only those with coordinates)
  const mapServices = useMemo(() => {
    return filteredServices.filter(s => s.latitude && s.longitude);
  }, [filteredServices]);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('services.title')}</h1>
          <p className="text-muted-foreground text-sm">{t('services.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          {canCreateService && (
            <Button size="sm" onClick={() => navigate(SERVICE_ROUTES.NEW)} className="gap-1.5">
              <Plus className="h-4 w-4" />
              {t('services.addService', 'Add Service')}
            </Button>
          )}
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('map')}
          >
            <MapIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder={t('services.searchPlaceholder')}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="outline" size="icon"><Search className="h-4 w-4" /></Button>
        </form>
        <Select value={filters.sort || 'default'} onValueChange={v => setFilters(f => ({ ...f, sort: v === 'default' ? undefined : v }))}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder={t('common.filter')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="default">{t('services.sortDefault')}</SelectItem>
            <SelectItem value="price_asc">{t('common.priceLow')}</SelectItem>
            <SelectItem value="price_desc">{t('common.priceHigh')}</SelectItem>
            <SelectItem value="rating">{t('services.sortRating')}</SelectItem>
            <SelectItem value="newest">{t('common.newest')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dynamic Category Filter */}
      <ServiceCategoryFilter
        categoryCounts={categoryCounts || []}
        selected={selectedCategories}
        onChange={setSelectedCategories}
        defaultVisible={5}
      />

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : viewMode === 'map' ? (
        <div className="h-[600px] rounded-xl overflow-hidden border border-border">
          <UnifiedMapSearch
            services={mapServices}
            lang={lang}
            onServiceSelect={handleServiceSelect}
            className="h-full"
          />
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {t('common.showing')} {filteredServices.length} / {data?.total || 0} {t('services.results')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                lang={lang}
                onClick={() => navigate(`/services/${service.id}`)}
              />
            ))}
          </div>
          {filteredServices.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">{t('services.noResults')}</p>
              <p className="text-sm">{t('services.noResultsHint')}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ServiceListing;
