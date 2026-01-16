import React from 'react';

import Heading from 'components/atoms/ui/Heading';
import ServicesImageSwitch from 'components/molecules/landing/ServicesImageSwitch';
import { SERVICES } from 'constants/routes';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/landing/ServicesSection.module.scss';

/**
 * Organism component used to render services section
 *
 * @constructor
 */
const ServicesSection = () => {
  const { section, textCenter, sectionTitle, contentCentered, customContainer } = coreStyle;
  const { servicesTitle, sectionServices } = componentStyle;

  return (
    <section className={`${section} ${sectionServices} ${customContainer} ${contentCentered}`} id={SERVICES}>
      <div>
        <div className={`${grid['col-sm-10']} ${grid['offset-sm-1']} ${textCenter}`}>
          <Heading
            className={`${sectionTitle} ${servicesTitle}`}
            textId={'services.title'}
            primaryTextId={'services.titlePrimary'}
            size="2"
          />
          <ServicesImageSwitch />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
