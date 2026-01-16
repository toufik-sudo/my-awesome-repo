import React, { memo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import ButtonSwitch from 'components/atoms/ui/ButtonSwitch';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { GENERAL_CHECKBOX_STATE, IMAGES_ALT } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/landing/ServicesSection.module.scss';

/**
 * Molecule component used to render services image switch
 *
 * @constructor
 */
const ServicesImageSwitch = () => {
  const { lead, textCenter, withPrimaryColor, withGrayColor, imgFluid } = coreStyle;
  const [isChecked, setIsChecked] = useState(false);
  const { DISABLED, ACTIVE } = GENERAL_CHECKBOX_STATE;

  return (
    <>
      <div className={`${lead} ${withGrayColor} ${textCenter}`}>
        <FormattedMessage id="services.target" />
        <DynamicFormattedMessage className={withPrimaryColor} tag="span" id="services.scope" />
        <div>
          <ButtonSwitch {...{ isChecked, setIsChecked }} />
        </div>
      </div>
      <img
        src={require(`assets/images/services/services-${isChecked ? ACTIVE : DISABLED}.png`)}
        className={`${imgFluid} ${componentStyle.servicesImage}`}
        alt={IMAGES_ALT.SERVICES}
      />
    </>
  );
};

export default memo(ServicesImageSwitch);
