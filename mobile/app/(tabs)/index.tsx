import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRTL } from '@/hooks/useRTL';
import { Card } from '@/components/Card';
import { spacing } from '@/constants/theme.constants';

export default function HomeScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isRTL, rtlStyles } = useRTL();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.content, isRTL && rtlStyles.container]}>
        <Text style={[styles.title, { color: theme.foreground }, isRTL && rtlStyles.text]}>
          {t('tabs.home')}
        </Text>
        <Card title={t('home.welcome', 'Welcome!')} subtitle={`${t('home.hello', 'Hello')}, ${user?.email || t('home.user', 'User')}`}>
          <Text style={[{ color: theme.foreground }, isRTL && rtlStyles.text]}>
            {t('home.description', 'This is your home screen. The mobile app is ready!')}
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
});