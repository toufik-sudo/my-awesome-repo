import React, { useState } from 'react';

import GoalsProducts from 'components/organisms/launch/cube/GoalsProducts';
import ValidateCta from 'components/atoms/launch/cube/ValidateCTA';
import GoalSpecificProductsOptions from 'components/molecules/launch/cube/GoalSpecificProductsOptions';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { CUBE_SECTIONS } from 'constants/wall/launch';
import { useSpecificProducts } from 'hooks/launch/cube/useSpecificProducts';
import { setTranslate } from 'utils/animations';
import { DELAY_INITIAL } from 'constants/animations';
import { useCubeModifyLimit } from 'hooks/launch/cube/useCubeModifyLimit';

import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';

/**
 * Organism component used to render the specific products block
 *
 * @param specificProducts
 * @param goalProductIds
 * @param index
 * @param handleSelection
 * @param specificProductsValidated
 * @constructor
 */
const SpecificProducts = ({
  goal: {
    specificProducts,
    productIds: goalProductIds,
    validated: { specificProducts: specificProductsValidated }
  },
  index,
  handleSelection
}) => {
  const { cubeSectionWrapper, cubeSectionDisabled, cubeSectionSubtitle, cubeSectionEditable } = style;
  const {
    handleCubeItemSelection,
    validateAvailable,
    personaliseProducts,
    handleSpecificProductsValidation,
    uniqueFullProducts,
    isDisabledProducts,
    isAllProductsDisabled,
    isGenericProductsDisabled
  } = useSpecificProducts(index, specificProducts);

  

  const { isCurrentGoal } = useCubeModifyLimit(index);
  const isValidateVisible = validateAvailable && specificProductsValidated && isCurrentGoal;

  if (!personaliseProducts || !uniqueFullProducts.length) {
    return null;
  }

  return (
    <SpringAnimation settings={setTranslate(DELAY_INITIAL)}>
      <div className={cubeSectionWrapper}>
        {isValidateVisible && (
          <ValidateCta
            {...{
              handleItemValidation: handleSpecificProductsValidation,
              targetName: CUBE_SECTIONS.SPECIFIC_PRODUCTS,
              targetValue: specificProductsValidated
            }}
          />
        )}
        <div className={`${cubeSectionEditable} ${specificProductsValidated ? cubeSectionDisabled : ''}`}>
          <DynamicFormattedMessage
            className={cubeSectionSubtitle}
            tag={HTML_TAGS.P}
            id="launchProgram.cube.specificProducts.title"
          />
          <GoalSpecificProductsOptions {...{ specificProducts, handleSelection, index, isAllProductsDisabled, isGenericProductsDisabled }} />
          <GoalsProducts
            {...{ specificProducts, uniqueFullProducts, goalProductIds, handleCubeItemSelection, isDisabledProducts }}
          />
        </div>
        {validateAvailable && !specificProductsValidated && (
          <ValidateCta
            {...{
              handleItemValidation: handleSpecificProductsValidation,
              targetName: CUBE_SECTIONS.SPECIFIC_PRODUCTS,
              targetValue: specificProductsValidated
            }}
          />
        )}
      </div>
    </SpringAnimation>
  );
};

export default SpecificProducts;
