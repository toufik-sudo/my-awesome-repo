import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/wall/WallUserBlock.module.scss';

/**
 * Atom component used to render dashboard program empty points list
 *
 * @constructor
 */
const ProgramBeneficiaryNoPoints = () => {
  return (
    <div className={style.userBlockTitle}>
      <DynamicFormattedMessage tag={HTML_TAGS.DIV} id={'wall.dashboard.beneficiary.no.points'} />
    </div>
  );
};

export default ProgramBeneficiaryNoPoints;
