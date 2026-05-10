/**
 * Self-contained OTP verification step for the onboarding flow.
 *
 * Verifies BOTH the recipient's email and phone number using the existing
 * `authService.sendVerificationEmail` / `verifyEmail` and
 * `sendVerificationOtp` / `verifyPhone` endpoints.
 *
 * Each channel goes through the states:
 *   idle → sending → sent (countdown) → verifying → verified
 *
 * The parent step is only marked complete when both channels are verified.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  InputOTP, InputOTPGroup, InputOTPSlot,
} from '@/components/ui/input-otp';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { authService } from '@/modules/auth/auth.service';
import {
  Mail, Phone, ShieldCheck, Loader2, RefreshCw, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const RESEND_COOLDOWN_S = 45;
const OTP_LENGTH = 6;

type ChannelStatus = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'error';

interface ChannelState {
  status: ChannelStatus;
  code: string;
  cooldown: number;
  error: string | null;
}

const initialState = (): ChannelState => ({
  status: 'idle',
  code: '',
  cooldown: 0,
  error: null,
});

export interface OtpVerificationStepProps {
  email: string;
  phone: string;        // E.164 (e.g. +21355...)
  /** Bubbles overall verified state up so the parent can gate the "Next" button. */
  onChange: (state: { emailVerified: boolean; phoneVerified: boolean }) => void;
}

