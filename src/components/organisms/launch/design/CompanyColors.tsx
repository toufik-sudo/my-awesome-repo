import React from 'react';

import CompanyColorsList from 'components/organisms/launch/design/CompanyColorsList';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/components/launch/Design.module.scss';

/**
 * Organism component used to render company colors list + title
 *
 * @constructor
 */
const CompanyColors = () => {
  const { companyColors, designTitle } = style;

  return (
    <div className={companyColors}>
      <DynamicFormattedMessage tag="label" id="launchProgram.design.customiseColors.title" className={designTitle} />
      <CompanyColorsList />
    </div>
  );
};

export default CompanyColors;
