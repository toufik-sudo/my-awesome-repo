/* eslint-disable quotes */
import React from 'react';
import GenericFormBuilder from 'components/organisms/form-wrappers/GenericFormBuilder';
import WallCreateAccount from 'components/molecules/forms/updateAccountInformation/WallCreateAccount';
import { emptyFn } from 'utils/general';

/**
 * Organism component used to render wall update personal information form
 * @param personalInformationFields
 * @param userData
 * @param userEmail
 * @param setUserEmail
 * @param imageError
 * @param setImageError
 * @constructor
 */
const PersonalInformationForm = ({
  personalInformationFields,
  userData,
  userEmail,
  setUserEmail,
  imageError,
  setImageError
}) => {
  return (
    <GenericFormBuilder
      formAction={emptyFn}
      formDeclaration={personalInformationFields}
      formSlot={form => (
        <WallCreateAccount
          {...{
            userEmail: userEmail,
            setUserEmail,
            userData,
            form,
            imageError,
            setImageError
          }}
        />
      )}
      disableSubmit={true}
    />
  );
};

export default PersonalInformationForm;
