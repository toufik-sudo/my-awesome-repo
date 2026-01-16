import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/landing/CtaSection.module.scss';

/**
 * Molecule component used to output a cta form block for Tailored and Resseller form
 *
 * @param body
 * @constructor
 */
const CTAFormBlock = ({ blockType, children }) => {
  const { card, withBorderSecondary, smallText, sectionSubtitle, withSecondaryColor, textCenter } = coreStyle;
  const { cardCta, cardCtaTitle, cardCtaBtn } = componentStyle;

  return (
    <div className={`${card} ${cardCta} ${withBorderSecondary} ${textCenter}`}>
      <DynamicFormattedMessage
        tag="h3"
        className={`${sectionSubtitle} ${cardCtaTitle}`}
        id={`form.cta.${blockType}.title`}
      />
      <DynamicFormattedMessage
        tag="p"
        className={`${smallText} ${withSecondaryColor}`}
        id={`form.cta.${blockType}.body`}
      />
      <div className={cardCtaBtn}>{children}</div>
    </div>
  );
};

export default CTAFormBlock;
