import React from 'react';

import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { DOT_SEPARATOR } from 'constants/general';
import { DELAY_MULTIPLIER } from 'constants/animations';
import { setTranslate } from 'utils/animations';
import { useUserFieldCustomisation } from 'hooks/launch/userInvitationFields/useUserFieldsCustomisation';
import { emptyFn } from 'utils/general';

import style from 'assets/style/components/launch/FieldBlock.module.scss';

/**
 * Molecule component used to render Mandatory field Element for user invitation
 *
 * @field
 */
const UserFieldElement = ({ field, index, selectedFields, setSelectedFields, isUserInformation }) => {
  const { fieldBlockElementDisabled, fieldBlockElement, fieldBlockHolder } = style;
  const {
    isFieldMandatory,
    fieldRemovableClass,
    isFieldDisabled,
    handleFormSelectionAction,
    fieldName,
    fieldTypeAndName
  } = useUserFieldCustomisation(field, selectedFields, setSelectedFields, style);

  const messageToDisplay = isUserInformation ? fieldName : fieldTypeAndName;

  return (
    <div className={fieldBlockHolder} onClick={!isFieldDisabled ? handleFormSelectionAction : emptyFn}>
      <DynamicFormattedMessage
        tag={SpringAnimation}
        settings={setTranslate(index * DELAY_MULTIPLIER)}
        className={`${fieldBlockElement} ${isFieldMandatory} ${fieldRemovableClass} ${
          isFieldDisabled ? fieldBlockElementDisabled : ''
        }`}
        id={`form${DOT_SEPARATOR}label${DOT_SEPARATOR}${messageToDisplay}`}
      />
    </div>
  );
};

export default UserFieldElement;
