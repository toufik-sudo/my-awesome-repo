import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { api } from '@/lib/axios';
import { API_BASE } from '@/constants/api.constants';
import { spacing } from '@/constants/theme.constants';

const CATEGORIES = ['walking_tour', 'restaurant', 'spa', 'transport', 'guide', 'other'];

export const AddServiceScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { canAddService, permissionsLoaded } = usePermissions();

  const [form, setForm] = useState({
    title: '', description: '', city: '', wilaya: '',
    price: '', currency: 'DZD', category: 'walking_tour', pricingType: 'per_person',
  });
  const [submitting, setSubmitting] = useState(false);

  if (permissionsLoaded && !canAddService) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.center}><Text style={{ color: theme.mutedForeground }}>{t('rbac.forbidden') || 'Access denied'}</Text></View>
      </SafeAreaView>
    );
  }

  const set = (k: keyof typeof form) => (v: string) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    if (!form.title || !form.city || !form.price) {
      Alert.alert('Validation', 'Title, city and price are required.');
      return;
    }
    try {
      setSubmitting(true);
      const payload = { ...form, price: Number(form.price) };
      const res = await api.post(API_BASE.SERVICES, payload);
      Alert.alert('Success', 'Service created.', [{ text: 'OK', onPress: () => navigation?.goBack() }]);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to create service.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={[styles.title, { color: theme.foreground }]}>Add service</Text>

        <Text style={[styles.label, { color: theme.foreground }]}>Title</Text>
        <TextInput value={form.title} onChangeText={set('title')} placeholder="Old town walking tour" placeholderTextColor={theme.mutedForeground}
          style={[styles.input, { color: theme.foreground, backgroundColor: theme.card, borderColor: theme.border }]} />

        <Text style={[styles.label, { color: theme.foreground }]}>Description</Text>
        <TextInput value={form.description} onChangeText={set('description')} multiline placeholderTextColor={theme.mutedForeground}
          style={[styles.input, styles.textarea, { color: theme.foreground, backgroundColor: theme.card, borderColor: theme.border }]} />

        <Text style={[styles.label, { color: theme.foreground }]}>Category</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity key={c} onPress={() => set('category')(c)}
              style={[styles.chip, { backgroundColor: form.category === c ? theme.primary : theme.muted }]}>
              <Text style={{ color: form.category === c ? theme.primaryForeground : theme.foreground, fontSize: 12, fontWeight: '600' }}>
                {c.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={[styles.label, { color: theme.foreground }]}>City</Text>
            <TextInput value={form.city} onChangeText={set('city')} placeholderTextColor={theme.mutedForeground}
              style={[styles.input, { color: theme.foreground, backgroundColor: theme.card, borderColor: theme.border }]} />
          </View>
          <View style={styles.col}>
            <Text style={[styles.label, { color: theme.foreground }]}>Price</Text>
            <TextInput value={form.price} onChangeText={set('price')} keyboardType="numeric" placeholderTextColor={theme.mutedForeground}
              style={[styles.input, { color: theme.foreground, backgroundColor: theme.card, borderColor: theme.border }]} />
          </View>
        </View>

        <TouchableOpacity disabled={submitting} onPress={submit} style={[styles.btn, { backgroundColor: theme.primary, opacity: submitting ? 0.6 : 1 }]}>
          {submitting ? <ActivityIndicator color={theme.primaryForeground} /> :
            <Text style={[styles.btnText, { color: theme.primaryForeground }]}>Create</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: spacing.lg },
  label: { fontSize: 12, fontWeight: '600', marginTop: spacing.md, marginBottom: 6, textTransform: 'uppercase' },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  row: { flexDirection: 'row', gap: 8 },
  col: { flex: 1 },
  btn: { marginTop: spacing.lg, padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '700' },
});

export default AddServiceScreen;
