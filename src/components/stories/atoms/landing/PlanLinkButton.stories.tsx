import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, withKnobs } from '@storybook/addon-knobs';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import PlanLinkButton from 'components/atoms/landing/PlanLinkButton';
import { DEFAULT } from 'constants/stories';
import { FREEMIUM, PREMIUM } from 'constants/routes';

const PlanLinkButtonStory = storiesOf('Atoms/Landing/Plan link button', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <PlanLinkButton content={{ name: select('Plans', [FREEMIUM, PREMIUM], FREEMIUM), id: 1 }} />
    </ProvidersWrapper>
  ));

export default PlanLinkButtonStory;
