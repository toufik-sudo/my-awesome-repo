import React from 'react';

import CreateNewInputField from 'components/atoms/launch/products/CreateNewInputField';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/components/launch/Design.module.scss';

/**
 * Molecule component used to render company name
 *
 * @param companyName
 * @param setCompanyName
 * @constructor
 */
const CompanyName = ({ companyName, setCompanyName, type }) => {
  const { companyName: companyNameStyle, designTitle } = style;

  return (
    <div className={companyNameStyle}>
      <DynamicFormattedMessage tag="label" id="launchProgram.design.companyTitle" className={designTitle} />
      <CreateNewInputField onChange={e => setCompanyName(e.target.value)} type={type} value={companyName} />
    </div>
  );
};

export default CompanyName;
