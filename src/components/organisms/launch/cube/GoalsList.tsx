/* eslint-disable quotes */
import React from 'react';

import CubeTypeForms from 'components/organisms/launch/cube/CubeTypeForms';
import SpecificProducts from 'components/organisms/launch/cube/SpecificProducts';
import MeasurementType from 'components/organisms/launch/cube/MeasurementType';
import CubeControls from 'components/molecules/launch/cube/CubeControls';
import { useGoalList } from 'hooks/launch/cube/useGoalList';

/**
 * Organism component used to render goal list
 *
 * @param selectedGoal
 * @param setSelectedGoal
 * @constructor
 */
const GoalsList = ({ selectedGoal, setSelectedGoal }) => {
  const {
    handleSpecificProductsSelection,
    cube,
    handleMethodMechanismSelection,
    handleAllocationTypeSelection
  } = useGoalList();

  return (
    <>
      {cube.goals.map((goal, index) => {
        const updatedIndex = index + 1;
        if (selectedGoal === updatedIndex) {
          return (
            <div key={index}>
              <SpecificProducts {...{ goal, index, handleSelection: handleSpecificProductsSelection }} />
              <MeasurementType {...{ index, cube, handleMethodMechanismSelection }} />
              <CubeTypeForms {...{ index, cube, handleAllocationTypeSelection }} />
              <CubeControls {...{ goal, index, setSelectedGoal }} />
            </div>
          );
        }
      })}
    </>
  );
};

export default GoalsList;
