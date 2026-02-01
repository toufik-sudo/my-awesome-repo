import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LOGIN } from '@/constants/routes';
import Loading from '@/components/common/Loading';
import { forgotPassword } from '@/services/AuthService';

const forgotPasswordSchema = z.object({
  email: z.string().email('validation.email.invalid').min(1, 'validation.required')
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSubmit?: (data: ForgotPasswordFormData) => Promise<void>;
  onSuccess?: () => void;
}

/**
 * Forgot password form component
 */
const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmit, onSuccess }) => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const handleFormSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (onSubmit) {
        await onSubmit(data);
        setSuccess(true);
        onSuccess?.();
      } else {
        // Use AuthService to send reset email
        const result = await forgotPassword(data.email);
        
        if (result.success) {
          setSuccess(true);
          onSuccess?.();
        } else {
          setError(result.error || intl.formatMessage({ id: 'error.generic' }));
        }
      }
    } catch (err) {
      setError(intl.formatMessage({ id: 'error.generic' }));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {intl.formatMessage({ id: 'modal.success.title.reset' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            {intl.formatMessage({ id: 'modal.success.body.reset' })}
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate(LOGIN)} 
            className="w-full"
          >
            {intl.formatMessage({ id: 'modal.success.button.reset' })}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {intl.formatMessage({ id: 'form.forgot.title' })}
        </CardTitle>
        <CardDescription className="text-center">
          {intl.formatMessage({ id: 'form.email.placeholder' })}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">
              {intl.formatMessage({ id: 'form.email.label' })}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={intl.formatMessage({ id: 'form.email.placeholder' })}
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {intl.formatMessage({ id: errors.email.message || 'validation.required' })}
              </p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loading size="sm" /> : intl.formatMessage({ id: 'form.forgot.submit' })}
          </Button>
          
          <button
            type="button"
            onClick={() => navigate(LOGIN)}
            className="text-sm text-primary hover:underline"
          >
            {intl.formatMessage({ id: 'form.forgot.back' })}
          </button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ForgotPasswordForm;
