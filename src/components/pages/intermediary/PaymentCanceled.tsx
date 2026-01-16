import React from 'react';

import Button from 'components/atoms/ui/Button';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { PAYMENT_METHOD } from 'constants/routes';
import { HTML_TAGS, IMAGES_ALT } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';
import { setTranslate } from 'utils/animations';
import { DELAY_TYPES } from 'constants/animations';

import logo from 'assets/images/logo/logoColored.png';
import style from 'sass-boilerplate/stylesheets/pages/IntermediaryPage.module.scss';

/**en
 * Intermediary page used for payment success
 *
 * @constructor
 */
const PaymentCanceled = () => {
  const translationPrefix = 'payment.canceled';
  const { wrapper, canceledIntermediary, logoSuccess, intermediaryBody } = style;

  return (
    <div className={`${wrapper} ${canceledIntermediary}`}>
      <SpringAnimation settings={setTranslate(DELAY_TYPES.MIN)}>
        <div className={logoSuccess}>
          <img src={logo} alt={IMAGES_ALT.LOGO} />
        </div>
      </SpringAnimation>
      <div className={intermediaryBody}>
        <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${translationPrefix}.body.first`} />
        <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${translationPrefix}.body.second`} />
        <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${translationPrefix}.body.third`} />
      </div>
      <DynamicFormattedMessage
        tag={Button}
        type={BUTTON_MAIN_TYPE.PRIMARY}
        variant={BUTTON_MAIN_VARIANT.INVERTED}
        id={`${translationPrefix}.body.cta`}
        onClick={() => (window.location = (PAYMENT_METHOD as unknown) as Location)}
      />
    </div>
  );
};

export default PaymentCanceled;
