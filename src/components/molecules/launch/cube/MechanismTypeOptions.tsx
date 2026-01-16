/* eslint-disable quotes */
import React from "react";

import CubeOption from "components/atoms/launch/cube/CubeOption";
import { MEASUREMENT_NAMES, MEASUREMENT_TYPES } from "constants/wall/launch";
import { useCubeMeasurementTypeFilter } from "hooks/launch/cube/useCubeMeasurementTypeFilter";

import style from "sass-boilerplate/stylesheets/components/launch/Cube.module.scss";

/**
 * Molecule component used to render mechanism type options
 *
 * @param handleSelection
 * @param measurementType
 * @param index
 * @constructor
 */
const MechanismTypeOptions = ({ handleMethodMechanismSelection, measurementType, measurementName, index, type }) => {
  const { currentMeasurementTypes, isDisabledMesurementTypes } = useCubeMeasurementTypeFilter(index);

  return (
    <div className={style.cubeRadio}>
      {currentMeasurementTypes.map(key => (
        <CubeOption
          key={key}
          {...{
            type: key != 'action' ? MEASUREMENT_TYPES[key] : 2,
            handleSelection: handleMethodMechanismSelection,
            isSelected: measurementName == key.toLowerCase(),
            index,
            translation: `launchProgram.cube.${type}.${MEASUREMENT_TYPES[key]}`,
            isDisabled: isDisabledMesurementTypes[key]
          }}
        />
      ))}
    </div>
  );
};

export default MechanismTypeOptions;
