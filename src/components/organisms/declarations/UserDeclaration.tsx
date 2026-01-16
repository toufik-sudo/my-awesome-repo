import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import Loading from 'components/atoms/ui/Loading';
import ConfirmationModal from 'components/organisms/modals/ConfirmationModal';
import UserDeclarationDetails from 'components/molecules/wall/declarations/details/UserDeclarationDetails';
import UserDeclarationInfoHeader from 'components/molecules/wall/declarations/details/UserDeclarationInfoHeader';
import UserDeclarationValidationControls from 'components/molecules/wall/declarations/details/UserDeclarationValidationControls';
import GeneralBlock from 'components/molecules/block/GeneralBlock';
import useUserDeclaration from 'hooks/declarations/useUserDeclaration';
import { LOADER_TYPE } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/wall/UsersDeclarationDetail.module.scss';

/**
 * Organism component used to render a User Declaration block
 *
 * @constructor
 */
const UserDeclaration = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const {
    declaration,
    isLoading,
    reloadDeclaration,
    confirmationProps,
    triggerConfirmation,
    isBeneficiary
  } = useUserDeclaration(parseInt(id));
  const { userDeclarationsDetail, userDeclarationsDetailWrapper } = style;
  console.log(declaration)
  if (isLoading) {
    return <Loading type={LOADER_TYPE.DROPZONE} />;
  }

  return (
    <div className={userDeclarationsDetail}>
      <GeneralBlock>
        <div className={userDeclarationsDetailWrapper}>
          <UserDeclarationInfoHeader declaration={declaration} state={state} isBeneficiary={isBeneficiary} />
          <UserDeclarationDetails {...{ declaration, triggerConfirmation, isBeneficiary }} />
          <UserDeclarationValidationControls
            {...{
              declaration,
              reloadDeclaration,
              triggerConfirmation,
              isBeneficiary
            }}
          />
        </div>
      </GeneralBlock>
      <ConfirmationModal {...confirmationProps} />
    </div>
  );
};

export default UserDeclaration;
