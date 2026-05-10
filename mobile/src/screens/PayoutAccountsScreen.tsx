import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, PayoutAccountSkeletonList } from '@/components';
import { payoutAccountsApi, type PayoutAccount } from '@/services/payout-accounts.api';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { spacing } from '@/constants/theme.constants';

type FormState = {
  id?: string;
  accountType: PayoutAccount['accountType'];
  bankName: string;
  accountNumber: string;
  accountKey: string;
  holderName: string;
  agencyName: string;
  rib: string;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  accountType: 'ccp',
  bankName: '',
  accountNumber: '',
  accountKey: '',
  holderName: '',
  agencyName: '',
  rib: '',
  isActive: true,
};

const TYPES: PayoutAccount['accountType'][] = ['ccp', 'bna', 'badr', 'cib', 'baridi_mob', 'bank_transfer', 'other'];

export const PayoutAccountsScreen: React.FC<{ navigation?: any }> = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { MOBILE_UI_PERM: PERM, canUI } = usePermissions();

  const fetcher = useCallback((p: any) => payoutAccountsApi.getAllPaginated(p), []);
  const { items, loading, refreshing, refresh, loadMore, hasMore, forbidden } =
    usePaginatedList<PayoutAccount>({ fetcher, limit: 20, permKey: PERM.PAYOUT_ACCOUNTS_VIEW });

  const canManage = canUI(PERM.PAYOUT_ACCOUNT_CREATE);

  const [busy, setBusy] = useState<string | null>(null);
  /** Optimistic overrides for `isActive` while a toggle request is in-flight. */
  const [optimistic, setOptimistic] = useState<Record<string, boolean>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (acc: PayoutAccount) => {
    setForm({
      id: acc.id,
      accountType: acc.accountType,
      bankName: acc.bankName || '',
      accountNumber: acc.accountNumber || '',
      accountKey: acc.accountKey || '',
      holderName: acc.holderName || '',
      agencyName: acc.agencyName || '',
      rib: acc.rib || '',
      isActive: acc.isActive,
    });
    setFormOpen(true);
  };

  const toggle = useCallback(async (acc: PayoutAccount) => {
    if (!canManage || busy === acc.id) return;
    const currentActive = optimistic[acc.id] ?? acc.isActive;
    const nextActive = !currentActive;
    // Optimistic update — instant UI feedback.
    setOptimistic((m) => ({ ...m, [acc.id]: nextActive }));
    setBusy(acc.id);
    try {
      await payoutAccountsApi.update(acc.id, { isActive: nextActive });
      // Refresh from server then drop the optimistic override.
      refresh();
      setOptimistic((m) => {
        const { [acc.id]: _, ...rest } = m;
        return rest;
      });
    } catch (e: any) {
      // Revert optimistic update on failure.
      setOptimistic((m) => ({ ...m, [acc.id]: currentActive }));
      Alert.alert('Error', e?.response?.data?.message || e?.message || 'Update failed.');
      setOptimistic((m) => {
        const { [acc.id]: _, ...rest } = m;
        return rest;
      });
    } finally {
      setBusy(null);
    }
  }, [canManage, busy, optimistic, refresh]);


  const submit = async () => {
    if (!form.bankName.trim()) return Alert.alert('Validation', 'Bank name is required.');
    if (!form.accountNumber.trim()) return Alert.alert('Validation', 'Account number is required.');
    if (!form.holderName.trim()) return Alert.alert('Validation', 'Holder name is required.');
    try {
      setSubmitting(true);
      const payload: Partial<PayoutAccount> = {
        accountType: form.accountType,
        bankName: form.bankName.trim(),
        accountNumber: form.accountNumber.trim(),
        accountKey: form.accountKey.trim() || undefined,
        holderName: form.holderName.trim(),
        agencyName: form.agencyName.trim() || undefined,
        rib: form.rib.trim() || undefined,
        isActive: form.isActive,
      };
      if (form.id) await payoutAccountsApi.update(form.id, payload);
      else await payoutAccountsApi.create(payload);
      setFormOpen(false);
      refresh();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || e?.message || 'Save failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (forbidden) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.empty}><Text style={{ color: theme.mutedForeground }}>{t('rbac.forbidden') || 'Access denied'}</Text></View>
      </SafeAreaView>
    );
  }

  // First-load skeleton (replaces full-screen spinner for better UX).
  const showInitialSkeleton = loading && items.length === 0;

  const setF = <K extends keyof FormState>(key: K) => (value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.foreground }]}>Payout accounts</Text>
        {canManage && (
          <TouchableOpacity onPress={openCreate} style={[styles.addBtn, { backgroundColor: theme.primary }]}>
            <Text style={[styles.addBtnText, { color: theme.primaryForeground }]}>+ New</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.primary} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          items.length === 0 ? null
          : hasMore
            ? <ActivityIndicator style={{ margin: spacing.lg }} color={theme.primary} />
            : (
              <View style={styles.endIndicator}>
                <View style={[styles.endLine, { backgroundColor: theme.border }]} />
                <Text style={[styles.endText, { color: theme.mutedForeground }]}>— End of list —</Text>
                <View style={[styles.endLine, { backgroundColor: theme.border }]} />
              </View>
            )
        }
        ListHeaderComponent={
          // Skeleton placeholders during initial load and when paginating to next page.
          showInitialSkeleton ? <PayoutAccountSkeletonList count={4} /> : null
        }
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🏦</Text>
              <Text style={[styles.emptyTitle, { color: theme.foreground }]}>No payout accounts yet</Text>
              <Text style={[styles.emptyText, { color: theme.mutedForeground }]}>
                {canManage
                  ? 'Add your first payout account to start receiving payments.'
                  : 'No payout accounts available for your role.'}
              </Text>
              {canManage && (
                <TouchableOpacity onPress={openCreate} style={[styles.emptyCta, { backgroundColor: theme.primary }]}>
                  <Text style={[styles.btnText, { color: theme.primaryForeground }]}>+ Add account</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        }
        renderItem={({ item }) => {
          const active = optimistic[item.id] ?? item.isActive;
          const isBusy = busy === item.id;
          return (
            <Card style={[styles.card, { backgroundColor: theme.card, opacity: isBusy ? 0.85 : 1 }]}>
              <View style={styles.row}>
                <Text style={[styles.cardTitle, { color: theme.foreground }]} numberOfLines={1}>
                  {item.bankName} • {item.accountType.toUpperCase()}
                </Text>
                <View style={[styles.dot, { backgroundColor: active ? '#10B981' : '#6B7280' }]} />
              </View>
              <Text style={[styles.meta, { color: theme.mutedForeground }]}>{item.holderName}</Text>
              <Text style={[styles.acct, { color: theme.foreground }]}>
                {item.accountNumber}{item.accountKey ? ` · ${item.accountKey}` : ''}
              </Text>
              {item.host && <Text style={[styles.meta, { color: theme.mutedForeground }]}>Host: {item.host.email}</Text>}

              {canManage && (
                <View style={styles.actionRow}>
                  <TouchableOpacity onPress={() => openEdit(item)} style={[styles.btn, { backgroundColor: theme.primary }]}>
                    <Text style={[styles.btnText, { color: theme.primaryForeground }]}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={isBusy}
                    onPress={() => toggle(item)}
                    style={[styles.btn, { backgroundColor: active ? '#EF4444' : '#10B981' }]}
                  >
                    {isBusy
                      ? <ActivityIndicator color="#fff" />
                      : <Text style={[styles.btnText, { color: '#fff' }]}>{active ? 'Deactivate' : 'Activate'}</Text>}
                  </TouchableOpacity>
                </View>
              )}
            </Card>
          );
        }}
      />

      {/* Create / Edit modal */}
      <Modal visible={formOpen} animationType="slide" transparent onRequestClose={() => setFormOpen(false)}>
        <View style={styles.overlay}>
          <View style={[styles.modal, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled">
              <Text style={[styles.modalTitle, { color: theme.foreground }]}>
                {form.id ? 'Edit payout account' : 'New payout account'}
              </Text>

              <Text style={[styles.label, { color: theme.foreground }]}>Type</Text>
              <View style={styles.typeRow}>
                {TYPES.map((tp) => (
                  <TouchableOpacity
                    key={tp}
                    onPress={() => setF('accountType')(tp)}
                    style={[
                      styles.typeChip,
                      {
                        backgroundColor: form.accountType === tp ? theme.primary : theme.card,
                        borderColor: form.accountType === tp ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Text style={{ color: form.accountType === tp ? theme.primaryForeground : theme.foreground, fontSize: 12, fontWeight: '600' }}>
                      {tp.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {(['bankName', 'holderName', 'accountNumber', 'accountKey', 'agencyName', 'rib'] as const).map((k) => (
                <View key={k}>
                  <Text style={[styles.label, { color: theme.foreground }]}>
                    {k === 'bankName' ? 'Bank name' :
                     k === 'holderName' ? 'Holder name' :
                     k === 'accountNumber' ? 'Account number' :
                     k === 'accountKey' ? 'Account key (RIP)' :
                     k === 'agencyName' ? 'Agency name (optional)' : 'RIB (optional)'}
                  </Text>
                  <TextInput
                    value={form[k]}
                    onChangeText={setF(k)}
                    placeholderTextColor={theme.mutedForeground}
                    style={[styles.input, { color: theme.foreground, backgroundColor: theme.card, borderColor: theme.border }]}
                    autoCapitalize={k === 'holderName' || k === 'bankName' || k === 'agencyName' ? 'words' : 'none'}
                  />
                </View>
              ))}

              <TouchableOpacity onPress={() => setF('isActive')(!form.isActive)} style={styles.activeToggle}>
                <View style={[styles.checkbox, { borderColor: theme.border, backgroundColor: form.isActive ? theme.primary : 'transparent' }]}>
                  {form.isActive && <Text style={{ color: theme.primaryForeground }}>✓</Text>}
                </View>
                <Text style={{ color: theme.foreground, marginLeft: 8 }}>Active</Text>
              </TouchableOpacity>

              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setFormOpen(false)} disabled={submitting}
                  style={[styles.btn, { borderWidth: 1, borderColor: theme.border, backgroundColor: 'transparent' }]}>
                  <Text style={[styles.btnText, { color: theme.foreground }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={submit} disabled={submitting}
                  style={[styles.btn, { backgroundColor: theme.primary, opacity: submitting ? 0.6 : 1 }]}>
                  {submitting
                    ? <ActivityIndicator color={theme.primaryForeground} />
                    : <Text style={[styles.btnText, { color: theme.primaryForeground }]}>{form.id ? 'Save' : 'Create'}</Text>}
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg },
  title: { fontSize: 26, fontWeight: '700' },
  addBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { fontWeight: '700', fontSize: 13 },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: { padding: spacing.md, marginBottom: spacing.md, borderRadius: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 15, fontWeight: '700', flex: 1, marginRight: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  meta: { fontSize: 12, marginBottom: 2 },
  acct: { fontSize: 13, fontFamily: 'monospace', marginVertical: 4 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  btn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontWeight: '700', fontSize: 13 },
  empty: { padding: spacing.xxl, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginBottom: 6 },
  emptyText: { fontSize: 13, textAlign: 'center', marginBottom: 16, maxWidth: 280 },
  emptyCta: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  endIndicator: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg, gap: 8, paddingHorizontal: spacing.md },
  endLine: { flex: 1, height: 1 },
  endText: { fontSize: 12, fontStyle: 'italic' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '92%' },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', marginTop: 10, marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  typeChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, borderWidth: 1 },
  activeToggle: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  checkbox: { width: 22, height: 22, borderRadius: 5, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: spacing.lg },
});

export default PayoutAccountsScreen;
