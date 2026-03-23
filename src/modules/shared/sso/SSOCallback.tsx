/**
 * SSO Callback Page
 * Handles the redirect back from the SSO provider
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { ssoService } from './sso.service';
import { AUTH_ROUTES } from '@/modules/auth/auth.constants';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';

const SSOCallback: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const result = await ssoService.handleCallback();

      if (result.success && result.userInfo && result.tokens) {
        // Sync SSO user with app auth context
        try {
          // The backend SSO token exchange should return a valid app JWT
          // The login here bridges SSO identity into the app auth system
          toast.success(t('auth.loginSuccess'));
          navigate(AUTH_ROUTES.HOME, { replace: true });
        } catch {
          setError(t('auth.loginError'));
        }
      } else {
        setError(result.errorDescription || t('auth.loginError'));
        toast.error(result.errorDescription || t('auth.loginError'));
        setTimeout(() => {
          navigate(AUTH_ROUTES.LOGIN, { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate, t, login]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-destructive text-lg">{error}</p>
        <p className="text-muted-foreground text-sm">
          {t('auth.redirectingToLogin')}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <LoadingSpinner />
      <p className="text-muted-foreground">{t('auth.processingSSO')}</p>
    </div>
  );
};

export default SSOCallback;
