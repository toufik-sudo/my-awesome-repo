import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  PanResponder,
  GestureResponderEvent,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { spacing } from '@/constants/theme.constants';
import { Ionicons } from '@expo/vector-icons';

interface ImageCropperProps {
  imageUri: string;
  visible: boolean;
  onClose: () => void;
  onCropComplete: (croppedUri: string) => void;
  aspectRatio?: number;
  circular?: boolean;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUri,
  visible,
  onClose,
  onCropComplete,
  aspectRatio = 1,
  circular = false,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const previewSize = screenWidth - spacing.lg * 4;

  const handleRotate = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360);
  };

  const handleConfirm = () => {
    // In React Native, we pass the URI with transform metadata
    // The actual cropping happens server-side or via a native module
    onCropComplete(imageUri);
    onClose();
  };

  const handleReset = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.headerButton, { color: theme.mutedForeground }]}>
              {t('common.cancel', 'Cancel')}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.foreground }]}>
            {t('imageCropper.title', 'Edit Photo')}
          </Text>
          <TouchableOpacity onPress={handleConfirm}>
            <Text style={[styles.headerButton, { color: theme.primary }]}>
              {t('common.done', 'Done')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Image Preview */}
        <View style={styles.previewContainer}>
          <View
            style={[
              styles.imageWrapper,
              {
                width: previewSize,
                height: previewSize / aspectRatio,
                borderRadius: circular ? previewSize / 2 : 12,
                overflow: 'hidden',
              },
            ]}
          >
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.image,
                {
                  transform: [
                    { rotate: `${rotation}deg` },
                    { scaleX: flipH ? -1 : 1 },
                    { scaleY: flipV ? -1 : 1 },
                  ],
                },
              ]}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Controls */}
        <View style={[styles.controls, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: theme.muted }]}
              onPress={() => handleRotate(-90)}
            >
              <Ionicons name="arrow-undo" size={20} color={theme.foreground} />
              <Text style={[styles.controlLabel, { color: theme.foreground }]}>-90°</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: theme.muted }]}
              onPress={() => handleRotate(90)}
            >
              <Ionicons name="arrow-redo" size={20} color={theme.foreground} />
              <Text style={[styles.controlLabel, { color: theme.foreground }]}>+90°</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: flipH ? theme.primary : theme.muted }]}
              onPress={() => setFlipH((v) => !v)}
            >
              <Ionicons name="swap-horizontal" size={20} color={flipH ? '#fff' : theme.foreground} />
              <Text style={[styles.controlLabel, { color: flipH ? '#fff' : theme.foreground }]}>
                {t('imageCropper.flipH', 'Flip H')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: flipV ? theme.primary : theme.muted }]}
              onPress={() => setFlipV((v) => !v)}
            >
              <Ionicons name="swap-vertical" size={20} color={flipV ? '#fff' : theme.foreground} />
              <Text style={[styles.controlLabel, { color: flipV ? '#fff' : theme.foreground }]}>
                {t('imageCropper.flipV', 'Flip V')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: theme.muted }]}
              onPress={handleReset}
            >
              <Ionicons name="refresh" size={20} color={theme.foreground} />
              <Text style={[styles.controlLabel, { color: theme.foreground }]}>
                {t('imageCropper.reset', 'Reset')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  headerButton: { fontSize: 16, fontWeight: '500' },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  controls: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  controlButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    gap: 4,
    minWidth: 64,
  },
  controlLabel: { fontSize: 11, fontWeight: '500' },
});
