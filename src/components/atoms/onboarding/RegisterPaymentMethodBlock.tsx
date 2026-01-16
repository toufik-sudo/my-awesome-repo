import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip';
import { useIntl } from 'react-intl';

import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { PAYMENT_ICONS } from 'constants/paymentMethod';
import { CARD, HTML_TAGS } from 'constants/general';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { TOOLTIP_FIELDS } from 'constants/tootltip';

import blockStyle from 'assets/style/components/BlockElement.module.scss';
import style from 'assets/style/components/PaymentMethod/PaymentMethod.module.scss';

/**
 * Atom component that renders a reusable payment method block
 *
 * @param textId
 * @param index
 * @param onClick
 *
 * @see RegisterPaymentMethodBlockStory
 */
const RegisterPaymentMethodBlock = ({ textId, index, onClick }) => {
  const { formatMessage } = useIntl();
  const { title, block, blockDisabled } = style;

  const isCardType = textId.includes(CARD);

  return (
    <div
      className={`${blockStyle.fullWidthBlock} ${block} ${!isCardType ? blockDisabled : ''}`}
      data-tip={!isCardType ? formatMessage({ id: 'notAvailable' }) : ''}
    >
      <FontAwesomeIcon icon={PAYMENT_ICONS[index]} />
      <DynamicFormattedMessage tag={HTML_TAGS.DIV} className={title} id={textId} />
      <DynamicFormattedMessage
        tag={Button}
        disabled={!isCardType}
        type={isCardType ? BUTTON_MAIN_TYPE.PRIMARY : BUTTON_MAIN_TYPE.DISABLED}
        onClick={onClick}
        id="paymentMethod.button"
      />
      <ReactTooltip
        place={TOOLTIP_FIELDS.PLACE_BOTTOM}
        type={TOOLTIP_FIELDS.TYPE_ERROR}
        effect={TOOLTIP_FIELDS.EFFECT_SOLID}
      />
    </div>
  );
};

export default RegisterPaymentMethodBlock;
