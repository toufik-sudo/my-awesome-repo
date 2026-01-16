import React from 'react';

import CreateNewTextareaField from 'components/atoms/launch/products/CreateNewTextareaField';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'sass-boilerplate/stylesheets/pages/DesignIdentification.module.scss';
import errorStyle from 'assets/style/common/Input.module.scss';
import { MAX_DESIGN_CONTENT } from 'constants/general';

/**
 * Molecule component used to render company name
 *
 * @param companyName
 * @param setCompanyName
 * @constructor
 */
const DesignTextField = ({ companyName, setCompanyName, type, hasContentError }) => {
  const { designIdentificationText } = style;

  return (
    <div className={designIdentificationText}>
      <CreateNewTextareaField onChange={e => setCompanyName(e.target.value)} type={type} value={companyName} maxLength={MAX_DESIGN_CONTENT} />
      {hasContentError && <DynamicFormattedMessage tag="p" className={errorStyle.error} id="form.validation.max" />}
    </div>
  );
};

export default DesignTextField;
