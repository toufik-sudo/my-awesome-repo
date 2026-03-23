/**
 * SSO Login Buttons Component
 * Renders available SSO provider buttons
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSSO } from './useSSO';
import type { SSOProviderName, SSOModuleInput } from './sso.types';

interface SSOLoginButtonsProps {
  ssoInput?: SSOModuleInput;
  className?: string;
}

const PROVIDER_META: Record<SSOProviderName, { icon: string; label: string; hoverClass: string }> = {
  google: { icon: '🔍', label: 'Google', hoverClass: 'hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950' },
  microsoft: { icon: '🪟', label: 'Microsoft', hoverClass: 'hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950' },
  apple: { icon: '🍎', label: 'Apple', hoverClass: 'hover:bg-gray-50 hover:border-gray-200 dark:hover:bg-gray-900' },
  facebook: { icon: '📘', label: 'Facebook', hoverClass: 'hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950' },
  github: { icon: '🐙', label: 'GitHub', hoverClass: 'hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-gray-900' },
};

export const SSOLoginButtons: React.FC<SSOLoginButtonsProps> = ({ ssoInput, className }) => {
  const { t } = useTranslation();
  const { isEnabled, providers, login, isLoading } = useSSO(ssoInput);

  if (!isEnabled || providers.length === 0) return null;

  const handleProviderLogin = (provider: SSOProviderName) => {
    login(provider);
  };

  return (
    <div className={className}>
      <div className="relative">
        <Separator className="my-4" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-background px-2 text-xs text-muted-foreground">
            {t('auth.ssoLogin')}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-2">
        {providers.map((provider) => {
          const meta = PROVIDER_META[provider];
          if (!meta) return null;
          return (
            <Button
              key={provider}
              type="button"
              variant="outline"
              onClick={() => handleProviderLogin(provider)}
              disabled={isLoading}
              className={`w-full transition-colors ${meta.hoverClass}`}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <span className="mr-2 text-lg">{meta.icon}</span>
              )}
              {meta.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
