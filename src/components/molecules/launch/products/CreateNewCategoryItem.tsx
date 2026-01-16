import React from 'react';

import Button from 'components/atoms/ui/Button';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { PRODUCTS_CTA_TYPE } from 'constants/wall/launch';

import style from 'assets/style/components/launch/Products.module.scss';

/**
 * Molecule component used to render a category item box
 *
 * @param name
 * @param background
 * @constructor
 */
const CreateNewCategoryItem = ({ name, picturePath, id, handleItemSelection, selectedItemCategories }) => {
  const { productsTitle, withEllipsis } = style;
  const isItemSelected = selectedItemCategories.includes(id);
  const { ADD, REMOVE } = PRODUCTS_CTA_TYPE;
  const { SECONDARY, ALT } = BUTTON_MAIN_TYPE;

  return (
    <div style={{ backgroundImage: `url(${picturePath})` }}>
      <span>
        <h3 className={`${productsTitle} ${withEllipsis}`}>{name}</h3>
      </span>
      <DynamicFormattedMessage
        type={isItemSelected ? SECONDARY : ALT}
        tag={Button}
        id={`launchProgram.products.${isItemSelected ? REMOVE : ADD}`}
        onClick={() => handleItemSelection(id)}
      />
    </div>
  );
};

export default CreateNewCategoryItem;
