import React, { ReactNode } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { useLanguage } from '@/hooks/i18n/useLanguage';

interface IntlProviderProps {
  children: ReactNode;
}

/**
 * Internationalization provider that wraps the app
 * Uses Redux to manage language state
 */
const IntlProvider: React.FC<IntlProviderProps> = ({ children }) => {
  const { selectedLanguage, messages } = useLanguage();

  return (
    <ReactIntlProvider
      locale={selectedLanguage.value}
      messages={messages}
      defaultLocale="en"
      onError={(err) => {
        // Suppress missing translation warnings in development
        if (err.code === 'MISSING_TRANSLATION') {
          console.warn('Missing translation:', err.message);
          return;
        }
        throw err;
      }}
    >
      {children}
    </ReactIntlProvider>
  );
};

export default IntlProvider;
