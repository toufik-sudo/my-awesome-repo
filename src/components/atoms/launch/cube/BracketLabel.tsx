import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/launch/Brackets.module.scss';

/**
 * Atom component used to render a bracket label
 *
 * @param condition
 * @constructor
 */
const BracketLabel = ({ condition }) => {
  return (
    condition && (
      <DynamicFormattedMessage className={style.bracketLabel} tag={HTML_TAGS.SPAN} id={`label.${condition}`} />
    )
  );
};

export default BracketLabel;
