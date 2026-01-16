import React from 'react';

import Button from 'components/atoms/ui/Button';
import useUserDeclarationValidation from 'hooks/declarations/useUserDeclarationValidation';
import Loading from 'components/atoms/ui/Loading';
import { LOADER_TYPE } from 'constants/general';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { USER_DECLARATION_STATUS } from 'constants/api/declarations';
import { isPendingUserDeclarationStatus, getUserDeclarationStatusSettings } from 'services/UserDeclarationServices';
import { emptyFn } from 'utils/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import style from 'sass-boilerplate/stylesheets/components/wall/UsersDeclarationDetail.module.scss';

/**
 * Molecule component used to render User Declarations validation controls (Validate/Refuse)
 * @param props
 * @param props.declaration
 * @param props.reloadDeclaration
 * @param props.triggerConfirmation
 * @param isBeneficiary
 * @constructor
 */
const UserDeclarationValidationControls = ({ declaration, reloadDeclaration, triggerConfirmation, isBeneficiary }) => {
  const { userDeclarationsDetailControls } = style;
  const { status, isValidating, confirmValidation } = useUserDeclarationValidation(
    declaration,
    reloadDeclaration,
    triggerConfirmation
  );

  if (isValidating) {
    return <Loading type={LOADER_TYPE.DROPZONE} />;
  }

  if (!isBeneficiary && isPendingUserDeclarationStatus(status)) {
    return (
      <div className={userDeclarationsDetailControls}>
        <div className={coreStyle.mb1}>
          <DynamicFormattedMessage
            tag={Button}
            onClick={() => confirmValidation(USER_DECLARATION_STATUS.VALIDATED)}
            id="wall.userDeclaration.validation.accept"
          />
        </div>
        <div>
          <DynamicFormattedMessage
            type={BUTTON_MAIN_TYPE.DANGER}
            tag={Button}
            onClick={() => confirmValidation(USER_DECLARATION_STATUS.DECLINED)}
            id="wall.userDeclaration.validation.decline"
          />
        </div>
      </div>
    );
  }

  const { statusDescriptionId } = getUserDeclarationStatusSettings(status);

  return (
    <div className={userDeclarationsDetailControls}>
      <DynamicFormattedMessage
        tag={Button}
        type={BUTTON_MAIN_TYPE.DISABLED}
        onClick={emptyFn}
        id={statusDescriptionId}
      />
    </div>
  );
};

export default UserDeclarationValidationControls;
