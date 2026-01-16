import React from 'react';

import FeatureBoxContent from 'components/molecules/landing/FeatureBoxContent';
import { IMAGES_ALT } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/landing/FeatureElement.module.scss';

/**
 * Molecule component used to render a single feature box
 *
 * @param index
 * @param label
 * @param activeBox
 * @param setActiveBox
 * @constructor
 */
const FeatureSingleBox = ({ index, label, activeBox, setActiveBox }) => {
  const { image, imageActive } = componentStyle;
  const { imgFluid } = coreStyle;

  return (
    <>
      <img
        src={require(`assets/images/features${index + 1}.png`)}
        alt={IMAGES_ALT.FEATURE}
        className={`${imgFluid} ${image} ${activeBox === index ? imageActive : ''}`}
      />
      <FeatureBoxContent
        position={index}
        titleId={label}
        textId={`${label}.info`}
        boxIndex={activeBox}
        setActiveBox={setActiveBox}
      />
    </>
  );
};

export default FeatureSingleBox;
