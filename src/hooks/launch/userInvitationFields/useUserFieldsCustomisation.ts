import { getFieldName, handleFieldCustomSelection } from 'services/LaunchServices';
import { COMING_SOON_FIELD } from 'constants/wall/launch';

/**
 * Hook used to handle user field customisation
 *
 * @param field
 * @param selectedFields
 * @param setSelectedFields
 * @param style
 */
export const useUserFieldCustomisation = (field, selectedFields, setSelectedFields, style) => {
  const { fieldBlockElementActive, fieldBlockCustomisableElement } = style;
  const fieldName = getFieldName(field);
  const fieldTypeAndName = field && field.key;
  const isFieldMandatory = selectedFields.includes(fieldName) ? fieldBlockElementActive : '';
  const fieldRemovableClass = !field.mandatory ? fieldBlockCustomisableElement : '';
  const isFieldDisabled = fieldName === COMING_SOON_FIELD;

  const handleFormSelectionAction = () =>
    handleFieldCustomSelection(field, fieldName, selectedFields, setSelectedFields);

  return {
    isFieldMandatory,
    isFieldDisabled,
    fieldName,
    handleFormSelectionAction,
    fieldRemovableClass,
    fieldTypeAndName
  };
};
