import React from 'react';

import HeadingAtom from 'components/atoms/ui/Heading';
import ProductsIntermediaryControls from 'components/molecules/launch/products/ProductsIntermediaryControls';
import { useIntermediaryProductsControls } from 'hooks/launch/products/items/useIntermediaryProductsControls';

import style from 'assets/style/components/launch/Launch.module.scss';

const ProductsIntermediaryPage = () => {
  const { launchHeadingIntermediaryTitle, launchHeadingTitle } = style;
  const { acceptProducts, declineProducts } = useIntermediaryProductsControls();

  return (
    <div>
      <HeadingAtom className={launchHeadingTitle} size="3" textId="launchProgram.title" />
      <HeadingAtom
        className={launchHeadingIntermediaryTitle}
        size="4"
        textId="launchProgram.products.intermediaryTitle"
      />
      <ProductsIntermediaryControls {...{ acceptProducts, declineProducts }} />
    </div>
  );
};

export default ProductsIntermediaryPage;
