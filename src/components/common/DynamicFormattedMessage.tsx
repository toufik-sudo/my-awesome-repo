// -----------------------------------------------------------------------------
// DynamicFormattedMessage Component
// Migrated from old_app/src/components/atoms/ui/DynamicFormattedMessage.tsx
// -----------------------------------------------------------------------------

import React, { createElement, ReactNode } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

interface DynamicFormattedMessageProps extends MessageDescriptor {
  tag: keyof JSX.IntrinsicElements;
  className?: string;
  values?: Record<string, ReactNode | ((chunks: ReactNode) => ReactNode)>;
  [key: string]: unknown;
}

/**
 * Component used to render a dynamic formatted message with a custom parent tag
 */
export const DynamicFormattedMessage: React.FC<DynamicFormattedMessageProps> = (props) => {
  const { defaultMessage, id, tag, values, ...parentProps } = props;
  const childrenProps = { defaultMessage, id, values };

  return createElement(
    tag, 
    { ...parentProps }, 
    <FormattedMessage {...childrenProps} />
  );
};

export default DynamicFormattedMessage;
