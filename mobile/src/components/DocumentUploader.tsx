import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '@/contexts/ThemeContext';
import { documentsApi } from '@/services/properties.api';
import { DOCUMENT_LABELS, DocumentType } from '@/types/property.types';
import { Badge } from './Badge';

interface DocumentUploaderProps {
  propertyId: string;
  onUploadComplete?: () => void;
}

const DOCUMENT_TYPES: DocumentType[] = [
  'national_id',
  'passport',
  'permit',
  'notarized_deed',
  'land_registry',
  'utility_bill',
  'management_declaration',
];

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  propertyId,
  onUploadComplete,
}) => {
  const { theme } = useTheme();
  const [selectedType, setSelectedType] = useState<DocumentType>('national_id');
  const [uploading, setUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  const handleSelectDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const file = result.assets[0];
      setUploading(true);

      await documentsApi.upload(propertyId, selectedType, file.uri, file.name);

      setUploadedDocs((prev) => [...prev, selectedType]);
      Alert.alert('Success', `${DOCUMENT_LABELS[selectedType]} uploaded successfully!`);
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.foreground }]}>Upload Verification Documents</Text>
      <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
        Upload documents to verify your property and increase your trust score.
      </Text>

      {/* Document Type Selector */}
      <View style={styles.typeGrid}>
        {DOCUMENT_TYPES.map((type) => {
          const isUploaded = uploadedDocs.includes(type);
          const isSelected = selectedType === type;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => setSelectedType(type)}
              style={[
                styles.typeButton,
                {
                  backgroundColor: isSelected ? theme.primary : theme.muted,
                  borderColor: isUploaded ? '#22c55e' : theme.border,
                  borderWidth: isUploaded ? 2 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.typeLabel,
                  { color: isSelected ? theme.primaryForeground : theme.foreground },
                ]}
                numberOfLines={2}
              >
                {DOCUMENT_LABELS[type]}
              </Text>
              {isUploaded && (
                <View style={styles.checkmark}>
                  <Text style={{ color: '#22c55e', fontSize: 14 }}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Upload Button */}
      <TouchableOpacity
        onPress={handleSelectDocument}
        disabled={uploading}
        style={[
          styles.uploadButton,
          { backgroundColor: uploading ? theme.muted : theme.primary },
        ]}
      >
        {uploading ? (
          <ActivityIndicator color={theme.primaryForeground} />
        ) : (
          <Text style={[styles.uploadText, { color: theme.primaryForeground }]}>
            📎 Select & Upload {DOCUMENT_LABELS[selectedType]}
          </Text>
        )}
      </TouchableOpacity>

      {/* Uploaded Summary */}
      {uploadedDocs.length > 0 && (
        <View style={styles.summary}>
          <Text style={[styles.summaryTitle, { color: theme.foreground }]}>
            Uploaded Documents ({uploadedDocs.length})
          </Text>
          <View style={styles.badgeRow}>
            {uploadedDocs.map((type) => (
              <Badge key={type} label={DOCUMENT_LABELS[type as DocumentType]} variant="success" />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    position: 'relative',
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '500',
    maxWidth: 100,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 15,
    fontWeight: '600',
  },
  summary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
});

export default DocumentUploader;
