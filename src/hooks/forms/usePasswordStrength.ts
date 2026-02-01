import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import zxcvbn from 'zxcvbn';

// -----------------------------------------------------------------------------
// Password Strength Constants
// -----------------------------------------------------------------------------

const PASSWORD_STRENGTH_FILL_VALUE = 25;
const PASSWORD_STRENGTH_FILL_SYMBOL = '%';

const STRENGTH_LABELS = {
  0: { key: 'weak', color: 'destructive' },
  1: { key: 'weak', color: 'destructive' },
  2: { key: 'fair', color: 'warning' },
  3: { key: 'good', color: 'primary' },
  4: { key: 'strong', color: 'success' },
} as const;

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PasswordStrengthResult {
  /** Password strength score (0-4) */
  score: number;
  /** Calculated fill width for progress bar (e.g., "75%") */
  fillWidth: string;
  /** Strength label key for i18n */
  labelKey: string;
  /** Localized strength label */
  label: string;
  /** Color variant for styling */
  colorVariant: string;
  /** Whether password meets minimum strength (score >= 2) */
  isAcceptable: boolean;
  /** Feedback suggestions from zxcvbn */
  suggestions: string[];
  /** Warning message from zxcvbn */
  warning: string;
}

export interface UsePasswordStrengthOptions {
  /** The password to evaluate */
  password: string;
  /** Minimum acceptable score (default: 2) */
  minScore?: number;
}

// -----------------------------------------------------------------------------
// Hook Implementation
// -----------------------------------------------------------------------------

/**
 * Hook to evaluate password strength using zxcvbn algorithm
 * 
 * @example
 * ```tsx
 * const { score, label, fillWidth, isAcceptable } = usePasswordStrength({
 *   password: formValues.password
 * });
 * ```
 */
export const usePasswordStrength = ({
  password,
  minScore = 2,
}: UsePasswordStrengthOptions): PasswordStrengthResult => {
  const intl = useIntl();

  return useMemo(() => {
    const result = zxcvbn(password || '');
    const { score, feedback } = result;

    const strengthConfig = STRENGTH_LABELS[score as keyof typeof STRENGTH_LABELS];
    const fillWidth = `${score * PASSWORD_STRENGTH_FILL_VALUE + PASSWORD_STRENGTH_FILL_VALUE}${PASSWORD_STRENGTH_FILL_SYMBOL}`;

    return {
      score,
      fillWidth,
      labelKey: strengthConfig.key,
      label: intl.formatMessage({ id: `form.passwordStrength.${strengthConfig.key}` }),
      colorVariant: strengthConfig.color,
      isAcceptable: score >= minScore,
      suggestions: feedback.suggestions || [],
      warning: feedback.warning || '',
    };
  }, [password, minScore, intl]);
};

export default usePasswordStrength;
