import React, { useState, useMemo, useCallback } from 'react';
import { useProperties } from '@/modules/properties/properties.hooks';
import type { MockProperty } from '@/modules/properties/properties.mock';
import { useFavorites } from '@/hooks/useFavorites';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Home,
  Building2,
  Hotel,
  Castle,
  Mountain,
  Palmtree,
  Star,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  List,
  Heart,

  Map,
  DollarSign,
  Bed,
  UserCheck,
  Wifi,
  ShieldCheck,
  ShieldX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

import { MapSearch, MapBounds } from '@/modules/shared/components/MapSearch';
import { UnifiedMapSearch } from '@/modules/shared/components/UnifiedMapSearch';
import { useServices } from '@/modules/services/services.hooks';
import { DynamicFilter, FilterConfig, ActiveFilter } from '@/modules/shared/components/DynamicFilter';
import { TrustBadge } from '@/modules/shared/components/TrustBadge';
import { BackendImage } from '@/modules/shared/components/BackendImage';
import { Property } from '@/types/property.types';

// Property type config
const PROPERTY_TYPES = [
  { id: 'house', icon: Home, labelKey: 'byootdz.categories.houses' },
  { id: 'apartment', icon: Building2, labelKey: 'byootdz.categories.apartments' },
  { id: 'hotel', icon: Hotel, labelKey: 'byootdz.categories.hotels' },
  { id: 'villa', icon: Castle, labelKey: 'byootdz.categories.villas' },
  { id: 'chalet', icon: Mountain, labelKey: 'byootdz.categories.chalets' },
  { id: 'riad', icon: Palmtree, labelKey: 'byootdz.categories.riads' },
];

const AMENITIES = [
  'wifi', 'parking', 'ac', 'pool', 'kitchen', 'washer', 'tv', 'security', 'garden', 'breakfast',
];

const SORT_OPTIONS = [
  { value: 'recommended', labelKey: 'listing.sort.recommended' },
  { value: 'price_asc', labelKey: 'listing.sort.priceAsc' },
  { value: 'price_desc', labelKey: 'listing.sort.priceDesc' },
  { value: 'rating', labelKey: 'listing.sort.rating' },
  { value: 'newest', labelKey: 'listing.sort.newest' },
];


interface Filters {
  location: string;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  guests: number;
  priceRange: [number, number];
  propertyTypes: string[];
  amenities: string[];
  sortBy: string;
  minTrustStars: number;
}