export const OtpVerificationStep: React.FC<OtpVerificationStepProps> = ({
  email, phone, onChange,
}) => {
  const { t } = useTranslation();
  const [emailState, setEmailState] = useState<ChannelState>(initialState);
  const [phoneState, setPhoneState] = useState<ChannelState>(initialState);

  // Track the contact values we have already auto-sent for, to avoid double-sends
  // when the user revisits this step.
  const autoSentForRef = useRef<{ email?: string; phone?: string }>({});

  // ─── Cooldown ticker ────────────────────────────────────────────────────
  useEffect(() => {
    if (emailState.cooldown <= 0 && phoneState.cooldown <= 0) return;
    const id = window.setInterval(() => {
      setEmailState(s => s.cooldown > 0 ? { ...s, cooldown: s.cooldown - 1 } : s);
      setPhoneState(s => s.cooldown > 0 ? { ...s, cooldown: s.cooldown - 1 } : s);
    }, 1000);
    return () => window.clearInterval(id);
  }, [emailState.cooldown, phoneState.cooldown]);

  // ─── Auto-send first code on mount ──────────────────────────────────────
  useEffect(() => {
    if (email && autoSentForRef.current.email !== email && emailState.status === 'idle') {
      autoSentForRef.current.email = email;
      void sendCode('email');
    }
    if (phone && autoSentForRef.current.phone !== phone && phoneState.status === 'idle') {
      autoSentForRef.current.phone = phone;
      void sendCode('phone');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, phone]);

  // ─── Notify parent on verification changes ──────────────────────────────
  useEffect(() => {
    onChange({
      emailVerified: emailState.status === 'verified',
      phoneVerified: phoneState.status === 'verified',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailState.status, phoneState.status]);

  // ─── Send / Resend ──────────────────────────────────────────────────────
  const sendCode = useCallback(async (channel: 'email' | 'phone') => {
    const setter = channel === 'email' ? setEmailState : setPhoneState;
    const target = channel === 'email' ? email : phone;
    if (!target) return;

    setter(s => ({ ...s, status: 'sending', error: null }));
    try {
      if (channel === 'email') {
        await authService.sendVerificationEmail(target);
        toast.success(t('onboarding.otp.emailSent', { defaultValue: 'Verification code sent to your email.' }));
      } else {
        await authService.sendVerificationOtp(target);
        toast.success(t('onboarding.otp.phoneSent', { defaultValue: 'Verification code sent by SMS.' }));
      }
      setter(s => ({ ...s, status: 'sent', cooldown: RESEND_COOLDOWN_S, error: null }));
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message;
      const msg = Array.isArray(apiMsg) ? apiMsg.join(' • ') : (apiMsg || t('onboarding.otp.sendFailed', { defaultValue: 'Could not send the code. Try again.' }));
      setter(s => ({ ...s, status: 'error', error: msg }));
      toast.error(msg);
    }
  }, [email, phone, t]);

  // ─── Verify ─────────────────────────────────────────────────────────────
  const verifyCode = useCallback(async (channel: 'email' | 'phone') => {
    const setter = channel === 'email' ? setEmailState : setPhoneState;
    const state = channel === 'email' ? emailState : phoneState;
    const target = channel === 'email' ? email : phone;
    if (!target || state.code.length !== OTP_LENGTH) return;

    setter(s => ({ ...s, status: 'verifying', error: null }));
    try {
      if (channel === 'email') await authService.verifyEmail(target, state.code);
      else                     await authService.verifyPhone(target, state.code);
      setter(s => ({ ...s, status: 'verified', error: null }));
      toast.success(t('onboarding.otp.verified', { defaultValue: 'Verified successfully.' }));
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message;
      const msg = Array.isArray(apiMsg) ? apiMsg.join(' • ') : (apiMsg || t('onboarding.otp.verifyFailed', { defaultValue: 'Invalid or expired code.' }));
      setter(s => ({ ...s, status: 'error', error: msg }));
    }
  }, [email, phone, emailState, phoneState, t]);

  // ─── Render helpers ─────────────────────────────────────────────────────
  const renderChannel = (
    channel: 'email' | 'phone',
    state: ChannelState,
    setState: React.Dispatch<React.SetStateAction<ChannelState>>,
    icon: React.ReactNode,
    titleKey: string,
    target: string,
  ) => {
    const isVerified = state.status === 'verified';
    const isLocked = state.status === 'sending' || state.status === 'verifying';
    const canResend = state.cooldown <= 0 && !isLocked && !isVerified;
    const showOtpInput = state.status !== 'idle' && !isVerified;

    return (
      <div className={cn(
        'rounded-xl border p-4 sm:p-5 transition-colors',
        isVerified ? 'border-green-500/40 bg-green-500/5' : 'border-border/60 bg-card/50',
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
            isVerified ? 'bg-green-500/15 text-green-600' : 'bg-primary/10 text-primary',
          )}>
            {isVerified ? <CheckCircle2 className="h-5 w-5" /> : icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">
              {t(titleKey, { defaultValue: channel === 'email' ? 'Email verification' : 'Phone verification' })}
            </p>
            <p className="text-xs text-muted-foreground truncate">{target || '—'}</p>
          </div>
          {isVerified && (
            <span className="text-xs font-medium text-green-600 flex items-center gap-1 shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t('onboarding.otp.verifiedBadge', { defaultValue: 'Verified' })}
            </span>
          )}
        </div>

        {!showOtpInput && !isVerified && (
          <div className="mt-4 flex justify-end">
            <Button
              size="sm"
              onClick={() => sendCode(channel)}
              disabled={isLocked || !target}
            >
              {state.status === 'sending'
                ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> {t('onboarding.otp.sending', { defaultValue: 'Sending…' })}</>
                : <>{t('onboarding.otp.sendCode', { defaultValue: 'Send code' })}</>}
            </Button>
          </div>
        )}

        {showOtpInput && (
          <div className="mt-4 space-y-3">
            <div className="flex justify-center">
              <InputOTP
                maxLength={OTP_LENGTH}
                value={state.code}
                onChange={(v) => setState(s => ({ ...s, code: v, error: null }))}
                disabled={isLocked}
              >
                <InputOTPGroup>
                  {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {state.error && (
              <p className="text-xs text-destructive flex items-center gap-1 justify-center">
                <AlertCircle className="h-3 w-3" /> {state.error}
              </p>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => sendCode(channel)}
                disabled={!canResend}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                {state.cooldown > 0
                  ? t('onboarding.otp.resendIn', { defaultValue: 'Resend in {{s}}s', s: state.cooldown })
                  : t('onboarding.otp.resend', { defaultValue: 'Resend code' })}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => verifyCode(channel)}
                disabled={isLocked || state.code.length !== OTP_LENGTH}
              >
                {state.status === 'verifying'
                  ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> {t('onboarding.otp.verifying', { defaultValue: 'Verifying…' })}</>
                  : <>{t('onboarding.otp.verify', { defaultValue: 'Verify' })}</>}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Alert>
        <ShieldCheck className="h-4 w-4" />
        <AlertTitle>
          {t('onboarding.otp.title', { defaultValue: 'Confirm your contact details' })}
        </AlertTitle>
        <AlertDescription>
          {t('onboarding.otp.description', {
            defaultValue: 'Enter the 6-digit codes we just sent to your email and phone. Both must be verified to continue.',
          })}
        </AlertDescription>
      </Alert>

      {renderChannel('email', emailState, setEmailState, <Mail className="h-5 w-5" />, 'onboarding.otp.emailTitle', email)}
      {renderChannel('phone', phoneState, setPhoneState, <Phone className="h-5 w-5" />, 'onboarding.otp.phoneTitle', phone)}
    </div>
  );
};

OtpVerificationStep.displayName = 'OtpVerificationStep';
