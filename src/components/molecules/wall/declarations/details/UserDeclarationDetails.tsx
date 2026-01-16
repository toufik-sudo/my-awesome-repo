import React from 'react';

import UserDeclarationNotes from 'components/molecules/wall/declarations/details/UserDeclarationNotes';
import UserDeclarationDetailForm from 'components/molecules/wall/declarations/details/UserDeclarationDetailsForm';

/**
 * Molecule component used to render User Declaration details
 * @param declaration
 * @param triggerConfirmation
 * @param isBeneficiary
 * @constructor
 */
const UserDeclarationDetails = ({ declaration, triggerConfirmation, isBeneficiary }) => {
  const { id, fields: fieldsToDisplay } = declaration;

  return (
    <>
      <UserDeclarationDetailForm {...{ fieldsToDisplay, declaration }} />
      <UserDeclarationNotes {...{ declarationId: id, triggerConfirmation, isBeneficiary }} />
    </>
  );
};

export default UserDeclarationDetails;
