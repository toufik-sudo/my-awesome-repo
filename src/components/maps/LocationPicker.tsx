import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons (Leaflet + bundlers issue)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x as unknown as string,
  iconUrl: markerIcon as unknown as string,
  shadowUrl: markerShadow as unknown as string,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export interface LocationPickerProps {
  latitude: number;
  longitude: number;
  /** When provided, marker is draggable and clicking the map moves it. */
  onChange?: (coords: { lat: number; lng: number }) => void;
  zoom?: number;
  height?: number | string;
  className?: string;
  /** Read-only mode (no drag, no click-to-move). */
  readOnly?: boolean;
}

const Recenter: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
};

const ClickHandler: React.FC<{ onChange: (c: { lat: number; lng: number }) => void }> = ({ onChange }) => {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

export const LocationPicker: React.FC<LocationPickerProps> = ({
  latitude,
  longitude,
  onChange,
  zoom = 14,
  height = 300,
  className = '',
  readOnly = false,
}) => {
  const markerRef = useRef<L.Marker | null>(null);
  const draggable = !readOnly && !!onChange;

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const m = markerRef.current;
        if (m && onChange) {
          const { lat, lng } = m.getLatLng();
          onChange({ lat, lng });
        }
      },
    }),
    [onChange],
  );

  return (
    <div
      className={`rounded-lg overflow-hidden border border-border ${className}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        scrollWheelZoom
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[latitude, longitude]}
          draggable={draggable}
          eventHandlers={draggable ? eventHandlers : undefined}
          ref={(ref) => {
            markerRef.current = ref as unknown as L.Marker | null;
          }}
        />
        <Recenter lat={latitude} lng={longitude} />
        {draggable && onChange && <ClickHandler onChange={onChange} />}
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
