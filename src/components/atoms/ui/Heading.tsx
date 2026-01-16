import React from 'react';
import { FormattedMessage } from 'react-intl';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component that renders a title (option for animation)
 *
 * @param size
 * @param textId
 * @param primaryTextId
 * @param className
 * @param delay
 * @constructor
 */
const Heading = ({ size, textId = '', primaryTextId = '', className = '' }) => {
  const Wrapper = `h${size}` as 'div';
  const { withPrimaryColor } = coreStyle;

  return (
    <Wrapper {...{ className }}>
      <FormattedMessage id={textId} />
      {primaryTextId && <DynamicFormattedMessage tag={'span'} className={withPrimaryColor} id={primaryTextId} />}
    </Wrapper>
  );
};

export default Heading;
