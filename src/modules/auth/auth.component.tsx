import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { Loader2, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, KeyRound, Building2, Shield, Star } from 'lucide-react';
import { authConfig } from './auth.config';
import { authService } from './auth.service';
import { ProfileCompletion } from './ProfileCompletion';
import { SSOLoginButtons } from '@/modules/shared/sso';
import { ssoConfig } from '@/modules/shared/sso/sso.config';
import logoImage from '@/assets/byootdz-logo.png';
import authHeroImage from '@/assets/auth-hero.jpg';

type SelectedAuthMethod = 'email' | 'phone';
type AuthView = 'login' | 'signup' | 'otp' | 'resetRequest' | 'resetVerify' | 'resetNewPassword' | 'verification' | 'profileCompletion';

const Auth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const getInitialMethod = (): SelectedAuthMethod => {
    if (authConfig.isOtpPostLogin && authConfig.allowEmail) return 'email';
    if (authConfig.allowEmail) return 'email';
    if (authConfig.allowPhone && authConfig.isOtpStandalone) return 'phone';
    return 'email';
  };

  const [view, setView] = useState<AuthView>('login');
  const [selectedMethod, setSelectedMethod] = useState<SelectedAuthMethod>(getInitialMethod());
  const showOtpInAuth = authConfig.showOtpInAuth;
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signupIdentifier, setSignupIdentifier] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [phoneForOtp, setPhoneForOtp] = useState('');
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationIdentifier, setVerificationIdentifier] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'phone'>('email');
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[\d\s\-+()]{8,20}$/.test(phone.replace(/\s/g, ''));

  const validateIdentifier = (value: string): boolean => {
    return selectedMethod === 'email' ? validateEmail(value) : validatePhone(value);
  };

  const getIdentifierError = (): string =>
    selectedMethod === 'email' ? t('auth.invalidEmail') : t('auth.invalidPhone');

  const getIdentifierRequiredError = (): string =>
    selectedMethod === 'email' ? t('auth.emailRequired') : t('auth.phoneRequired');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier) { toast.error(getIdentifierRequiredError()); return; }
    if (!validateIdentifier(loginIdentifier)) { toast.error(getIdentifierError()); return; }

    if (selectedMethod === 'phone' && showOtpInAuth) {
      setIsLoading(true);
      try {
        await authService.sendOtp(loginIdentifier);
        setPhoneForOtp(loginIdentifier);
        setView('otp');
        toast.success(t('auth.otpSent'));
      } catch { toast.error(t('auth.loginError')); }
      finally { setIsLoading(false); }
      return;
    }

    if (!loginPassword) { toast.error(t('auth.passwordRequired')); return; }

    setIsLoading(true);
    try {
      await login(loginIdentifier, loginPassword);
      toast.success(t('auth.loginSuccess'));
      navigate('/dashboard');
    } catch { toast.error(t('auth.loginError')); }
    finally { setIsLoading(false); }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpValue || otpValue.length !== 6) { toast.error(t('auth.otpRequired')); return; }
    setIsLoading(true);
    try {
      await authService.verifyOtp(phoneForOtp, otpValue);
      toast.success(t('auth.loginSuccess'));
      navigate('/dashboard');
    } catch { toast.error(t('auth.otpInvalid')); }
    finally { setIsLoading(false); }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try { await authService.sendOtp(phoneForOtp); toast.success(t('auth.otpResent')); }
    catch { toast.error(t('auth.loginError')); }
    finally { setIsLoading(false); }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      await authService.loginWithSocial(provider);
      toast.success(t('auth.loginSuccess'));
      navigate('/dashboard');
    } catch { toast.error(t('auth.loginError')); }
    finally { setIsLoading(false); }
  };

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetIdentifier) { toast.error(getIdentifierRequiredError()); return; }
    if (!validateIdentifier(resetIdentifier)) { toast.error(getIdentifierError()); return; }
    setIsLoading(true);
    try {
      await authService.sendPasswordResetCode(resetIdentifier);
      toast.success(resetIdentifier.includes('@') ? t('auth.resetCodeSentEmail') : t('auth.resetCodeSentPhone'));
      setView('resetVerify');
    } catch { toast.error(t('auth.resetError')); }
    finally { setIsLoading(false); }
  };

  const handleVerifyResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode || resetCode.length !== 6) { toast.error(t('auth.otpRequired')); return; }
    setIsLoading(true);
    try {
      const response = await authService.verifyResetCode(resetIdentifier, resetCode);
      setResetToken(response.token);
      setView('resetNewPassword');
      toast.success(t('common.success'));
    } catch { toast.error(t('auth.invalidResetCode')); }
    finally { setIsLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) { toast.error(t('auth.passwordRequired')); return; }
    if (newPassword.length < 8) { toast.error(t('auth.passwordMinLength')); return; }
    if (newPassword !== confirmNewPassword) { toast.error(t('auth.passwordMismatch')); return; }
    setIsLoading(true);
    try {
      await authService.resetPassword(resetToken, newPassword);
      toast.success(t('auth.resetSuccess'));
      setView('login');
      setResetIdentifier(''); setResetCode(''); setNewPassword(''); setConfirmNewPassword(''); setResetToken('');
    } catch { toast.error(t('auth.resetError')); }
    finally { setIsLoading(false); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupIdentifier) { toast.error(getIdentifierRequiredError()); return; }
    if (!validateIdentifier(signupIdentifier)) { toast.error(getIdentifierError()); return; }
    if (!signupPassword) { toast.error(t('auth.passwordRequired')); return; }
    if (signupPassword.length < 8) { toast.error(t('auth.passwordMinLength')); return; }
    if (signupPassword !== confirmPassword) { toast.error(t('auth.passwordMismatch')); return; }

    setIsLoading(true);
    try {
      const response: any = await signup(signupIdentifier, signupPassword);
      const userId = response?.id || response?.userId || response?.user?.id;
      if (userId) setPendingUserId(userId);

      setVerificationIdentifier(signupIdentifier);
      setVerificationMethod(selectedMethod);

      if (selectedMethod === 'email') {
        await authService.sendVerificationEmail(signupIdentifier);
        toast.success(t('auth.verificationEmailSent'));
      } else {
        await authService.sendVerificationOtp(signupIdentifier);
        toast.success(t('auth.verificationOtpSent'));
      }
      setView('verification');
    } catch { toast.error(t('auth.signupError')); }
    finally { setIsLoading(false); }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) { toast.error(t('auth.verificationCodeRequired')); return; }
    setIsLoading(true);
    try {
      if (verificationMethod === 'email') await authService.verifyEmail(verificationIdentifier, verificationCode);
      else await authService.verifyPhone(verificationIdentifier, verificationCode);
      toast.success(t('auth.verificationSuccess'));
      setView('profileCompletion');
    } catch { toast.error(t('auth.verificationError')); }
    finally { setIsLoading(false); }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      if (verificationMethod === 'email') {
        await authService.resendVerificationEmail(verificationIdentifier);
        toast.success(t('auth.verificationEmailResent'));
      } else {
        await authService.resendVerificationOtp(verificationIdentifier);
        toast.success(t('auth.verificationOtpResent'));
      }
    } catch { toast.error(t('auth.resendError')); }
    finally { setIsLoading(false); }
  };

  // Profile completion view
  if (view === 'profileCompletion' && pendingUserId) {
    return (
      <ProfileCompletion
        userId={pendingUserId}
        email={verificationMethod === 'email' ? verificationIdentifier : undefined}
        phoneNbr={verificationMethod === 'phone' ? verificationIdentifier : undefined}
      />
    );
  }

  const renderMethodSelector = () => {
    if (!authConfig.showMethodSelector || !showOtpInAuth) return null;
    return (
      <div className="mb-2">
        <RadioGroup
          value={selectedMethod}
          onValueChange={(value) => {
            setSelectedMethod(value as SelectedAuthMethod);
            setLoginIdentifier(''); setSignupIdentifier('');
          }}
          className="flex gap-4 justify-center"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="method-email" />
            <Label htmlFor="method-email" className="flex items-center gap-1.5 cursor-pointer text-sm">
              <Mail className="h-3.5 w-3.5" /> {t('auth.email')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="method-phone" />
            <Label htmlFor="method-phone" className="flex items-center gap-1.5 cursor-pointer text-sm">
              <Phone className="h-3.5 w-3.5" /> {t('auth.phone')}
            </Label>
          </div>
        </RadioGroup>
      </div>
    );
  };

  const renderIdentifierInput = (id: string, value: string, onChange: (v: string) => void) => {
    const isEmail = selectedMethod === 'email';
    return (
      <div className="space-y-1.5">
        <Label htmlFor={id} className="text-sm font-medium">{isEmail ? t('auth.email') : t('auth.phone')}</Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {isEmail ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
          </div>
          <Input
            id={id}
            type={isEmail ? 'email' : 'tel'}
            placeholder={isEmail ? 'name@example.com' : '+213 555 123 456'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isLoading}
            className="pl-10 h-12 bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)] transition-all rounded-xl"
          />
        </div>
      </div>
    );
  };

  const renderSocialButtons = () => {
    if (ssoConfig.enabled) return <SSOLoginButtons />;
    const socialProviders = [
      { name: 'google', label: 'Google', icon: '🔍' },
      { name: 'apple', label: 'Apple', icon: '🍎' },
    ];
    return (
      <div className="space-y-4">
        <div className="relative">
          <Separator className="my-4" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider">
              {t('auth.socialLogin')}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {socialProviders.map((provider) => (
            <Button
              key={provider.name}
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin(provider.name)}
              disabled={isLoading}
              className="h-11 font-medium hover:bg-muted/50 transition-all"
            >
              <span className="mr-2 text-base">{provider.icon}</span>
              {provider.label}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  // OTP view
  if (view === 'otp') {
    return (
      <AuthShell>
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <KeyRound className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{t('auth.enterOtp')}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t('auth.otpSent')}</p>
        </div>
        <form onSubmit={handleOtpVerification} className="space-y-5">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue} disabled={isLoading}>
              <InputOTPGroup>
                {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleResendOtp} disabled={isLoading} className="flex-1 h-11">{t('auth.resendOtp')}</Button>
            <Button type="submit" disabled={isLoading} className="flex-1 h-11">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('auth.verifyOtp')}
            </Button>
          </div>
          <Button type="button" variant="ghost" onClick={() => { setView('login'); setOtpValue(''); }} className="w-full">{t('common.cancel')}</Button>
        </form>
      </AuthShell>
    );
  }

  // Verification view
  if (view === 'verification') {
    return (
      <AuthShell>
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{t('auth.verifyAccount')}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {verificationMethod === 'email' ? t('auth.verificationEmailDescription') : t('auth.verificationOtpDescription')}
          </p>
        </div>
        <form onSubmit={handleVerification} className="space-y-5">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode} disabled={isLoading}>
              <InputOTPGroup>
                {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleResendVerification} disabled={isLoading} className="flex-1 h-11">{t('auth.resendCode')}</Button>
            <Button type="submit" disabled={isLoading} className="flex-1 h-11">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('auth.verify')}
            </Button>
          </div>
          <Button type="button" variant="ghost" onClick={() => { setView('login'); setVerificationCode(''); }} className="w-full">{t('common.cancel')}</Button>
        </form>
      </AuthShell>
    );
  }

  // Reset password views
  if (view === 'resetRequest' || view === 'resetVerify' || view === 'resetNewPassword') {
    return (
      <AuthShell>
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <KeyRound className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{t('auth.resetPasswordTitle')}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {view === 'resetRequest' ? t('auth.resetPasswordDescription') : view === 'resetVerify' ? t('auth.enterResetCode') : t('auth.newPassword')}
          </p>
        </div>
        {view === 'resetRequest' && (
          <form onSubmit={handleSendResetCode} className="space-y-5">
            {renderMethodSelector()}
            {renderIdentifierInput('reset-identifier', resetIdentifier, setResetIdentifier)}
            <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('auth.sendResetCode')}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setView('login')} className="w-full">{t('auth.backToLogin')}</Button>
          </form>
        )}
        {view === 'resetVerify' && (
          <form onSubmit={handleVerifyResetCode} className="space-y-5">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={resetCode} onChange={setResetCode} disabled={isLoading}>
                <InputOTPGroup>
                  {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('common.confirm')}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setView('login')} className="w-full">{t('auth.backToLogin')}</Button>
          </form>
        )}
        {view === 'resetNewPassword' && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="new-password" className="text-sm font-medium">{t('auth.newPassword')}</Label>
              <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isLoading} className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-new-password" className="text-sm font-medium">{t('auth.confirmPassword')}</Label>
              <Input id="confirm-new-password" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} disabled={isLoading} className="h-11" />
            </div>
            <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('auth.resetPassword')}
            </Button>
          </form>
        )}
      </AuthShell>
    );
  }

  // Main login/signup view
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Immersive Hero */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <img
          src={authHeroImage}
          alt="Luxury villa"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        {/* Content over hero */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          {/* Top - Logo */}
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="ByootDZ" className="w-12 h-12 rounded-xl shadow-lg ring-2 ring-white/20" />
            <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              ByootDZ
            </span>
          </div>

          {/* Bottom - Text & Stats */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {t('common.welcome')}
              </h1>
              <p className="text-lg text-white/75 max-w-lg leading-relaxed">
                {t('auth.description')}
              </p>
            </div>

            {/* Stats bar */}
            <div className="flex gap-1">
              {[
                { value: '10K+', label: t('byootdz.stats.properties') || 'Properties', icon: Building2 },
                { value: '50K+', label: t('byootdz.stats.users') || 'Users', icon: Shield },
                { value: '4.9', label: t('byootdz.stats.rating') || 'Rating', icon: Star },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex-1 backdrop-blur-md bg-white/10 border border-white/10 p-4 ${
                    i === 0 ? 'rounded-l-xl' : i === 2 ? 'rounded-r-xl' : ''
                  }`}
                >
                  <stat.icon className="h-4 w-4 text-white/50 mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/60 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <Shield className="h-3.5 w-3.5" />
              <span>{t('auth.trustedPlatform') || 'Trusted by property owners across Algeria'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Forms */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />

        <div className="w-full max-w-[420px] relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img src={logoImage} alt="ByootDZ" className="w-10 h-10 rounded-xl shadow-md" />
            <span className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>ByootDZ</span>
          </div>

          {/* Toggle between login/signup */}
          <div className="flex bg-muted/60 rounded-xl p-1 mb-8 shadow-inner">
            <button
              type="button"
              onClick={() => setView('login')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                view === 'login'
                  ? 'bg-background text-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('auth.login')}
            </button>
            <button
              type="button"
              onClick={() => setView('signup')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                view === 'signup'
                  ? 'bg-background text-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('auth.signup')}
            </button>
          </div>

          {view === 'login' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                  {t('auth.login')}
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  {t('auth.loginSubtitle') || t('auth.description')}
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {renderMethodSelector()}
                {renderIdentifierInput('login-identifier', loginIdentifier, setLoginIdentifier)}

                {(selectedMethod === 'email' || !showOtpInAuth) && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" className="text-sm font-medium">{t('auth.password')}</Label>
                      <button
                        type="button"
                        onClick={() => setView('resetRequest')}
                        className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        {t('auth.forgotPassword')}
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        disabled={isLoading}
                        className="pl-10 pr-10 h-12 bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)] transition-all rounded-xl"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 font-semibold text-sm group rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  )}
                  {selectedMethod === 'phone' && showOtpInAuth ? t('auth.verifyOtp') : t('auth.login')}
                </Button>
              </form>

              {renderSocialButtons()}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                  {t('auth.signup')}
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  {t('auth.signupSubtitle') || t('auth.description')}
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                {renderMethodSelector()}
                {renderIdentifierInput('signup-identifier', signupIdentifier, setSignupIdentifier)}

                <div className="space-y-1.5">
                  <Label htmlFor="signup-password" className="text-sm font-medium">{t('auth.password')}</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input
                      id="signup-password"
                      type={showSignupPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      disabled={isLoading}
                      className="pl-10 pr-10 h-12 bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)] transition-all rounded-xl"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">{t('auth.confirmPassword')}</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className="pl-10 h-12 bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)] transition-all rounded-xl"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 font-semibold text-sm group rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  )}
                  {t('auth.signup')}
                </Button>
              </form>

              {renderSocialButtons()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Shared shell for secondary views (OTP, reset, verification)
const AuthShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
    <div className="w-full max-w-[440px] bg-card border border-border/50 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
      {children}
    </div>
  </div>
);

export default Auth;
