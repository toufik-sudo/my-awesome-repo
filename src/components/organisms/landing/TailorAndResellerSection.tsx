import React from 'react';

import resellerBg from 'assets/images/resellerBg.png';
import sectionShape from 'assets/images/resellerShape.png';
import HeadingAtom from 'components/atoms/ui/Heading';
import { TAILORED_FORM_TYPE } from 'constants/formDefinitions/genericFields';
import { RESELLER_FORM_TYPE } from 'constants/forms';
import { TAILOR_SECTION_ID } from 'constants/general';
import { WELCOME_TAILORED_ROUTE } from 'constants/routes';
import TailoredResellerCustomBlock from 'components/molecules/landing/TailoredResellerCustomBlock';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/landing/CtaSection.module.scss';

/**
 * Organism component used to display left pricing labels and slider pricing plans
 *
 * @param sortedPricingData
 * @param openResellerModal
 * @constructor
 */
const TailoredAndResellerSection = ({ openResellerModal }) => {
  const { cardsWrapper, sectionCta, sectionTitleCustomSpacing } = componentStyle;
  const {
    section,
    withDefaultColor,
    sectionTitle,
    withBackgroundImage,
    customContainer,
    patternTop,
    containerVerticallyCentered,
    widthFull
  } = coreStyle;

  const sectionClasses = `${section} ${sectionCta} ${withBackgroundImage} ${containerVerticallyCentered}`;
  const leftCol = `${grid['col-lg-4']} ${grid['col-xl-6']} ${grid['text-center']} ${grid['text-lg-left']}`;
  const rightCol = `${grid['col-lg-8']} ${grid['col-xl-6']} ${grid['justify-content-center']} ${grid['justify-content-sm-between']}  ${grid['justify-content-md-center']} ${grid['justify-content-lg-end']} ${cardsWrapper}`;

  return (
    <section className={sectionClasses} style={{ backgroundImage: `url(${resellerBg})` }} id={TAILOR_SECTION_ID}>
      <img src={sectionShape} className={patternTop} alt="section shape" />
      <div className={`${customContainer} ${coreStyle['flex-center-total']}`}>
        <div className={`${grid['row']} ${widthFull}`}>
          <div className={leftCol}>
            <HeadingAtom
              className={`${sectionTitle} ${withDefaultColor} ${sectionTitleCustomSpacing}`}
              size="2"
              textId="tailored.title"
            />
          </div>
          <div className={rightCol}>
            <TailoredResellerCustomBlock
              type={TAILORED_FORM_TYPE}
              onClick={() => window.open(WELCOME_TAILORED_ROUTE, '_blank')}
            />
            <TailoredResellerCustomBlock type={RESELLER_FORM_TYPE} onClick={openResellerModal} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TailoredAndResellerSection;
