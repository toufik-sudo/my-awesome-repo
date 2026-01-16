import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/components/launch/Products.module.scss';

/**
 * Molecule component used to render a category item box
 *
 * @param name
 * @param background
 * @constructor
 */
const AddExistingProductItem = ({ children, name, picturePath, count = null }) => {
  const { productsTitle, withEllipsis } = style;

  return (
    <div style={{ backgroundImage: `url(${picturePath})` }}>
      <span>
        <h3 className={`${productsTitle} ${withEllipsis}`}>{name}</h3>
        {count !== null && (
          <DynamicFormattedMessage
            className={`${productsTitle} ${withEllipsis}`}
            tag="h4"
            id="launchProgram.products.productsCount"
            values={{ count }}
          />
        )}
      </span>
      {children}
    </div>
  );
};

export default AddExistingProductItem;
