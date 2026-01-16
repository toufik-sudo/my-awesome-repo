import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setIsProgramSelectionLocked } from 'store/actions/wallActions';
import { useWallSelection } from 'hooks/wall/useWallSelection';

/**
 * Disables the programs selection locking it to the current selected program
 * as long as the current hook is mounted
 */
const useLockProgramSelection = () => {
  const dispatch = useDispatch();
  const { isProgramSelectionLocked } = useWallSelection();

  useEffect(() => {
    dispatch(setIsProgramSelectionLocked(true));

    return () => {
      dispatch(setIsProgramSelectionLocked(false));
    };
  }, [isProgramSelectionLocked]);
};

export default useLockProgramSelection;
