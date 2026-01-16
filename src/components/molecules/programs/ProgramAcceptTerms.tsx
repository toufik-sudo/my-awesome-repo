import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { buildEmbbededHtmlPart } from 'services/IntlServices';
import { INPUT_TYPE } from 'constants/forms';
import { HTML_TAGS } from 'constants/general';
import { LINK_TARGET } from 'constants/ui';

import style from 'assets/style/common/Labels.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import inputStyle from 'sass-boilerplate/stylesheets/components/forms/Input.module.scss';

/**
 * Component that renders accept option for program's terms and conditions
 * @param termsAccepted
 * @param setTermsAccepted
 * @constructor
 */
const ProgramAcceptTerms = ({ termsAccepted, setTermsAccepted, termsAndConditionsUrl }) => {
  const { flexSpace1, displayFlex, ml3, pr05, pl15 } = coreStyle;
  const { customRadioInputWrapper, customRadioInput } = inputStyle;

  return (
    <div className={`${displayFlex} ${flexSpace1} ${pr05} ${pl15}`} style={{ paddingLeft: '1.5rem !important' }}>
      <label htmlFor="terms" className={customRadioInputWrapper} style={{ width: 'max-content', marginRight: '1rem' }}>
        <input
          type={INPUT_TYPE.CHECKBOX}
          checked={termsAccepted}
          onChange={e => setTermsAccepted(e.target.checked)}
          id="terms"
        />
        <div className={`${customRadioInput}`} />
      </label>

      <DynamicFormattedMessage
        id="program.join.terms"
        tag={HTML_TAGS.P}
        values={{
          a: buildEmbbededHtmlPart({
            tag: HTML_TAGS.ANCHOR,
            href: termsAndConditionsUrl,
            target: LINK_TARGET.BLANK,
            className: style.underline
          })
        }}
      />

    </div>
  );
};
export default ProgramAcceptTerms;
