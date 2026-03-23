import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { CameraView, Camera, CameraType, FlashMode } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './Button';
import { spacing } from '@/constants/theme.constants';

export interface CameraComponentProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (uri: string) => void;
  mode?: 'photo' | 'video';
  saveToLibrary?: boolean;
  title?: string;
}

export const CameraComponent: React.FC<CameraComponentProps> = ({
  visible,
  onClose,
  onCapture,
  mode = 'photo',
  saveToLibrary = false,
  title = 'Camera',
}) => {
  const { theme } = useTheme();
  const cameraRef = useRef<CameraView>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [isRecording, setIsRecording] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  React.useEffect(() => {
    const getPermissions = async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(cameraStatus === 'granted');
    };

    if (visible) {
      getPermissions();
      setCapturedImage(null);
    }
  }, [visible]);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        
        if (photo) {
          setCapturedImage(photo.uri);
          
          if (saveToLibrary) {
            await MediaLibrary.saveToLibraryAsync(photo.uri);
          }
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const startRecording = async () => {
    if (cameraRef.current && !isRecording) {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync();
        
        if (video) {
          onCapture(video.uri);
          
          if (saveToLibrary) {
            await MediaLibrary.saveToLibraryAsync(video.uri);
          }
        }
      } catch (error) {
        console.error('Error recording video:', error);
      } finally {
        setIsRecording(false);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  const toggleCameraType = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlashMode(current => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
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

    if (capturedImage) {
      return (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.preview} />
          <View style={[styles.previewControls, { backgroundColor: theme.card }]}>
            <Button onPress={handleRetake} variant="outline" style={styles.actionButton}>
              Retake
            </Button>
            <Button onPress={handleConfirm} style={styles.actionButton}>
              Use Photo
            </Button>
          </View>
        </View>
      );
    }

    return (
      <>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={cameraType}
          flash={flashMode}
        >
          <View style={styles.topControls}>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
              onPress={toggleFlash}
            >
              <Text style={styles.controlIcon}>
                {flashMode === 'off' ? '⚡' : flashMode === 'on' ? '⚡' : '⚡A'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
              onPress={toggleCameraType}
            >
              <Text style={styles.controlIcon}>🔄</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.captureButton,
                { borderColor: 'white' },
                isRecording && styles.recordingButton,
              ]}
              onPress={mode === 'photo' ? takePicture : isRecording ? stopRecording : startRecording}
            >
              <View
                style={[
                  styles.captureButtonInner,
                  { backgroundColor: isRecording ? '#ef4444' : 'white' },
                ]}
              />
            </TouchableOpacity>

            <View style={styles.controlButton} />
          </View>
        </CameraView>
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
      <View style={[styles.container, { backgroundColor: 'black' }]}>
        <View style={[styles.header, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <Text style={[styles.title, { color: 'white' }]}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl + 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingBottom: spacing.xl + 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 24,
    color: 'white',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  recordingButton: {
    borderColor: '#ef4444',
  },
  previewContainer: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.sm,
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
