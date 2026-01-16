import React from 'react';

import NavScrollElement from 'components/atoms/ui/NavScrollElement';
import { PRICING } from 'constants/routes';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import linkStyle from 'assets/style/common/Labels.module.scss';

const ChooseUsBrands = () => {
  return (
    <NavScrollElement
      styleCustom={`${coreStyle.withPrimaryColor} ${linkStyle.link}`}
      title={PRICING}
      id={'whyChooseUs.brands.link'}
    />
  );
};

export default ChooseUsBrands;
