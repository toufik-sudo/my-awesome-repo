import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import ContentsSelectionPreview from 'components/atoms/launch/contents/ContentsSelectionPreview';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { DEFAULT } from 'constants/stories';

import style from 'sass-boilerplate/stylesheets/pages/DesignIdentification.module.scss';

const ContentsSelectionPreviewStory = storiesOf('Molecules/Avatar/Avatar selection preview', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <ContentsSelectionPreview
        croppedAvatar="https://image.shutterstock.com/image-photo/beautiful-water-drop-on-dandelion-260nw-789676552.jpg"
        className={style.designCoverWrapper}
      />
    </ProvidersWrapper>
  ));

export default ContentsSelectionPreviewStory;
