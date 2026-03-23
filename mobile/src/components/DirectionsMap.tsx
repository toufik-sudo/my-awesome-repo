import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTheme } from '@/contexts/ThemeContext';

export interface RoutePoint {
  latitude: number;
  longitude: number;
}

interface DirectionsMapProps {
  origin: RoutePoint;
  destination: RoutePoint;
  waypoints?: RoutePoint[];
  routeCoordinates?: RoutePoint[];
  height?: number;
  strokeWidth?: number;
  originMarkerTitle?: string;
  destinationMarkerTitle?: string;
}

export const DirectionsMap: React.FC<DirectionsMapProps> = ({
  origin,
  destination,
  waypoints = [],
  routeCoordinates,
  height = 400,
  strokeWidth = 4,
  originMarkerTitle = 'Start',
  destinationMarkerTitle = 'Destination',
}) => {
  const { theme, isDark } = useTheme();

  // Calculate the region to fit all points
  const calculateRegion = (): Region => {
    const allPoints = [origin, destination, ...waypoints];
    
    const latitudes = allPoints.map(p => p.latitude);
    const longitudes = allPoints.map(p => p.longitude);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    
    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;
    const deltaLat = (maxLat - minLat) * 1.5; // Add padding
    const deltaLng = (maxLng - minLng) * 1.5;

    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: Math.max(deltaLat, 0.01),
      longitudeDelta: Math.max(deltaLng, 0.01),
    };
  };

  // Generate simple straight line if no route provided
  const coordinates = routeCoordinates || [origin, ...waypoints, destination];

  const mapStyle = isDark ? [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  ] : [];

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={calculateRegion()}
        customMapStyle={mapStyle}
      >
        {/* Route polyline */}
        <Polyline
          coordinates={coordinates}
          strokeColor={theme.primary}
          strokeWidth={strokeWidth}
          lineDashPattern={[0]}
        />

        {/* Origin marker */}
        <Marker
          coordinate={origin}
          title={originMarkerTitle}
          pinColor="#22c55e"
        />

        {/* Waypoint markers */}
        {waypoints.map((point, index) => (
          <Marker
            key={`waypoint-${index}`}
            coordinate={point}
            title={`Waypoint ${index + 1}`}
            pinColor={theme.primary}
          />
        ))}

        {/* Destination marker */}
        <Marker
          coordinate={destination}
          title={destinationMarkerTitle}
          pinColor="#ef4444"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
