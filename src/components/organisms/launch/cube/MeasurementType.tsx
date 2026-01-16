import React from 'react';

import MechanismTypeOptions from 'components/molecules/launch/cube/MechanismTypeOptions';
import ValidateCta from 'components/atoms/launch/cube/ValidateCTA';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { CUBE_SECTIONS, SPONSORSHIP } from 'constants/wall/launch';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { useMeasurementType } from 'hooks/launch/cube/useMeasurementType';
import { setTranslate } from 'utils/animations';
import { DELAY_INITIAL } from 'constants/animations';
import { useCubeModifyLimit } from 'hooks/launch/cube/useCubeModifyLimit';

import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';

/**
 * Organism component used to render measurement type block
 *
 * @param cube
 * @param index
 * @param handleMethodMechanismSelection
 * @constructor
 */
const MeasurementType = ({ cube, index, handleMethodMechanismSelection }) => {
  const { measurementTypeWrapper, cubeSectionDisabled, cubeSectionSubtitle, cubeSectionWrapper } = style;
  const {
    type,
    getMeasurementTypeVisibleState,
    productIds,
    categoryIds,
    handleMeasurementTypeValidation
  } = useMeasurementType(cube, index);
  const productsAvailable = productIds || categoryIds;
  const measurementType = cube.goals[index].measurementType;
  const measurementName = cube.goals[index].measurementName;
  const measurementTypeAvailable =
    type !== SPONSORSHIP && (cube.goals[index].validated[CUBE_SECTIONS.SPECIFIC_PRODUCTS] || !productsAvailable);
  const measurementTypeValidated = cube.goals[index].validated.measurementType;
  const { isCurrentGoal } = useCubeModifyLimit(index);
  const isValidateVisible = measurementType && measurementTypeValidated && isCurrentGoal;

  if (!measurementTypeAvailable || !type) return null;

  return (
    getMeasurementTypeVisibleState() && (
      <SpringAnimation settings={setTranslate(DELAY_INITIAL)}>
        <div className={`${measurementTypeWrapper} ${cubeSectionWrapper}`}>
          {isValidateVisible && (
            <ValidateCta
              {...{
                handleItemValidation: handleMeasurementTypeValidation,
                targetName: CUBE_SECTIONS.MEASUREMENT_TYPE,
                targetValue: measurementTypeValidated
              }}
            />
          )}
          <div className={`${measurementTypeValidated ? cubeSectionDisabled : ''}`}>
            <DynamicFormattedMessage
              className={cubeSectionSubtitle}
              tag={HTML_TAGS.P}
              id="launchProgram.cube.mechanismType.title"
            />
            <MechanismTypeOptions
              {...{
                measurementType,
                measurementName,
                handleMethodMechanismSelection,
                index,
                type
              }}
            />
          </div>
          {measurementType && !measurementTypeValidated && (
            <ValidateCta
              {...{
                handleItemValidation: handleMeasurementTypeValidation,
                targetName: CUBE_SECTIONS.MEASUREMENT_TYPE,
                targetValue: measurementTypeValidated
              }}
            />
          )}
        </div>
        
      </SpringAnimation>
    )
  );
};

export default MeasurementType;
