import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import PlanLinkButton from 'components/atoms/landing/PlanLinkButton';
import { DELAY_MULTIPLIER } from 'constants/animations';
import { ILandingPricingRowProps } from 'interfaces/containers/ILandingPricingContainer';
import {
  CHECKED_LABEL,
  CHECKED_VALUES,
  CTA,
  CURRENCY,
  CURRENCY_VALUES,
  FORMATTED_PRICING_CELLS,
  FREQUENCIES_OF_PAYMENT,
  ID,
  PRICE_ORDER_ADDITIONAL,
  SETUP,
  UNCHECKED_LABEL
} from 'constants/landing';
import { getPlanType } from 'services/PriceServices';
import { processPricingClass } from 'services/SectionsServices';
import { setTranslate } from 'utils/animations';
import style from 'assets/style/components/Pricing/Pricing.module.scss';
import PricingSetupCell from 'components/atoms/landing/PricingSetupCell';

/**
 * Molecule component which outputs key as class and value as innerHTML
 *
 * @param pricingElement
 * @param columnIndex
 * @constructor
 */
const PricingRow: FC<ILandingPricingRowProps> = ({ pricingElement, columnIndex }) => {
  const { slideWrapper, hasValues } = style;

  return (
    <SpringAnimation
      settings={setTranslate(columnIndex * DELAY_MULTIPLIER)}
      className={`${slideWrapper} ${processPricingClass(pricingElement)}`}
    >
      {pricingElement.map(({ className, content }, index) => {
        if (className === ID || className === FREQUENCIES_OF_PAYMENT) return null;

        let outputContent = content;

        if (PRICE_ORDER_ADDITIONAL.includes(className) && outputContent < 1) {
          outputContent = <div className={hasValues}>{content.toString().replace('.', ',')}</div>;
        }

        if (className === CURRENCY) {
          outputContent = CURRENCY_VALUES[content];
        }
        if (className === SETUP) {
          outputContent = <PricingSetupCell {...{ columnIndex, outputContent }} />;
        }
        if (
          typeof outputContent === 'string' &&
          (outputContent === CHECKED_LABEL || outputContent === UNCHECKED_LABEL)
        ) {
          outputContent = <div className={style[CHECKED_VALUES[outputContent]]} />;
        }
        if (className === CTA) {
          outputContent = <PlanLinkButton content={getPlanType(pricingElement)} key={index} />;
        }
        if (FORMATTED_PRICING_CELLS.includes(className)) {
          outputContent = <FormattedMessage id={`landing.${className}`} values={{ value: outputContent }} />;
        }

        if (typeof outputContent === 'number') {
          outputContent = content;

          if (className === 'price' && outputContent !== 0) {
            outputContent = (
              <FormattedMessage id={`subscription.payment.month`} values={{ pricePerMonth: outputContent }} />
            );
          }

          if (className === 'price' && outputContent === 0) {
            outputContent = <div className={hasValues}>{content}</div>;
          }
        }

        return (
          <div key={index} className={style[className]}>
            {outputContent}
          </div>
        );
      })}
    </SpringAnimation>
  );
};

export default PricingRow;
