import React from 'react';

import CreateNewInputField from 'components/atoms/launch/products/CreateNewInputField';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/components/launch/Design.module.scss';
import errorStyle from 'assets/style/common/Input.module.scss';
import { MAX_DESIGN_TITLE_INPUT_CHAR_LENGTH } from 'constants/general';

/**
 * Molecule component used to render company name
 *
 * @param companyName
 * @param setCompanyName
 * @constructor
 */
const CompanyTitle = ({ companyName, setCompanyName, type, hasLabel = '', hasError }) => {
  const { companyName: companyNameStyle, designTitle } = style;

  return (
    <div className={companyNameStyle}>
      {hasLabel && (
        <DynamicFormattedMessage tag="label" id="launchProgram.design.companyTitle" className={designTitle} />
      )}
      <CreateNewInputField
        onChange={e => setCompanyName(e.target.value)}
        type={type}
        value={companyName}
        maxLength={MAX_DESIGN_TITLE_INPUT_CHAR_LENGTH}
      />
      {hasError && <DynamicFormattedMessage tag="p" className={errorStyle.error} id="form.validation.max" />}
    </div>
  );
};

export default CompanyTitle;
