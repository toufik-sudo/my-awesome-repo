import React from 'react';

import LandingSectionCta from 'components/molecules/landing/LandingSectionCta';
import AnimatedTitle from 'components/atoms/ui/AnimatedTitle';
import { LANDING_TITLE } from 'constants/landing';
import { LANDING } from 'constants/routes';

import landingImage from 'assets/images/landingBg.jpg';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component that renders landing section
 *
 * @constructor
 */
const LandingSection = () => {
  const { section, contentCentered } = coreStyle;

  return (
    <section
      className={`${section} ${contentCentered}`}
      style={{ backgroundImage: `url(${landingImage})` }}
      id={LANDING}
    >
      <div>
        <AnimatedTitle contentArray={LANDING_TITLE} />
        <LandingSectionCta />
      </div>
    </section>
  );
};

export default LandingSection;
