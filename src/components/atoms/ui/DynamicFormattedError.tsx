import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import errorStyle from 'assets/style/common/Input.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render a dynamic formatted error
 *
 * @param className
 * @param tag
 * @param props
 * @constructor
 *
 * @see DynamicFormattedMessageStory
 */
const DynamicFormattedError = ({ className = undefined, tag = HTML_TAGS.SPAN, ...props }) => {
  const { hasError, ...dynamicProps } = props;
  if (!hasError) return null;

  const defaultClassName = `${errorStyle.errorRelative} ${coreStyle['flex-center-total']}`;

  return (
    <DynamicFormattedMessage
      {...{
        ...dynamicProps,
        tag,
        className: className || defaultClassName
      }}
    />
  );
};

export default DynamicFormattedError;
