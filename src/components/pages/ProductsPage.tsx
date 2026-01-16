import React from 'react';

import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import ProductsWrapper from 'components/organisms/launch/products/ProductsWrapper';

import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import coreStyle from '../../sass-boilerplate/stylesheets/style.module.scss';

/**
 * Template component used to render Products page
 *
 * @constructor
 */
const ProductsPage = () => {
  return (
    <div>
      <LaunchProgramTitle
        titleId="launchProgram.title"
        subtitleId="launchProgram.products.subtitle"
        subtitleCustomClass={coreStyle.withSecondaryColor}
      />
      <div className={style.section}>
        <ProductsWrapper />
      </div>
    </div>
  );
};

export default ProductsPage;
