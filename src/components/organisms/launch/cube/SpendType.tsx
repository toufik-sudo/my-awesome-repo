import React from 'react';

import SpendTypeOptionsList from 'components/organisms/launch/cube/SpendTypeOptionsList';
import CubeRadioValidate from 'components/atoms/launch/cube/CubeRadioValidate';
import CubeSectionTitle from 'components/atoms/launch/cube/CubeSectionTitle';
import { useSpendPoints } from 'hooks/launch/cube/spendType/useSpendPoints';

import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';
import { useSelector } from 'react-redux';
import { IStore } from 'interfaces/store/IStore';
import { SPEND_POINTS_TYPE } from 'constants/wall/launch';

/**
 * Organism component used to render spend type selection
 *
 * @constructor
 */
const SpendType = () => {
  const { cubeContent, cubeSectionWrapper, cubeFrequencyWrapper, cubeSectionDisabled } = style;
  
  const {
    spendPointsTypes,
    selectedSpendPoint,
    setSelectedSpendPoint,
    validateShouldDisplay,
    modifyShouldDisplay,
    sectionShouldDisplay,
    spendPointsValidated,
    handleSpendPointsValidation
  } = useSpendPoints();
  // console.log("hawlik selector")
  // console.log(useSelector)

  const { type } = useSelector((store: IStore) => store.launchReducer);

  let spendPointsTypesReal=spendPointsTypes
  if (!sectionShouldDisplay) return null;
  if(type==="sponsorship"){
   spendPointsTypesReal=[SPEND_POINTS_TYPE.AT_VALIDATION]
  }

  return (
    <div className={`${cubeSectionWrapper} ${cubeContent} ${cubeFrequencyWrapper}`}>
      {modifyShouldDisplay && (
        <CubeRadioValidate {...{ action: handleSpendPointsValidation, payload: selectedSpendPoint, type: true }} />
      )}
      <div className={`${spendPointsValidated ? cubeSectionDisabled : ''}`}>
        <CubeSectionTitle type="spendPoints" />
        <SpendTypeOptionsList {...{ selectedSpendPoint, spendPointsTypes: spendPointsTypesReal, setSelectedSpendPoint }} />
        {validateShouldDisplay && (
          <CubeRadioValidate {...{ action: handleSpendPointsValidation, payload: selectedSpendPoint, type: false }} />
        )}
      </div>
    </div>
  );
};

export default SpendType;
