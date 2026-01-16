import React, { createElement } from 'react';
import { FormattedMessage } from 'react-intl';

/**
 * Atom component used to render a dynamic formatted message with a custom parent
 *
 * @param props
 * @constructor
 *
 * @see DynamicFormattedMessageStory
 */
export const DynamicFormattedMessage = props => {
  const { defaultMessage, id } = props;
  const childrenProps = { defaultMessage, id, values: props.values };
  // eslint-disable-next-line
  const { tag, values, ...parentProps } = props;

  return createElement(tag, { ...parentProps }, <FormattedMessage {...childrenProps} />);
};
