import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { QRScanner } from '@/components/QRScanner';
import { BiometricAuth, checkBiometricSupport, authenticateAsync } from '@/components/BiometricAuth';
import { CameraComponent } from '@/components/CameraComponent';
import { PDFViewer, openPDFFromPicker } from '@/components/PDFViewer';
import { Alert } from '@/components/Alert';
import { spacing } from '@/constants/theme.constants';

export default function UtilitiesDemo() {
  const { theme } = useTheme();
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [biometricResult, setBiometricResult] = useState<string | null>(null);

  const handleScanQR = (data: string, type?: string) => {
    setScannedData(`Type: ${type}\nData: ${data}`);
    setShowQRScanner(false);
  };

  const handleQuickBiometric = async () => {
    const support = await checkBiometricSupport();
    
    if (!support.isAvailable) {
      setBiometricResult(`Biometric not available. Type: ${support.biometricType}`);
      return;
    }

    const result = await authenticateAsync({
      promptMessage: 'Quick Authentication',
      cancelLabel: 'Cancel',
    });

    if (result.success) {
      setBiometricResult('✓ Authentication successful!');
    } else {
      setBiometricResult(`✗ Authentication failed: ${result.error}`);
    }
  };

  const handleCaptureImage = (uri: string) => {
    setCapturedImage(uri);
    setShowCamera(false);
  };

  const handleOpenPDF = async () => {
    const uri = await openPDFFromPicker();
    if (uri) {
      setPdfUri(uri);
      setShowPDF(true);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.foreground }]}>
          Utility Components
        </Text>
        <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
          Batch 5: QR Scanner, Biometric, Camera, PDF
        </Text>

        {/* QR Scanner Section */}
        <Card title="QR Code Scanner" style={styles.section}>
          <Text style={[styles.description, { color: theme.mutedForeground }]}>
            Scan QR codes and barcodes using the camera
          </Text>
          <Button onPress={() => setShowQRScanner(true)}>
            Open QR Scanner
          </Button>
          {scannedData && (
            <Alert variant="success" style={styles.result}>
              <Text style={{ color: theme.foreground }}>{scannedData}</Text>
            </Alert>
          )}
        </Card>

        {/* Biometric Section */}
        <Card title="Biometric Authentication" style={styles.section}>
          <Text style={[styles.description, { color: theme.mutedForeground }]}>
            Face ID / Touch ID authentication
          </Text>
          <View style={styles.buttonRow}>
            <Button onPress={() => setShowBiometric(true)} style={styles.flex1}>
              Full Screen
            </Button>
            <Button onPress={handleQuickBiometric} variant="outline" style={styles.flex1}>
              Quick Auth
            </Button>
          </View>
          {biometricResult && (
            <Alert 
              variant={biometricResult.includes('✓') ? 'success' : 'error'} 
              style={styles.result}
            >
              <Text style={{ color: theme.foreground }}>{biometricResult}</Text>
            </Alert>
          )}
        </Card>

        {/* Camera Section */}
        <Card title="Camera" style={styles.section}>
          <Text style={[styles.description, { color: theme.mutedForeground }]}>
            Full-featured camera with photo capture
          </Text>
          <Button onPress={() => setShowCamera(true)}>
            Open Camera
          </Button>
          {capturedImage && (
            <Alert variant="success" style={styles.result}>
              <Text style={{ color: theme.foreground }}>
                ✓ Image captured: {capturedImage.slice(-30)}
              </Text>
            </Alert>
          )}
        </Card>

        {/* PDF Viewer Section */}
        <Card title="PDF Viewer" style={styles.section}>
          <Text style={[styles.description, { color: theme.mutedForeground }]}>
            View PDF documents with zoom and navigation
          </Text>
          <View style={styles.buttonRow}>
            <Button onPress={handleOpenPDF} style={styles.flex1}>
              Select PDF
            </Button>
            <Button 
              onPress={() => {
                setPdfUri('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
                setShowPDF(true);
              }} 
              variant="outline" 
              style={styles.flex1}
            >
              Sample PDF
            </Button>
          </View>
        </Card>
      </ScrollView>

      {/* QR Scanner Modal */}
      <QRScanner
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleScanQR}
        title="Scan QR Code"
        instructions="Position the QR code within the frame to scan"
      />

      {/* Biometric Modal */}
      {showBiometric && (
        <View style={StyleSheet.absoluteFill}>
          <BiometricAuth
            onSuccess={() => {
              setBiometricResult('✓ Full screen authentication successful!');
              setShowBiometric(false);
            }}
            onError={(error) => {
              setBiometricResult(`✗ Error: ${error}`);
              setShowBiometric(false);
            }}
            onCancel={() => {
              setBiometricResult('Authentication cancelled');
              setShowBiometric(false);
            }}
            promptMessage="Verify your identity to continue"
          />
        </View>
      )}

      {/* Camera Modal */}
      <CameraComponent
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCaptureImage}
        title="Take Photo"
        saveToLibrary={false}
      />

      {/* PDF Viewer Modal */}
      {pdfUri && (
        <PDFViewer
          visible={showPDF}
          onClose={() => {
            setShowPDF(false);
            setPdfUri(null);
          }}
          source={{ uri: pdfUri }}
          title="PDF Document"
          enablePaging
          onLoadComplete={(pages) => console.log(`Loaded ${pages} pages`)}
          onError={(error) => console.error('PDF Error:', error)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: 14,
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex1: {
    flex: 1,
  },
  result: {
    marginTop: spacing.md,
  },
});
