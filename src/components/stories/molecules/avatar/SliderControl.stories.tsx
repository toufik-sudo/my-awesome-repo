import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import SliderControl from 'components/molecules/avatar/SliderControl';
import { DEFAULT } from 'constants/stories';
import { emptyFn } from 'utils/general';
import { ZOOM } from 'constants/personalInformation';

const SliderControlStory = storiesOf('Molecules/Avatar/Slider control', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <SliderControl
        type={ZOOM}
        config={{ min: 0, max: 100 }}
        setValue={emptyFn}
        value={{ zoom: 1, rotate: 0, name: '' }}
      />
    </ProvidersWrapper>
  ));

export default SliderControlStory;
