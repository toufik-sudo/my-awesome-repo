import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-scroll/modules';

import FeaturesMainSectionTabs from 'components/molecules/landing/FeaturesMainSectionTabs';
import FeaturesMainSectionSubTabs from 'components/molecules/landing/FeaturesMainSectionSubTabs';
import Button from 'components/atoms/ui/Button';
import HeadingAtom from 'components/atoms/ui/Heading';
import { FEATURES, PRICING } from 'constants/routes';
import { BUTTON_MAIN_TYPE } from 'constants/ui';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/landing/Features.module.scss';

/**
 * Organism component used to render features section
 *
 * @constructor
 */
const FeaturesSection = () => {
  const { innerContent, cardWrapper, sectionFeatures, sectionFeaturesTitle, customRow } = componentStyle;
  const { section, sectionTitle, contentCentered, textCenter } = coreStyle;

  return (
    <section className={`${section} ${sectionFeatures} ${grid['container-fluid']}`} id={FEATURES}>
      <div className={`${customRow} ${grid['row']}`}>
        <div className={`${grid['col-lg-3']} ${contentCentered}`}>
          <div className={`${customRow} ${grid['row']} ${contentCentered}`}>
            <HeadingAtom
              className={`${sectionTitle} ${textCenter} ${sectionFeaturesTitle}`}
              textId="content.features.title"
              size="2"
            />
            <Link to={PRICING} spy smooth>
              <Button className={componentStyle.heroButtonSpacing} type={BUTTON_MAIN_TYPE.PRIMARY}>
                <FormattedMessage id="label.more" />
              </Button>
            </Link>
          </div>
        </div>
        <div className={`${grid['col-lg-9']} ${contentCentered} ${cardWrapper}`}>
          <div className={innerContent}>
            <FeaturesMainSectionTabs />
            <FeaturesMainSectionSubTabs />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
