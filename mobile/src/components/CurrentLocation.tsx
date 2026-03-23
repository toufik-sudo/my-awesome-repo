import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { useTheme } from '@/contexts/ThemeContext';
import { Badge } from './Badge';

interface CurrentLocationProps {
  onLocationUpdate?: (location: Location.LocationObject) => void;
  showCoordinates?: boolean;
  showAddress?: boolean;
  autoUpdate?: boolean;
}

export const CurrentLocation: React.FC<CurrentLocationProps> = ({
  onLocationUpdate,
  showCoordinates = true,
  showAddress = false,
  autoUpdate = false,
}) => {
  const { theme } = useTheme();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'unknown'>('unknown');

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (autoUpdate && permissionStatus === 'granted') {
      const subscription = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
        },
        (loc) => {
          setLocation(loc);
          onLocationUpdate?.(loc);
        }
      );

      return () => {
        subscription.then(sub => sub.remove());
      };
    }
  }, [autoUpdate, permissionStatus]);

  const requestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status === 'granted' ? 'granted' : 'denied');
      
      if (status === 'granted') {
        getCurrentLocation();
      } else {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      }
    } catch (error) {
      console.error('Permission error:', error);
      setPermissionStatus('denied');
    }
  };

  const getCurrentLocation = async () => {
    if (permissionStatus !== 'granted') {
      await requestPermission();
      return;
    }

    setLoading(true);
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc);
      onLocationUpdate?.(loc);

      if (showAddress) {
        const addressResults = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        
        if (addressResults.length > 0) {
          const addr = addressResults[0];
          setAddress(`${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}`);
        }
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setLoading(false);
    }
  };

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  if (permissionStatus === 'denied') {
    return (
      <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.errorText, { color: theme.destructive }]}>Location permission denied</Text>
        <TouchableOpacity onPress={requestPermission} style={[styles.retryBtn, { borderColor: theme.border }]}>
          <Text style={{ color: theme.foreground }}>Request Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.foreground }]}>Current Location</Text>
        {location && <Badge label="Active" variant="success" />}
      </View>

      {loading && <Text style={{ color: theme.mutedForeground }}>Getting location...</Text>}

      {location && (
        <View style={styles.info}>
          {showCoordinates && (
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.mutedForeground }]}>Coordinates:</Text>
              <Text style={[styles.value, { color: theme.foreground }]}>
                {formatCoordinates(location.coords.latitude, location.coords.longitude)}
              </Text>
            </View>
          )}

          {showAddress && address && (
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.mutedForeground }]}>Address:</Text>
              <Text style={[styles.value, { color: theme.foreground }]} numberOfLines={2}>
                {address}
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.mutedForeground }]}>Accuracy:</Text>
            <Text style={[styles.value, { color: theme.foreground }]}>
              ±{location.coords.accuracy?.toFixed(0)}m
            </Text>
          </View>
        </View>
      )}

      {!autoUpdate && (
        <TouchableOpacity
          onPress={getCurrentLocation}
          disabled={loading}
          style={[styles.refreshBtn, { backgroundColor: theme.primary }]}
        >
          <Text style={{ color: theme.primaryForeground, fontWeight: '600' }}>
            {loading ? 'Loading...' : 'Refresh Location'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  info: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    flex: 1,
  },
  refreshBtn: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  retryBtn: {
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
});
