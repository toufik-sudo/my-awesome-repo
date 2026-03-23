import React, { memo, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ErrorBoundary } from '@/modules/shared/components/ErrorBoundary';
import { toast } from 'sonner';
import {
  ArrowRight, ArrowLeft, Check, Sparkles, User, PartyPopper,
  Eye, EyeOff, Mail, Phone, Lock, Camera, Heart, Star, Zap,
  Globe, Palette, Code, Music, Book, Film, Gamepad2, Briefcase,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
  validate?: () => boolean | string;
  skippable?: boolean;
}

export interface OnboardingFlowProps {
  steps: OnboardingStep[];
  title?: string;
  subtitle?: string;
  onComplete: (data: Record<string, any>) => void | Promise<void>;
  onSkip?: () => void;
  onStepChange?: (stepIndex: number, stepId: string) => void;
  showProgressBar?: boolean;
  showStepIndicator?: boolean;
  allowBack?: boolean;
  className?: string;
  logo?: React.ReactNode;
  brandColor?: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  avatar?: File | null;
  bio?: string;
  interests?: string[];
  otpCode?: string;
}

export interface RegisterFlowProps {
  onRegister: (data: RegisterFormData) => void | Promise<void>;
  onLoginRedirect?: () => void;
  showSocialLogin?: boolean;
  socialButtons?: React.ReactNode;
  logo?: React.ReactNode;
  className?: string;
  enablePhoneVerification?: boolean;
  onSendOtp?: (phone: string) => Promise<void>;
  onVerifyOtp?: (phone: string, code: string) => Promise<boolean>;
  availableInterests?: InterestOption[];
}

export interface InterestOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  category?: string;
}

// ─── Default Interests ───────────────────────────────────────────────────────

const DEFAULT_INTERESTS: InterestOption[] = [
  { id: 'technology', label: 'Technology', icon: <Code className="h-4 w-4" /> },
  { id: 'design', label: 'Design', icon: <Palette className="h-4 w-4" /> },
  { id: 'business', label: 'Business', icon: <Briefcase className="h-4 w-4" /> },
  { id: 'music', label: 'Music', icon: <Music className="h-4 w-4" /> },
  { id: 'reading', label: 'Reading', icon: <Book className="h-4 w-4" /> },
  { id: 'movies', label: 'Movies', icon: <Film className="h-4 w-4" /> },
  { id: 'gaming', label: 'Gaming', icon: <Gamepad2 className="h-4 w-4" /> },
  { id: 'travel', label: 'Travel', icon: <Globe className="h-4 w-4" /> },
  { id: 'fitness', label: 'Fitness', icon: <Zap className="h-4 w-4" /> },
  { id: 'cooking', label: 'Cooking', icon: <Heart className="h-4 w-4" /> },
  { id: 'science', label: 'Science', icon: <Star className="h-4 w-4" /> },
  { id: 'arts', label: 'Arts', icon: <Sparkles className="h-4 w-4" /> },
];

// ─── Onboarding Flow ─────────────────────────────────────────────────────────

