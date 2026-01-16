import React from 'react';

import CubeOption from 'components/atoms/launch/cube/CubeOption';

import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';

/**
 * Molecule component used to render goal specific products options
 *
 * @param handleSelection
 * @param specificProducts
 * @param isAllProductsDisabled
 * @param isGenericProductsDisabled
 * @param index
 * @constructor
 */
const GoalSpecificProductsOptions = ({ handleSelection, specificProducts, index, isAllProductsDisabled, isGenericProductsDisabled }) => (
  <div className={style.cubeRadio}>
    <CubeOption
      {...{
        type: true,
        handleSelection,
        isSelected: specificProducts,
        index,
        translation: 'launchProgram.cube.specificProducts.yes',
        isDisabled : isAllProductsDisabled,
      }}
    />
    <CubeOption
      {...{
        type: false,
        handleSelection,
        isSelected: specificProducts !== null && !specificProducts,
        index,
        translation: 'launchProgram.cube.specificProducts.no',
        isDisabled: isGenericProductsDisabled,
      }}
    />
  </div>
);

export default GoalSpecificProductsOptions;
