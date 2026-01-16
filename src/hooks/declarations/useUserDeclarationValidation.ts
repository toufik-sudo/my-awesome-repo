import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import UserDeclarationApi from 'api/UserDeclarationsApi';
import { extractErrorCode } from 'utils/api';
import { ERROR_CODES } from 'constants/api/declarations';

const userDeclarationApi = new UserDeclarationApi();
/**
 * Hook used to validate a single user declaration
 * @param declaration
 * @param reloadDeclaration
 * @param intl
 */
const useUserDeclarationValidation = (declaration: any = {}, reloadDeclaration, triggerConfirmation) => {
  const [validation, setValidation] = useState<any>({ status: declaration.status, isValidating: false });
  const intl = useIntl();

  const onValidate = useCallback(
    async status => {
      if (validation.isValidating) {
        return;
      }

      setValidation({ ...validation, isValidating: true });
      toast.dismiss();

      try {
        await userDeclarationApi.validateDeclaration(declaration, status);
        setValidation({ status, isValidating: false });
      } catch ({ response }) {
        if (extractErrorCode(response) === ERROR_CODES.USER_DECLARATION_CHANGED) {
          toast(intl.formatMessage({ id: 'wall.userDeclaration.validation.error.updated' }));
          reloadDeclaration();
          return;
        }
        if (response&&response.data&&(response.data.message == "COMPANY WINS IS NOT SUFFISANTE !")) {
          toast(intl.formatMessage({ id: 'wall.userDeclaration.validation.error.notSuffisantWins' }));
          return;
        }
      }
    },
    [declaration, reloadDeclaration, validation, intl]
  );

  const confirmValidation = useCallback(
    status =>
      triggerConfirmation({
        question: 'wall.userDeclarations.validation.confirm',
        onAccept: onValidate,
        onAcceptArgs: 'status',
        data: { status }
      }),
    [triggerConfirmation, onValidate]
  );

  useEffect(() => {
    setValidation({ status: declaration.status, isValidating: false });
  }, [declaration]);

  return { ...validation, confirmValidation };
};

export default useUserDeclarationValidation;