const PropertyListing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const canAddProperty = useMemo(() => {
    if (!user?.roles) return false;
    // Hyper admin/manager cannot add - only admin/manager can
    return user.roles.some(r => ['admin', 'manager'].includes(r));
  }, [user]);

  const canPauseArchive = useMemo(() => {
    if (!user?.roles) return false;
    return user.roles.some(r => ['hyper_admin', 'hyper_manager', 'admin', 'manager'].includes(r));
  }, [user]);

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const { isFavorite, toggleFavorite } = useFavorites();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const { data: allProperties = [], isLoading: propertiesLoading } = useProperties();
  const { data: servicesData } = useServices({ page: 1, limit: 200 });
  const mapServicesData = useMemo(() => {
    const services = servicesData?.data || [];
    return services.filter(s => {
      const lat = Number(s.latitude);
      const lng = Number(s.longitude);
      return !isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0);
    }).map(s => ({ ...s, latitude: Number(s.latitude), longitude: Number(s.longitude) }));
  }, [servicesData]);

  const [filters, setFilters] = useState<Filters>({
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : undefined,
    checkOut: searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : undefined,
    guests: Number(searchParams.get('guests')) || 0,
    priceRange: [0, 30000],
    propertyTypes: searchParams.get('type') ? [searchParams.get('type')!] : [],
    amenities: [],
    sortBy: 'recommended',
    minTrustStars: 0,
  });

  const updateFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const togglePropertyType = useCallback((typeId: string) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(typeId)
        ? prev.propertyTypes.filter(t => t !== typeId)
        : [...prev.propertyTypes, typeId],
    }));
  }, []);

  const toggleAmenity = useCallback((amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }, []);


  const clearFilters = useCallback(() => {
    setFilters({
      location: '', checkIn: undefined, checkOut: undefined, guests: 0,
      priceRange: [0, 30000], propertyTypes: [], amenities: [], sortBy: 'recommended',
      minTrustStars: 0,
    });
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.location) count++;
    if (filters.checkIn) count++;
    if (filters.guests > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 30000) count++;
    if (filters.propertyTypes.length > 0) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.minTrustStars > 0) count++;
    return count;
  }, [filters]);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    let result = [...allProperties];

    if (filters.location) {
      const q = filters.location.toLowerCase();
      result = result.filter(p =>
        p.location.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q)
      );
    }

    if (filters.guests > 0) {
      result = result.filter(p => p.guests >= filters.guests);
    }

    result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    if (filters.propertyTypes.length > 0) {
      result = result.filter(p => filters.propertyTypes.includes(p.type));
    }

    if (filters.amenities.length > 0) {
      result = result.filter(p => filters.amenities.every(a => p.amenities.includes(a)));
    }

    if (filters.minTrustStars > 0) {
      result = result.filter(p => p.trustStars >= filters.minTrustStars);
    }

    // Sort: unverified (0 stars) always at end, then by trust stars desc + rating desc
    const sortWithTrust = (arr: MockProperty[]) => {
      return arr.sort((a, b) => {
        // Unverified always last
        if (a.trustStars === 0 && b.trustStars !== 0) return 1;
        if (b.trustStars === 0 && a.trustStars !== 0) return -1;
        // Then by trust stars desc
        if (a.trustStars !== b.trustStars) return b.trustStars - a.trustStars;
        // Then by client rating
        return b.rating - a.rating;
      });
    };

    switch (filters.sortBy) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => String(b.id).localeCompare(String(a.id))); break;
      default: sortWithTrust(result);
    }

    return result;
  }, [filters, allProperties]);

  // Convert filtered properties to Property type for MapSearch
  const mapProperties: Property[] = useMemo(() => {
    let source = filteredProperties;

    // Filter by visible map bounds when in map mode
    if (viewMode === 'map' && mapBounds) {
      source = source.filter(p =>
        p.latitude >= mapBounds.south &&
        p.latitude <= mapBounds.north &&
        p.longitude >= mapBounds.west &&
        p.longitude <= mapBounds.east
      );
    }

    return source.map(p => ({
      id: String(p.id),
      title: p.title,
      description: p.title,
      price: p.price,
      currency: 'DA',
      location: {
        latitude: p.latitude,
        longitude: p.longitude,
        address: p.location,
        city: p.city,
        country: p.country,
      },
      images: p.images,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      guests: p.guests,
      rating: p.rating,
      reviewCount: p.reviews,
      amenities: p.amenities,
      hostName: '',
      propertyType: p.type as Property['propertyType'],
      available: true,
    }));
  }, [filteredProperties, viewMode, mapBounds]);

  // DynamicFilter configs for the inline filter bar
  const dynamicFilterConfigs: FilterConfig[] = useMemo(() => [
    {
      id: 'price',
      name: t('listing.filters.priceRange'),
      icon: DollarSign,
      type: 'range',
      min: 0,
      max: 30000,
      step: 500,
      defaultValue: [0, 30000],
    },
    {
      id: 'propertyType',
      name: t('listing.filters.propertyType'),
      icon: Home,
      type: 'multiselect',
      options: PROPERTY_TYPES.map(pt => ({ label: t(pt.labelKey), value: pt.id })),
    },
    {
      id: 'bedrooms',
      name: t('propertyDetail.bedrooms'),
      icon: Bed,
      type: 'select',
      options: [
        { label: '1+', value: '1' },
        { label: '2+', value: '2' },
        { label: '3+', value: '3' },
        { label: '4+', value: '4' },
        { label: '5+', value: '5' },
      ],
    },
    {
      id: 'guests',
      name: t('listing.filters.guests'),
      icon: Users,
      type: 'select',
      options: [
        { label: '1+', value: '1' },
        { label: '2+', value: '2' },
        { label: '4+', value: '4' },
        { label: '6+', value: '6' },
        { label: '8+', value: '8' },
      ],
    },
    {
      id: 'amenities',
      name: t('listing.filters.amenities'),
      icon: Wifi,
      type: 'multiselect',
      options: AMENITIES.map(a => ({ label: t(`propertyDetail.amenities.${a}`), value: a })),
    },
    {
      id: 'superhost',
      name: 'Superhost',
      icon: UserCheck,
      type: 'boolean',
    },
    {
      id: 'trustLevel',
      name: t('listing.filters.trustLevel', 'Trust Level'),
      icon: ShieldCheck,
      type: 'select',
      options: [
        { label: '1+ ★', value: '1' },
        { label: '2+ ★★', value: '2' },
        { label: '3+ ★★★', value: '3' },
        { label: '5 ★★★★★', value: '5' },
      ],
    },
  ], [t]);

  // Handle DynamicFilter changes
  const handleDynamicFilterApply = useCallback((filter: ActiveFilter) => {
    switch (filter.id) {
      case 'price':
        if (Array.isArray(filter.value)) {
          updateFilter('priceRange', filter.value as [number, number]);
        }
        break;
      case 'propertyType':
        if (Array.isArray(filter.value)) {
          updateFilter('propertyTypes', filter.value as string[]);
        }
        break;
      case 'bedrooms':
        updateFilter('guests', 0); // reset guests if changing bedrooms
        // Apply bedrooms filter through the existing price range mechanism
        setFilters(prev => ({ ...prev }));
        break;
      case 'guests':
        updateFilter('guests', filter.value ? Number(filter.value) : 0);
        break;
      case 'amenities':
        if (Array.isArray(filter.value)) {
          updateFilter('amenities', filter.value as string[]);
        }
        break;
      case 'trustLevel':
        updateFilter('minTrustStars', filter.value ? Number(filter.value) : 0);
        break;
    }
  }, [updateFilter]);

  const handleDynamicFilterRemove = useCallback((filterId: string) => {
    switch (filterId) {
      case 'price': updateFilter('priceRange', [0, 30000]); break;
      case 'propertyType': updateFilter('propertyTypes', []); break;
      case 'guests': updateFilter('guests', 0); break;
      case 'amenities': updateFilter('amenities', []); break;
      case 'trustLevel': updateFilter('minTrustStars', 0); break;
    }
  }, [updateFilter]);

  // Filter sidebar content (shared between desktop and mobile)
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">{t('listing.filters.priceRange')}</h3>
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground mb-1 block">Min</Label>
            <Input
              type="number"
              min={0}
              max={filters.priceRange[1]}
              value={filters.priceRange[0]}
              onChange={(e) => {
                const val = Math.min(Number(e.target.value) || 0, filters.priceRange[1]);
                updateFilter('priceRange', [val, filters.priceRange[1]]);
              }}
              className="h-8 text-xs"
            />
          </div>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground mb-1 block">Max</Label>
            <Input
              type="number"
              min={filters.priceRange[0]}
              max={30000}
              value={filters.priceRange[1]}
              onChange={(e) => {
                const val = Math.max(Number(e.target.value) || 0, filters.priceRange[0]);
                updateFilter('priceRange', [filters.priceRange[0], val]);
              }}
              className="h-8 text-xs"
            />
          </div>
        </div>
        <Slider
          value={filters.priceRange}
          min={0}
          max={30000}
          step={500}
          onValueChange={(val) => updateFilter('priceRange', val as [number, number])}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{filters.priceRange[0].toLocaleString()} DA</span>
          <span>{filters.priceRange[1].toLocaleString()} DA</span>
        </div>
      </div>

      <Separator />

      {/* Property Types */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">{t('listing.filters.propertyType')}</h3>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.map(({ id, icon: Icon, labelKey }) => (
            <Button
              key={id}
              variant={filters.propertyTypes.includes(id) ? 'default' : 'outline'}
              size="sm"
              className="justify-start gap-2 h-9"
              onClick={() => togglePropertyType(id)}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="text-xs">{t(labelKey)}</span>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Guests */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">{t('listing.filters.guests')}</h3>
        <Select
          value={filters.guests > 0 ? String(filters.guests) : ''}
          onValueChange={(v) => updateFilter('guests', Number(v))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('listing.filters.anyGuests')} />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border z-50">
            {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(n => (
              <SelectItem key={n} value={String(n)}>
                {n}+ {t('listing.filters.guests')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Dates */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">{t('listing.filters.dates')}</h3>
        <div className="space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !filters.checkIn && 'text-muted-foreground')}>
                <Calendar className="mr-2 h-4 w-4" />
                {filters.checkIn ? format(filters.checkIn, 'PPP') : t('listing.filters.checkIn')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover border border-border z-50" align="start">
              <CalendarComponent
                mode="single"
                selected={filters.checkIn}
                onSelect={(d) => updateFilter('checkIn', d)}
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !filters.checkOut && 'text-muted-foreground')}>
                <Calendar className="mr-2 h-4 w-4" />
                {filters.checkOut ? format(filters.checkOut, 'PPP') : t('listing.filters.checkOut')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover border border-border z-50" align="start">
              <CalendarComponent
                mode="single"
                selected={filters.checkOut}
                onSelect={(d) => updateFilter('checkOut', d)}
                disabled={(date) => date < (filters.checkIn || new Date())}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Separator />

      {/* Amenities */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">{t('listing.filters.amenities')}</h3>
        <div className="space-y-2">
          {AMENITIES.map(amenity => (
            <div key={amenity} className="flex items-center gap-2">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={filters.amenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <Label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">
                {t(`propertyDetail.amenities.${amenity}`)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Trust Level */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          {t('listing.filters.trustLevel', 'Trust Level')}
        </h3>
        <div className="space-y-2">
          {[
            { value: 0, label: t('listing.filters.anyTrust', 'Any') },
            { value: 1, label: '1+ ★' },
            { value: 2, label: '2+ ★★' },
            { value: 3, label: '3+ ★★★' },
            { value: 5, label: '5 ★★★★★' },
          ].map(opt => (
            <div key={opt.value} className="flex items-center gap-2">
              <Checkbox
                id={`trust-${opt.value}`}
                checked={filters.minTrustStars === opt.value}
                onCheckedChange={() => updateFilter('minTrustStars', filters.minTrustStars === opt.value ? 0 : opt.value)}
              />
              <Label htmlFor={`trust-${opt.value}`} className="text-sm cursor-pointer flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                {opt.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          {t('listing.filters.clearAll')} ({activeFilterCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Category bar */}
      <div className="border-b border-border bg-card">
        <div className="px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {/* Search bar inline */}
            <div className="flex-1 min-w-[200px] max-w-md mr-2">
              <div className="flex items-center bg-muted/60 rounded-full border border-border px-3 py-1.5 gap-2">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                  placeholder={t('listing.searchPlaceholder')}
                  className="border-0 bg-transparent h-auto p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                />
                {filters.location && (
                  <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0" onClick={() => updateFilter('location', '')}>
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {PROPERTY_TYPES.map(({ id, icon: Icon, labelKey }) => (
              <Button
                key={id}
                variant="ghost"
                size="sm"
                className={cn(
                  'flex-col gap-1 h-auto py-2 px-4 min-w-fit rounded-lg transition-all',
                  filters.propertyTypes.includes(id)
                    ? 'bg-primary/10 text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={() => togglePropertyType(id)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[11px] font-medium whitespace-nowrap">{t(labelKey)}</span>
              </Button>
            ))}

            <Separator orientation="vertical" className="h-8 mx-2" />

            {/* Mobile filter toggle */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                  {t('listing.filters.title')}
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>{t('listing.filters.title')}</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-5 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">{t('listing.filters.title')}</h2>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="text-xs">{activeFilterCount}</Badge>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-xl font-heading font-bold text-foreground">
                  {filters.location
                    ? t('listing.resultsIn', { location: filters.location })
                    : t('listing.allProperties')}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {t('listing.resultCount', { count: filteredProperties.length })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {canAddProperty && (
                  <Button size="sm" onClick={() => navigate('/properties/new')} className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    {t('dashboard.actions.addProperty', 'Add Property')}
                  </Button>
                )}
                <Select value={filters.sortBy} onValueChange={(v) => updateFilter('sortBy', v)}>
                  <SelectTrigger className="w-44 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
                    {SORT_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {t(opt.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn('h-9 w-9 rounded-none', viewMode === 'grid' && 'bg-muted')}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn('h-9 w-9 rounded-none', viewMode === 'list' && 'bg-muted')}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn('h-9 w-9 rounded-none', viewMode === 'map' && 'bg-muted')}
                    onClick={() => setViewMode('map')}
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* DynamicFilter bar */}
            <div className="mb-4">
              <DynamicFilter
                filters={dynamicFilterConfigs}
                onFilterApply={handleDynamicFilterApply}
                onFilterRemove={handleDynamicFilterRemove}
              />
            </div>

            {/* Active filter tags */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {filters.propertyTypes.map(type => {
                  const pt = PROPERTY_TYPES.find(p => p.id === type);
                  return pt ? (
                    <Badge key={type} variant="secondary" className="gap-1 pr-1">
                      {t(pt.labelKey)}
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => togglePropertyType(type)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ) : null;
                })}
                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 30000) && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()} DA
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => updateFilter('priceRange', [0, 30000])}>
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.guests > 0 && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {filters.guests}+ {t('listing.filters.guests')}
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => updateFilter('guests', 0)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.checkIn && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {format(filters.checkIn, 'PP')}
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => updateFilter('checkIn', undefined)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.minTrustStars > 0 && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    <ShieldCheck className="h-3 w-3" /> {filters.minTrustStars}+ stars
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => updateFilter('minTrustStars', 0)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" className="text-xs text-destructive h-7" onClick={clearFilters}>
                  {t('listing.filters.clearAll')}
                </Button>
              </div>
            )}

            {/* Map View */}
            {viewMode === 'map' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm text-muted-foreground">
                    {mapProperties.length} {t('listing.results', { count: mapProperties.length })} in visible area
                  </p>
                  {mapBounds && (
                    <Button variant="ghost" size="sm" onClick={() => setMapBounds(null)} className="text-xs">
                      <X className="h-3 w-3 mr-1" /> Reset bounds
                    </Button>
                  )}
                </div>
                <div className="rounded-xl overflow-hidden border border-border">
                  <UnifiedMapSearch
                    properties={mapProperties}
                    services={mapServicesData}
                    center={(() => {
                      const top = [...mapProperties].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];
                      return top ? [top.location.longitude, top.location.latitude] as [number, number] : [3.0588, 36.7538] as [number, number];
                    })()}
                    zoom={6}
                    onPropertySelect={(property) => navigate(`/property/${property.id}`)}
                    onServiceSelect={(service) => navigate(`/services/${service.id}`)}
                    className="h-[calc(100vh-16rem)]"
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Property Grid / List */}
                {filteredProperties.length === 0 ? (
                  <div className="text-center py-20">
                    <Search className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">{t('listing.noResults')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{t('listing.noResultsHint')}</p>
                    <Button variant="outline" onClick={clearFilters}>{t('listing.filters.clearAll')}</Button>
                  </div>
                ) : (
                  <div className={cn(
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                      : 'space-y-4'
                  )}>
                    {filteredProperties.map(property => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        viewMode={viewMode as 'grid' | 'list'}
                        isFavorite={isFavorite(String(property.id))}
                        onToggleFavorite={() => toggleFavorite(String(property.id))}
                        onClick={() => navigate(`/property/${property.id}`)}
                        t={t}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// Discount badge helper
const DiscountBadges: React.FC<{ weeklyDiscount?: number; monthlyDiscount?: number }> = ({ weeklyDiscount, monthlyDiscount }) => {
  if (!weeklyDiscount && !monthlyDiscount) return null;
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {weeklyDiscount && weeklyDiscount > 0 ? (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0">
          -{weeklyDiscount}% week
        </Badge>
      ) : null}
      {monthlyDiscount && monthlyDiscount > 0 ? (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] px-1.5 py-0">
          -{monthlyDiscount}% month
        </Badge>
      ) : null}
    </div>
  );
};

// Property Card Component
interface PropertyCardProps {
  property: MockProperty;
  viewMode: 'grid' | 'list';
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
  t: (key: string, opts?: any) => string;
}

const PropertyCard = React.memo<PropertyCardProps>(({ property, viewMode, isFavorite, onToggleFavorite, onClick, t }) => {
  const badgeLabel = property.badge ? t(`byootdz.badges.${property.badge}`) : null;

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border-border/60 group" onClick={onClick}>
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-72 h-48 sm:h-auto shrink-0">
            <BackendImage src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 bg-card/80 backdrop-blur-sm hover:bg-card rounded-full"
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            >
              <Heart className={cn('h-4 w-4', isFavorite ? 'fill-destructive text-destructive' : 'text-foreground')} />
            </Button>
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {badgeLabel && (
                <Badge className="bg-primary text-primary-foreground text-[10px]">
                  {badgeLabel}
                </Badge>
              )}
            </div>
          </div>
          <CardContent className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{property.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5" /> {property.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="text-sm font-semibold text-foreground">{property.rating}</span>
                  <span className="text-xs text-muted-foreground">({property.reviews})</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                <span>{property.bedrooms} {t('propertyDetail.bedrooms')}</span>
                <span>•</span>
                <span>{property.bathrooms} {t('propertyDetail.bathrooms')}</span>
                <span>•</span>
                <span>{property.guests} {t('propertyDetail.guests')}</span>
              </div>
              {/* Trust Badge + Discount Badges */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <TrustBadge trustStars={property.trustStars} isVerified={property.isVerified} size="sm" showLabel />
                <DiscountBadges weeklyDiscount={property.weeklyDiscount} monthlyDiscount={property.monthlyDiscount} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-lg font-bold text-foreground">
                {property.price.toLocaleString()} DA
                <span className="text-sm font-normal text-muted-foreground"> / {t('byootdz.perNight')}</span>
              </p>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-border/40 group rounded-xl" onClick={onClick}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <BackendImage
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-9 w-9 bg-card/90 backdrop-blur-md hover:bg-card shadow-sm rounded-full"
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
        >
          <Heart className={cn('h-4 w-4 transition-colors', isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
        </Button>
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {badgeLabel && (
            <Badge className="bg-primary text-primary-foreground text-[10px] shadow-sm">
              {badgeLabel}
            </Badge>
          )}
          <TrustBadge
            trustStars={property.trustStars}
            isVerified={property.isVerified}
            size="sm"
            showLabel={false}
            className="shadow-sm bg-card/95 backdrop-blur-md"
          />
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground text-[15px] truncate group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 shrink-0" /> {property.location}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0 bg-accent/50 px-2 py-1 rounded-lg">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="text-sm font-bold text-foreground">{property.rating}</span>
          </div>
        </div>

        {/* Discount Badges */}
        {(property.weeklyDiscount > 0 || property.monthlyDiscount > 0) && (
          <div className="mt-2">
            <DiscountBadges weeklyDiscount={property.weeklyDiscount} monthlyDiscount={property.monthlyDiscount} />
          </div>
        )}

        <div className="flex items-center gap-2 mt-2.5 text-[11px] text-muted-foreground">
          <span>{property.bedrooms} {t('propertyDetail.bedrooms')}</span>
          <span className="text-border">•</span>
          <span>{property.guests} {t('propertyDetail.guests')}</span>
        </div>
        <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
          <p className="text-base font-bold text-primary">
            {property.price.toLocaleString()} DA
            <span className="text-xs font-normal text-muted-foreground"> / {t('byootdz.perNight')}</span>
          </p>
          <TrustBadge trustStars={property.trustStars} isVerified={property.isVerified} size="sm" showLabel={false} />
        </div>
      </CardContent>
    </Card>
  );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyListing;
