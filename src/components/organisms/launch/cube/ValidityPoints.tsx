import React from 'react';
import Select from 'react-select';

import CubeRadioValidate from 'components/atoms/launch/cube/CubeRadioValidate';
import CubeSectionTitle from 'components/atoms/launch/cube/CubeSectionTitle';
import { getDropdownStyle } from 'services/LaunchServices';
import { useValidityPoints } from 'hooks/launch/cube/validity/useValidityPoints';
import { VALIDITY } from 'constants/wall/launch';

import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';

/**
 * Organism component used to render spend type selection
 *
 * @constructor
 */
const ValidityPoints = () => {
  const { cubeContent, cubeSectionWrapper, cubeFrequencyWrapper, cubeSectionDisabled, cubeValidityDropdown } = style;
  const {
    selectedValidityPoints,
    setValidityPoints,
    allValidityPointsOptions,
    handleValidityValidation,
    validateShouldDisplay,
    modifyShouldDisplay,
    sectionShouldDisplay,
    validityPointsValidated
  } = useValidityPoints();

  if (!sectionShouldDisplay) return null;

  return (
    <div className={`${cubeSectionWrapper} ${cubeContent} ${cubeFrequencyWrapper}`}>
      {modifyShouldDisplay && (
        <CubeRadioValidate {...{ action: handleValidityValidation, payload: selectedValidityPoints, type: true }} />
      )}
      <div className={`${validityPointsValidated ? cubeSectionDisabled : ''}`}>
        <CubeSectionTitle type="validityPoints" />
        <div className={cubeValidityDropdown}>
          <Select
            name={VALIDITY}
            isSearchable
            id={VALIDITY}
            value={selectedValidityPoints}
            onChange={setValidityPoints}
            options={allValidityPointsOptions}
            styles={{ option: getDropdownStyle }}
          />
        </div>
        {validateShouldDisplay && (
          <CubeRadioValidate {...{ action: handleValidityValidation, payload: selectedValidityPoints, type: false }} />
        )}
      </div>
    </div>
  );
};

export default ValidityPoints;
