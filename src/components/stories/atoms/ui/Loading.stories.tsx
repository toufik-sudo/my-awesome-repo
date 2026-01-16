import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, withKnobs } from '@storybook/addon-knobs';

import { DEFAULT } from 'constants/stories';
import Loading from 'components/atoms/ui/Loading';
import { LOADER_TYPE } from 'constants/general';

storiesOf('Atoms/Ui/Loading', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => <Loading type={select('Type', LOADER_TYPE, LOADER_TYPE.DROPZONE)} />);
