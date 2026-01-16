import React from 'react';

import AddExistingItems from 'components/molecules/launch/products/AddExistingItems';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';

/**
 * Organism component used to render goals products
 *
 * @param specificProducts
 * @param fullProducts
 * @param handleCubeItemSelection
 * @param goalProductIds
 * @constructor
 */
const GoalsProducts = ({
  specificProducts,
  uniqueFullProducts,
  handleCubeItemSelection,
  goalProductIds,
  isDisabledProducts
}) => {

  const filteredProducts = uniqueFullProducts.filter(
    (product) => !goalProductIds.includes(product.id)
  );
  
  return (
    specificProducts &&
    uniqueFullProducts.length && (
      <>
        <DynamicFormattedMessage
          className={style.cubeSectionSubtitle}
          tag={HTML_TAGS.SPAN}
          id="launchProgram.cube.selectedProductsTitle"
        /> 
        <AddExistingItems
          {...{
            productList: uniqueFullProducts,
            handleItemSelection: handleCubeItemSelection,
            productIds: goalProductIds,
            isDisabledProducts
          }}
        />
      </>
    )
  );
};

export default GoalsProducts;
