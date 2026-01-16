import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import RegisterPaymentMethodBlock from 'components/atoms/onboarding/RegisterPaymentMethodBlock';
import { DEFAULT } from 'constants/stories';
import { emptyFn } from 'utils/general';

const RegisterPaymentMethodBlockStory = storiesOf(
  'Atoms/Onboarding/Register payment method block story',
  {} as NodeModule
).add(DEFAULT, () => (
  <ProvidersWrapper>
    <RegisterPaymentMethodBlock index="1" textId={text('Text', 'text')} onClick={emptyFn} />
  </ProvidersWrapper>
));

export default RegisterPaymentMethodBlockStory;
