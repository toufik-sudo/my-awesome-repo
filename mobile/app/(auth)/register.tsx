import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRTL } from '@/hooks/useRTL';
import { Form, FormField } from '@/components/Form';
import { Button } from '@/components/Button';
import { spacing } from '@/constants/theme.constants';

export default function RegisterScreen() {
  const { signup } = useAuth();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isRTL, rtlStyles } = useRTL();
  const [error, setError] = useState('');

  const fields: FormField[] = [
    {
      name: 'email',
      label: t('auth.email'),
      type: 'email',
      placeholder: 'name@example.com',
      required: true,
      validation: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    {
      name: 'password',
      label: t('auth.password'),
      type: 'password',
      placeholder: '••••••••',
      required: true,
      validation: {
        required: true,
        minLength: 8,
      },
    },
    {
      name: 'confirmPassword',
      label: t('auth.confirmPassword'),
      type: 'password',
      placeholder: '••••••••',
      required: true,
      validation: {
        required: true,
        custom: (value, values) => {
          return value === values?.password || t('auth.passwordMismatch');
        },
      },
    },
  ];

  const handleSubmit = async (values: Record<string, any>) => {
    setError('');
    try {
      await signup(values.email, values.password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err?.response?.data?.message || t('auth.signupError'));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.header, isRTL && rtlStyles.alignEnd]}>
            <Text style={[styles.title, { color: theme.foreground }, isRTL && rtlStyles.text]}>
              {t('auth.signup')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.mutedForeground }, isRTL && rtlStyles.text]}>
              {t('auth.signupSubtitle')}
            </Text>
          </View>

          {error && (
            <View style={[styles.errorContainer, { backgroundColor: theme.destructive + '20' }]}>
              <Text style={[styles.errorText, { color: theme.destructive }, isRTL && rtlStyles.text]}>
                {error}
              </Text>
            </View>
          )}

          <Form
            fields={fields}
            onSubmit={handleSubmit}
            submitButtonText={t('auth.signup')}
          />

          <View style={[styles.footer, isRTL && rtlStyles.row]}>
            <Text style={[styles.footerText, { color: theme.mutedForeground }]}>
              {t('auth.hasAccount')}{' '}
            </Text>
            <Button variant="ghost" onPress={() => router.push('/(auth)/login')}>
              <Text style={{ color: theme.primary }}>{t('auth.login')}</Text>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  header: { marginBottom: spacing.xl },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  subtitle: { fontSize: 16 },
  errorContainer: {
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  errorText: { fontSize: 14 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: { fontSize: 14 },
});