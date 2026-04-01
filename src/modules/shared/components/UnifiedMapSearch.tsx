import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import ReactDOM from 'react-dom/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, Locate, Map as MapIcon, Building2, Compass, Layers } from 'lucide-react';
import { DynamicButton } from './DynamicButton';
import { AddressAutocomplete, type NominatimSuggestion } from './AddressAutocomplete';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { resolveImageUrl } from './BackendImage';
import { CATEGORY_ICONS } from '@/modules/services/services.constants';
import type { Property } from '@/types/property.types';
import type { TourismService } from '@/types/tourism-service.types';
import { useTranslation } from 'react-i18next';

export interface UnifiedMapBounds {
  north: number; south: number; east: number; west: number;
}

type LayerType = 'all' | 'properties' | 'services';

interface UnifiedMapSearchProps {
  properties?: Property[];
  services?: TourismService[];
  center?: [number, number];
  zoom?: number;
  lang?: string;
  onPropertySelect?: (property: Property) => void;
  onServiceSelect?: (service: TourismService) => void;
  onBoundsChange?: (bounds: UnifiedMapBounds) => void;
  className?: string;
}

const DEFAULT_CENTER: [number, number] = [3.0588, 36.7538]; // Algiers
const DEFAULT_ZOOM = 10;

const getLocalizedText = (obj: Record<string, string> | string | undefined, lang: string): string => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj['fr'] || obj['en'] || Object.values(obj)[0] || '';
};

