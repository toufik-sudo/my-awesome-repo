import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import LanguageSwitcher from 'components/atoms/ui/LanguageSwitcher';

describe('Language Switcher', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <LanguageSwitcher handleLanguageChange={jest.fn()} selectedLanguage={jest.fn()} />
      </ProvidersWrapper>
    );
  });
});
