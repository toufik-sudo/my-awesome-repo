import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTheme } from '@/contexts/ThemeContext';

interface LocationPickerProps {
  initialLocation?: { latitude: number; longitude: number };
  onLocationSelect: (location: { latitude: number; longitude: number; address?: string }) => void;
  label?: string;
  placeholder?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  initialLocation,
  onLocationSelect,
  label,
  placeholder = 'Select location',
}) => {
  const { theme, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(
    initialLocation || null
  );
  const [tempLocation, setTempLocation] = useState<{ latitude: number; longitude: number } | null>(
    initialLocation || null
  );

  const initialRegion: Region = {
    latitude: initialLocation?.latitude || 37.78825,
    longitude: initialLocation?.longitude || -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const mapStyle = isDark ? [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  ] : [];

  const handleMapPress = (e: any) => {
    setTempLocation(e.nativeEvent.coordinate);
  };

  const handleConfirm = () => {
    if (tempLocation) {
      setSelectedLocation(tempLocation);
      onLocationSelect(tempLocation);
      setIsOpen(false);
    }
  };

  const formatLocation = (loc: { latitude: number; longitude: number }) => {
    return `${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`;
  };

  return (
    <>
      <View style={styles.container}>
        {label && <Text style={[styles.label, { color: theme.foreground }]}>{label}</Text>}
        <TouchableOpacity
          onPress={() => setIsOpen(true)}
          style={[styles.input, { backgroundColor: theme.muted, borderColor: theme.border }]}
        >
          <Text style={[styles.inputText, { color: selectedLocation ? theme.foreground : theme.mutedForeground }]}>
            {selectedLocation ? formatLocation(selectedLocation) : placeholder}
          </Text>
          <Text style={{ color: theme.mutedForeground }}>📍</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isOpen} animationType="slide" onRequestClose={() => setIsOpen(false)}>
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.headerTitle, { color: theme.foreground }]}>Select Location</Text>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <Text style={{ color: theme.primary, fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={initialRegion}
            customMapStyle={mapStyle}
            showsUserLocation
            showsMyLocationButton
            onPress={handleMapPress}
          >
            {tempLocation && (
              <Marker
                coordinate={tempLocation}
                draggable
                onDragEnd={(e) => setTempLocation(e.nativeEvent.coordinate)}
              />
            )}
          </MapView>

          {tempLocation && (
            <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
              <Text style={[styles.locationText, { color: theme.mutedForeground }]}>
                {formatLocation(tempLocation)}
              </Text>
              <TouchableOpacity
                onPress={handleConfirm}
                style={[styles.confirmBtn, { backgroundColor: theme.primary }]}
              >
                <Text style={{ color: theme.primaryForeground, fontWeight: '600' }}>Confirm Location</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  inputText: { fontSize: 14, flex: 1 },
  modalContainer: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  map: { flex: 1 },
  footer: {
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  locationText: { fontSize: 13, textAlign: 'center' },
  confirmBtn: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
});
