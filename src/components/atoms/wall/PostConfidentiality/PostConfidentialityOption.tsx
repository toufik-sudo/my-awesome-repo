import React from 'react';
import { components } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { HTML_TAGS } from 'constants/general';
import { CONFIDENTIALITY_OPTIONS_ICONS, POST_CONFIDENTIALITY_TYPES } from 'constants/wall/posts';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'sass-boilerplate/stylesheets/components/wall/WallPostBaseBlock.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to show confidentiality option for post.
 * @param props
 */
const PostConfidentialityOption = props => {
  const { wallPostOption, wallPostOptionSelected } = style;
  const isDelete = props.data && props.data.type === POST_CONFIDENTIALITY_TYPES.DELETE;
  const { width15, withDangerColor } = coreStyle;
  const isDeletedClass = isDelete ? withDangerColor : '';

  return (
    <components.Option
      {...props}
      value={props.data}
      className={`${wallPostOption} ${
        props.selectProps.showIsSelected === props.data.type ? wallPostOptionSelected : ''
      } ${isDeletedClass}`}
    >
      <FontAwesomeIcon icon={CONFIDENTIALITY_OPTIONS_ICONS[props.data.type]} className={width15} />
      <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={props.label} />
    </components.Option>
  );
};

export default PostConfidentialityOption;
