import React from 'react';
import { FormattedMessage } from 'react-intl';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { DEFAULT } from 'constants/stories';

const TabItemStory = storiesOf('Atoms/Launch/Tab item', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <FontAwesomeIcon icon={faPlus} />
      <FormattedMessage id={text('Id', 'text')} />
    </ProvidersWrapper>
  ));

export default TabItemStory;
