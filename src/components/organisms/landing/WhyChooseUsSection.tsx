import React, { FC } from 'react';
import { injectIntl } from 'react-intl';

import HeadingAtom from 'components/atoms/ui/Heading';
import { WHY_CHOOSE_US } from 'constants/routes';
import { IReactIntlProps } from 'interfaces/IGeneral';
import landingImage from 'assets/images/WhyChooseUs.png';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import ChooseUsEveryone from 'components/organisms/whyChooseUs/ChooseUsEveryone';
import ChooseUsBrands from 'components/organisms/whyChooseUs/ChooseUsBrands';
import ChooseUsAgencies from 'components/organisms/whyChooseUs/ChooseUsAgencies';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/landing/WhyChooseUs.module.scss';
import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';

/**
 * Organism component used to render why choose use section
 *
 * @constructor
 */
const WhyChooseUsSection: FC<IReactIntlProps> = () => {
  const {
    section,
    sectionHalfHeight,
    sectionTitle,
    textCenter,
    withDefaultColor,
    withBackgroundImage,
    lead,
    withPrimaryColorSecondaryAccent,
    mb3,
    mb9,
    withBoldFont
  } = coreStyle;

  return (
    <section
      className={`${section} ${sectionHalfHeight} ${sectionHalfHeight} ${withBackgroundImage} ${textCenter}`}
      style={{ backgroundImage: `url(${landingImage})` }}
      id={WHY_CHOOSE_US}
    >
      <HeadingAtom
        className={`${sectionTitle} ${componentStyle.sectionTitleWhyChooseUs} ${withDefaultColor}`}
        textId="content.whyChooseUs.title"
        size="2"
      />
      <div className={grid['container']}>
        <div className={grid['row']}>
          <div className={`${grid['col-md-6']} ${grid['col-lg-4']} ${mb9}`}>
            <DynamicFormattedMessage
              tag="div"
              className={` ${lead} ${withBoldFont} ${withPrimaryColorSecondaryAccent} ${mb3}`}
              id={`whyChooseUs.everyone`}
            />
            <DynamicFormattedMessage
              tag="div"
              className={`${withDefaultColor}`}
              id={`whyChooseUs.everyone.info`}
              values={{ link: <ChooseUsEveryone /> }}
            />
          </div>
          <div className={`${grid['col-md-6']} ${grid['col-lg-4']} ${mb9}`}>
            <DynamicFormattedMessage
              tag="div"
              className={` ${lead} ${withBoldFont} ${withPrimaryColorSecondaryAccent} ${mb3}`}
              id={`whyChooseUs.brands`}
            />
            <DynamicFormattedMessage
              tag="div"
              className={`${withDefaultColor}`}
              id={`whyChooseUs.brands.info`}
              values={{ link: <ChooseUsBrands /> }}
            />
          </div>
          <div className={`${grid['col-md-6']} ${grid['col-lg-4']} ${mb9}`}>
            <DynamicFormattedMessage
              tag="div"
              className={` ${lead} ${withBoldFont} ${withPrimaryColorSecondaryAccent} ${mb3}`}
              id={`whyChooseUs.agencies`}
            />
            <DynamicFormattedMessage
              tag="div"
              className={`${withDefaultColor}`}
              id={`whyChooseUs.agencies.info`}
              values={{ link: <ChooseUsAgencies /> }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default injectIntl(WhyChooseUsSection);
