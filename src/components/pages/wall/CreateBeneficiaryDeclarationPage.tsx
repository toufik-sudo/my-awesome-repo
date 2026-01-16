import React from 'react';

import CreateUserDeclarationFormWrapper from 'components/organisms/form-wrappers/CreateUserDeclarationFormWrapper';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { GeneralErrorBlock } from 'components/molecules/wall/blocks/GeneralErrorBlock';

/**
 * Component used for rendering the form used by a beneficiar to upload a declaration
 * @constructor
 */
const CreateBeneficiaryDeclarationPage = () => {
  const { selectedProgramId } = useWallSelection();

  if (!selectedProgramId) {
    return <GeneralErrorBlock id="wall.userDeclarations.program.notSelected" />;
  }

  return <CreateUserDeclarationFormWrapper />;
};

export default CreateBeneficiaryDeclarationPage;
