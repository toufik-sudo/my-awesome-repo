import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import LanguageSwitcher from 'components/atoms/ui/LanguageSwitcher';
import { DEFAULT } from 'constants/stories';
import { emptyFn } from 'utils/general';

storiesOf('Atoms/Ui/Language switcher', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => <LanguageSwitcher handleLanguageChange={emptyFn} selectedLanguage={emptyFn} />);
