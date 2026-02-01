// -----------------------------------------------------------------------------
// Registration Step Components
// Multi-step form components for user registration
// -----------------------------------------------------------------------------

import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { RegisterData, CIVILITY_OPTIONS, PasswordValidation, validationRules } from '../types';
import { ArrowLeft, ArrowRight, Check, Loader2, Upload, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const fadeIn = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 }
};

interface StepProps {
  data: RegisterData;
  updateData: (data: Partial<RegisterData>) => void;
  onNext: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

// Step 1: Civility Selection
export const CivilityStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, canGoBack }) => {
  const { formatMessage } = useIntl();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.title) {
      onNext();
    }
  };

  return (
    <motion.form {...fadeIn} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          {formatMessage({ id: 'register.civility.title', defaultMessage: 'How should we address you?' })}
        </h2>
        <p className="text-muted-foreground">
          {formatMessage({ id: 'register.civility.subtitle', defaultMessage: 'Select your preferred title' })}
        </p>
      </div>

      <RadioGroup
        value={data.title || ''}
        onValueChange={(value) => updateData({ title: value })}
        className="grid grid-cols-2 gap-4"
      >
        {CIVILITY_OPTIONS.map((option) => (
          <Label
            key={option.value}
            htmlFor={option.value}
            className={cn(
              "flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all",
              data.title === option.value
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            )}
          >
            <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
            <span className="font-medium">{option.label}</span>
          </Label>
        ))}
      </RadioGroup>

      <div className="flex gap-4 pt-4">
        {canGoBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {formatMessage({ id: 'common.back', defaultMessage: 'Back' })}
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={!data.title}>
          {formatMessage({ id: 'common.continue', defaultMessage: 'Continue' })}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.form>
  );
};

// Step 2: Name Input
export const NameStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, canGoBack }) => {
  const { formatMessage } = useIntl();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onNext();
    }
  };

  const isValid = data.firstName && 
    data.firstName.length >= validationRules.firstName.minLength &&
    data.lastName && 
    data.lastName.length >= validationRules.lastName.minLength;

  return (
    <motion.form {...fadeIn} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          {formatMessage({ id: 'register.name.title', defaultMessage: "What's your name?" })}
        </h2>
        <p className="text-muted-foreground">
          {formatMessage({ id: 'register.name.subtitle', defaultMessage: 'Enter your first and last name' })}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            {formatMessage({ id: 'register.firstName', defaultMessage: 'First Name' })} *
          </Label>
          <Input
            id="firstName"
            value={data.firstName || ''}
            onChange={(e) => updateData({ firstName: e.target.value })}
            placeholder={formatMessage({ id: 'register.firstName.placeholder', defaultMessage: 'John' })}
            autoFocus
            maxLength={validationRules.firstName.maxLength}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            {formatMessage({ id: 'register.lastName', defaultMessage: 'Last Name' })} *
          </Label>
          <Input
            id="lastName"
            value={data.lastName || ''}
            onChange={(e) => updateData({ lastName: e.target.value })}
            placeholder={formatMessage({ id: 'register.lastName.placeholder', defaultMessage: 'Doe' })}
            maxLength={validationRules.lastName.maxLength}
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        {canGoBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {formatMessage({ id: 'common.back', defaultMessage: 'Back' })}
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={!isValid}>
          {formatMessage({ id: 'common.continue', defaultMessage: 'Continue' })}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.form>
  );
};

