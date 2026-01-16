import { useWallSelection } from 'hooks/wall/useWallSelection';

/**
 * Returns the current platform id from store
 */
const usePlatformIdSelection = () => {
  const { selectedPlatform } = useWallSelection();
  return selectedPlatform && selectedPlatform.id;
};

export default usePlatformIdSelection;
