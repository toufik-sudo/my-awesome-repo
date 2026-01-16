import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { setTranslate } from 'utils/animations';
import { DELAY_MULTIPLIER } from 'constants/animations';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/landing/FeatureSubcategory.module.scss';

/**
 * Atom component that renders a subcategory box
 *
 * @param titleId
 * @param index
 * @constructor
 * @param icon
 *
 * @see FeatureSubcategoryStory
 */
const FeatureSubcategory = ({ titleId, index, iconBlock }) => {
  const { customCard, cardTitleWithIcon } = componentStyle;
  const { card, cardTitle, cardTitleSmall, withSecondaryColor, withBorderSecondary, textCenter } = coreStyle;

  return (
    <SpringAnimation
      className={`${customCard} ${card} ${withBorderSecondary} ${textCenter}`}
      settings={setTranslate(index * DELAY_MULTIPLIER)}
    >
      <div className={`${cardTitle} ${cardTitleSmall} ${cardTitleWithIcon} ${withSecondaryColor} `}>
        <FontAwesomeIcon icon={iconBlock} />
        <FormattedMessage id={titleId} />
      </div>
    </SpringAnimation>
  );
};

export default FeatureSubcategory;
