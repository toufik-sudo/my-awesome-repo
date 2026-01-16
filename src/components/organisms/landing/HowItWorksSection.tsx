import React from 'react';
import { useIntl } from 'react-intl';

import BlockElementList from 'components/molecules/landing/BlockElementList';
import HeadingAtom from '../../atoms/ui/Heading';
import { processTranslations } from 'services/SectionsServices';
import { HOW_IT_WORKS } from 'constants/routes';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/landing/HowItWork.module.scss';

/**
 * Organism component used to render how it works section
 *
 * @constructor
 */
const HowItWorksSection = () => {
  const {
    section,
    sectionHalfHeight,
    sectionTitle,
    contentCentered,
    withBackgroundGradient,
    withDefaultColor
  } = coreStyle;
  const { sectionHowItWork, sectionHowItWorkTitle } = componentStyle;
  const { messages } = useIntl();
  const labels = processTranslations(messages, 'howItWorks.', '.info');

  return (
    <section
      className={`${section} ${sectionHalfHeight} ${sectionHowItWork} ${withBackgroundGradient} ${contentCentered}`}
      id={HOW_IT_WORKS}
    >
      <div className={grid['container-fluid']}>
        <div className={grid['row']}>
          <div className={`${grid['col-md-10']} ${grid['offset-md-1']}`}>
            <div className={grid['row']}>
              <div className={grid['col-12']}>
                <HeadingAtom
                  className={`${sectionTitle} ${sectionHowItWorkTitle} ${withDefaultColor}`}
                  textId="content.howItWorks.title"
                  size="2"
                />
              </div>
              <BlockElementList {...{ labels }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
