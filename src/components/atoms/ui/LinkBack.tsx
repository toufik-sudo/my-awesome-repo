import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render a back large chevron link
 * @param to
 * @param messageId
 * @param className
 * @constructor
 */
const LinkBack = ({ to, messageId, className = '' }) => {
  const {
    textCenterMobile,
    textLeft,
    withFontMedium,
    displayInlineBlock,
    mr1,
    valignMiddle,
    withRegularFont
  } = coreStyle;

  return (
    <div className={`${textCenterMobile} ${className} ${textLeft}`}>
      <Link to={to}>
        <FontAwesomeIcon icon={faChevronLeft} size={'2x'} className={`${mr1} ${displayInlineBlock} ${valignMiddle}`} />
        <DynamicFormattedMessage
          tag={HTML_TAGS.P}
          className={`${withFontMedium} ${displayInlineBlock} ${withRegularFont} ${valignMiddle}`}
          id={messageId}
        />
      </Link>
    </div>
  );
};

export default LinkBack;