// Step 3: Contact (Email + Phone)
export const ContactStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, canGoBack }) => {
  const { formatMessage } = useIntl();
  const [emailError, setEmailError] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.email || !validationRules.email.pattern.test(data.email)) {
      setEmailError(formatMessage({ id: 'validation.email.invalid', defaultMessage: 'Please enter a valid email address' }));
      return;
    }
    setEmailError(null);
    onNext();
  };

  const isEmailValid = data.email && validationRules.email.pattern.test(data.email);
  const isPhoneValid = !data.phone || validationRules.phone.pattern.test(data.phone);

  return (
    <motion.form {...fadeIn} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          {formatMessage({ id: 'register.contact.title', defaultMessage: 'How can we reach you?' })}
        </h2>
        <p className="text-muted-foreground">
          {formatMessage({ id: 'register.contact.subtitle', defaultMessage: 'Your email will be used to sign in' })}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            {formatMessage({ id: 'register.email', defaultMessage: 'Email Address' })} *
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email || ''}
            onChange={(e) => {
              updateData({ email: e.target.value });
              setEmailError(null);
            }}
            placeholder={formatMessage({ id: 'register.email.placeholder', defaultMessage: 'john@example.com' })}
            autoFocus
            className={emailError ? 'border-destructive' : ''}
          />
          {emailError && (
            <p className="text-sm text-destructive">{emailError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            {formatMessage({ id: 'register.phone', defaultMessage: 'Phone Number' })}
            <span className="text-muted-foreground ml-1">
              ({formatMessage({ id: 'common.optional', defaultMessage: 'optional' })})
            </span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone || ''}
            onChange={(e) => updateData({ phone: e.target.value })}
            placeholder={formatMessage({ id: 'register.phone.placeholder', defaultMessage: '+1 (555) 123-4567' })}
            className={!isPhoneValid ? 'border-destructive' : ''}
          />
          {!isPhoneValid && (
            <p className="text-sm text-destructive">
              {formatMessage({ id: 'validation.phone.invalid', defaultMessage: 'Please enter a valid phone number' })}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        {canGoBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {formatMessage({ id: 'common.back', defaultMessage: 'Back' })}
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={!isEmailValid || !isPhoneValid}>
          {formatMessage({ id: 'common.continue', defaultMessage: 'Continue' })}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.form>
  );
};

// Step 4: Avatar Upload
export const AvatarStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, canGoBack }) => {
  const { formatMessage } = useIntl();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        return;
      }
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      updateData({ avatar: file, avatarPreview: previewUrl });
    }
  };

  const handleRemoveAvatar = () => {
    if (data.avatarPreview) {
      URL.revokeObjectURL(data.avatarPreview);
    }
    updateData({ avatar: null, avatarPreview: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = () => {
    const first = data.firstName?.[0] || '';
    const last = data.lastName?.[0] || '';
    return (first + last).toUpperCase();
  };

  return (
    <motion.div {...fadeIn} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          {formatMessage({ id: 'register.avatar.title', defaultMessage: 'Add a profile photo' })}
        </h2>
        <p className="text-muted-foreground">
          {formatMessage({ id: 'register.avatar.subtitle', defaultMessage: 'This helps others recognize you (optional)' })}
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="h-32 w-32">
            {data.avatarPreview ? (
              <AvatarImage src={data.avatarPreview} alt="Profile preview" />
            ) : (
              <AvatarFallback className="text-2xl bg-primary/10">
                {getInitials() || <User className="h-12 w-12 text-muted-foreground" />}
              </AvatarFallback>
            )}
          </Avatar>
          
          {data.avatarPreview && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
              onClick={handleRemoveAvatar}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {data.avatarPreview
            ? formatMessage({ id: 'register.avatar.change', defaultMessage: 'Change Photo' })
            : formatMessage({ id: 'register.avatar.upload', defaultMessage: 'Upload Photo' })
          }
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          {formatMessage({ id: 'register.avatar.hint', defaultMessage: 'JPG, PNG or GIF. Max 5MB.' })}
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        {canGoBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {formatMessage({ id: 'common.back', defaultMessage: 'Back' })}
          </Button>
        )}
        <Button type="button" className="flex-1" onClick={onNext}>
          {data.avatarPreview
            ? formatMessage({ id: 'common.continue', defaultMessage: 'Continue' })
            : formatMessage({ id: 'common.skip', defaultMessage: 'Skip for now' })
          }
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

// Step 5: Password Input with Strength Indicator
interface PasswordStepProps extends StepProps {
  validatePassword: (password: string) => PasswordValidation;
}

export const PasswordStep: React.FC<PasswordStepProps> = ({ 
  data, 
  updateData, 
  onNext,
  onBack, 
  canGoBack,
  validatePassword
}) => {
  const { formatMessage } = useIntl();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onNext();
    }
  };

  const passwordValidation = data.password ? validatePassword(data.password) : null;
  const passwordsMatch = data.password === data.passwordConfirmation;
  const isValid = passwordValidation?.isValid && passwordsMatch && data.passwordConfirmation;

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-500';
      case 'good': return 'bg-primary';
      case 'fair': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  const getStrengthWidth = (strength: string) => {
    switch (strength) {
      case 'strong': return 'w-full';
      case 'good': return 'w-3/4';
      case 'fair': return 'w-1/2';
      default: return 'w-1/4';
    }
  };

  return (
    <motion.form {...fadeIn} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          {formatMessage({ id: 'register.password.title', defaultMessage: 'Create a password' })}
        </h2>
        <p className="text-muted-foreground">
          {formatMessage({ id: 'register.password.subtitle', defaultMessage: 'Make it strong and memorable' })}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">
            {formatMessage({ id: 'register.password', defaultMessage: 'Password' })} *
          </Label>
          <Input
            id="password"
            type="password"
            value={data.password || ''}
            onChange={(e) => updateData({ password: e.target.value })}
            placeholder="••••••••"
            autoFocus
          />
          
          {/* Password strength indicator */}
          {data.password && passwordValidation && (
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-300",
                    getStrengthColor(passwordValidation.strength),
                    getStrengthWidth(passwordValidation.strength)
                  )} 
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {formatMessage({ id: `password.strength.${passwordValidation.strength}`, defaultMessage: passwordValidation.strength })}
              </p>
              
              {/* Validation requirements */}
              <ul className="text-xs space-y-1">
                <li className={passwordValidation.hasMinLength ? 'text-green-600' : 'text-muted-foreground'}>
                  {passwordValidation.hasMinLength ? '✓' : '○'} {formatMessage({ id: 'password.req.minLength', defaultMessage: 'At least 8 characters' })}
                </li>
                <li className={passwordValidation.hasUppercase ? 'text-green-600' : 'text-muted-foreground'}>
                  {passwordValidation.hasUppercase ? '✓' : '○'} {formatMessage({ id: 'password.req.uppercase', defaultMessage: 'One uppercase letter' })}
                </li>
                <li className={passwordValidation.hasLowercase ? 'text-green-600' : 'text-muted-foreground'}>
                  {passwordValidation.hasLowercase ? '✓' : '○'} {formatMessage({ id: 'password.req.lowercase', defaultMessage: 'One lowercase letter' })}
                </li>
                <li className={passwordValidation.hasNumber ? 'text-green-600' : 'text-muted-foreground'}>
                  {passwordValidation.hasNumber ? '✓' : '○'} {formatMessage({ id: 'password.req.number', defaultMessage: 'One number' })}
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="passwordConfirmation">
            {formatMessage({ id: 'register.passwordConfirmation', defaultMessage: 'Confirm Password' })} *
          </Label>
          <Input
            id="passwordConfirmation"
            type="password"
            value={data.passwordConfirmation || ''}
            onChange={(e) => updateData({ passwordConfirmation: e.target.value })}
            placeholder="••••••••"
          />
          {data.passwordConfirmation && !passwordsMatch && (
            <p className="text-sm text-destructive">
              {formatMessage({ id: 'register.password.mismatch', defaultMessage: 'Passwords do not match' })}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        {canGoBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {formatMessage({ id: 'common.back', defaultMessage: 'Back' })}
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={!isValid}>
          {formatMessage({ id: 'common.continue', defaultMessage: 'Continue' })}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.form>
  );
};

// Step 6: Terms & Conditions
interface TermsStepProps extends Omit<StepProps, 'onNext'> {
  onSubmit: () => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export const TermsStep: React.FC<TermsStepProps> = ({ 
  data, 
  updateData, 
  onBack, 
  canGoBack,
  onSubmit,
  isLoading,
  error
}) => {
  const { formatMessage } = useIntl();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.termsAccepted) {
      await onSubmit();
    }
  };

  return (
    <motion.form {...fadeIn} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          {formatMessage({ id: 'register.terms.title', defaultMessage: 'Almost there!' })}
        </h2>
        <p className="text-muted-foreground">
          {formatMessage({ id: 'register.terms.subtitle', defaultMessage: 'Please review and accept our terms' })}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 border rounded-lg">
          <Checkbox
            id="terms"
            checked={data.termsAccepted}
            onCheckedChange={(checked) => updateData({ termsAccepted: checked === true })}
          />
          <div className="space-y-1">
            <Label htmlFor="terms" className="font-normal cursor-pointer">
              {formatMessage(
                { id: 'register.terms.accept', defaultMessage: 'I accept the {terms} and {privacy}' },
                {
                  terms: (
                    <a href="/terms" target="_blank" className="text-primary hover:underline">
                      {formatMessage({ id: 'register.terms.termsLink', defaultMessage: 'Terms of Service' })}
                    </a>
                  ),
                  privacy: (
                    <a href="/privacy" target="_blank" className="text-primary hover:underline">
                      {formatMessage({ id: 'register.terms.privacyLink', defaultMessage: 'Privacy Policy' })}
                    </a>
                  ),
                }
              )}
            </Label>
            <p className="text-xs text-muted-foreground">
              {formatMessage({ id: 'register.terms.required', defaultMessage: 'Required to create an account' })}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 border rounded-lg">
          <Checkbox
            id="newsletter"
            checked={data.newsletterOptIn}
            onCheckedChange={(checked) => updateData({ newsletterOptIn: checked === true })}
          />
          <div className="space-y-1">
            <Label htmlFor="newsletter" className="font-normal cursor-pointer">
              {formatMessage({ id: 'register.newsletter.accept', defaultMessage: 'Send me news and updates' })}
            </Label>
            <p className="text-xs text-muted-foreground">
              {formatMessage({ id: 'register.newsletter.hint', defaultMessage: 'You can unsubscribe at any time' })}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        {canGoBack && (
          <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {formatMessage({ id: 'common.back', defaultMessage: 'Back' })}
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={!data.termsAccepted || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {formatMessage({ id: 'common.creating', defaultMessage: 'Creating account...' })}
            </>
          ) : (
            <>
              {formatMessage({ id: 'register.submit', defaultMessage: 'Create Account' })}
              <Check className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
};

// Step 7: Complete
interface CompleteStepProps {
  email: string;
  onLogin: () => void;
}

export const CompleteStep: React.FC<CompleteStepProps> = ({ email, onLogin }) => {
  const { formatMessage } = useIntl();

  return (
    <motion.div {...fadeIn} className="space-y-6 text-center">
      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
        <Check className="h-8 w-8 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          {formatMessage({ id: 'register.complete.title', defaultMessage: 'Account Created!' })}
        </h2>
        <p className="text-muted-foreground">
          {formatMessage(
            { id: 'register.complete.subtitle', defaultMessage: "We've sent a confirmation email to {email}" },
            { email: <strong>{email}</strong> }
          )}
        </p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        {formatMessage({ 
          id: 'register.complete.checkEmail', 
          defaultMessage: 'Please check your inbox and click the confirmation link to activate your account.' 
        })}
      </div>

      <Button onClick={onLogin} className="w-full">
        {formatMessage({ id: 'register.complete.login', defaultMessage: 'Go to Login' })}
      </Button>
    </motion.div>
  );
};
