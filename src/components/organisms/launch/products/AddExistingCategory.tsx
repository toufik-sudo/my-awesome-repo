import React from 'react';

import AddExistingProductItem from 'components/molecules/launch/products/AddExistingProductItem';
import Button from 'components/atoms/ui/Button';
import { useExistingCategoryList } from 'hooks/launch/products/category/useExistingCategoryList';
import { useAlreadyCreatedCategories } from 'hooks/launch/products/items/useAlreadyCreatedCategories';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { PRODUCTS_CTA_TYPE } from 'constants/wall/launch';
import { BUTTON_MAIN_TYPE } from 'constants/ui';

import style from 'assets/style/components/launch/Products.module.scss';

/**
 * Organism component used to render existing product
 *
 * @constructor
 */
const AddExistingCategory = () => {
  const { categoriesListState } = useExistingCategoryList();
  const [categoryList] = categoriesListState;
  const { handleItemSelection, categoryIds } = useAlreadyCreatedCategories(categoriesListState);
  const { ADD, REMOVE } = PRODUCTS_CTA_TYPE;
  const { SECONDARY, ALT } = BUTTON_MAIN_TYPE;
  const { addExistingProductsWrapper, addExistingProductsView, addExistingCategoryView } = style;

  if (!categoryList.length) return null;

  return (
    <div className={addExistingProductsWrapper}>
      <div className={`${addExistingProductsView} ${addExistingCategoryView}`}>
        <>
          {categoryList.map(({ name, id, totalItems }) => {
            const isItemSelected = categoryIds && categoryIds.includes(id);

            return (
              <AddExistingProductItem
                key={id}
                {...{
                  count: totalItems,
                  id,
                  name,
                  picturePath: `${require(`assets/images/categoryBG.png`)}`,
                  handleItemSelection,
                  programItems: categoryIds
                }}
              >
                {!!totalItems && (
                  <DynamicFormattedMessage
                    type={isItemSelected ? SECONDARY : ALT}
                    tag={Button}
                    id={`launchProgram.products.alreadySelected.${isItemSelected ? REMOVE : ADD}`}
                    onClick={() => handleItemSelection(id)}
                  />
                )}
              </AddExistingProductItem>
            );
          })}
        </>
      </div>
    </div>
  );
};

export default AddExistingCategory;
