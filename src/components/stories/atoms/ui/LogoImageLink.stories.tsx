import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import LogoImageLink from 'components/atoms/ui/LogoImageLink';
import { LOGO_URL } from 'constants/stories';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { setBackgrounds } from 'services/StoriesServices';
import LogoUrl from 'components/atoms/ui/LogoUrl';

const LogoImageLinkStory = storiesOf('Atoms/Ui/Logo image link', {} as NodeModule)
  .addParameters(setBackgrounds())
  .addDecorator(withKnobs)
  .add(LOGO_URL.LOGO_1, () => (
    <ProvidersWrapper>
      <LogoImageLink className="" />
    </ProvidersWrapper>
  ))
  .add(LOGO_URL.LOGO_2, () => (
    <ProvidersWrapper>
      <LogoUrl />
    </ProvidersWrapper>
  ));

export default LogoImageLinkStory;
