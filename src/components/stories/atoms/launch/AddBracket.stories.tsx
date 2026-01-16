import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import AddBracket from 'components/atoms/launch/cube/AddBracket';
import { DEFAULT } from 'constants/stories';
import { getSampleAction } from 'services/StoriesServices';
import { RANKING } from 'constants/wall/launch';

const AddBracketStory = storiesOf('Atoms/Launch/Add Bracket', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <AddBracket onClick={getSampleAction()} type={RANKING} />
    </ProvidersWrapper>
  ));

export default AddBracketStory;
