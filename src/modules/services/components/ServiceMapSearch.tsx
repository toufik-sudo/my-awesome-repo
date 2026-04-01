import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import ReactDOM from 'react-dom/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, Locate } from 'lucide-react';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { AddressAutocomplete, type NominatimSuggestion } from '@/modules/shared/components/AddressAutocomplete';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { CATEGORY_ICONS } from '../services.constants';
import type { TourismService } from '@/types/tourism-service.types';

export interface ServiceMapBounds {
  north: number; south: number; east: number; west: number;
}

interface ServiceMapSearchProps {
  services: TourismService[];
  center?: [number, number];
  zoom?: number;
  lang?: string;
  onServiceSelect?: (service: TourismService) => void;
  onBoundsChange?: (bounds: ServiceMapBounds) => void;
  className?: string;
}

const DEFAULT_CENTER: [number, number] = [3.0588, 36.7538]; // Algiers
const DEFAULT_ZOOM = 10;

const getLocalizedText = (obj: Record<string, string> | string | undefined, lang: string): string => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj['fr'] || obj['en'] || Object.values(obj)[0] || '';
};

export const ServiceMapSearch: React.FC<ServiceMapSearchProps> = ({
  services,
  center,
  zoom,
  lang = 'fr',
  onServiceSelect,
  onBoundsChange,
  className = '',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const popups = useRef<maplibregl.Popup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [filters, setFilters] = useState<{ minPrice?: number; maxPrice?: number; category?: string }>({});

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
        toast.success('Centré sur votre position');
      },
      () => { setIsLocating(false); toast.error('Erreur de géolocalisation'); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

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

  useEffect(() => {
    if (!map.current || !mapReady) return;
    markers.current.forEach(mk => mk.remove());
    popups.current.forEach(p => p.remove());
    markers.current = [];
    popups.current = [];

    const filtered = services.filter(s => {
      if (!s.latitude || !s.longitude) return false;
      if (filters.minPrice && s.price < filters.minPrice) return false;
      if (filters.maxPrice && s.price > filters.maxPrice) return false;
      if (filters.category && s.category !== filters.category) return false;
      return true;
    });

    filtered.forEach(service => {
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
      markerEl.className = 'custom-marker';
      markerEl.innerHTML = `<div class="marker-content"><span class="marker-price">${icon} ${service.price.toLocaleString()}</span></div>`;

      const marker = new maplibregl.Marker({ element: markerEl })
        .setLngLat([service.longitude!, service.latitude!])
        .addTo(map.current!);

      markerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.maplibregl-popup').forEach(p => p.classList.add('hidden-marker'));
        document.querySelectorAll('.custom-marker.active-marker').forEach(m => m.classList.remove('active-marker'));
        popup.setLngLat([service.longitude!, service.latitude!]).addTo(map.current!);
        markerEl.className = 'custom-marker active-marker';
      });

      markers.current.push(marker);
    });

    if (filtered.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      filtered.forEach(s => bounds.extend([s.longitude!, s.latitude!]));
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }
  }, [services, filters, lang, mapReady, onServiceSelect]);

  return (
    <div className="space-y-4">
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
            <div>
              <Label className="text-sm mb-2 block">Catégorie</Label>
              <Select value={filters.category || ''} onValueChange={v => setFilters(f => ({ ...f, category: v || undefined }))}>
                <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes</SelectItem>
                  {Object.entries(CATEGORY_ICONS).map(([k, icon]) => (
                    <SelectItem key={k} value={k}>{icon} {k.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <div ref={mapContainer} className={`w-full min-h-[400px] rounded-lg ${className}`} />
    </div>
  );
};
