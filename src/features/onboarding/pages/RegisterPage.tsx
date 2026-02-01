// -----------------------------------------------------------------------------
// Register Page
// Full-page registration with multi-step form
// -----------------------------------------------------------------------------

import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MultiStepRegisterForm } from '../components';
import { LOGIN_PAGE_ROUTE } from '@/constants/routes';

const RegisterPage: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">RewardzAi</h1>
        </div>

        {/* Registration Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>
              {formatMessage({ id: 'register.title', defaultMessage: 'Create Account' })}
            </CardTitle>
            <CardDescription>
              {formatMessage({ id: 'register.subtitle', defaultMessage: 'Join our rewards platform' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MultiStepRegisterForm />

            {/* Login link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {formatMessage({ id: 'register.hasAccount', defaultMessage: 'Already have an account?' })}{' '}
              </span>
              <Link to={LOGIN_PAGE_ROUTE} className="text-primary font-medium hover:underline">
                {formatMessage({ id: 'register.signIn', defaultMessage: 'Sign in' })}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
