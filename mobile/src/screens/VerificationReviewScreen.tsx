import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Badge, Loading } from '@/components';
import { documentsApi, propertiesApi } from '@/services/properties.api';
import type { VerificationDocument } from '@/types/property.types';
import { DOCUMENT_LABELS } from '@/types/property.types';
import { spacing } from '@/constants/theme.constants';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { MOBILE_UI_PERM } from '@/utils/rbac/mobile-permission-keys';

export const VerificationReviewScreen: React.FC = () => {
  const { theme } = useTheme();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetcher = useCallback(
    (params: { page: number; limit: number }) => documentsApi.getPendingPaginated(params),
    [],
  );

  const {
    items: documents,
    loading,
    refreshing,
    refresh,
    loadMore,
    hasMore,
    forbidden,
    total,
  } = usePaginatedList<VerificationDocument>({
    fetcher,
    limit: 20,
    permKey: MOBILE_UI_PERM.VERIFICATION_REVIEW_VIEW,
  });

  const handleApprove = async (doc: VerificationDocument) => {
    try {
      setProcessingId(doc.id);
      await documentsApi.approve(doc.id);
      await propertiesApi.recalculateTrust(doc.propertyId);
      Alert.alert('Success', 'Document approved and trust score updated.');
      refresh();
    } catch (error) {
      Alert.alert('Error', 'Failed to approve document.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (doc: VerificationDocument) => {
    Alert.prompt(
      'Reject Document',
      'Enter reason for rejection (optional):',
      async (reason) => {
        try {
          setProcessingId(doc.id);
          await documentsApi.reject(doc.id, reason);
          await propertiesApi.recalculateTrust(doc.propertyId);
          Alert.alert('Rejected', 'Document rejected and trust score updated.');
          refresh();
        } catch (error) {
          Alert.alert('Error', 'Failed to reject document.');
        } finally {
          setProcessingId(null);
        }
      },
      'plain-text',
    );
  };

  const handleAIValidate = async (doc: VerificationDocument) => {
    try {
      setProcessingId(doc.id);
      const result = await documentsApi.submitForValidation(doc.id);
      if (result.autoApproved) {
        Alert.alert(
          'AI Processed',
          `Document auto-${result.document.status} by AI with ${Math.round((result.aiResult?.confidence || 0) * 100)}% confidence.`,
        );
      } else {
        Alert.alert(
          'AI Analysis Complete',
          `AI suggests: ${result.aiResult?.isValid ? 'Valid' : 'Invalid'} (${Math.round((result.aiResult?.confidence || 0) * 100)}% confidence)\n\n${result.aiResult?.reason}`,
        );
      }
      refresh();
    } catch (error) {
      Alert.alert('Error', 'AI validation failed.');
    } finally {
      setProcessingId(null);
    }
  };

  const renderDocument = ({ item: doc }: { item: VerificationDocument }) => {
    const isProcessing = processingId === doc.id;

    return (
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Image source={{ uri: doc.fileUrl }} style={styles.preview} />
        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={[styles.docType, { color: theme.foreground }]}>
              {DOCUMENT_LABELS[doc.type]}
            </Text>
            <Badge label={doc.status} variant={doc.status === 'pending' ? 'outline' : 'secondary'} />
          </View>

          <Text style={[styles.fileName, { color: theme.mutedForeground }]} numberOfLines={1}>
            📎 {doc.fileName}
          </Text>

          <Text style={[styles.propertyId, { color: theme.mutedForeground }]}>
            Property: {doc.propertyId.slice(0, 8)}...
          </Text>

          {doc.aiAnalyzed && (
            <View
              style={[
                styles.aiBox,
                { backgroundColor: doc.aiValidationResult ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)' },
              ]}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: theme.foreground }}>
                🤖 AI: {doc.aiValidationResult ? '✅ Valid' : '⚠️ Invalid'} ({Math.round((doc.aiConfidence || 0) * 100)}%)
              </Text>
              {doc.aiReason && (
                <Text style={{ fontSize: 11, color: theme.mutedForeground }}>{doc.aiReason}</Text>
              )}
            </View>
          )}

          {doc.status === 'pending' && (
            <View style={styles.actions}>
              {!doc.aiAnalyzed && (
                <TouchableOpacity
                  onPress={() => handleAIValidate(doc)}
                  disabled={isProcessing}
                  style={[styles.actionBtn, { backgroundColor: theme.secondary }]}
                >
                  <Text style={{ color: theme.foreground, fontSize: 12, fontWeight: '600' }}>🤖 AI Check</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => handleApprove(doc)}
                disabled={isProcessing}
                style={[styles.actionBtn, { backgroundColor: '#22c55e' }]}
              >
                <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '600' }}>✓ Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleReject(doc)}
                disabled={isProcessing}
                style={[styles.actionBtn, { backgroundColor: theme.destructive }]}
              >
                <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '600' }}>✕ Reject</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (forbidden) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.empty, { paddingTop: spacing.xxl }]}>
          <Text style={{ fontSize: 40, marginBottom: 8 }}>🔒</Text>
          <Text style={{ color: theme.mutedForeground, textAlign: 'center' }}>Access denied</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading && documents.length === 0) {
    return <Loading message="Loading pending documents..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.foreground }]}>Verification Review</Text>
        <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
          {total} document{total !== 1 ? 's' : ''} pending review
        </Text>
      </View>

      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.primary} />
        }
        ListFooterComponent={
          hasMore || (loading && documents.length > 0) ? (
            <View style={{ paddingVertical: spacing.lg }}>
              <ActivityIndicator color={theme.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 40, marginBottom: 8 }}>✅</Text>
            <Text style={{ color: theme.mutedForeground, textAlign: 'center' }}>
              No documents pending review
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4 },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: { borderRadius: 12, borderWidth: 1, overflow: 'hidden', marginBottom: spacing.md },
  preview: { width: '100%', height: 160, resizeMode: 'cover' },
  info: { padding: 12, gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  docType: { fontSize: 15, fontWeight: '600' },
  fileName: { fontSize: 12 },
  propertyId: { fontSize: 11 },
  aiBox: { padding: 8, borderRadius: 8, gap: 2 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl * 2 },
});

export default VerificationReviewScreen;
