import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { spacing } from '@/constants/theme.constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: theme.foreground },
            isRTL && styles.rtlLabel,
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.background,
            borderColor: error ? theme.destructive : theme.input,
          },
          isRTL && styles.rtlRow,
        ]}
      >
        {/* In RTL mode, swap sides: rightIcon renders on the left visually */}
        {isRTL && rightIcon && <View style={styles.leftIcon}>{rightIcon}</View>}
        {!isRTL && leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            { color: theme.foreground },
            isRTL && styles.rtlInput,
            style,
          ]}
          placeholderTextColor={theme.mutedForeground}
          textAlign={isRTL ? 'right' : 'left'}
          writingDirection={isRTL ? 'rtl' : 'ltr'}
          {...props}
        />

        {isRTL && leftIcon && <View style={styles.rightIcon}>{leftIcon}</View>}
        {!isRTL && rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && (
        <Text
          style={[
            styles.error,
            { color: theme.destructive },
            isRTL && styles.rtlLabel,
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  rtlLabel: {
    textAlign: 'right',
    writingDirection: 'rtl',
  } as any,
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: spacing.sm,
  },
  rtlInput: {
    textAlign: 'right',
    writingDirection: 'rtl',
  } as any,
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  error: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
