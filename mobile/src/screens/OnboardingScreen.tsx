import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { spacing } from '@/constants/theme.constants';
import { onboardingApi, type SignupPayload } from '@/services/onboarding.api';
import { usePermissions } from '@/hooks/usePermissions';

type Step = 0 | 1 | 2;

const INTRO_STEPS = [
  { icon: '👋', title: 'Welcome', text: 'Discover trusted hosts and authentic services around you.' },
  { icon: '🔒', title: 'Secure', text: 'Verified properties, identity checks and protected payments.' },
];

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNbr: string;
  password: string;
  city: string;
  zipcode: string;
  address: string;
  country: string;
  referralCode: string;
}

const EMPTY: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNbr: '',
  password: '',
  city: '',
  zipcode: '',
  address: '',
  country: '',
  referralCode: '',
};

export const OnboardingScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { MOBILE_UI_PERM: PERM, canUI } = usePermissions();

  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const allowed = canUI(PERM.ONBOARDING_VIEW);

  const set = (key: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Invalid email';
    if (!/^\+?[0-9 ()\-]{6,}$/.test(form.phoneNbr.trim())) e.phoneNbr = 'Invalid phone';
    if (form.password.length < 8) e.password = 'Min 8 characters';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.country.trim()) e.country = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onNext = () => {
    if (step < 2) setStep((s) => ((s + 1) as Step));
  };
  const onBack = () => {
    if (step > 0) setStep((s) => ((s - 1) as Step));
  };

  const onFinish = async () => {
    if (!validate()) {
      Alert.alert(t('onboarding.invalid', 'Please fix the highlighted fields.'));
      return;
    }
    try {
      setSubmitting(true);
      const payload: SignupPayload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phoneNbr: form.phoneNbr.trim(),
        password: form.password,
        city: form.city.trim(),
        zipcode: form.zipcode.trim(),
        address: form.address.trim(),
        country: form.country.trim(),
        referralCode: form.referralCode.trim() || undefined,
      };
      await onboardingApi.selfSignup(payload);
      Alert.alert(t('onboarding.success', 'Account created!'), t('onboarding.successMsg', 'You can now sign in.'));
      navigation?.replace?.('Auth', { screen: 'Login' }) ?? navigation?.goBack?.();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || err?.message || 'Signup failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const progress = useMemo(() => ((step + 1) / 3) * 100, [step]);

  if (!allowed) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.center}>
          <Text style={{ color: theme.mutedForeground }}>{t('rbac.forbidden') || 'Access denied'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderField = (
    key: keyof FormState,
    label: string,
    opts: { secure?: boolean; keyboard?: any; autoCap?: any } = {},
  ) => (
    <View style={styles.field} key={key}>
      <Text style={[styles.label, { color: theme.foreground }]}>{label}</Text>
      <TextInput
        value={form[key]}
        onChangeText={set(key)}
        secureTextEntry={opts.secure}
        keyboardType={opts.keyboard || 'default'}
        autoCapitalize={opts.autoCap || 'none'}
        placeholderTextColor={theme.mutedForeground}
        style={[
          styles.input,
          {
            color: theme.foreground,
            backgroundColor: theme.card,
            borderColor: errors[key] ? '#EF4444' : theme.border,
          },
        ]}
      />
      {errors[key] && <Text style={styles.err}>{errors[key]}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Progress */}
        <View style={[styles.progressTrack, { backgroundColor: theme.muted }]}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: theme.primary }]} />
        </View>
        <Text style={[styles.stepIndicator, { color: theme.mutedForeground }]}>
          {t('onboarding.step', 'Step')} {step + 1} / 3
        </Text>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {step < 2 ? (
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <Text style={styles.icon}>{INTRO_STEPS[step].icon}</Text>
              <Text style={[styles.cardTitle, { color: theme.foreground }]}>{INTRO_STEPS[step].title}</Text>
              <Text style={[styles.cardText, { color: theme.mutedForeground }]}>{INTRO_STEPS[step].text}</Text>
            </View>
          ) : (
            <View>
              <Text style={[styles.title, { color: theme.foreground }]}>
                {t('onboarding.createAccount', 'Create your account')}
              </Text>
              {renderField('firstName', 'First name', { autoCap: 'words' })}
              {renderField('lastName', 'Last name', { autoCap: 'words' })}
              {renderField('email', 'Email', { keyboard: 'email-address' })}
              {renderField('phoneNbr', 'Phone number', { keyboard: 'phone-pad' })}
              {renderField('password', 'Password (min 8)', { secure: true })}
              {renderField('address', 'Address', { autoCap: 'words' })}
              {renderField('city', 'City', { autoCap: 'words' })}
              {renderField('zipcode', 'Zip code', { keyboard: 'numeric' })}
              {renderField('country', 'Country', { autoCap: 'words' })}
              {renderField('referralCode', 'Referral code (optional)')}
            </View>
          )}
        </ScrollView>

        {/* CTAs */}
        <View style={styles.ctaRow}>
          {step > 0 && (
            <TouchableOpacity
              onPress={onBack}
              disabled={submitting}
              style={[styles.btn, styles.btnSecondary, { borderColor: theme.border }]}
            >
              <Text style={[styles.btnSecondaryText, { color: theme.foreground }]}>
                {t('common.back', 'Back')}
              </Text>
            </TouchableOpacity>
          )}
          {step < 2 ? (
            <TouchableOpacity onPress={onNext} style={[styles.btn, styles.btnPrimary, { backgroundColor: theme.primary }]}>
              <Text style={[styles.btnPrimaryText, { color: theme.primaryForeground }]}>
                {t('common.next', 'Next')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={onFinish}
              disabled={submitting}
              style={[styles.btn, styles.btnPrimary, { backgroundColor: theme.primary, opacity: submitting ? 0.6 : 1 }]}
            >
              {submitting ? (
                <ActivityIndicator color={theme.primaryForeground} />
              ) : (
                <Text style={[styles.btnPrimaryText, { color: theme.primaryForeground }]}>
                  {t('onboarding.finish', 'Create account')}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  progressTrack: { height: 4, marginHorizontal: spacing.lg, marginTop: spacing.md, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%' },
  stepIndicator: { fontSize: 12, textAlign: 'center', marginTop: 6 },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxl },
  title: { fontSize: 24, fontWeight: '800', marginBottom: spacing.lg },
  card: { padding: spacing.xl, borderRadius: 14, alignItems: 'center', marginTop: spacing.lg },
  icon: { fontSize: 56, marginBottom: 12 },
  cardTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  cardText: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  field: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  err: { color: '#EF4444', fontSize: 12, marginTop: 4 },
  ctaRow: { flexDirection: 'row', gap: 10, padding: spacing.lg },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnPrimary: {},
  btnPrimaryText: { fontSize: 16, fontWeight: '700' },
  btnSecondary: { borderWidth: 1 },
  btnSecondaryText: { fontSize: 16, fontWeight: '600' },
});

export default OnboardingScreen;
