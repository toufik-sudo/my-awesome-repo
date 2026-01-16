import { useSelector } from 'react-redux';

import { IStore } from 'interfaces/store/IStore';
import { getBracketFieldsLabels, getBracketType } from 'services/CubeServices';

/**
 * Hook used to handle bracket labels
 *
 * @param goalIndex
 * @param inputType
 */
export const useBracketLabels = (goalIndex, inputType) => {
  const { type, cube } = useSelector((store: IStore) => store.launchReducer);
  const currentGoal = cube.goals[goalIndex];
  const measurementType = currentGoal.measurementType;
  const bracketFormType = getBracketType(type, measurementType);
  const fieldLabels = getBracketFieldsLabels(bracketFormType, type, inputType);

  return { fieldLabels };
};
