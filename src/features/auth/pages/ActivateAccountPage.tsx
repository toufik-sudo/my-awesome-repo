import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LOGIN } from '@/constants/routes';
import { activateAccount } from '@/services/AuthService';

type ActivationStatus = 'loading' | 'success' | 'error';

/**
 * Account activation page component
 * Handles email verification token validation
 */
const ActivateAccountPage: React.FC = () => {
  const { uuid, token } = useParams<{ uuid: string; token: string }>();
  const navigate = useNavigate();
  const intl = useIntl();
  const [status, setStatus] = useState<ActivationStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleActivation = async () => {
      if (!uuid || !token) {
        setStatus('error');
        setErrorMessage(intl.formatMessage({ id: 'activation.error.invalidLink', defaultMessage: 'Invalid activation link' }));
        return;
      }

      try {
        const result = await activateAccount(uuid, token);
        
        if (result.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(result.error || intl.formatMessage({ id: 'activation.error.message' }));
        }
      } catch (error) {
        console.error('Activation failed:', error);
        setStatus('error');
        setErrorMessage(intl.formatMessage({ id: 'activation.error.message' }));
      }
    };

    handleActivation();
  }, [uuid, token, intl]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
              <p className="text-lg text-muted-foreground">
                {intl.formatMessage({ id: 'activation.loading', defaultMessage: 'Activating your account...' })}
              </p>
            </CardContent>
          </Card>
        );

      case 'success':
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary">
                {intl.formatMessage({ id: 'activation.success.title', defaultMessage: 'Account Activated!' })}
              </CardTitle>
              <CardDescription>
                {intl.formatMessage({ id: 'activation.success.message', defaultMessage: 'Your account has been successfully activated. You can now log in.' })}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate(LOGIN)} className="w-full">
                {intl.formatMessage({ id: 'activation.goToLogin', defaultMessage: 'Go to Login' })}
              </Button>
            </CardFooter>
          </Card>
        );

      case 'error':
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <XCircle className="h-16 w-16 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold text-destructive">
                {intl.formatMessage({ id: 'activation.error.title', defaultMessage: 'Activation Failed' })}
              </CardTitle>
              <CardDescription>
                {errorMessage || intl.formatMessage({ id: 'activation.error.message', defaultMessage: 'Unable to activate your account. The link may have expired.' })}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col space-y-2">
              <Button onClick={() => navigate(LOGIN)} className="w-full">
                {intl.formatMessage({ id: 'activation.goToLogin', defaultMessage: 'Go to Login' })}
              </Button>
            </CardFooter>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">RewardzAi</h1>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default ActivateAccountPage;
