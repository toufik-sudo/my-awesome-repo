import React, { FunctionComponent } from 'react';

import FeatureIconText from 'components/atoms/landing/FeatureIconText';
import { IFeatureElementProps } from 'interfaces/components/common/FeatureElement';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/landing/FeatureElement.module.scss';

/**
 * Molecule component used to render feature box content
 *
 * @param titleId
 * @param textId
 * @param size
 * @param position
 * @param boxIndex
 * @param setActiveBox
 * @constructor
 */
const FeatureBoxContent: FunctionComponent<IFeatureElementProps> = ({
  titleId,
  textId,
  position,
  boxIndex,
  setActiveBox
}) => {
  const { customCard, customCardActive, customCardTitle } = componentStyle;
  const { card, sectionSubtitle, textLeft, withBorderPrimaryAccent, lead, mb1, withGrayColor } = coreStyle;

  return (
    <div
      className={`${card} ${customCard} ${lead} ${withGrayColor} ${
        position === boxIndex ? `${customCardActive} ${withBorderPrimaryAccent}` : ''
      }`}
      onClick={() => setActiveBox(position)}
    >
      <DynamicFormattedMessage
        tag="div"
        className={`${sectionSubtitle} ${customCardTitle} ${mb1} ${textLeft}`}
        id={titleId}
      />
      <FeatureIconText {...{ position, textId }} />
    </div>
  );
};

export default FeatureBoxContent;
