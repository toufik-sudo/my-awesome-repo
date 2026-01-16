import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/components/launch/Design.module.scss';

/**
 * Atom component used to render optimal resolution information
 *
 * @param size
 * @constructor
 */
const OptimalResolution = ({ size, textId }) => {
  return <DynamicFormattedMessage tag="p" id={textId} values={{ size }} className={style.designOptimalInformation} />;
};

export default OptimalResolution;
