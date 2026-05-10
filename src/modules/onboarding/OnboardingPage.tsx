import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ArrowRight, ArrowLeft, Check, ShieldCheck, Mail, Phone, MapPin,
  User as UserIcon, Lock, Eye, EyeOff, Sparkles, Camera, Upload,
  AlertCircle, PartyPopper, Loader2, FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { onboardingService } from './onboarding.service';
import { VerifiedInvitation, SignupPayload, OnboardingRole } from './onboarding.api';
import { PRESET_AVATARS, AVATAR_GROUPS } from './preset-avatars';
import { DynamicImageCropper } from '@/modules/shared/components/DynamicImageCropper';
import { COUNTRIES, COUNTRY_BY_CODE, digitsOnly } from './data/countries';
import { getCitiesFor, getCitiesForDepartment, CityEntry } from './data/cities';
import { getDepartmentsFor, hasDepartments, DepartmentEntry } from './data/departments';
import { SearchableSelect, SearchableSelectOption } from './components/SearchableSelect';
import { OtpVerificationStep } from './components/OtpVerificationStep';
import { TermsConsentStep, TermsConsentValue, emptyConsent, isFullyConsented } from './components/TermsConsentStep';
import { authService } from '@/modules/auth/auth.service';
// ─── Validation rules (mirror CreateUserRequestDto) ─────────────────────────

const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const ROLE_LABEL: Record<OnboardingRole, string> = {
  hyper_admin: 'Hyper Admin',
  hyper_manager: 'Hyper Manager',
  admin: 'Host / Admin',
  manager: 'Manager',
  user: 'User',
  guest: 'Guest',
};

interface FormState {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phoneCountry: string;   // ISO-3166 alpha-2 (e.g. 'DZ')
  phoneNbr: string;       // national number without dial code
  cardId: string;
  passportId: string;
  password: string;
  confirmPassword: string;
  address: string;
  city: string;
  zipcode: string;
  country: string;        // ISO-3166 alpha-2
  department: string;     // department / state / wilaya code (optional per country)
  avatarUrl: string;
  referralCode: string;
}

const EMPTY_FORM: FormState = {
  firstName: '', lastName: '', title: '', email: '',
  phoneCountry: 'DZ', phoneNbr: '',
  cardId: '', passportId: '', password: '', confirmPassword: '',
  address: '', city: '', zipcode: '', country: 'DZ', department: '', avatarUrl: '',
  referralCode: '',
};

/** Best-effort: split an E.164-ish phone string into (country, national digits). */
function splitInvitationPhone(raw: string | null | undefined): { country: string; national: string } {
  if (!raw) return { country: 'DZ', national: '' };
  const cleaned = raw.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    // Try longest dial code match
    const sorted = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
    for (const c of sorted) {
      if (cleaned.startsWith(c.dialCode)) {
        return { country: c.code, national: cleaned.slice(c.dialCode.length) };
      }
    }
  }
  return { country: 'DZ', national: digitsOnly(cleaned) };
}

type StepId = 'identity' | 'security' | 'verify' | 'address' | 'avatar' | 'terms' | 'review';

