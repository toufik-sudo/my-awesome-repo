// -----------------------------------------------------------------------------
// FormattedMessage Atom Component
// Migrated from old_app/src/components/atoms/ui/DynamicFormattedMessage.tsx
// Uses react-intl for i18n support
// -----------------------------------------------------------------------------

import React, { createElement, ComponentType, HTMLAttributes } from 'react';
import { FormattedMessage as IntlFormattedMessage, useIntl } from 'react-intl';
import { HTML_TAGS, HtmlTag } from '@/constants/ui';

interface DynamicFormattedMessageProps extends HTMLAttributes<HTMLElement> {
  tag: HtmlTag | ComponentType<any>;
  id: string;
  defaultMessage?: string;
  values?: Record<string, any>;
}

/**
 * Dynamic formatted message that wraps react-intl's FormattedMessage
 * with a configurable parent element
 */
export const DynamicFormattedMessage: React.FC<DynamicFormattedMessageProps> = ({
  tag,
  id,
  defaultMessage,
  values,
  ...parentProps
}) => {
  const childrenProps = { defaultMessage, id, values };

  return createElement(
    tag as any,
    { ...parentProps },
    <IntlFormattedMessage {...childrenProps} />
  );
};

interface FormattedTextProps {
  id: string;
  defaultMessage?: string;
  values?: Record<string, any>;
}

/**
 * Simple formatted text component (no wrapper)
 */
export const FormattedText: React.FC<FormattedTextProps> = ({
  id,
  defaultMessage,
  values,
}) => {
  return <IntlFormattedMessage id={id} defaultMessage={defaultMessage} values={values} />;
};

/**
 * Hook to get formatted message as string
 */
export const useFormattedMessage = () => {
  const intl = useIntl();

  const formatMessage = (id: string, values?: Record<string, any>) => {
    return intl.formatMessage({ id }, values);
  };

  return { formatMessage, intl };
};

export { DynamicFormattedMessage as default };
