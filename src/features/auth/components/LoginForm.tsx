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
import { FORGOT_PASSWORD, CREATE_ACCOUNT, WALL } from '@/constants/routes';
import Loading from '@/components/common/Loading';
import { useAuth } from '../hooks/useAuth';
import { HTTP_USER_NOT_ACTIVATED } from '@/services/AuthService';

const loginSchema = z.object({
  email: z.string().email('validation.email.invalid').min(1, 'validation.required'),
  password: z.string().min(1, 'validation.required')
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => Promise<void>;
}

/**
 * Login form component with email and password fields
 */
const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const intl = useIntl();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Call the auth service login
        const result = await login({ email: data.email, password: data.password });
        
        if (result.success) {
          console.log('Login successful:', result.decodedToken);
          navigate(WALL);
        } else {
          // Handle specific error codes
          if (result.errorCode === HTTP_USER_NOT_ACTIVATED) {
            setError(intl.formatMessage({ id: 'error.login.notActivated' }));
          } else {
            setError(result.error || intl.formatMessage({ id: 'error.login.failed' }));
          }
        }
      }
    } catch (err) {
      setError(intl.formatMessage({ id: 'error.login.failed' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {intl.formatMessage({ id: 'form.login.title' })}
        </CardTitle>
        <CardDescription className="text-center">
          {intl.formatMessage({ id: 'landing.title.incentive' })} {intl.formatMessage({ id: 'landing.title.relationship' })}
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
          
          <div className="space-y-2">
            <Label htmlFor="password">
              {intl.formatMessage({ id: 'form.password.label' })}
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
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loading size="sm" /> : intl.formatMessage({ id: 'form.login.submit' })}
          </Button>
          
          <div className="flex flex-col space-y-2 text-center text-sm">
            <button
              type="button"
              onClick={() => navigate(FORGOT_PASSWORD)}
              className="text-primary hover:underline"
            >
              {intl.formatMessage({ id: 'form.login.forgot' })}
            </button>
            
            <span className="text-muted-foreground">
              {intl.formatMessage({ id: 'form.login.noAccount' })}{' '}
              <button
                type="button"
                onClick={() => navigate(CREATE_ACCOUNT)}
                className="text-primary hover:underline"
              >
                {intl.formatMessage({ id: 'form.login.signUp' })}
              </button>
            </span>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
