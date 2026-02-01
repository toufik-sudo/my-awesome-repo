import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LOGIN } from '@/constants/routes';
import Loading from '@/components/common/Loading';
import { resetPassword } from '@/services/AuthService';

const passwordResetSchema = z.object({
  password: z.string().min(8, 'validation.password.minLength'),
  confirmPassword: z.string().min(1, 'validation.required')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'validation.password.mismatch',
  path: ['confirmPassword'],
});

type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

interface PasswordResetFormProps {
  onSubmit?: (data: PasswordResetFormData & { token: string }) => Promise<void>;
}

/**
 * Password reset form component
 */
const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const intl = useIntl();
  const { token } = useParams<{ token: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema)
  });

  const handleFormSubmit = async (data: PasswordResetFormData) => {
    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      if (onSubmit) {
        await onSubmit({ ...data, token });
      } else {
        const result = await resetPassword(token, data.password);
        if (result.success) {
          setSuccess(true);
        } else {
          setError(result.error || intl.formatMessage({ id: 'error.passwordReset.failed' }));
        }
      }
    } catch (err) {
      setError(intl.formatMessage({ id: 'error.passwordReset.failed' }));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-green-600">
            {intl.formatMessage({ id: 'form.passwordReset.success.title' })}
          </CardTitle>
          <CardDescription className="text-center">
            {intl.formatMessage({ id: 'form.passwordReset.success.message' })}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate(LOGIN)} className="w-full">
            {intl.formatMessage({ id: 'form.passwordReset.backToLogin' })}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {intl.formatMessage({ id: 'form.passwordReset.title' })}
        </CardTitle>
        <CardDescription className="text-center">
          {intl.formatMessage({ id: 'form.passwordReset.description' })}
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
            <Label htmlFor="password">
              {intl.formatMessage({ id: 'form.password.new.label' })}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={intl.formatMessage({ id: 'form.password.placeholder' })}
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {intl.formatMessage({ id: errors.password.message || 'validation.required' })}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {intl.formatMessage({ id: 'form.password.confirm.label' })}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={intl.formatMessage({ id: 'form.password.confirm.placeholder' })}
              {...register('confirmPassword')}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {intl.formatMessage({ id: errors.confirmPassword.message || 'validation.required' })}
              </p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loading size="sm" /> : intl.formatMessage({ id: 'form.passwordReset.submit' })}
          </Button>
          
          <button
            type="button"
            onClick={() => navigate(LOGIN)}
            className="text-sm text-primary hover:underline"
          >
            {intl.formatMessage({ id: 'form.passwordReset.backToLogin' })}
          </button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PasswordResetForm;
