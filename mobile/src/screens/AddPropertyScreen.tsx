import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { propertiesApi } from '@/services/properties.api';
import { spacing } from '@/constants/theme.constants';

export const AddPropertyScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { canAddProperty, permissionsLoaded } = usePermissions();

  const [form, setForm] = useState({
    title: '', description: '', city: '', wilaya: '', country: 'DZ',
    pricePerNight: '', maxGuests: '2', bedrooms: '1', bathrooms: '1', propertyType: 'apartment',
  });
  const [submitting, setSubmitting] = useState(false);

  if (permissionsLoaded && !canAddProperty) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.center}><Text style={{ color: theme.mutedForeground }}>{t('rbac.forbidden') || 'Access denied'}</Text></View>
      </SafeAreaView>
    );
  }

  const set = (k: keyof typeof form) => (v: string) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    if (!form.title || !form.city || !form.pricePerNight) {
      Alert.alert('Validation', 'Title, city and price are required.');
      return;
    }
    try {
      setSubmitting(true);
      const payload: any = {
        ...form,
        pricePerNight: Number(form.pricePerNight),
        maxGuests: Number(form.maxGuests),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
      };
      const created: any = await (propertiesApi as any).create?.(payload);
      Alert.alert('Success', 'Property created.', [{
        text: 'OK', onPress: () => created?.id ? navigation?.replace('PropertyDetail', { propertyId: created.id }) : navigation?.goBack(),
      }]);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to create property.');
    } finally {
      setSubmitting(false);
    }
  };

  const Field = ({ label, k, placeholder, keyboardType }: any) => (
    <>
      <Text style={[styles.label, { color: theme.foreground }]}>{label}</Text>
      <TextInput
        value={(form as any)[k]} onChangeText={set(k)}
        placeholder={placeholder} placeholderTextColor={theme.mutedForeground}
        keyboardType={keyboardType}
        style={[styles.input, { color: theme.foreground, backgroundColor: theme.card, borderColor: theme.border }]}
      />
    </>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={[styles.title, { color: theme.foreground }]}>Add property</Text>
        <Field label="Title" k="title" placeholder="Cozy apartment downtown" />
        <Field label="Description" k="description" placeholder="…" />
        <Field label="City" k="city" placeholder="Algiers" />
        <Field label="Wilaya" k="wilaya" placeholder="Alger" />
        <Field label="Price / night" k="pricePerNight" placeholder="5000" keyboardType="numeric" />
        <View style={styles.row3}>
          <View style={styles.col}><Field label="Guests" k="maxGuests" keyboardType="numeric" /></View>
          <View style={styles.col}><Field label="Bedrooms" k="bedrooms" keyboardType="numeric" /></View>
          <View style={styles.col}><Field label="Baths" k="bathrooms" keyboardType="numeric" /></View>
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
  row3: { flexDirection: 'row', gap: 8 },
  col: { flex: 1 },
  btn: { marginTop: spacing.lg, padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '700' },
});

export default AddPropertyScreen;
