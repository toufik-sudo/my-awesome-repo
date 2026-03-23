import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, I18nManager, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRTL } from '@/hooks/useRTL';
import { Card } from '@/components/Card';
import { Switch } from '@/components/Switch';
import { Avatar } from '@/components/Avatar';
import { ImageCropper } from '@/components/ImageCropper';
import { spacing } from '@/constants/theme.constants';
import { Ionicons } from '@expo/vector-icons';
import { saveLanguage } from '@/i18n/config';
import { settingsApi, type SettingsResponse } from '@/services/settings.api';

const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', rtl: false },
  { code: 'fr', label: 'French', nativeLabel: 'Français', rtl: false },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', rtl: true },
];

export default function SettingsScreen() {
  const { theme, mode, setMode } = useTheme();
  const { t, i18n } = useTranslation();
  const { isRTL, rtlStyles, chevronIcon } = useRTL();
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [settings, setSettings] = useState<SettingsResponse | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | undefined>();
  const [cropperVisible, setCropperVisible] = useState(false);
  const [rawImageUri, setRawImageUri] = useState('');

  // Fetch settings on mount
  useEffect(() => {
    settingsApi.getSettings().then((data) => {
      setSettings(data);
      if (data.notifications) {
        setNotifications(data.notifications.pushNotifications);
      }
    }).catch(() => {});
  }, []);

  const handleLanguageChange = useCallback(async (langCode: string, isRtl: boolean) => {
    await saveLanguage(langCode);
    settingsApi.updateLanguage(langCode).catch(() => {});
    settingsApi.updatePreferences({ language: langCode }).catch(() => {});
    if (I18nManager.isRTL !== isRtl) {
      I18nManager.forceRTL(isRtl);
    }
  }, []);

  const handleNotificationsToggle = useCallback(async (value: boolean) => {
    setNotifications(value);
    settingsApi.updateNotifications({ pushNotifications: value }).catch(() => {});
  }, []);

  const handleDarkModeToggle = useCallback(async (v: boolean) => {
    setMode(v ? 'dark' : 'light');
    settingsApi.updatePreferences({ theme: v ? 'dark' : 'light' }).catch(() => {});
  }, [setMode]);

  const handleAvatarPick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('common.error'), t('settings.permissionDenied', 'Permission denied'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setRawImageUri(result.assets[0].uri);
      setCropperVisible(true);
    }
  };

  const handleCropComplete = async (croppedUri: string) => {
    setAvatarUri(croppedUri);
    setCropperVisible(false);
    try {
      await settingsApi.uploadAvatar('me', croppedUri, 'avatar.jpg');
    } catch {
      // Avatar saved locally even if upload fails
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.content, isRTL && rtlStyles.container]}>
        <Text style={[styles.title, { color: theme.foreground }, isRTL && rtlStyles.text]}>
          {t('settings.title')}
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Avatar Section */}
          <Card title={t('settings.profilePhoto', 'Profile Photo')} style={styles.section}>
            <View style={styles.avatarSection}>
              <TouchableOpacity onPress={handleAvatarPick} activeOpacity={0.7}>
                <View style={[styles.avatarWrapper, { borderColor: theme.primary }]}>
                  {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                  ) : (
                    <Avatar name="User" size={80} />
                  )}
                  <View style={[styles.cameraOverlay, { backgroundColor: theme.primary }]}>
                    <Ionicons name="camera" size={16} color="#fff" />
                  </View>
                </View>
              </TouchableOpacity>
              <Text style={[styles.avatarHint, { color: theme.mutedForeground }]}>
                {t('settings.tapToChange', 'Tap to change photo')}
              </Text>
            </View>
          </Card>

          {/* Language Selection */}
          <Card title={t('settings.language')} style={styles.section}>
            <View style={styles.languageGrid}>
              {LANGUAGES.map((lang) => {
                const isSelected = i18n.language === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.langButton,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.card,
                        borderColor: isSelected ? theme.primary : theme.border,
                      },
                    ]}
                    onPress={() => handleLanguageChange(lang.code, lang.rtl)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.langNative, { color: isSelected ? '#fff' : theme.foreground }]}>
                      {lang.nativeLabel}
                    </Text>
                    <Text style={[styles.langSub, { color: isSelected ? 'rgba(255,255,255,0.75)' : theme.mutedForeground }]}>
                      {lang.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          {/* Preferences */}
          <Card title={t('settings.preferences')} style={styles.section}>
            <View style={[styles.settingRow, isRTL && rtlStyles.row]}>
              <Text style={[styles.settingLabel, { color: theme.foreground }, isRTL && rtlStyles.text]}>
                {t('settings.pushNotifications')}
              </Text>
              <Switch value={notifications} onValueChange={handleNotificationsToggle} />
            </View>

            <View style={[styles.settingRow, styles.separator, { borderTopColor: theme.border }, isRTL && rtlStyles.row]}>
              <Text style={[styles.settingLabel, { color: theme.foreground }, isRTL && rtlStyles.text]}>
                {t('settings.darkMode')}
              </Text>
              <Switch value={mode === 'dark'} onValueChange={handleDarkModeToggle} />
            </View>

            <View style={[styles.settingRow, styles.separator, { borderTopColor: theme.border }, isRTL && rtlStyles.row]}>
              <Text style={[styles.settingLabel, { color: theme.foreground }, isRTL && rtlStyles.text]}>
                {t('settings.locationServices')}
              </Text>
              <Switch value={locationServices} onValueChange={setLocationServices} />
            </View>
          </Card>

          {/* Account */}
          <Card title={t('settings.account')} style={styles.section}>
            {[
              { label: t('settings.email'), action: t('settings.change') },
              { label: t('settings.password'), action: t('settings.change') },
            ].map((item, i) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.settingRow,
                  i > 0 && styles.separator,
                  { borderTopColor: theme.border },
                  isRTL && rtlStyles.row,
                ]}
                activeOpacity={0.6}
              >
                <Text style={[styles.settingLabel, { color: theme.foreground }, isRTL && rtlStyles.text]}>
                  {item.label}
                </Text>
                <View style={[styles.actionRow, isRTL && rtlStyles.row]}>
                  <Text style={[styles.settingValue, { color: theme.mutedForeground }]}>{item.action}</Text>
                  <Ionicons name={chevronIcon} size={16} color={theme.mutedForeground} />
                </View>
              </TouchableOpacity>
            ))}
          </Card>

          {/* About */}
          <Card title={t('settings.about')} style={styles.section}>
            <View style={[styles.settingRow, isRTL && rtlStyles.row]}>
              <Text style={[styles.settingLabel, { color: theme.foreground }, isRTL && rtlStyles.text]}>
                {t('settings.version')}
              </Text>
              <Text style={[styles.settingValue, { color: theme.mutedForeground }]}>1.0.0</Text>
            </View>

            {[
              { label: t('settings.termsOfService') },
              { label: t('settings.privacyPolicy') },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.settingRow, styles.separator, { borderTopColor: theme.border }, isRTL && rtlStyles.row]}
                activeOpacity={0.6}
              >
                <Text style={[styles.settingLabel, { color: theme.foreground }, isRTL && rtlStyles.text]}>
                  {item.label}
                </Text>
                <View style={[styles.actionRow, isRTL && rtlStyles.row]}>
                  <Text style={[styles.settingValue, { color: theme.mutedForeground }]}>{t('settings.view')}</Text>
                  <Ionicons name={chevronIcon} size={16} color={theme.mutedForeground} />
                </View>
              </TouchableOpacity>
            ))}
          </Card>

        </ScrollView>
      </View>

      {/* Image Cropper Modal */}
      {rawImageUri !== '' && (
        <ImageCropper
          imageUri={rawImageUri}
          visible={cropperVisible}
          onClose={() => setCropperVisible(false)}
          onCropComplete={handleCropComplete}
          aspectRatio={1}
          circular
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: spacing.lg },
  title: { fontSize: 32, fontWeight: '700', marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  avatarSection: { alignItems: 'center', paddingVertical: spacing.md, gap: spacing.sm },
  avatarWrapper: { position: 'relative', borderRadius: 50, borderWidth: 3, padding: 3 },
  avatarImage: { width: 80, height: 80, borderRadius: 40 },
  cameraOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarHint: { fontSize: 12 },
  languageGrid: { flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.sm },
  langButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 2,
  },
  langNative: { fontSize: 15, fontWeight: '600' },
  langSub: { fontSize: 11 },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  separator: { borderTopWidth: 1 },
  settingLabel: { fontSize: 16, fontWeight: '500' },
  settingValue: { fontSize: 14 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
