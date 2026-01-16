import { useDispatch, useSelector } from 'react-redux';

import { validateItem } from 'store/actions/launchActions';
import { IStore } from 'interfaces/store/IStore';

/**
 * Hook used to handle cube section validation
 *
 * @param index
 */
export const useCubeSectionValidation = index => {
  const dispatch = useDispatch();
  const { cube } = useSelector((store: IStore) => store.launchReducer);
  const handleItemValidation = target => validateItem(cube, target, index, dispatch);

  return { handleItemValidation };
};