export const OnboardingFlow: React.FC<OnboardingFlowProps> = memo(({
  steps,
  title,
  subtitle,
  onComplete,
  onSkip,
  onStepChange,
  showProgressBar = true,
  showStepIndicator = true,
  allowBack = true,
  className,
  logo,
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const progress = useMemo(() => ((currentStep + 1) / steps.length) * 100, [currentStep, steps.length]);
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = useCallback(async () => {
    if (step.validate) {
      const result = step.validate();
      if (result !== true) {
        toast.error(typeof result === 'string' ? result : t('common.error'));
        return;
      }
    }
    if (isLastStep) {
      setIsLoading(true);
      try {
        await onComplete({});
        setCompleted(true);
      } catch {
        toast.error(t('common.error'));
      } finally {
        setIsLoading(false);
      }
    } else {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep, steps[nextStep].id);
    }
  }, [currentStep, step, isLastStep, onComplete, onStepChange, steps, t]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep, steps[prevStep].id);
    }
  }, [currentStep, onStepChange, steps]);

  if (completed) {
    return (
      <div className={cn('flex items-center justify-center min-h-[60vh]', className)}>
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <PartyPopper className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">{t('onboarding.steps.complete.title')}</h2>
            <p className="text-muted-foreground">{t('onboarding.steps.complete.description')}</p>
            <Button size="lg" className="mt-4 gap-2" onClick={() => onComplete({})}>
              {t('onboarding.letsGo')} <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center min-h-[60vh] px-4', className)}>
      <div className="w-full max-w-lg space-y-6">
        {logo && <div className="flex justify-center mb-4">{logo}</div>}
        {(title || subtitle) && (
          <div className="text-center space-y-1">
            {title && <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        {showProgressBar && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t('onboarding.progressLabel', { current: currentStep + 1, total: steps.length })}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        {showStepIndicator && (
          <div className="flex justify-center gap-2">
            {steps.map((s, i) => (
              <div key={s.id} className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                i < currentStep && 'bg-primary text-primary-foreground',
                i === currentStep && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                i > currentStep && 'bg-muted text-muted-foreground'
              )}>
                {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
              </div>
            ))}
          </div>
        )}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2">{step.icon || <Sparkles className="h-8 w-8 text-primary" />}</div>
            <CardTitle>{step.title}</CardTitle>
            {step.description && <CardDescription>{step.description}</CardDescription>}
          </CardHeader>
          <CardContent>
            <ErrorBoundary>
              {step.content || <p className="text-center text-muted-foreground py-8">{t('tabs.noContent')}</p>}
            </ErrorBoundary>
          </CardContent>
        </Card>
        <div className="flex items-center justify-between">
          <div>
            {allowBack && currentStep > 0 && (
              <Button variant="ghost" onClick={handleBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> {t('common.back')}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onSkip && step.skippable !== false && (
              <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
                {t('onboarding.skipOnboarding')}
              </Button>
            )}
            <Button onClick={handleNext} disabled={isLoading} className="gap-2">
              {isLoading ? t('common.loading') : isLastStep ? t('onboarding.completeSetup') : t('common.next')}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
OnboardingFlow.displayName = 'OnboardingFlow';

// ─── Register Flow (Multi-Step) ──────────────────────────────────────────────

export const RegisterFlow: React.FC<RegisterFlowProps> = memo(({
  onRegister,
  onLoginRedirect,
  showSocialLogin = true,
  socialButtons,
  logo,
  className,
  enablePhoneVerification,
  onSendOtp,
  onVerifyOtp,
  availableInterests = DEFAULT_INTERESTS,
}) => {
  const { t } = useTranslation();
  const phoneVerificationEnabled = enablePhoneVerification ?? (import.meta.env.VITE_ENABLE_PHONE_VERIFICATION === 'true');

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    avatar: null,
    bio: '',
    interests: [],
    otpCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const totalSteps = phoneVerificationEnabled ? 4 : 3;
  const progress = ((step + 1) / totalSteps) * 100;

  const passwordStrength = useMemo(() => {
    const p = formData.password;
    if (!p) return { score: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const labels = ['', t('register.passwordStrength.weak'), t('register.passwordStrength.fair'), t('register.passwordStrength.good'), t('register.passwordStrength.strong')];
    const colors = ['', 'bg-destructive', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
    return { score, label: labels[score], color: colors[score] };
  }, [formData.password, t]);

  const handleChange = useCallback((field: keyof RegisterFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('profile.photo.tooLarge'));
        return;
      }
      handleChange('avatar', file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [handleChange, t]);

  const toggleInterest = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests?.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...(prev.interests || []), id],
    }));
  }, []);

  const handleSendOtp = useCallback(async () => {
    if (!formData.phone) {
      toast.error(t('auth.phoneRequired'));
      return;
    }
    setIsLoading(true);
    try {
      await onSendOtp?.(formData.phone);
      setOtpSent(true);
      toast.success(t('auth.otpSent'));
    } catch {
      toast.error(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  }, [formData.phone, onSendOtp, t]);

  const handleVerifyOtp = useCallback(async () => {
    if (!formData.otpCode || formData.otpCode.length < 6) {
      toast.error(t('auth.otpRequired'));
      return;
    }
    setIsLoading(true);
    try {
      const result = await onVerifyOtp?.(formData.phone, formData.otpCode);
      if (result) {
        setOtpVerified(true);
        toast.success(t('auth.verificationSuccess'));
      } else {
        toast.error(t('auth.otpInvalid'));
      }
    } catch {
      toast.error(t('auth.otpInvalid'));
    } finally {
      setIsLoading(false);
    }
  }, [formData.otpCode, formData.phone, onVerifyOtp, t]);

  const validateStep = useCallback((stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Account creation
        if (!formData.email) { toast.error(t('auth.emailRequired')); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { toast.error(t('auth.invalidEmail')); return false; }
        if (!formData.password || formData.password.length < 8) { toast.error(t('auth.passwordMinLength')); return false; }
        if (formData.password !== formData.confirmPassword) { toast.error(t('auth.passwordMismatch')); return false; }
        if (!formData.agreeTerms) { toast.error(t('register.termsRequired')); return false; }
        return true;
      case 1: // Profile
        if (!formData.firstName || !formData.lastName) { toast.error(t('common.required')); return false; }
        return true;
      case 2: // Interests (always valid, skippable)
        return true;
      case 3: // Phone verification (if enabled)
        if (phoneVerificationEnabled && !otpVerified) {
          toast.error(t('register.phoneVerificationRequired'));
          return false;
        }
        return true;
      default:
        return true;
    }
  }, [formData, phoneVerificationEnabled, otpVerified, t]);

  const handleNext = useCallback(async () => {
    if (!validateStep(step)) return;
    if (step === totalSteps - 1) {
      setIsLoading(true);
      try {
        await onRegister(formData);
        toast.success(t('register.success'));
      } catch {
        toast.error(t('register.error'));
      } finally {
        setIsLoading(false);
      }
    } else {
      setStep(prev => prev + 1);
    }
  }, [step, totalSteps, validateStep, onRegister, formData, t]);

  const handleBack = useCallback(() => {
    if (step > 0) setStep(prev => prev - 1);
  }, [step]);

  // ─── Step 0: Account Creation ──────────────────────────────────────────────
  const renderAccountStep = () => (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="reg-email">{t('register.email')}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="reg-email" type="email" placeholder={t('register.emailPlaceholder')} value={formData.email}
            onChange={e => handleChange('email', e.target.value)} className="pl-9" disabled={isLoading} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="reg-pw">{t('register.password')}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="reg-pw" type={showPassword ? 'text' : 'password'} placeholder={t('register.passwordPlaceholder')}
            value={formData.password} onChange={e => handleChange('password', e.target.value)}
            className="pl-9 pr-10" disabled={isLoading} />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {formData.password && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={cn('h-1 flex-1 rounded-full transition-colors',
                  i <= passwordStrength.score ? passwordStrength.color : 'bg-muted')} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{passwordStrength.label}</p>
          </div>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="reg-cpw">{t('register.confirmPassword')}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="reg-cpw" type={showPassword ? 'text' : 'password'} placeholder={t('register.confirmPasswordPlaceholder')}
            value={formData.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)}
            className="pl-9" disabled={isLoading} />
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Checkbox id="reg-terms" checked={formData.agreeTerms}
          onCheckedChange={val => handleChange('agreeTerms', !!val)} disabled={isLoading} />
        <Label htmlFor="reg-terms" className="text-sm leading-tight cursor-pointer">
          {t('register.agreeTerms')}
        </Label>
      </div>
    </div>
  );

  // ─── Step 1: Profile Info ──────────────────────────────────────────────────
  const renderProfileStep = () => (
    <div className="space-y-4">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarPreview || ''} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {formData.firstName ? formData.firstName[0].toUpperCase() : <User className="h-10 w-10" />}
            </AvatarFallback>
          </Avatar>
          <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors">
            <Camera className="h-4 w-4" />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>
        <p className="text-xs text-muted-foreground">{t('profile.photo.hint')}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="reg-fn">{t('register.firstName')}</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="reg-fn" placeholder={t('register.firstNamePlaceholder')} value={formData.firstName}
              onChange={e => handleChange('firstName', e.target.value)} className="pl-9" disabled={isLoading} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reg-ln">{t('register.lastName')}</Label>
          <Input id="reg-ln" placeholder={t('register.lastNamePlaceholder')} value={formData.lastName}
            onChange={e => handleChange('lastName', e.target.value)} disabled={isLoading} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-bio">{t('register.bio')}</Label>
        <Textarea id="reg-bio" placeholder={t('register.bioPlaceholder')} value={formData.bio}
          onChange={e => handleChange('bio', e.target.value)} className="min-h-[80px] resize-none"
          maxLength={300} disabled={isLoading} />
        <p className="text-xs text-muted-foreground text-right">{formData.bio?.length || 0}/300</p>
      </div>
    </div>
  );

  // ─── Step 2: Interests Selection ───────────────────────────────────────────
  const renderInterestsStep = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        {t('register.selectInterestsDescription')}
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {availableInterests.map(interest => {
          const isSelected = formData.interests?.includes(interest.id);
          return (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={cn(
                'flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-sm',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/30 hover:bg-accent/50 text-muted-foreground'
              )}
            >
              <div className={cn(
                'p-2 rounded-full',
                isSelected ? 'bg-primary/20' : 'bg-muted'
              )}>
                {interest.icon || <Star className="h-4 w-4" />}
              </div>
              <span className="text-xs font-medium text-center leading-tight">{interest.label}</span>
              {isSelected && <Check className="h-3 w-3" />}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground text-center">
        {t('register.selectedInterests', { count: formData.interests?.length || 0 })}
      </p>
    </div>
  );

  // ─── Step 3: Phone Verification (Optional) ────────────────────────────────
  const renderPhoneVerificationStep = () => (
    <div className="space-y-4">
      {!otpVerified ? (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="reg-phone">{t('register.phone')}</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="reg-phone" type="tel" placeholder={t('register.phonePlaceholder')} value={formData.phone}
                onChange={e => handleChange('phone', e.target.value)} className="pl-9" disabled={isLoading || otpSent} />
            </div>
          </div>

          {!otpSent ? (
            <Button onClick={handleSendOtp} disabled={isLoading || !formData.phone} className="w-full">
              {t('register.sendVerificationCode')}
            </Button>
          ) : (
            <div className="space-y-3">
              <Label>{t('auth.enterOtp')}</Label>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={formData.otpCode || ''}
                  onChange={val => handleChange('otpCode', val)} disabled={isLoading}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                    <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSendOtp} disabled={isLoading} className="flex-1">
                  {t('auth.resendOtp')}
                </Button>
                <Button onClick={handleVerifyOtp} disabled={isLoading} className="flex-1">
                  {t('auth.verify')}
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center space-y-3 py-4">
          <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
            <Check className="h-6 w-6 text-green-500" />
          </div>
          <p className="font-medium text-green-600">{t('register.phoneVerified')}</p>
          <p className="text-sm text-muted-foreground">{formData.phone}</p>
        </div>
      )}
    </div>
  );

  const stepTitles = useMemo(() => {
    const titles = [
      { title: t('register.steps.account'), icon: <Lock className="h-6 w-6 text-primary" />, desc: t('register.steps.accountDesc') },
      { title: t('register.steps.profile'), icon: <User className="h-6 w-6 text-primary" />, desc: t('register.steps.profileDesc') },
      { title: t('register.steps.interests'), icon: <Heart className="h-6 w-6 text-primary" />, desc: t('register.steps.interestsDesc') },
    ];
    if (phoneVerificationEnabled) {
      titles.push({ title: t('register.steps.verification'), icon: <Phone className="h-6 w-6 text-primary" />, desc: t('register.steps.verificationDesc') });
    }
    return titles;
  }, [phoneVerificationEnabled, t]);

  const renderCurrentStep = () => {
    switch (step) {
      case 0: return renderAccountStep();
      case 1: return renderProfileStep();
      case 2: return renderInterestsStep();
      case 3: return renderPhoneVerificationStep();
      default: return null;
    }
  };

  return (
    <div className={cn('flex items-center justify-center min-h-[60vh] px-4', className)}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          {logo && <div className="flex justify-center mb-2">{logo}</div>}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground px-2">
              <span>{t('onboarding.progressLabel', { current: step + 1, total: totalSteps })}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 pt-2">
            {stepTitles.map((_, i) => (
              <div key={i} className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                i < step && 'bg-primary text-primary-foreground',
                i === step && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                i > step && 'bg-muted text-muted-foreground'
              )}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-1 pt-2">
            {stepTitles[step]?.icon}
            <CardTitle className="text-xl">{stepTitles[step]?.title}</CardTitle>
            <CardDescription>{stepTitles[step]?.desc}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {renderCurrentStep()}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            {step > 0 ? (
              <Button variant="ghost" onClick={handleBack} className="gap-1">
                <ArrowLeft className="h-4 w-4" /> {t('common.back')}
              </Button>
            ) : <div />}
            <Button onClick={handleNext} disabled={isLoading} className="gap-1">
              {isLoading ? t('common.loading') : step === totalSteps - 1 ? t('register.createAccount') : t('common.next')}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>

          {/* Social login on first step */}
          {step === 0 && showSocialLogin && socialButtons && (
            <div className="mt-2">{socialButtons}</div>
          )}

          {/* Login redirect on first step */}
          {step === 0 && onLoginRedirect && (
            <p className="text-center text-sm text-muted-foreground">
              {t('register.haveAccount')}{' '}
              <button onClick={onLoginRedirect} className="text-primary font-medium hover:underline">
                {t('register.signIn')}
              </button>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
});
RegisterFlow.displayName = 'RegisterFlow';
