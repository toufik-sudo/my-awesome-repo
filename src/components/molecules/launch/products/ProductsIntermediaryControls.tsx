import React from 'react';

import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_VARIANT } from 'constants/ui';

import productsStyle from 'assets/style/components/launch/Products.module.scss';

/**
 * Molecule component used to render products intermediary controls
 *
 * @param acceptProducts
 * @param declineProducts
 * @constructor
 */
const ProductsIntermediaryControls = ({ acceptProducts, declineProducts }) => (
  <div className={productsStyle.productsControls}>
    <DynamicFormattedMessage onClick={acceptProducts} tag={Button} id="launchProgram.products.acceptSetProductsList" />
    <DynamicFormattedMessage
      onClick={declineProducts}
      tag={Button}
      variant={BUTTON_MAIN_VARIANT.INVERTED}
      id="launchProgram.products.declineSetProductsList"
    />
  </div>
);

export default ProductsIntermediaryControls;
