import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CONFIDENTIALITY_OPTIONS_ICONS } from 'constants/wall/posts';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { getSelectedOption } from 'services/WallServices';

/**
 * Atom component used to render an icon
 * @param confidentialityType
 * @param isCreatingPost
 * @constructor
 */
const PostConfidentialityIcon = (confidentialityType, isCreatingPost) => {
  const confidentialitySelectedValue = getSelectedOption(confidentialityType);
  return (
    <p>
      <FontAwesomeIcon icon={CONFIDENTIALITY_OPTIONS_ICONS[confidentialitySelectedValue.type]} />
      {isCreatingPost ? <DynamicFormattedMessage id={confidentialitySelectedValue.label} tag={HTML_TAGS.SPAN} /> : ''}
    </p>
  );
};

export default PostConfidentialityIcon;
