import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { IStore } from 'interfaces/store/IStore';

/**
 * Hook used to handle cube modify limitation
 *
 * @param index
 */
export const useCubeModifyLimit = index => {
  const { cube } = useSelector((store: IStore) => store.launchReducer);
  const [isCurrentGoal, setIsCurrentGoal] = useState(true);

  useEffect(() => {
    setIsCurrentGoal(cube.goals.length === index + 1);
  }, [cube]);

  return { isCurrentGoal };
};
