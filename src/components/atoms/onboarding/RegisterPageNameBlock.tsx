import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render title for register step block
 * @param blockTitle
 * @constructor
 */
const RegisterPageNameBlock = ({ blockTitle }) => {
  const { text2xl, withDefaultColor, textLeft, mb2 } = coreStyle;

  return (
    <DynamicFormattedMessage
      className={`${text2xl} ${withDefaultColor} ${mb2} ${textLeft}`}
      tag={HTML_TAGS.P}
      id={`${'onboarding.register.'}${blockTitle}`}
    />
  );
};

export default RegisterPageNameBlock;
