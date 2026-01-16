import React from 'react';
import { components } from 'react-select';

import { DynamicFormattedMessage } from '../ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

/**
 * Atom component used to show file upload option for post.
 * @param props
 */
const PostFileTypeOption = props => (
  <components.Option {...props} value={props.data}>
    <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={props.label} />
  </components.Option>
);

export default PostFileTypeOption;
