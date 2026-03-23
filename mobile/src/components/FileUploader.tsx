import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ViewStyle,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing } from '@/constants/theme.constants';
import { Button } from './Button';
import { Image } from './Image';
import { ImageCropper } from './ImageCropper';

interface FileUploaderProps {
  accept?: 'image' | 'video' | 'document' | 'all';
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  onUpload: (files: any[]) => void | Promise<void>;
  onRemove?: (file: any) => void;
  files?: any[];
  showPreview?: boolean;
  enableCropper?: boolean;
  cropAspectRatio?: number;
  cropCircular?: boolean;
  style?: ViewStyle;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  accept = 'all',
  multiple = false,
  maxSize = 10,
  maxFiles,
  onUpload,
  onRemove,
  files: externalFiles,
  showPreview = true,
  enableCropper = false,
  cropAspectRatio = 1,
  cropCircular = false,
  style,
}) => {
  const { theme } = useTheme();
  const [internalFiles, setInternalFiles] = useState<any[]>([]);
  const files = externalFiles || internalFiles;
  const [cropperVisible, setCropperVisible] = useState(false);
  const [rawImageUri, setRawImageUri] = useState('');
  const [pendingAssets, setPendingAssets] = useState<any[]>([]);

  const requestPermissions = async () => {
    if (accept === 'image' || accept === 'video' || accept === 'all') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please grant media library permissions');
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        accept === 'video'
          ? ImagePicker.MediaTypeOptions.Videos
          : accept === 'image'
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: multiple,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      if (enableCropper && accept === 'image' && !multiple && result.assets.length === 1) {
        // Open cropper for single image
        setRawImageUri(result.assets[0].uri);
        setPendingAssets(result.assets);
        setCropperVisible(true);
        return;
      }

      processFiles(result.assets);
    }
  };

  const processFiles = (newFiles: any[]) => {
    if (maxFiles && files.length + newFiles.length > maxFiles) {
      Alert.alert('Error', `Maximum ${maxFiles} files allowed`);
      return;
    }

    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
    if (!externalFiles) {
      setInternalFiles(updatedFiles);
    }
    onUpload(newFiles);
  };

  const handleCropComplete = (croppedUri: string) => {
    setCropperVisible(false);
    const croppedAssets = pendingAssets.map((a) => ({ ...a, uri: croppedUri }));
    processFiles(croppedAssets);
    setPendingAssets([]);
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      multiple,
    });

    if (!result.canceled && result.assets) {
      processFiles(result.assets);
    }
  };

  const handleRemove = (file: any, index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    if (!externalFiles) {
      setInternalFiles(newFiles);
    }
    onRemove?.(file);
  };

  const getFilePicker = () => {
    if (accept === 'document') {
      return pickDocument;
    }
    return pickImage;
  };

  return (
    <View style={[styles.container, style]}>
      <Button onPress={getFilePicker()} variant="outline">
        {multiple ? 'Upload Files' : 'Upload File'}
      </Button>
      <Text style={[styles.hint, { color: theme.mutedForeground }]}>
        Max {maxSize}MB {maxFiles ? `• Up to ${maxFiles} files` : ''}
      </Text>

      {showPreview && files.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.preview}>
          {files.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              {file.uri && file.type?.startsWith?.('image') ? (
                <Image
                  src={file.uri}
                  width={100}
                  height={100}
                  rounded
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    styles.filePlaceholder,
                    { backgroundColor: theme.muted },
                  ]}
                >
                  <Text style={{ color: theme.foreground }}>📄</Text>
                </View>
              )}
              <TouchableOpacity
                style={[
                  styles.removeButton,
                  { backgroundColor: theme.destructive },
                ]}
                onPress={() => handleRemove(file, index)}
              >
                <Text style={{ color: theme.destructiveForeground }}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Image Cropper */}
      {rawImageUri !== '' && (
        <ImageCropper
          imageUri={rawImageUri}
          visible={cropperVisible}
          onClose={() => setCropperVisible(false)}
          onCropComplete={handleCropComplete}
          aspectRatio={cropAspectRatio}
          circular={cropCircular}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  hint: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  preview: {
    marginTop: spacing.md,
  },
  fileItem: {
    marginRight: spacing.md,
    position: 'relative',
  },
  filePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
