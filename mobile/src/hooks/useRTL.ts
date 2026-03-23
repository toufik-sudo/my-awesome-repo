import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

interface RTLStyles {
  /** Flips row direction for RTL */
  row: ViewStyle;
  /** Text alignment and writing direction */
  text: TextStyle;
  /** Container with RTL direction */
  container: ViewStyle;
  /** Flex alignment for RTL (flex-end) */
  alignEnd: ViewStyle;
}

interface UseRTLReturn {
  /** Whether current language is RTL (Arabic) */
  isRTL: boolean;
  /** Current language code */
  language: string;
  /** Pre-built RTL-aware styles */
  rtlStyles: RTLStyles;
  /** Returns row-reverse if RTL, otherwise row */
  flexDirection: 'row' | 'row-reverse';
  /** Returns flex-end if RTL, otherwise flex-start */
  alignItems: 'flex-start' | 'flex-end';
  /** Returns right if RTL, otherwise left */
  textAlign: 'left' | 'right';
  /** Returns chevron-back if RTL, otherwise chevron-forward */
  chevronIcon: 'chevron-back' | 'chevron-forward';
}

/**
 * Centralised RTL detection hook for consistent RTL support across screens.
 * Returns isRTL flag and pre-built style helpers.
 */
export function useRTL(): UseRTLReturn {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const rtlStyles = useMemo<RTLStyles>(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
        text: {
          textAlign: isRTL ? 'right' : 'left',
          writingDirection: isRTL ? 'rtl' : 'ltr',
        },
        container: {
          direction: isRTL ? 'rtl' : 'ltr',
        } as ViewStyle,
        alignEnd: {
          alignItems: isRTL ? 'flex-end' : 'flex-start',
        },
      }),
    [isRTL]
  );

  return {
    isRTL,
    language: i18n.language,
    rtlStyles,
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: isRTL ? 'flex-end' : 'flex-start',
    textAlign: isRTL ? 'right' : 'left',
    chevronIcon: isRTL ? 'chevron-back' : 'chevron-forward',
  };
}
