import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';
import { faHome } from '@fortawesome/free-solid-svg-icons';

import LeftNavigationElement from 'components/atoms/wall/LeftNavigationElement';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { DEFAULT } from 'constants/stories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { emptyFn } from 'utils/general';

const LeftNavigationElementStory = storiesOf('Atoms/Wall/Left navigation element', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <LeftNavigationElement
        closeNav={emptyFn}
        title={text('Title', 'title')}
        icon={<FontAwesomeIcon icon={faHome} />}
        url={text('Url', 'url')}
      />
    </ProvidersWrapper>
  ));

export default LeftNavigationElementStory;
