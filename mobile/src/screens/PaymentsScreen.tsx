import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, Loading } from '@/components';
import { paymentsApi, type PaymentReceipt } from '@/services/payments.api';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { spacing } from '@/constants/theme.constants';

const STATUS_COLORS: Record<string, string> = { pending: '#F59E0B', approved: '#10B981', rejected: '#EF4444' };

interface PickedFile {
  uri: string;
  name: string;
  mimeType: string;
  isImage: boolean;
  size?: number;
}

export const PaymentsScreen: React.FC<{ navigation?: any }> = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { MOBILE_UI_PERM: PERM, canUI, isHyper, isAdmin } = usePermissions();

  const adminMode = isHyper || isAdmin;
  const fetcher = useCallback(
    (p: any) => (adminMode ? paymentsApi.getPendingReceipts(p) : paymentsApi.getMyReceipts(p)),
    [adminMode],
  );
  const { items, loading, refreshing, refresh, loadMore, hasMore, forbidden } =
    usePaginatedList<PaymentReceipt>({ fetcher, limit: 20, permKey: PERM.PAYMENTS_VIEW });

  const canReview = canUI(PERM.PAYMENT_APPROVE) || canUI(PERM.PAYMENT_REJECT);
  const canUpload = !adminMode && canUI(PERM.RECEIPT_UPLOAD);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('DZD');
  const [note, setNote] = useState('');
  const [file, setFile] = useState<PickedFile | null>(null);
  /** Server-side error surfaced inline in the modal. Cleared on each new attempt. */
  const [submitError, setSubmitError] = useState<string | null>(null);
  /** Tracks which fields the user has interacted with — errors only show after blur/submit. */
  const [touched, setTouched] = useState<{ bookingId?: boolean; amount?: boolean; currency?: boolean; file?: boolean }>({});
  /** Forces all field errors visible (set by submitUpload when validation fails). */
  const [showAllErrors, setShowAllErrors] = useState(false);

  /**
   * Synchronous double-tap guard: a ref flips on the very first click, so even
   * back-to-back taps before React commits `setUploading(true)` are blocked.
   * A monotonic submit token discards responses from previous in-flight calls
   * if the user manages to retry rapidly.
   */
  const uploadingRef = useRef(false);
  const submitToken = useRef(0);

  // Per-field validation — pure derivation, recomputed on each render.
  const fieldErrors = useMemo(() => {
    const errs: { bookingId?: string; amount?: string; currency?: string; file?: string } = {};
    if (!bookingId.trim()) errs.bookingId = 'Booking ID is required.';
    const amt = parseFloat(amount);
    if (!amount.trim()) errs.amount = 'Amount is required.';
    else if (!Number.isFinite(amt) || amt <= 0) errs.amount = 'Enter a valid positive amount.';
    const cur = currency.trim();
    if (cur && !/^[A-Za-z]{3}$/.test(cur)) errs.currency = 'Use a 3-letter currency code (e.g. DZD, EUR).';
    if (!file) errs.file = 'Please attach a receipt file.';
    return errs;
  }, [bookingId, amount, currency, file]);

  const parsedAmount = parseFloat(amount);
  const formValid = Object.keys(fieldErrors).length === 0;

  /** Show a field's error only when touched OR after a submit attempt. */
  const showErr = (k: keyof typeof fieldErrors) => (touched[k] || showAllErrors) && fieldErrors[k];

  const review = useCallback(async (id: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') await paymentsApi.approve(id);
      else await paymentsApi.reject(id);
      refresh();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Action failed.');
    }
  }, [refresh]);

  /** Receipt validation rules — keep aligned with backend `payments.controller.ts`. */
  const MAX_RECEIPT_BYTES = 10 * 1024 * 1024; // 10 MB
  const ACCEPTED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];
  const ACCEPTED_LABEL = 'JPG, PNG, WEBP, HEIC or PDF · max 10 MB';

  const validateAndSet = async (candidate: { uri: string; name: string; mimeType: string; size?: number }) => {
    const mime = (candidate.mimeType || '').toLowerCase();
    const accepted = ACCEPTED_MIME.includes(mime) || mime.startsWith('image/');
    if (!accepted) {
      Alert.alert('Unsupported file', `This file type is not allowed. Accepted: ${ACCEPTED_LABEL}.`);
      return;
    }
    let size = candidate.size;
    if (size == null) {
      try {
        const FS = await import('expo-file-system');
        const info = await FS.getInfoAsync(candidate.uri);
        if (info.exists && typeof (info as any).size === 'number') size = (info as any).size;
      } catch { /* best-effort */ }
    }
    if (size != null && size > MAX_RECEIPT_BYTES) {
      Alert.alert('File too large', `Maximum size is 10 MB. This file is ${(size / 1024 / 1024).toFixed(1)} MB.`);
      return;
    }
    setFile({
      uri: candidate.uri,
      name: candidate.name,
      mimeType: mime || 'application/octet-stream',
      isImage: mime.startsWith('image/'),
      size,
    });
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your media library.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (!res.canceled && res.assets[0]) {
      const a = res.assets[0];
      await validateAndSet({
        uri: a.uri,
        name: a.fileName || `receipt-${Date.now()}.jpg`,
        mimeType: a.mimeType || 'image/jpeg',
        size: (a as any).fileSize,
      });
    }
  };

  const pickDocument = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf'],
      copyToCacheDirectory: true,
    });
    if (!res.canceled && res.assets?.[0]) {
      const a = res.assets[0];
      await validateAndSet({
        uri: a.uri,
        name: a.name,
        mimeType: a.mimeType || 'application/octet-stream',
        size: (a as any).size,
      });
    }
  };


  const resetUpload = () => {
    setUploadOpen(false);
    setBookingId('');
    setAmount('');
    setCurrency('DZD');
    setNote('');
    setFile(null);
    setSubmitError(null);
    setTouched({});
    setShowAllErrors(false);
    uploadingRef.current = false;
    submitToken.current += 1; // invalidate any in-flight submit
  };

  const submitUpload = useCallback(async () => {
    // Synchronous double-tap guard — wins the race against React state.
    if (uploadingRef.current) return;
    setSubmitError(null);
    if (!formValid || !file) {
      setShowAllErrors(true);
      return;
    }
    uploadingRef.current = true;
    setUploading(true);
    submitToken.current += 1;
    const myToken = submitToken.current;

    // Snapshot inputs so a stale response can't mismatch later edits.
    const payload = {
      bookingId: bookingId.trim(),
      amount: parsedAmount,
      currency: (currency.trim() || 'DZD').toUpperCase(),
      note: note.trim() || undefined,
      file: { uri: file.uri, name: file.name, mimeType: file.mimeType },
    };

    try {
      await paymentsApi.uploadReceipt(payload);
      if (myToken !== submitToken.current) return; // a newer attempt or reset happened — ignore
      resetUpload();
      Alert.alert('Success', 'Receipt uploaded.');
      refresh();
    } catch (e: any) {
      if (myToken !== submitToken.current) return; // stale failure — ignore
      const serverMsg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        'Upload failed. Please try again.';
      const msg = Array.isArray(serverMsg) ? serverMsg.join(' · ') : String(serverMsg);
      setSubmitError(msg);
    } finally {
      if (myToken === submitToken.current) {
        uploadingRef.current = false;
        setUploading(false);
      }
    }
  }, [formValid, file, bookingId, parsedAmount, currency, note, refresh]);

  /** Re-run the same submission with the same form/preview after a server refusal. */
  const retryUpload = useCallback(() => {
    if (uploadingRef.current) return;
    setSubmitError(null);
    submitUpload();
  }, [submitUpload]);

  if (forbidden) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.empty}><Text style={{ color: theme.mutedForeground }}>{t('rbac.forbidden') || 'Access denied'}</Text></View>
      </SafeAreaView>
    );
  }
  if (loading && items.length === 0) return <Loading message="Loading receipts..." />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.foreground }]}>{adminMode ? 'Receipts queue' : 'My receipts'}</Text>
        {canUpload && (
          <TouchableOpacity onPress={() => setUploadOpen(true)} style={[styles.uploadCta, { backgroundColor: theme.primary }]}>
            <Text style={[styles.uploadCtaText, { color: theme.primaryForeground }]}>+ Upload</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.primary} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={hasMore && items.length > 0 ? <ActivityIndicator style={{ margin: spacing.lg }} color={theme.primary} /> : null}
        ListEmptyComponent={<View style={styles.empty}><Text style={{ color: theme.mutedForeground }}>No receipts.</Text></View>}
        renderItem={({ item }) => (
          <Card style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.row}>
              <Text style={[styles.cardTitle, { color: theme.foreground }]} numberOfLines={1}>
                {item.booking?.property?.title || `Receipt ${item.id.slice(0, 8)}`}
              </Text>
              <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] || theme.muted }]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>
            <Text style={[styles.meta, { color: theme.mutedForeground }]}>{item.amount} {item.currency}</Text>
            {adminMode && canReview && item.status === 'pending' && (
              <View style={styles.actions}>
                {canUI(PERM.PAYMENT_APPROVE) && (
                  <TouchableOpacity onPress={() => review(item.id, 'approve')} style={[styles.btn, { backgroundColor: '#10B981' }]}>
                    <Text style={styles.btnText}>Approve</Text>
                  </TouchableOpacity>
                )}
                {canUI(PERM.PAYMENT_REJECT) && (
                  <TouchableOpacity onPress={() => review(item.id, 'reject')} style={[styles.btn, { backgroundColor: '#EF4444' }]}>
                    <Text style={styles.btnText}>Reject</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Card>
        )}
      />

      {/* Upload modal — RBAC-gated by RECEIPT_UPLOAD */}
      <Modal visible={uploadOpen} animationType="slide" transparent onRequestClose={resetUpload}>
        <View style={styles.overlay}>
          <View style={[styles.modal, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled">
              <Text style={[styles.modalTitle, { color: theme.foreground }]}>Upload receipt</Text>

              <Text style={[styles.label, { color: theme.foreground }]}>Booking ID</Text>
              <TextInput
                value={bookingId}
                onChangeText={(v) => { setBookingId(v); setSubmitError(null); }}
                onBlur={() => setTouched((t) => ({ ...t, bookingId: true }))}
                placeholder="UUID of your booking"
                placeholderTextColor={theme.mutedForeground}
                style={[
                  styles.input,
                  { color: theme.foreground, backgroundColor: theme.card,
                    borderColor: showErr('bookingId') ? '#EF4444' : theme.border },
                ]}
                autoCapitalize="none"
              />
              {showErr('bookingId') && <Text style={styles.fieldError}>{fieldErrors.bookingId}</Text>}

              <View style={styles.rowFields}>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.label, { color: theme.foreground }]}>Amount</Text>
                  <TextInput
                    value={amount}
                    onChangeText={(v) => { setAmount(v); setSubmitError(null); }}
                    onBlur={() => setTouched((t) => ({ ...t, amount: true }))}
                    keyboardType="decimal-pad"
                    placeholderTextColor={theme.mutedForeground}
                    style={[
                      styles.input,
                      { color: theme.foreground, backgroundColor: theme.card,
                        borderColor: showErr('amount') ? '#EF4444' : theme.border },
                    ]}
                  />
                  {showErr('amount') && <Text style={styles.fieldError}>{fieldErrors.amount}</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { color: theme.foreground }]}>Currency</Text>
                  <TextInput
                    value={currency}
                    onChangeText={(v) => { setCurrency(v); setSubmitError(null); }}
                    onBlur={() => setTouched((t) => ({ ...t, currency: true }))}
                    autoCapitalize="characters"
                    maxLength={3}
                    style={[
                      styles.input,
                      { color: theme.foreground, backgroundColor: theme.card,
                        borderColor: showErr('currency') ? '#EF4444' : theme.border },
                    ]}
                  />
                  {showErr('currency') && <Text style={styles.fieldError}>{fieldErrors.currency}</Text>}
                </View>
              </View>

              <Text style={[styles.label, { color: theme.foreground }]}>Note (optional)</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                multiline
                style={[styles.input, { color: theme.foreground, backgroundColor: theme.card, borderColor: theme.border, minHeight: 60 }]}
              />

              {/* File picker + preview */}
              <Text style={[styles.label, { color: theme.foreground }]}>Receipt file</Text>
              <Text style={[styles.hint, { color: theme.mutedForeground }]}>{ACCEPTED_LABEL}</Text>
              <View style={styles.pickerRow}>
                <TouchableOpacity onPress={pickImage} style={[styles.pickerBtn, { borderColor: showErr('file') ? '#EF4444' : theme.border }]}>
                  <Text style={{ color: theme.foreground }}>📷 Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={pickDocument} style={[styles.pickerBtn, { borderColor: showErr('file') ? '#EF4444' : theme.border }]}>
                  <Text style={{ color: theme.foreground }}>📄 Document</Text>
                </TouchableOpacity>
              </View>
              {showErr('file') && <Text style={styles.fieldError}>{fieldErrors.file}</Text>}

              {file && (
                <View style={[styles.previewBox, { borderColor: theme.border, backgroundColor: theme.card }]}>
                  {file.isImage ? (
                    <Image source={{ uri: file.uri }} style={styles.previewImg} resizeMode="cover" />
                  ) : (
                    <View style={styles.fileChip}>
                      <Text style={{ fontSize: 32 }}>📄</Text>
                      <Text numberOfLines={1} style={{ color: theme.foreground, marginTop: 4, fontWeight: '600' }}>{file.name}</Text>
                    </View>
                  )}
                  <View style={styles.fileMetaRow}>
                    <Text numberOfLines={1} style={[styles.fileMeta, { color: theme.mutedForeground }]}>
                      {file.mimeType}{file.size != null ? ` · ${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
                    </Text>
                    <TouchableOpacity onPress={() => setFile(null)} style={styles.removeInline}>
                      <Text style={{ color: '#EF4444', fontWeight: '700' }}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => setFile(null)} style={styles.removeBtn} accessibilityLabel="Remove file">
                    <Text style={{ color: '#fff' }}>×</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Inline server-side error + Retry — re-runs submitUpload with the same form/file. */}
              {submitError && (
                <View style={[styles.errorBox, { borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.08)' }]}>
                  <Text style={{ color: '#EF4444', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>{submitError}</Text>
                  <View style={styles.errorActions}>
                    <TouchableOpacity
                      onPress={() => setSubmitError(null)}
                      style={[styles.errorBtn, { borderColor: '#EF4444' }]}
                    >
                      <Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 12 }}>Dismiss</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={retryUpload}
                      disabled={uploading || !formValid}
                      style={[styles.errorBtn, { backgroundColor: '#EF4444', opacity: (uploading || !formValid) ? 0.5 : 1 }]}
                    >
                      {uploading
                        ? <ActivityIndicator color="#fff" size="small" />
                        : <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>↻ Retry</Text>}
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity onPress={resetUpload} disabled={uploading} style={[styles.btn, { borderWidth: 1, borderColor: theme.border, backgroundColor: 'transparent' }]}>
                  <Text style={[styles.btnText, { color: theme.foreground }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={submitUpload}
                  disabled={uploading || !formValid}
                  style={[styles.btn, { backgroundColor: theme.primary, opacity: (uploading || !formValid) ? 0.5 : 1 }]}
                  accessibilityState={{ disabled: uploading || !formValid }}
                >
                  {uploading
                    ? <ActivityIndicator color={theme.primaryForeground} />
                    : <Text style={[styles.btnText, { color: theme.primaryForeground }]}>Submit</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg },
  title: { fontSize: 26, fontWeight: '700' },
  uploadCta: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  uploadCtaText: { fontWeight: '700', fontSize: 13 },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: { padding: spacing.md, marginBottom: spacing.md, borderRadius: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 8 },
  meta: { fontSize: 13, marginBottom: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  empty: { flex: 1, padding: spacing.xxl, alignItems: 'center', justifyContent: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '92%' },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', marginTop: 10, marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  rowFields: { flexDirection: 'row', gap: 10 },
  pickerRow: { flexDirection: 'row', gap: 10 },
  pickerBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  previewBox: { marginTop: 10, padding: 8, borderRadius: 10, borderWidth: 1, position: 'relative' },
  previewImg: { width: '100%', height: 200, borderRadius: 8 },
  fileChip: { padding: 16, alignItems: 'center' },
  removeBtn: { position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: 12, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  hint: { fontSize: 11, marginBottom: 6 },
  fileMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingHorizontal: 4 },
  fileMeta: { fontSize: 11, flex: 1, marginRight: 8 },
  removeInline: { paddingHorizontal: 8, paddingVertical: 4 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: spacing.lg },
  errorBox: { marginTop: spacing.md, padding: 10, borderWidth: 1, borderRadius: 8 },
  errorActions: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
  errorBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center', minWidth: 80 },
  fieldError: { color: '#EF4444', fontSize: 11, fontWeight: '600', marginTop: 4 },
});

export default PaymentsScreen;
