import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { addAdditionalDisabledBracket, getBracketDisplayReady } from 'services/CubeServices';
import { IStore } from 'interfaces/store/IStore';

/**
 * Hook used to handle store bracket addition on local state
 *
 * @param goalIndex
 * @param setBracketsData
 */
export const useBracketStoreAdd = (goalIndex, setBracketsData) => {
  const { cube } = useSelector((store: IStore) => store.launchReducer);

  useEffect(() => {
    if (cube.goals[goalIndex].brackets.length) {
      let displayBracketsData = getBracketDisplayReady(cube.goals[goalIndex].brackets);
      displayBracketsData = addAdditionalDisabledBracket(displayBracketsData);
      setBracketsData(displayBracketsData);
    }
  }, [cube.goals[goalIndex]]);
};
