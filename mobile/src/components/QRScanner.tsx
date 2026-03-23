import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Vibration } from 'react-native';
import { CameraView, Camera, BarcodeScanningResult } from 'expo-camera';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/Button';
import { spacing } from '@/constants/theme.constants';

export interface QRScannerProps {
  visible: boolean;
  onClose: () => void;
  onScan: (data: string, type?: string) => void;
  title?: string;
  instructions?: string;
  enableVibration?: boolean;
  allowedBarcodeTypes?: ('qr' | 'ean13' | 'ean8' | 'code128' | 'code39' | 'upc_a' | 'upc_e')[];
}

export const QRScanner: React.FC<QRScannerProps> = ({
  visible,
  onClose,
  onScan,
  title = 'Scan QR Code',
  instructions = 'Position the QR code within the frame',
  enableVibration = true,
  allowedBarcodeTypes = ['qr'],
}) => {
  const { theme } = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    if (visible) {
      getCameraPermissions();
      setScanned(false);
    }
  }, [visible]);

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    if (!scanned) {
      setScanned(true);
      
      if (enableVibration) {
        Vibration.vibrate(100);
      }
      
      onScan(data, type);
      
      // Reset after a delay to allow re-scanning
      setTimeout(() => {
        setScanned(false);
      }, 2000);
    }
  };

  const renderContent = () => {
    if (hasPermission === null) {
      return (
        <View style={styles.messageContainer}>
          <Text style={[styles.messageText, { color: theme.foreground }]}>
            Requesting camera permission...
          </Text>
        </View>
      );
    }

    if (hasPermission === false) {
      return (
        <View style={styles.messageContainer}>
          <Text style={[styles.messageText, { color: theme.foreground }]}>
            Camera permission denied
          </Text>
          <Text style={[styles.subText, { color: theme.mutedForeground }]}>
            Please enable camera access in your device settings
          </Text>
          <Button onPress={onClose} style={styles.button}>
            Close
          </Button>
        </View>
      );
    }

    return (
      <>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: allowedBarcodeTypes,
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.topOverlay} />
            
            <View style={styles.middleRow}>
              <View style={styles.sideOverlay} />
              <View style={[styles.scanFrame, { borderColor: scanned ? theme.primary : 'white' }]}>
                {scanned && (
                  <View style={[styles.scannedIndicator, { backgroundColor: theme.primary }]}>
                    <Text style={styles.scannedText}>✓ Scanned</Text>
                  </View>
                )}
              </View>
              <View style={styles.sideOverlay} />
            </View>
            
            <View style={styles.bottomOverlay}>
              <Text style={styles.instructionsText}>{instructions}</Text>
            </View>
          </View>
        </CameraView>

        <View style={[styles.controls, { backgroundColor: theme.card }]}>
          <Button onPress={onClose} variant="outline">
            Cancel
          </Button>
        </View>
      </>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.foreground }]}>{title}</Text>
        </View>
        {renderContent()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl + 20, // Account for status bar
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  middleRow: {
    flexDirection: 'row',
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedIndicator: {
    padding: spacing.md,
    borderRadius: 8,
  },
  scannedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  instructionsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  controls: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  messageText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    minWidth: 120,
  },
});
