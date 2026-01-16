import { useSelector } from 'react-redux';
import { IStore } from '../../interfaces/store/IStore';
import { IProgram } from '../../interfaces/components/wall/IWallPrograms';

/**
 * Hook used to get selected program data from store
 */
const useSelectedProgram = (): IProgram => {
  const { selectedProgramId, programs } = useSelector((store: IStore) => store.wallReducer);

  return programs.find(({ id }) => id === selectedProgramId);
};

export default useSelectedProgram;
