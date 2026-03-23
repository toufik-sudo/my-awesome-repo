import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Circle, Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTheme } from '@/contexts/ThemeContext';

export interface Geofence {
  id: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  label?: string;
  color?: string;
}

interface GeofenceMapProps {
  geofences: Geofence[];
  onGeofencePress?: (geofence: Geofence) => void;
  height?: number;
  editable?: boolean;
  onGeofenceUpdate?: (geofence: Geofence) => void;
}

export const GeofenceMap: React.FC<GeofenceMapProps> = ({
  geofences,
  onGeofencePress,
  height = 400,
  editable = false,
  onGeofenceUpdate,
}) => {
  const { theme, isDark } = useTheme();
  const [selectedGeofenceId, setSelectedGeofenceId] = useState<string | null>(null);

  const calculateRegion = (): Region => {
    if (geofences.length === 0) {
      return {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }

    const latitudes = geofences.map(g => g.latitude);
    const longitudes = geofences.map(g => g.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.01),
      longitudeDelta: Math.max((maxLng - minLng) * 1.5, 0.01),
    };
  };

  const handleMarkerDragEnd = (geofence: Geofence, e: any) => {
    if (editable && onGeofenceUpdate) {
      const { latitude, longitude } = e.nativeEvent.coordinate;
      onGeofenceUpdate({
        ...geofence,
        latitude,
        longitude,
      });
    }
  };

  const mapStyle = isDark ? [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  ] : [];

  return (
    <View style={styles.container}>
      <View style={[styles.mapContainer, { height }]}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={calculateRegion()}
          customMapStyle={mapStyle}
          showsUserLocation
        >
          {geofences.map((geofence) => (
            <React.Fragment key={geofence.id}>
              {/* Geofence circle */}
              <Circle
                center={{
                  latitude: geofence.latitude,
                  longitude: geofence.longitude,
                }}
                radius={geofence.radius}
                fillColor={`${geofence.color || theme.primary}30`}
                strokeColor={geofence.color || theme.primary}
                strokeWidth={2}
              />

              {/* Center marker */}
              <Marker
                coordinate={{
                  latitude: geofence.latitude,
                  longitude: geofence.longitude,
                }}
                title={geofence.label}
                draggable={editable}
                onDragEnd={(e) => handleMarkerDragEnd(geofence, e)}
                onPress={() => {
                  setSelectedGeofenceId(geofence.id);
                  onGeofencePress?.(geofence);
                }}
              />
            </React.Fragment>
          ))}
        </MapView>
      </View>

      {/* Legend */}
      {geofences.length > 0 && (
        <View style={[styles.legend, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {geofences.map((geofence) => (
            <TouchableOpacity
              key={geofence.id}
              style={[
                styles.legendItem,
                selectedGeofenceId === geofence.id && { backgroundColor: theme.muted }
              ]}
              onPress={() => {
                setSelectedGeofenceId(geofence.id);
                onGeofencePress?.(geofence);
              }}
            >
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: geofence.color || theme.primary }
                ]}
              />
              <View style={styles.legendText}>
                <Text style={[styles.legendLabel, { color: theme.foreground }]}>
                  {geofence.label || `Geofence ${geofence.id}`}
                </Text>
                <Text style={[styles.legendRadius, { color: theme.mutedForeground }]}>
                  Radius: {geofence.radius}m
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  legend: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 10,
    borderRadius: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    flex: 1,
    gap: 2,
  },
  legendLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  legendRadius: {
    fontSize: 11,
  },
});
