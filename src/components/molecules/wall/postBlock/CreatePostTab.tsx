import React from 'react';
import { FormattedMessage } from 'react-intl';

import SpringAnimation from '../../animations/SpringAnimation';
import { setScale } from 'utils/animations';
import { DELAY_TYPES } from 'constants/animations';

/**
 * Molecule component used to render Create Post tab
 *
 * @textId
 * @constructor
 */
const CreatePostTab = ({ textId }) => {
  return (
    <SpringAnimation settings={setScale(DELAY_TYPES.NONE)}>
      <FormattedMessage id={`launchProgram.wall.${textId}`} />
    </SpringAnimation>
  );
};

export default CreatePostTab;
