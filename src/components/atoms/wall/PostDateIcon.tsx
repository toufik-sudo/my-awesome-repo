import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import { emptyFn } from 'utils/general';
import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render datepicker icon for post
 */
const PostDateIcon = ({
  onClick = emptyFn,
  label = 'wall.posts.date',
  hasError = false,
  customInputClass = '',
  value = ''
}) => (
  <div onClick={onClick} className={`${hasError ? coreStyle.withDangerColor : ''} ${customInputClass}`}>
    <FontAwesomeIcon icon={faCalendarAlt} />
    {!value ? <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={label} /> : value}
  </div>
);

export default PostDateIcon;
