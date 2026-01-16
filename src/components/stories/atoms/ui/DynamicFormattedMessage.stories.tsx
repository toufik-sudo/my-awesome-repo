import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { DEFAULT } from 'constants/stories';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

const DynamicFormattedMessageStory = storiesOf('Atoms/Ui/Dynamic formatted message', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <DynamicFormattedMessage tag="div" id={text('Id', 'text')} />
    </ProvidersWrapper>
  ));

export default DynamicFormattedMessageStory;
