import React from 'react';
import { useIntl } from 'react-intl';

import style from 'assets/style/common/Input.module.scss';

/**
 * Molecule component used to render create new product name field
 *
 * @param productName
 * @param onChange
 * @constructor
 */
const CreateNewProductName = ({ productName, onChange }) => {
  const { formatMessage } = useIntl();

  return (
    <div className={style.container}>
      <input
        className={style.defaultInputStyle}
        value={productName}
        {...{ onChange }}
        placeholder={formatMessage({ id: 'launchProgram.products.name' })}
      />
    </div>
  );
};

export default CreateNewProductName;
