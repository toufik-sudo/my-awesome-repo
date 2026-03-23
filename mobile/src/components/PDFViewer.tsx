import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, ActivityIndicator, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './Button';
import { spacing } from '@/constants/theme.constants';

const { width, height } = Dimensions.get('window');

export interface PDFViewerProps {
  visible: boolean;
  onClose: () => void;
  source: { uri: string } | { base64: string } | number;
  title?: string;
  enablePaging?: boolean;
  enableSwipe?: boolean;
  horizontal?: boolean;
  fitPolicy?: 0 | 1 | 2; // 0: width, 1: height, 2: both
  spacing?: number;
  password?: string;
  showsHorizontalScrollIndicator?: boolean;
  showsVerticalScrollIndicator?: boolean;
  onLoadComplete?: (numberOfPages: number, filePath: string) => void;
  onPageChanged?: (page: number, numberOfPages: number) => void;
  onError?: (error: Error) => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  visible,
  onClose,
  source,
  title = 'PDF Viewer',
  enablePaging = true,
  enableSwipe = true,
  horizontal = false,
  fitPolicy = 2,
  spacing: pageSpacing = 10,
  password,
  showsHorizontalScrollIndicator = false,
  showsVerticalScrollIndicator = false,
  onLoadComplete,
  onPageChanged,
  onError,
}) => {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLoadComplete = (numberOfPages: number, filePath: string) => {
    setTotalPages(numberOfPages);
    setLoading(false);
    onLoadComplete?.(numberOfPages, filePath);
  };

  const handlePageChanged = (page: number, numberOfPages: number) => {
    setCurrentPage(page);
    onPageChanged?.(page, numberOfPages);
  };

  const handleError = (err: Error) => {
    setError(err.message);
    setLoading(false);
    onError?.(err);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: theme.foreground }]} numberOfLines={1}>
              {title}
            </Text>
            {totalPages > 0 && (
              <Text style={[styles.pageInfo, { color: theme.mutedForeground }]}>
                Page {currentPage} of {totalPages}
              </Text>
            )}
          </View>
          <Button onPress={onClose} variant="ghost" size="sm">
            Close
          </Button>
        </View>

        {/* PDF Content */}
        <View style={styles.pdfContainer}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.foreground }]}>
                Loading PDF...
              </Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorIcon, { color: theme.destructive }]}>⚠️</Text>
              <Text style={[styles.errorTitle, { color: theme.foreground }]}>
                Error Loading PDF
              </Text>
              <Text style={[styles.errorMessage, { color: theme.mutedForeground }]}>
                {error}
              </Text>
              <Button onPress={onClose} style={styles.errorButton}>
                Close
              </Button>
            </View>
          )}

          {!error && (
            <Pdf
              source={source}
              password={password}
              style={styles.pdf}
              enablePaging={enablePaging}
              enableSwipe={enableSwipe}
              horizontal={horizontal}
              fitPolicy={fitPolicy}
              spacing={pageSpacing}
              showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
              showsVerticalScrollIndicator={showsVerticalScrollIndicator}
              onLoadComplete={handleLoadComplete}
              onPageChanged={handlePageChanged}
              onError={handleError}
              trustAllCerts={false}
            />
          )}
        </View>

        {/* Footer Navigation (optional) */}
        {totalPages > 0 && !error && (
          <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
            <Text style={[styles.footerText, { color: theme.mutedForeground }]}>
              Swipe to navigate • Pinch to zoom
            </Text>
          </View>
        )}
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
    borderBottomWidth: 1,
  },
  headerContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  pageInfo: {
    fontSize: 14,
  },
  pdfContainer: {
    flex: 1,
    position: 'relative',
  },
  pdf: {
    flex: 1,
    width,
    height,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  errorButton: {
    minWidth: 120,
  },
  footer: {
    padding: spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 12,
  },
});

// Utility function to open PDF from file picker
export const openPDFFromPicker = async (): Promise<string | null> => {
  try {
    const DocumentPicker = require('expo-document-picker');
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error('Error picking PDF:', error);
    return null;
  }
};
