/* eslint-disable quotes */
import React from 'react';

import AddExistingProductItem from 'components/molecules/launch/products/AddExistingProductItem';
import Button from 'components/atoms/ui/Button';
import { PRODUCTS_CTA_TYPE } from 'constants/wall/launch';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import style from 'assets/style/components/launch/Products.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render existing product list
 * @param productList
 * @param productListState
 * @param handleItemSelection
 * @param productIds
 * @constructor
 */
const AddExistingItems = ({ productList, handleItemSelection, productIds, isDisabledProducts }) => {
  const { ADD, REMOVE } = PRODUCTS_CTA_TYPE;
  const { SECONDARY, PRIMARY, DISABLED } = BUTTON_MAIN_TYPE;

  return (
    <div className={style.addExistingProductsView}>
      <>
        {productList.map(({ name, id, picturePath }) => {
          const isItemSelected = productIds && productIds.includes(id);

          return (
            <AddExistingProductItem key={id} {...{ id, name, picturePath, handleItemSelection }}>
              <DynamicFormattedMessage
                type={
                  isItemSelected && (!isDisabledProducts || (isDisabledProducts && !isDisabledProducts[id]))
                    ? SECONDARY
                    : !isDisabledProducts || (isDisabledProducts && !isDisabledProducts[id])
                    ? PRIMARY
                    : DISABLED
                }
                tag={Button}
                id={`launchProgram.products.alreadySelected.${
                  isItemSelected && (!isDisabledProducts || (isDisabledProducts && !isDisabledProducts[id]))
                    ? REMOVE
                    : ADD
                }`}
                onClick={() => {
                  if (isDisabledProducts && !isDisabledProducts[id]) {
                    handleItemSelection(id);
                  }
                }}
                disable={isDisabledProducts && isDisabledProducts[id]}
                className={`${isDisabledProducts && isDisabledProducts[id] ? coreStyle.disabled : ''}`}
              />
            </AddExistingProductItem>
          );
        })}
      </>
    </div>
  );
};

export default AddExistingItems;
