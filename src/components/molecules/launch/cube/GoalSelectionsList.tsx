import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ButtonDelete from 'components/atoms/ui/ButtonDelete';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { IStore } from 'interfaces/store/IStore';
import { deleteGoal } from 'store/actions/launchActions';
import { getAllocationTypes } from 'services/CubeServices';
import { INITIAL_GOAL_INDEX } from 'constants/wall/launch';

import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';

/**
 * Molecule component used to render goal selection list
 *
 * @constructor
 */
const GoalSelectionsList = ({ selectedGoal, setSelectedGoal }) => {
  const dispatch = useDispatch();
  const { goalList, goalItem, goalItemActive, goalDeleteButton } = style;
  const { cube } = useSelector((store: IStore) => store.launchReducer);
  const shouldDeleteDisplay = cube.goals.length > 1;
  const processCubeAllocations = getAllocationTypes(cube);

  return (
    <div className={goalList}>
      {cube.goals.map((goal, index) => {
        const updateIndex = ++index;

        return (
          <DynamicFormattedMessage
            className={`${goalItem} ${selectedGoal === updateIndex ? goalItemActive : ''}`}
            key={index}
            tag={HTML_TAGS.DIV}
            id="launchProgram.cube.goal"
            values={{ index: updateIndex }}
            onClick={() => setSelectedGoal(updateIndex)}
          />
        );
      })}
      {shouldDeleteDisplay && (
        <ButtonDelete
          className={goalDeleteButton}
          onclick={() => {
            dispatch(deleteGoal(processCubeAllocations, cube.correlated));
            setSelectedGoal((cube.goals.length && cube.goals.length - 1) || INITIAL_GOAL_INDEX);
          }}
        />
      )}
    </div>
  );
};

export default GoalSelectionsList;
