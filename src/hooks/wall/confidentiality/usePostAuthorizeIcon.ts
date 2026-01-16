import { useWallSelection } from 'hooks/wall/useWallSelection';
import { getUserAuthorizations, isAnyKindOfAdmin, isAnyKindOfManager } from 'services/security/accessServices';

/**
 * Hook used to return the state for show confidentiality
 */
export const usePostAuthorizeData = isAutomatic => {
  const {
    selectedPlatform: { role }
  } = useWallSelection();
  const userRights = getUserAuthorizations(role);
  const showConfidentiality = !isAutomatic && (isAnyKindOfAdmin(userRights) || isAnyKindOfManager(userRights));

  return { showConfidentiality };
};