export const UnifiedMapSearch: React.FC<UnifiedMapSearchProps> = ({
  properties = [],
  services = [],
  center,
  zoom,
  lang = 'fr',
  onPropertySelect,
  onServiceSelect,
  onBoundsChange,
  className = '',
}) => {
  const { t } = useTranslation();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const popups = useRef<maplibregl.Popup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [activeLayer, setActiveLayer] = useState<LayerType>('all');
  const [filters, setFilters] = useState<{ minPrice?: number; maxPrice?: number; serviceCategory?: string }>({});

  const initialCenter = useRef(center || DEFAULT_CENTER);
  const initialZoom = useRef(zoom ?? DEFAULT_ZOOM);

  const handleAddressSelect = useCallback((suggestion: NominatimSuggestion) => {
    if (!map.current) return;
    map.current.flyTo({ center: [parseFloat(suggestion.lon), parseFloat(suggestion.lat)], zoom: 14, duration: 2000 });
  }, []);

  const handleGeolocation = useCallback(() => {
    if (!map.current || !navigator.geolocation) {
      toast.error('Geolocation is not supported');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.current!.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 14, duration: 2000 });
        setIsLocating(false);
      },
      () => { setIsLocating(false); toast.error('Erreur de géolocalisation'); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: initialCenter.current,
      zoom: initialZoom.current,
    });
    map.current = m;
    m.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

    let moveTimeout: ReturnType<typeof setTimeout>;
    m.on('moveend', () => {
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        if (!map.current || !onBoundsChange) return;
        const b = map.current.getBounds();
        onBoundsChange({ north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() });
      }, 300);
    });
    m.on('load', () => setMapReady(true));

    return () => {
      clearTimeout(moveTimeout);
      markers.current.forEach(mk => mk.remove());
      popups.current.forEach(p => p.remove());
      map.current = null;
      m.remove();
    };
  }, []);

  // Render markers
  useEffect(() => {
    if (!map.current || !mapReady) return;
    markers.current.forEach(mk => mk.remove());
    popups.current.forEach(p => p.remove());
    markers.current = [];
    popups.current = [];

    const allCoords: [number, number][] = [];

    // ── Property Markers ──
    if (activeLayer === 'all' || activeLayer === 'properties') {
      const filteredProps = properties.filter(p => {
        if (!p.location?.latitude || !p.location?.longitude) return false;
        if (filters.minPrice && p.price < filters.minPrice) return false;
        if (filters.maxPrice && p.price > filters.maxPrice) return false;
        return true;
      });

      filteredProps.forEach(property => {
        const popupContainer = document.createElement('div');
        const root = ReactDOM.createRoot(popupContainer);
        root.render(
          <div className="w-72 p-0">
            <div className="relative">
              {property.images[0] && (
                <img src={resolveImageUrl(property.images[0])} alt={property.title} className="w-full h-36 object-cover rounded-t-xl" />
              )}
              <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold">
                ⭐ {property.rating || 'N/A'}
              </div>
              <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-[10px] font-bold">
                🏠 Propriété
              </div>
            </div>
            <div className="p-3 space-y-2">
              <h3 className="font-semibold text-foreground text-sm line-clamp-1">{property.title}</h3>
              <p className="text-xs text-muted-foreground">{property.location.address}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary">
                  {property.currency}{property.price}<span className="text-xs font-normal text-muted-foreground">/nuit</span>
                </span>
                <span className="text-xs text-muted-foreground">{property.bedrooms} ch • {property.guests} pers</span>
              </div>
              <button
                onClick={() => onPropertySelect?.(property)}
                className="w-full mt-2 py-2 px-4 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Voir détails
              </button>
            </div>
          </div>
        );

        const popup = new maplibregl.Popup({ offset: 25, closeButton: true, closeOnClick: false, maxWidth: '300px' })
          .setDOMContent(popupContainer);
        popups.current.push(popup);

        const markerEl = document.createElement('div');
        markerEl.className = 'custom-marker property-marker';
        markerEl.innerHTML = `<div class="marker-content marker-property"><span class="marker-price">🏠 ${property.currency}${property.price}</span></div>`;

        const marker = new maplibregl.Marker({ element: markerEl })
          .setLngLat([property.location.longitude, property.location.latitude])
          .addTo(map.current!);

        markerEl.addEventListener('click', (e) => {
          e.stopPropagation();
          document.querySelectorAll('.maplibregl-popup').forEach(p => p.classList.add('hidden-marker'));
          document.querySelectorAll('.custom-marker.active-marker').forEach(m => m.classList.remove('active-marker'));
          popup.setLngLat([property.location.longitude, property.location.latitude]).addTo(map.current!);
          markerEl.className = 'custom-marker property-marker active-marker';
        });

        markers.current.push(marker);
        allCoords.push([property.location.longitude, property.location.latitude]);
      });
    }

    // ── Service Markers ──
    if (activeLayer === 'all' || activeLayer === 'services') {
      const filteredServices = services.filter(s => {
        if (!s.latitude || !s.longitude) return false;
        if (filters.minPrice && s.price < filters.minPrice) return false;
        if (filters.maxPrice && s.price > filters.maxPrice) return false;
        if (filters.serviceCategory && s.category !== filters.serviceCategory) return false;
        return true;
      });

      filteredServices.forEach(service => {
        const title = getLocalizedText(service.title, lang);
        const icon = CATEGORY_ICONS[service.category] || '✨';

        const popupContainer = document.createElement('div');
        const root = ReactDOM.createRoot(popupContainer);
        root.render(
          <div className="w-72 p-0">
            <div className="relative">
              {service.images?.[0] && (
                <img src={service.images[0]} alt={title} className="w-full h-36 object-cover rounded-t-xl" />
              )}
              <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold">
                ⭐ {service.averageRating}
              </div>
              <div className="absolute top-2 right-2 bg-secondary/90 text-secondary-foreground px-2 py-1 rounded-full text-[10px] font-bold">
                {icon} Service
              </div>
            </div>
            <div className="p-3 space-y-2">
              <h3 className="font-semibold text-foreground text-sm line-clamp-1">{icon} {title}</h3>
              <p className="text-xs text-muted-foreground">{service.city}, {service.wilaya}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary">
                  {service.price.toLocaleString()} {service.currency}
                </span>
                {service.duration && (
                  <span className="text-xs text-muted-foreground">{service.duration}h</span>
                )}
              </div>
              <button
                onClick={() => onServiceSelect?.(service)}
                className="w-full mt-2 py-2 px-4 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Voir détails
              </button>
            </div>
          </div>
        );

        const popup = new maplibregl.Popup({ offset: 25, closeButton: true, closeOnClick: false, maxWidth: '300px' })
          .setDOMContent(popupContainer);
        popups.current.push(popup);

        const markerEl = document.createElement('div');
        markerEl.className = 'custom-marker service-marker';
        markerEl.innerHTML = `<div class="marker-content marker-service"><span class="marker-price">${icon} ${service.price.toLocaleString()}</span></div>`;

        const marker = new maplibregl.Marker({ element: markerEl })
          .setLngLat([service.longitude!, service.latitude!])
          .addTo(map.current!);

        markerEl.addEventListener('click', (e) => {
          e.stopPropagation();
          document.querySelectorAll('.maplibregl-popup').forEach(p => p.classList.add('hidden-marker'));
          document.querySelectorAll('.custom-marker.active-marker').forEach(m => m.classList.remove('active-marker'));
          popup.setLngLat([service.longitude!, service.latitude!]).addTo(map.current!);
          markerEl.className = 'custom-marker service-marker active-marker';
        });

        markers.current.push(marker);
        allCoords.push([service.longitude!, service.latitude!]);
      });
    }

    // Fit bounds
    if (allCoords.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      allCoords.forEach(c => bounds.extend(c));
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }
  }, [properties, services, filters, activeLayer, lang, mapReady, onPropertySelect, onServiceSelect]);

  const propertiesCount = properties.filter(p => p.location?.latitude && p.location?.longitude).length;
  const servicesCount = services.filter(s => s.latitude && s.longitude).length;

  return (
    <div className="space-y-4">
      {/* Search + Controls */}
      <div className="flex gap-2">
        <AddressAutocomplete
          value={searchQuery}
          onChange={setSearchQuery}
          onSelect={handleAddressSelect}
          placeholder="Rechercher une adresse..."
          className="flex-1"
        />
        <DynamicButton variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="h-4 w-4" />
        </DynamicButton>
        <DynamicButton variant="outline" onClick={handleGeolocation} disabled={isLocating}>
          <Locate className={`h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} />
        </DynamicButton>
      </div>

      {/* Layer Toggle */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeLayer === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveLayer('all')}
          className="gap-1.5"
        >
          <Layers className="h-3.5 w-3.5" />
          Tout ({propertiesCount + servicesCount})
        </Button>
        <Button
          variant={activeLayer === 'properties' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveLayer('properties')}
          className="gap-1.5"
        >
          <Building2 className="h-3.5 w-3.5" />
          Propriétés ({propertiesCount})
        </Button>
        <Button
          variant={activeLayer === 'services' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveLayer('services')}
          className="gap-1.5"
        >
          <Compass className="h-3.5 w-3.5" />
          Services ({servicesCount})
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 bg-card rounded-lg border border-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm mb-2 block">Prix Min</Label>
              <Input type="number" placeholder="Min" value={filters.minPrice || ''} onChange={e => setFilters(f => ({ ...f, minPrice: Number(e.target.value) || undefined }))} />
            </div>
            <div>
              <Label className="text-sm mb-2 block">Prix Max</Label>
              <Input type="number" placeholder="Max" value={filters.maxPrice || ''} onChange={e => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) || undefined }))} />
            </div>
            {(activeLayer === 'all' || activeLayer === 'services') && (
              <div>
                <Label className="text-sm mb-2 block">Catégorie Service</Label>
                <Select value={filters.serviceCategory || ''} onValueChange={v => setFilters(f => ({ ...f, serviceCategory: v || undefined }))}>
                  <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes</SelectItem>
                    {Object.entries(CATEGORY_ICONS).map(([k, icon]) => (
                      <SelectItem key={k} value={k}>{icon} {k.replace(/_/g, ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map */}
      <div ref={mapContainer} className={`w-full min-h-[500px] rounded-xl border border-border ${className}`} />

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-primary" />
          Propriétés
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-secondary" />
          Services
        </div>
      </div>
    </div>
  );
};
