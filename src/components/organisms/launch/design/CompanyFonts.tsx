import React from 'react';

import CompanyFontsList from 'components/organisms/launch/design/CompanyFontsList';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/components/launch/Design.module.scss';

/**
 * Organism component used to render company fonts list + title
 *
 * @constructor
 */
const CompanyFonts = () => {
  const { companyFonts, designTitle } = style;

  return (
    <div className={companyFonts}>
      <DynamicFormattedMessage tag="label" id="launchProgram.design.fonts.title" className={designTitle} />
      <CompanyFontsList />
    </div>
  );
};

export default CompanyFonts;
