import { useSelector } from 'react-redux';
import { IStore, IWallReducer } from 'interfaces/store/IStore';

/**
 * Selects wall reducer data existing on store
 */
export const useWallSelection = () => {
  return useSelector<IStore, IWallReducer>(store => store.wallReducer);
};