const STEPS: { id: StepId; titleKey: string; icon: React.ComponentType<any> }[] = [
  { id: 'identity', titleKey: 'onboarding.step.identity', icon: UserIcon },
  { id: 'security', titleKey: 'onboarding.step.security', icon: Lock },
  { id: 'verify',   titleKey: 'onboarding.step.verify',   icon: ShieldCheck },
  { id: 'address',  titleKey: 'onboarding.step.address',  icon: MapPin },
  { id: 'avatar',   titleKey: 'onboarding.step.avatar',   icon: Camera },
  { id: 'terms',    titleKey: 'onboarding.step.terms',    icon: FileText },
  { id: 'review',   titleKey: 'onboarding.step.review',   icon: Check },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const OnboardingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const invitationToken = params.get('invitation');
  // Optional prefill values appended by the backend invitation URL builder.
  // Available immediately, before the verify round-trip completes.
  const prefilledEmail = params.get('email') || '';
  const prefilledPhone = params.get('phone') || '';
  const prefilledMethod = (params.get('method') as 'email' | 'phone' | null) || null;
  const prefilledRefCode = (params.get('ref') || params.get('referralCode') || '').trim();

  const [verifying, setVerifying] = useState(!!invitationToken);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<VerifiedInvitation | null>(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(() => {
    if (!invitationToken) {
      return { ...EMPTY_FORM, referralCode: prefilledRefCode };
    }
    const phoneSplit = splitInvitationPhone(prefilledPhone);
    return {
      ...EMPTY_FORM,
      email: prefilledEmail || EMPTY_FORM.email,
      phoneCountry: prefilledPhone ? phoneSplit.country : EMPTY_FORM.phoneCountry,
      phoneNbr: prefilledPhone ? phoneSplit.national : EMPTY_FORM.phoneNbr,
      referralCode: prefilledRefCode,
    };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [success, setSuccess] = useState(false);

  // OTP verification (email + phone)
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  // Role-based Terms & Conditions consent
  const [consent, setConsent] = useState<TermsConsentValue>(emptyConsent);

  // Avatar picker
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [avatarGroup, setAvatarGroup] = useState<string>(AVATAR_GROUPS[0] || 'People');
  const [cropperImage, setCropperImage] = useState<string | null>(null);

  const isInvitationFlow = !!invitationToken;
  const currentStep = STEPS[stepIndex];

  /** Resolved role used by the consent step (defaults to 'user' for self-signup). */
  const effectiveRole: OnboardingRole = invitation?.role || 'user';

  /** Full E.164 phone string for the OTP verification step. */
  const fullPhoneE164 = useMemo(() => {
    const c = COUNTRY_BY_CODE[form.phoneCountry];
    const national = digitsOnly(form.phoneNbr);
    return c && national ? `${c.dialCode}${national}` : '';
  }, [form.phoneCountry, form.phoneNbr]);

  // ─── Derived options for combobox fields ──────────────────────────────────

  const countryOptions = useMemo<SearchableSelectOption[]>(
    () => COUNTRIES.map((c) => ({
      value: c.code,
      label: c.name,
      searchable: `${c.name} ${c.code} ${c.dialCode}`,
      leading: <span className="text-base leading-none">{c.flag}</span>,
    })),
    [],
  );

  const countryDialOptions = useMemo<SearchableSelectOption[]>(
    () => COUNTRIES.map((c) => ({
      value: c.code,
      label: `${c.flag} ${c.dialCode}`,
      description: c.name,
      searchable: `${c.name} ${c.code} ${c.dialCode}`,
    })),
    [],
  );

  const selectedPhoneCountry = COUNTRY_BY_CODE[form.phoneCountry];
  const selectedAddrCountry = COUNTRY_BY_CODE[form.country];

  // ─── Departments / states ────────────────────────────────────────────────
  const departments: DepartmentEntry[] = useMemo(
    () => getDepartmentsFor(form.country),
    [form.country],
  );
  const showDepartmentField = departments.length > 0;

  const departmentOptions = useMemo<SearchableSelectOption[]>(
    () => departments.map((d) => ({
      value: d.code,
      label: d.name,
      description: d.code,
      searchable: `${d.name} ${d.code}`,
    })),
    [departments],
  );

  // Cities filtered by department when a department dataset exists.
  const countryCities: CityEntry[] = useMemo(
    () => showDepartmentField
      ? getCitiesForDepartment(form.country, form.department)
      : getCitiesFor(form.country),
    [form.country, form.department, showDepartmentField],
  );

  const cityOptions = useMemo<SearchableSelectOption[]>(
    () => countryCities.map((c) => ({
      value: c.name,
      label: c.name,
      description: c.zipcode,
      searchable: `${c.name} ${c.zipcode}`,
    })),
    [countryCities],
  );

  const cityAddressOptions = useMemo<SearchableSelectOption[]>(() => {
    const entry = countryCities.find((c) => c.name === form.city);
    return (entry?.addresses || []).map((a) => ({
      value: a,
      label: a,
      searchable: a,
    }));
  }, [countryCities, form.city]);

  // ─── Verify invitation token (once) ───────────────────────────────────────

  useEffect(() => {
    if (!invitationToken) return;
    let cancelled = false;
    (async () => {
      try {
        setVerifying(true);
        setVerifyError(null);
        const data = await onboardingService.verifyInvitation(invitationToken);
        if (cancelled) return;
        setInvitation(data);
        const phoneSplit = splitInvitationPhone(data.phone);
        setForm(prev => ({
          ...prev,
          email: data.email || prev.email,
          phoneCountry: data.phone ? phoneSplit.country : prev.phoneCountry,
          phoneNbr: data.phone ? phoneSplit.national : prev.phoneNbr,
        }));
        if (data.userExists) {
          setVerifyError(t('onboarding.errors.userExists', {
            defaultValue: 'An account already exists for this contact. Please sign in.',
          }));
        }
      } catch (err: any) {
        if (cancelled) return;
        const status = err?.response?.status;
        const apiMsg = err?.response?.data?.message;
        if (status === 404) {
          setVerifyError(t('onboarding.errors.invalidToken', {
            defaultValue: 'This invitation link is invalid or no longer exists.',
          }));
        } else if (status === 403) {
          setVerifyError(apiMsg || t('onboarding.errors.expired', {
            defaultValue: 'This invitation can no longer be used.',
          }));
        } else {
          setVerifyError(apiMsg || t('onboarding.errors.generic', {
            defaultValue: 'Something went wrong while verifying your invitation.',
          }));
        }
      } finally {
        if (!cancelled) setVerifying(false);
      }
    })();
    return () => { cancelled = true; };
  }, [invitationToken, t]);

  // ─── Field helpers ────────────────────────────────────────────────────────

  const updateField = useCallback((name: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    // Changing the email or phone invalidates any prior verification.
    if (name === 'email') setEmailVerified(false);
    if (name === 'phoneNbr' || name === 'phoneCountry') setPhoneVerified(false);
  }, []);

  // ─── Validation per step ──────────────────────────────────────────────────

  const validateStep = useCallback((id: StepId): boolean => {
    const next: Record<string, string> = {};
    const required = (k: keyof FormState, msg: string) => {
      if (!form[k] || !String(form[k]).trim()) next[k] = msg;
    };

    if (id === 'identity') {
      required('title', t('onboarding.validation.titleRequired', { defaultValue: 'Title is required' }));
      required('firstName', t('onboarding.validation.firstNameRequired', { defaultValue: 'First name is required' }));
      required('lastName', t('onboarding.validation.lastNameRequired', { defaultValue: 'Last name is required' }));
      required('email', t('onboarding.validation.emailRequired', { defaultValue: 'Email is required' }));
      required('phoneNbr', t('onboarding.validation.phoneRequired', { defaultValue: 'Phone number is required' }));
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        next.email = t('onboarding.validation.emailInvalid', { defaultValue: 'Email is invalid' });
      }
      const phoneCountry = COUNTRY_BY_CODE[form.phoneCountry];
      const nationalDigits = digitsOnly(form.phoneNbr);
      if (form.phoneNbr && phoneCountry && !phoneCountry.phoneRegex.test(nationalDigits)) {
        next.phoneNbr = t('onboarding.validation.phoneInvalid', {
          defaultValue: 'Enter a valid phone number for {{country}}',
          country: phoneCountry.name,
        });
      }
      required('cardId', t('onboarding.validation.cardIdRequired', { defaultValue: 'National ID is required' }));
    }

    if (id === 'security') {
      required('password', t('onboarding.validation.passwordRequired', { defaultValue: 'Password is required' }));
      if (form.password && !STRONG_PASSWORD_REGEX.test(form.password)) {
        next.password = t('onboarding.validation.passwordWeak', {
          defaultValue: 'At least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 symbol',
        });
      }
      if (form.password !== form.confirmPassword) {
        next.confirmPassword = t('onboarding.validation.passwordMismatch', {
          defaultValue: 'Passwords do not match',
        });
      }
    }

    if (id === 'address') {
      required('country', t('onboarding.validation.countryRequired', { defaultValue: 'Country is required' }));
      if (showDepartmentField) {
        required('department', t('onboarding.validation.departmentRequired', { defaultValue: 'Department / state is required' }));
      }
      required('city', t('onboarding.validation.cityRequired', { defaultValue: 'City is required' }));
      required('zipcode', t('onboarding.validation.zipRequired', { defaultValue: 'ZIP code is required' }));
      required('address', t('onboarding.validation.addressRequired', { defaultValue: 'Address is required' }));
      const addrCountry = COUNTRY_BY_CODE[form.country];
      if (form.zipcode && addrCountry && !addrCountry.postalRegex.test(form.zipcode.trim())) {
        next.zipcode = t('onboarding.validation.zipInvalid', {
          defaultValue: 'ZIP code is invalid for {{country}}',
          country: addrCountry.name,
        });
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form, t]);

  // ─── Navigation ───────────────────────────────────────────────────────────

  const goNext = useCallback(() => {
    // Step-level form validation (identity / security / address).
    if (!validateStep(currentStep.id)) return;

    // OTP gate: both channels must be verified before leaving the verify step.
    if (currentStep.id === 'verify' && (!emailVerified || !phoneVerified)) {
      toast.error(t('onboarding.otp.required', {
        defaultValue: 'Please verify both your email and phone number to continue.',
      }));
      return;
    }

    // Consent gate: all three boxes must be ticked before leaving the terms step.
    if (currentStep.id === 'terms' && !isFullyConsented(consent)) {
      toast.error(t('onboarding.terms.required', {
        defaultValue: 'You must accept all conditions to continue.',
      }));
      return;
    }

    setStepIndex(i => Math.min(STEPS.length - 1, i + 1));
  }, [currentStep.id, validateStep, emailVerified, phoneVerified, consent, t]);

  const goBack = useCallback(() => {
    setStepIndex(i => Math.max(0, i - 1));
  }, []);

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    // re-validate everything before sending
    for (const s of STEPS) {
      if (s.id === 'avatar' || s.id === 'review' || s.id === 'verify' || s.id === 'terms') continue;
      if (!validateStep(s.id)) {
        const idx = STEPS.findIndex(x => x.id === s.id);
        setStepIndex(idx);
        return;
      }
    }

    // Hard re-check of the gating steps before hitting the API.
    if (!emailVerified || !phoneVerified) {
      const idx = STEPS.findIndex(s => s.id === 'verify');
      if (idx >= 0) setStepIndex(idx);
      toast.error(t('onboarding.otp.required', {
        defaultValue: 'Please verify both your email and phone number to continue.',
      }));
      return;
    }
    if (!isFullyConsented(consent)) {
      const idx = STEPS.findIndex(s => s.id === 'terms');
      if (idx >= 0) setStepIndex(idx);
      toast.error(t('onboarding.terms.required', {
        defaultValue: 'You must accept all conditions to continue.',
      }));
      return;
    }

    setSubmitting(true);
    try {
      const phoneCountry = COUNTRY_BY_CODE[form.phoneCountry];
      const addrCountry = COUNTRY_BY_CODE[form.country];
      const fullPhone = phoneCountry
        ? `${phoneCountry.dialCode}${digitsOnly(form.phoneNbr)}`
        : form.phoneNbr.trim();
      const payload: SignupPayload = {
        phoneNbr: fullPhone,
        email: form.email.trim().toLowerCase(),
        role: invitation?.role || 'user',
        password: await authService.encodePassword(form.password),
        cardId: form.cardId.trim(),
        passportId: form.passportId.trim() || undefined,
        lastName: form.lastName.trim(),
        firstName: form.firstName.trim(),
        title: form.title.trim(),
        city: form.city.trim(),
        zipcode: form.zipcode.trim(),
        address: form.address.trim(),
        country: addrCountry?.name || form.country,
        countryCode: form.country,
        avatarUrl: form.avatarUrl || undefined,
        referralCode: form.referralCode.trim() || undefined,
      };

      if (isInvitationFlow && invitationToken) {
        await onboardingService.signupWithInvitation(invitationToken, payload);
      } else {
        await onboardingService.selfSignup(payload);
      }

      setSuccess(true);
      toast.success(t('onboarding.success.created', { defaultValue: 'Account created. Welcome aboard!' }));
      setTimeout(() => navigate('/login', { replace: true }), 1800);
    } catch (err: any) {
      const status = err?.response?.status;
      const apiMsg = err?.response?.data?.message;
      if (status === 409) {
        toast.error(apiMsg || t('onboarding.errors.userExists', {
          defaultValue: 'An account already exists for this contact.',
        }));
      } else if (status === 400) {
        toast.error(Array.isArray(apiMsg) ? apiMsg.join(' • ') : apiMsg ||
          t('onboarding.errors.validation', { defaultValue: 'Please review your information.' }));
      } else {
        toast.error(apiMsg || t('onboarding.errors.signupFailed', {
          defaultValue: 'Sign up failed. Please try again.',
        }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Avatar handlers ──────────────────────────────────────────────────────

  const handlePickPreset = (src: string) => {
    setCropperImage(src);
    setAvatarPickerOpen(false);
  };

  const handleUploadAvatar = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropperImage(String(reader.result));
      setAvatarPickerOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCropDone = (dataUrl: string) => {
    setForm(prev => ({ ...prev, avatarUrl: dataUrl }));
    setCropperImage(null);
  };

  // ─── Render: verification states ──────────────────────────────────────────

  if (verifying) {
    return (
      <Shell>
        <Card className="border-border/60 shadow-xl">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
            <CardTitle>{t('onboarding.verifying.title', { defaultValue: 'Verifying your invitation…' })}</CardTitle>
            <CardDescription>
              {t('onboarding.verifying.description', { defaultValue: 'We\'re making sure this invitation is valid.' })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </Shell>
    );
  }

  if (verifyError) {
    return (
      <Shell>
        <Card className="border-destructive/40 shadow-xl">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>{t('onboarding.invalid.title', { defaultValue: 'Invitation unavailable' })}</CardTitle>
            <CardDescription>{verifyError}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button onClick={() => navigate('/login')} className="w-full">
              {t('onboarding.invalid.gotoLogin', { defaultValue: 'Go to login' })}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')} className="w-full">
              {t('common.backHome', { defaultValue: 'Back to home' })}
            </Button>
          </CardContent>
        </Card>
      </Shell>
    );
  }

  if (success) {
    return (
      <Shell>
        <Card className="border-primary/40 shadow-xl">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <PartyPopper className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {t('onboarding.success.title', { defaultValue: 'Welcome aboard!' })}
            </CardTitle>
            <CardDescription>
              {t('onboarding.success.description', {
                defaultValue: 'Your account is ready. Redirecting you to sign in…',
              })}
            </CardDescription>
          </CardHeader>
        </Card>
      </Shell>
    );
  }

  // ─── Render: main flow ────────────────────────────────────────────────────

  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <Shell>
      <Card className="border-border/60 shadow-xl overflow-hidden">
        {/* Header banner */}
        <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent px-6 pt-6 pb-4 border-b border-border/40">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              {isInvitationFlow
                ? t('onboarding.banner.invited', { defaultValue: 'You\'ve been invited' })
                : t('onboarding.banner.signup', { defaultValue: 'Create your account' })}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            {isInvitationFlow && invitation
              ? t('onboarding.banner.invitedTitle', {
                defaultValue: '{{name}} invited you as {{role}}',
                name: invitation.inviterName,
                role: ROLE_LABEL[invitation.role],
              })
              : t('onboarding.banner.signupTitle', { defaultValue: 'Let\'s set up your profile' })}
          </h1>
          {isInvitationFlow && invitation?.message && (
            <Alert className="mt-4 bg-card/60 border-border/60">
              <Mail className="h-4 w-4" />
              <AlertTitle className="text-sm">
                {t('onboarding.message.from', { defaultValue: 'Personal message' })}
              </AlertTitle>
              <AlertDescription className="text-sm whitespace-pre-wrap">
                {invitation.message}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Progress + step indicator */}
        <div className="px-6 pt-5 pb-2 space-y-3 border-b border-border/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {t('onboarding.progress', {
                defaultValue: 'Step {{current}} of {{total}}',
                current: stepIndex + 1,
                total: STEPS.length,
              })}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
          <div className="flex items-center justify-between gap-2 pt-1 overflow-x-auto">
            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              const done = idx < stepIndex;
              const active = idx === stepIndex;
              return (
                <div key={s.id} className="flex items-center gap-2 shrink-0">
                  <div className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center border transition-colors',
                    done && 'bg-primary border-primary text-primary-foreground',
                    active && 'border-primary text-primary',
                    !done && !active && 'border-border text-muted-foreground',
                  )}>
                    {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={cn(
                    'text-xs hidden sm:inline',
                    active ? 'text-foreground font-medium' : 'text-muted-foreground',
                  )}>
                    {t(s.titleKey, { defaultValue: s.id })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* ── Identity ── */}
          {currentStep.id === 'identity' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label={t('onboarding.fields.title', { defaultValue: 'Title' })} required error={errors.title}>
                  <Select value={form.title} onValueChange={v => updateField('title', v)}>
                    <SelectTrigger><SelectValue placeholder={t('onboarding.placeholders.title', { defaultValue: 'Mr / Mrs / Ms' })} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr">{t('onboarding.title.mr', { defaultValue: 'Mr' })}</SelectItem>
                      <SelectItem value="Mrs">{t('onboarding.title.mrs', { defaultValue: 'Mrs' })}</SelectItem>
                      <SelectItem value="Ms">{t('onboarding.title.ms', { defaultValue: 'Ms' })}</SelectItem>
                      <SelectItem value="Dr">{t('onboarding.title.dr', { defaultValue: 'Dr' })}</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label={t('onboarding.fields.firstName', { defaultValue: 'First name' })} required error={errors.firstName} className="sm:col-span-1">
                  <Input value={form.firstName} onChange={e => updateField('firstName', e.target.value)} autoComplete="given-name" />
                </Field>
                <Field label={t('onboarding.fields.lastName', { defaultValue: 'Last name' })} required error={errors.lastName}>
                  <Input value={form.lastName} onChange={e => updateField('lastName', e.target.value)} autoComplete="family-name" />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t('onboarding.fields.email', { defaultValue: 'Email' })} required error={errors.email}>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={e => updateField('email', e.target.value)}
                    disabled={isInvitationFlow && invitation?.method === 'email' && !!invitation?.email}
                    autoComplete="email"
                  />
                </Field>
                <Field
                  label={t('onboarding.fields.phone', { defaultValue: 'Phone number' })}
                  required
                  error={errors.phoneNbr}
                >
                  <div className="flex gap-2">
                    <div className="w-[150px] shrink-0">
                      <SearchableSelect
                        options={countryDialOptions}
                        value={form.phoneCountry}
                        onChange={(v) => updateField('phoneCountry', v)}
                        placeholder={t('onboarding.placeholders.dialCode', { defaultValue: 'Code' })}
                        searchPlaceholder={t('onboarding.placeholders.searchCountry', { defaultValue: 'Search country…' })}
                        disabled={isInvitationFlow && invitation?.method === 'phone' && !!invitation?.phone}
                      />
                    </div>
                    <Input
                      value={form.phoneNbr}
                      onChange={e => updateField('phoneNbr', e.target.value.replace(/[^\d\s.-]/g, ''))}
                      placeholder={selectedPhoneCountry?.dialCode === '+213' ? '5 12 34 56 78' : selectedPhoneCountry?.dialCode === '+33' ? '6 12 34 56 78' : '...'}
                      disabled={isInvitationFlow && invitation?.method === 'phone' && !!invitation?.phone}
                      autoComplete="tel-national"
                      inputMode="tel"
                      className="flex-1"
                    />
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t('onboarding.fields.cardId', { defaultValue: 'National ID' })} required error={errors.cardId}>
                  <Input value={form.cardId} onChange={e => updateField('cardId', e.target.value)} />
                </Field>
                <Field label={t('onboarding.fields.passportId', { defaultValue: 'Passport (optional)' })} error={errors.passportId}>
                  <Input value={form.passportId} onChange={e => updateField('passportId', e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {/* ── Security ── */}
          {currentStep.id === 'security' && (
            <div className="space-y-4">
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>{t('onboarding.security.title', { defaultValue: 'Pick a strong password' })}</AlertTitle>
                <AlertDescription>
                  {t('onboarding.security.hint', {
                    defaultValue: 'Min 8 chars including uppercase, lowercase, digit and symbol.',
                  })}
                </AlertDescription>
              </Alert>

              <Field label={t('onboarding.fields.password', { defaultValue: 'Password' })} required error={errors.password}>
                <div className="relative">
                  <Input
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => updateField('password', e.target.value)}
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(s => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="toggle password"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <PasswordStrength password={form.password} />
              </Field>

              <Field label={t('onboarding.fields.confirmPassword', { defaultValue: 'Confirm password' })} required error={errors.confirmPassword}>
                <Input
                  type={showPwd ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => updateField('confirmPassword', e.target.value)}
                  autoComplete="new-password"
                />
              </Field>

              {!isInvitationFlow && (
                <Field
                  label={t('onboarding.fields.referralCode', { defaultValue: 'Referral code (optional)' })}
                  error={errors.referralCode}
                >
                  <Input
                    value={form.referralCode}
                    onChange={e => updateField('referralCode', e.target.value.toUpperCase())}
                    placeholder="REF-XXXXXXXX"
                    autoComplete="off"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('onboarding.fields.referralCodeHint', {
                      defaultValue: 'Got invited by a friend? Enter their code to earn 50 bonus points.',
                    })}
                  </p>
                </Field>
              )}
            </div>
          )}

          {/* ── OTP verification (email + phone) ── */}
          {currentStep.id === 'verify' && (
            <OtpVerificationStep
              email={form.email.trim().toLowerCase()}
              phone={fullPhoneE164}
              onChange={({ emailVerified: e, phoneVerified: p }) => {
                setEmailVerified(e);
                setPhoneVerified(p);
              }}
            />
          )}

          {/* ── Address ── */}
          {currentStep.id === 'address' && (
            <div className="space-y-5">
              <Field
                label={t('onboarding.fields.country', { defaultValue: 'Country' })}
                required
                error={errors.country}
              >
                <SearchableSelect
                  options={countryOptions}
                  value={form.country}
                  onChange={(v) => {
                    setForm(prev => ({ ...prev, country: v, department: '', city: '', zipcode: '', address: '' }));
                    setErrors(prev => {
                      const n = { ...prev };
                      delete n.country; delete n.department; delete n.city; delete n.zipcode; delete n.address;
                      return n;
                    });
                  }}
                  placeholder={t('onboarding.placeholders.selectCountry', { defaultValue: 'Select a country' })}
                  searchPlaceholder={t('onboarding.placeholders.searchCountry', { defaultValue: 'Search country…' })}
                />
              </Field>

              {showDepartmentField && (
                <Field
                  label={t('onboarding.fields.department', { defaultValue: 'Department / State / Region' })}
                  required
                  error={errors.department}
                >
                  <SearchableSelect
                    options={departmentOptions}
                    value={form.department}
                    onChange={(v) => {
                      setForm(prev => ({ ...prev, department: v, city: '', zipcode: '', address: '' }));
                      setErrors(prev => {
                        const n = { ...prev };
                        delete n.department; delete n.city; delete n.zipcode; delete n.address;
                        return n;
                      });
                    }}
                    placeholder={t('onboarding.placeholders.selectDepartment', { defaultValue: 'Select a department / state' })}
                    searchPlaceholder={t('onboarding.placeholders.searchDepartment', { defaultValue: 'Search…' })}
                  />
                </Field>
              )}

              <Field
                label={t('onboarding.fields.city', { defaultValue: 'City' })}
                required
                error={errors.city}
              >
                {countryCities.length > 0 ? (
                  <SearchableSelect
                    options={cityOptions}
                    value={form.city}
                    onChange={(v) => {
                      const match = countryCities.find(c => c.name === v);
                      setForm(prev => ({
                        ...prev,
                        city: v,
                        zipcode: match?.zipcode || prev.zipcode,
                        address: '',
                      }));
                      setErrors(prev => {
                        const n = { ...prev };
                        delete n.city; delete n.zipcode; delete n.address;
                        return n;
                      });
                    }}
                    placeholder={t('onboarding.placeholders.selectCity', { defaultValue: 'Select a city' })}
                    searchPlaceholder={t('onboarding.placeholders.searchCity', { defaultValue: 'Search city…' })}
                    allowCustom
                    customLabel={(s) => t('onboarding.actions.useCustomCity', {
                      defaultValue: 'Use "{{name}}" as city',
                      name: s,
                    })}
                  />
                ) : (
                  <Input
                    value={form.city}
                    onChange={e => updateField('city', e.target.value)}
                    autoComplete="address-level2"
                  />
                )}
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label={t('onboarding.fields.zipcode', { defaultValue: 'ZIP / Postal code' })}
                  required
                  error={errors.zipcode}
                >
                  <Input
                    value={form.zipcode}
                    onChange={e => updateField('zipcode', e.target.value)}
                    placeholder={selectedAddrCountry?.code === 'DZ' ? '16000' : ''}
                    autoComplete="postal-code"
                  />
                </Field>

                <Field
                  label={t('onboarding.fields.address', { defaultValue: 'Address' })}
                  required
                  error={errors.address}
                >
                  {cityAddressOptions.length > 0 ? (
                    <SearchableSelect
                      options={cityAddressOptions}
                      value={form.address}
                      onChange={(v) => updateField('address', v)}
                      placeholder={t('onboarding.placeholders.selectAddress', { defaultValue: 'Select or type an address' })}
                      searchPlaceholder={t('onboarding.placeholders.searchAddress', { defaultValue: 'Search address…' })}
                      allowCustom
                      customLabel={(s) => t('onboarding.actions.useCustomAddress', {
                        defaultValue: 'Use "{{name}}"',
                        name: s,
                      })}
                    />
                  ) : (
                    <Input
                      value={form.address}
                      onChange={e => updateField('address', e.target.value)}
                      autoComplete="street-address"
                      placeholder={t('onboarding.placeholders.address', { defaultValue: 'Street name and number' })}
                    />
                  )}
                </Field>
              </div>
            </div>
          )}

          {/* ── Avatar ── */}
          {currentStep.id === 'avatar' && (
            <div className="space-y-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-28 w-28 ring-4 ring-primary/10">
                  {form.avatarUrl
                    ? <AvatarImage src={form.avatarUrl} alt="avatar" />
                    : <AvatarFallback className="text-2xl bg-muted">
                      {(form.firstName[0] || '') + (form.lastName[0] || '') || <UserIcon className="h-8 w-8" />}
                    </AvatarFallback>}
                </Avatar>
                <p className="text-sm text-muted-foreground">
                  {t('onboarding.avatar.hint', { defaultValue: 'Pick a preset, upload your own, or skip — you can change it later.' })}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="default" onClick={() => setAvatarPickerOpen(true)}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t('onboarding.avatar.choosePreset', { defaultValue: 'Choose a preset' })}
                  </Button>
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => e.target.files?.[0] && handleUploadAvatar(e.target.files[0])}
                    />
                    <Button variant="outline" asChild>
                      <span className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        {t('onboarding.avatar.upload', { defaultValue: 'Upload photo' })}
                      </span>
                    </Button>
                  </label>
                  {form.avatarUrl && (
                    <Button variant="ghost" onClick={() => updateField('avatarUrl', '')}>
                      {t('onboarding.avatar.remove', { defaultValue: 'Remove' })}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Role-specific Terms & Conditions ── */}
          {currentStep.id === 'terms' && (
            <TermsConsentStep
              role={effectiveRole}
              value={consent}
              onChange={setConsent}
            />
          )}

          {/* ── Review ── */}
          {currentStep.id === 'review' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg border border-border/60 bg-muted/30">
                <Avatar className="h-16 w-16">
                  {form.avatarUrl
                    ? <AvatarImage src={form.avatarUrl} alt="avatar" />
                    : <AvatarFallback>{(form.firstName[0] || '') + (form.lastName[0] || '')}</AvatarFallback>}
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{form.title} {form.firstName} {form.lastName}</p>
                  <p className="text-sm text-muted-foreground">
                    {form.email} • {selectedPhoneCountry?.dialCode || ''} {form.phoneNbr}
                  </p>
                  {invitation && (
                    <Badge variant="secondary" className="mt-1">
                      {t('onboarding.review.role', { defaultValue: 'Role' })}: {ROLE_LABEL[invitation.role]}
                    </Badge>
                  )}
                </div>
              </div>
              <ReviewRow label={t('onboarding.fields.cardId', { defaultValue: 'National ID' })} value={form.cardId} />
              {form.passportId && <ReviewRow label={t('onboarding.fields.passportId', { defaultValue: 'Passport' })} value={form.passportId} />}
              <ReviewRow
                label={t('onboarding.fields.address', { defaultValue: 'Address' })}
                value={`${form.address}, ${form.zipcode} ${form.city}, ${selectedAddrCountry?.name || form.country}`}
              />
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertDescription>
                  {t('onboarding.review.confirm', {
                    defaultValue: 'By creating your account you agree to our Terms and Privacy Policy.',
                  })}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Footer nav */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <Button variant="ghost" onClick={goBack} disabled={stepIndex === 0 || submitting}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back', { defaultValue: 'Back' })}
            </Button>
            {stepIndex < STEPS.length - 1 ? (
              <Button
                onClick={goNext}
                disabled={
                  submitting ||
                  (currentStep.id === 'verify' && (!emailVerified || !phoneVerified)) ||
                  (currentStep.id === 'terms' && !isFullyConsented(consent))
                }
              >
                {t('common.next', { defaultValue: 'Next' })}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitting || !emailVerified || !phoneVerified || !isFullyConsented(consent)}
                className="min-w-[180px]"
              >
                {submitting
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {t('common.submitting', { defaultValue: 'Creating…' })}</>
                  : <>{t('onboarding.submit', { defaultValue: 'Create my account' })} <Check className="h-4 w-4 ml-2" /></>}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground mt-4">
        {t('onboarding.haveAccount', { defaultValue: 'Already have an account?' })}{' '}
        <Link to="/login" className="text-primary hover:underline font-medium">
          {t('common.signIn', { defaultValue: 'Sign in' })}
        </Link>
      </p>

      {/* Avatar preset picker — grouped by style for easier browsing */}
      <Dialog open={avatarPickerOpen} onOpenChange={setAvatarPickerOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('onboarding.avatar.pickerTitle', { defaultValue: 'Choose your avatar' })}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 pb-3 border-b border-border/40">
            {AVATAR_GROUPS.map((g) => (
              <Button
                key={g}
                size="sm"
                variant={avatarGroup === g ? 'default' : 'outline'}
                onClick={() => setAvatarGroup(g)}
              >
                {g}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 max-h-[60vh] overflow-y-auto p-1 mt-3">
            {PRESET_AVATARS.filter(av => av.group === avatarGroup).map(av => (
              <button
                key={av.id}
                onClick={() => handlePickPreset(av.src)}
                className={cn(
                  'group relative aspect-square rounded-xl border-2 overflow-hidden bg-muted transition-all',
                  'hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary',
                  form.avatarUrl === av.src ? 'border-primary' : 'border-border',
                )}
                title={av.label}
              >
                <img
                  src={av.src}
                  alt={av.label}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Crop / edit modal */}
      {cropperImage && (
        <DynamicImageCropper
          imageSrc={cropperImage}
          open={!!cropperImage}
          onOpenChange={(o) => !o && setCropperImage(null)}
          onCropComplete={handleCropDone}
          aspectRatio={1}
          circularCrop
        />
      )}
    </Shell>
  );
};

OnboardingPage.displayName = 'OnboardingPage';

// ─── Sub-components ─────────────────────────────────────────────────────────

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-2xl">{children}</div>
  </div>
);

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}
const Field: React.FC<FieldProps> = ({ label, required, error, className, children }) => (
  <div className={cn('space-y-1.5', className)}>
    <Label className="text-sm font-medium">
      {label}{required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
    {children}
    {error && (
      <p className="text-xs text-destructive flex items-center gap-1">
        <AlertCircle className="h-3 w-3" /> {error}
      </p>
    )}
  </div>
);

const ReviewRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between gap-4 text-sm border-b border-border/30 pb-2">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-right">{value}</span>
  </div>
);

const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const score = useMemo(() => {
    let s = 0;
    if (!password) return 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[a-z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  }, [password]);
  if (!password) return null;
  const labels = ['', 'Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-destructive', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  return (
    <div className="space-y-1 pt-1">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={cn('h-1 flex-1 rounded-full transition-colors', i < score ? colors[score] : 'bg-muted')} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{labels[score]}</p>
    </div>
  );
};
