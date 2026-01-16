import { useContext, useEffect, useState } from 'react';

import { UserContext } from 'components/App';

/**
 * Hook used to return currentUserId and user status
 * @param isBeneficiary
 */
const useUserDeclarationViewDetailsNotes = isBeneficiary => {
  const [currentUserId, setCurrentUserId] = useState([]);
  const { userData = {} } = useContext(UserContext);

  useEffect(() => {
    const userDataKeys = Object.keys(userData);
    if (userDataKeys.length) {
      setCurrentUserId(userData.id);
    }
  }, [userData]);

  return { currentUserId, isBeneficiary };
};

export default useUserDeclarationViewDetailsNotes;
