import React, { FC } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import PlanLinkButton from 'components/atoms/landing/PlanLinkButton';
import PricingSetupCell from 'components/atoms/landing/PricingSetupCell';
import {
  CHECKED_VALUES,
  CURRENCY,
  CURRENCY_VALUES,
  SETUP,
  CTA,
  CHECKED_LABEL,
  UNCHECKED_LABEL,
  FORMATTED_PRICING_CELLS,
  ID,
  FREQUENCIES_OF_PAYMENT,
  PRICE_ORDER_ADDITIONAL,
  NAME,
  PRICE
} from 'constants/landing';
import { getPlanType } from 'services/PriceServices';
import { processPricingClass } from 'services/SectionsServices';

import style from 'assets/style/components/Pricing/StaticPricing.module.scss';

/**
 * Molecule component which outputs key as class and value as innerHTML
 *
 * @param pricingElement
 * @param intl
 * @param columnIndex
 * @param translationPrefix
 * @constructor
 */
const StaticPricingRow: FC<any> = ({ intl, pricingElement, columnIndex, translationPrefix }) => {
  const { slideWrapper, hasValues, staticSlideWrapper } = style;

  return (
    <div className={`${slideWrapper} ${staticSlideWrapper} ${processPricingClass(pricingElement)}`}>
      {pricingElement.map(({ className, content }, index) => {
        if (className === ID || className === FREQUENCIES_OF_PAYMENT || className === PRICE || className === CTA)
          return null;

        let outputContent = content;

        if (PRICE_ORDER_ADDITIONAL.includes(className) && outputContent < 1) {
          outputContent = <div className={hasValues}>{content.toString().replace('.', ',')}</div>;
        }

        if (className === CURRENCY) {
          outputContent = CURRENCY_VALUES[content];
        }
        if (className === SETUP) {
          outputContent = (
            <PricingSetupCell {...{ columnIndex, outputContent }} translationPrefix={translationPrefix} />
          );
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
          outputContent = <div className={hasValues}>{content}</div>;
        }

        let dataLabel = intl.formatMessage({ id: `label.price.${className}` });

        if (className === NAME || className === PRICE || className === CTA) {
          dataLabel = '';
        }

        return (
          <div key={index} data-label={dataLabel} className={`${style[className]} ${style.itemWithAttr}`}>
            {outputContent}
          </div>
        );
      })}
    </div>
  );
};

export default injectIntl(StaticPricingRow);
