import React from 'react';

import { SAMPLE_TEXT_LIST } from 'constants/wall/design';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/components/launch/Design.module.scss';

/**
 * Atom component used to render design font text sample
 *
 * @constructor
 */
const DesignFontTextSample = () => (
  <>
    {SAMPLE_TEXT_LIST.map(text => (
      <DynamicFormattedMessage
        key={text}
        className={style.designFontsSampleText}
        tag="p"
        id={`launchProgram.design.fonts.sample.${text}`}
      />
    ))}
  </>
);

export default DesignFontTextSample;
