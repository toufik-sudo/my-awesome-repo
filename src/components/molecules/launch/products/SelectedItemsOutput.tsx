import React from 'react';

import style from 'assets/style/components/launch/Products.module.scss';
import { FormattedMessage } from 'react-intl';

/**
 * Molecule component used to render the selected items count
 *
 * @param filteredItems
 * @constructor
 */
const SelectedItemsOutput = ({ filteredItems }) => (
  <div className={style.productsCount}>
    {filteredItems && !!filteredItems.length && (
      <FormattedMessage id="launchProgram.products.productsSelectedCount" values={{ count: filteredItems.length }} />
    )}
  </div>
);

export default SelectedItemsOutput;
