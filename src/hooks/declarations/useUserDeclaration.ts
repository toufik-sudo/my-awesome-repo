import { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import UserDeclarationApi from 'api/UserDeclarationsApi';
import { isNotFound, isForbidden } from 'utils/api';
import { PAGE_NOT_FOUND, USER_DECLARATIONS_ROUTE } from 'constants/routes';
import { setModalState } from 'store/actions/modalActions';
import { CONFIRMATION_MODAL } from 'constants/modal';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { isUserBeneficiary } from 'services/security/accessServices';

const userDeclarationApi = new UserDeclarationApi();
/**
 * Hook used to load a single user declaration (by Id).
 * @param declarationId
 */
const useUserDeclaration = (declarationId: number) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const [declaration, setDeclaration] = useState<any>({});
  const [isLoading, setLoading] = useState(true);
  const [confirmationProps, setConfirmationProps] = useState<any>();
  const history = useHistory();
  const loading = isLoading || declaration.id !== declarationId;
  const {
    selectedPlatform: { role }
  } = useWallSelection();
  const isBeneficiary = isUserBeneficiary(role);

  useEffect(() => {
    if (confirmationProps) {
      dispatch(setModalState(true, CONFIRMATION_MODAL, confirmationProps.data));
    }
  }, [confirmationProps, dispatch]);

  const loadDeclaration = useCallback(async () => {
    setLoading(true);
    try {
      const declaration = await userDeclarationApi.getDeclaration(declarationId);
      const declarationFields = await userDeclarationApi.getDeclarationFields(declaration.program.id);
      setDeclaration({ ...declaration, fields: declarationFields });
      setLoading(false);
    } catch ({ response }) {
      if (isNotFound(response) || isForbidden(response)) {
        history.push(PAGE_NOT_FOUND);
        return;
      }

      toast(intl.formatMessage({ id: 'wall.userDeclaration.details.error.failedToLoad' }));
      history.push(USER_DECLARATIONS_ROUTE);
    }
  }, [declarationId, history]);

  useEffect(() => {
    loadDeclaration();
  }, [loadDeclaration]);

  return {
    declaration,
    isLoading: loading,
    reloadDeclaration: loadDeclaration,
    confirmationProps,
    triggerConfirmation: setConfirmationProps,
    isBeneficiary
  };
};

export default useUserDeclaration;
