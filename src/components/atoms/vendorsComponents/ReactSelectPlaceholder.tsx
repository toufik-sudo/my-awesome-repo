import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import { HTML_TAGS } from '../../../constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component that renders react select placeholder
 *this is used for Programs page select
 *
 * @constructor
 */
const ReactSelectPlaceholder = () => {
  const { withFontBase, ml1 } = coreStyle;

  return (
    <div className={coreStyle['flex-center-vertical']}>
      <FontAwesomeIcon className={withFontBase} icon={faFilter} />
      <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id="label.filter" className={ml1} />
    </div>
  );
};

export default ReactSelectPlaceholder;
