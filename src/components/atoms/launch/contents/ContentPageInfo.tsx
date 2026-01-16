import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/common/Labels.module.scss';

/**
 * Atom component used to render Contents Title
 *
 */
const ContentsPageInfo = () => {
  const { generalLabel, generalText } = style;

  return (
    <>
      <DynamicFormattedMessage tag="p" className={generalLabel} id="launchProgram.wysiwig.label" />
      <DynamicFormattedMessage tag="p" className={generalText} id="launchProgram.wysiwig.info" />
    </>
  );
};

export default ContentsPageInfo;
