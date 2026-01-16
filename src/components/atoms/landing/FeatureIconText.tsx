import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FEATURE_ICONS } from 'constants/landing';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import componentStyle from 'sass-boilerplate/stylesheets/components/landing/FeatureElement.module.scss';

/**
 * Atom component used to render feature icon text
 *
 * @param position
 * @param textId
 * @constructor
 *
 * @see FeatureIconTextStory
 */
const FeatureIconText = ({ position, textId }) => {
  const { cardContent, cardIcon, cardDescription } = componentStyle;

  return (
    <div className={cardContent}>
      <div className={cardIcon}>
        <FontAwesomeIcon icon={FEATURE_ICONS[position]} />
      </div>
      <DynamicFormattedMessage tag="div" className={cardDescription} id={textId} />
    </div>
  );
};

export default FeatureIconText;
