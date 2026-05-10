import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { supportApi } from '@/services/support.api';
import { spacing } from '@/constants/theme.constants';

const CATEGORIES = [
  'general', 'technical', 'booking_issue', 'payment', 'property_issue', 'negative_review',
];

export const SupportNewScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { MOBILE_UI_PERM: PERM, canUI, permissionsLoaded } = usePermissions();

  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);

  if (permissionsLoaded && !canUI(PERM.SUPPORT_CREATE)) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.center}><Text style={{ color: theme.mutedForeground }}>{t('rbac.forbidden') || 'Access denied'}</Text></View>
      </SafeAreaView>
    );
  }

  const submit = async () => {
    if (!subject.trim() || !content.trim()) {
      Alert.alert('Validation', 'Subject and message are required.');
      return;
    }
    try {
      setSubmitting(true);
      const thread = await supportApi.createThread({ subject: subject.trim(), content: content.trim(), category });
      navigation?.replace('SupportDetail', { id: thread.id });
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to create thread.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={[styles.title, { color: theme.foreground }]}>New support thread</Text>

        <Text style={[styles.label, { color: theme.foreground }]}>Subject</Text>
        <TextInput
          value={subject} onChangeText={setSubject}
          placeholder="Short summary" placeholderTextColor={theme.mutedForeground}
          style={[styles.input, { color: theme.foreground, backgroundColor: theme.card, borderColor: theme.border }]}
        />

        <Text style={[styles.label, { color: theme.foreground }]}>Category</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity key={c} onPress={() => setCategory(c)}
              style={[styles.chip, { backgroundColor: category === c ? theme.primary : theme.muted }]}>
              <Text style={{ color: category === c ? theme.primaryForeground : theme.foreground, fontSize: 12, fontWeight: '600' }}>
                {c.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.foreground }]}>Message</Text>
        <TextInput
          value={content} onChangeText={setContent} multiline numberOfLines={6}
          placeholder="Describe your issue…" placeholderTextColor={theme.mutedForeground}
          style={[styles.input, styles.textarea, { color: theme.foreground, backgroundColor: theme.card, borderColor: theme.border }]}
        />

        <TouchableOpacity disabled={submitting} onPress={submit} style={[styles.btn, { backgroundColor: theme.primary, opacity: submitting ? 0.6 : 1 }]}>
          {submitting ? <ActivityIndicator color={theme.primaryForeground} /> :
            <Text style={[styles.btnText, { color: theme.primaryForeground }]}>Submit</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: spacing.lg },
  label: { fontSize: 13, fontWeight: '600', marginTop: spacing.md, marginBottom: 6, textTransform: 'uppercase' },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  textarea: { minHeight: 120, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  btn: { marginTop: spacing.lg, padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '700' },
});

export default SupportNewScreen;
