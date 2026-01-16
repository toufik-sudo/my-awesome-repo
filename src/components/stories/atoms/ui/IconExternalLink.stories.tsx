import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import IconExternalLink from 'components/atoms/ui/IconExternalLink';
import { DEFAULT } from 'constants/stories';
import { LINKEDIN, LINKEDIN_LINK } from 'constants/footer';

const IconExternalLinkStory = storiesOf('Atoms/Ui/Icon external link', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => <IconExternalLink icon={{ platform: LINKEDIN, url: LINKEDIN_LINK }} />);

export default IconExternalLinkStory;
