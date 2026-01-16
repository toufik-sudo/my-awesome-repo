import { useBracketLabels } from 'hooks/launch/cube/allocation/useBracketLabels';
import { cubeFieldValidationManager } from 'services/CubeServices';

/**
 * Hook used to handle all bracket data
 *
 * @param goalIndex
 * @param bracketsData
 * @param setBracketsData
 * @param inputType
 */
export const useBracket = (goalIndex, bracketsData, setBracketsData, inputType) => {
  const { fieldLabels } = useBracketLabels(goalIndex, inputType);

  const handleBracketInputChange = (target, value, index) => {
    const updatedBracketsData = bracketsData;
    updatedBracketsData.splice(index, 1, { ...bracketsData[index], [target]: value });
    setBracketsData([...updatedBracketsData]);
  };

  const handleBracketValidation = (target, value, index, validation) => {
    const updatedBracketsData = bracketsData;
    const errorList = cubeFieldValidationManager(validation, value, bracketsData, index);
    updatedBracketsData.splice(index, 1, {
      ...updatedBracketsData[index],
      errors: { ...updatedBracketsData[index].errors, [target]: errorList }
    });

    return errorList;
  };

  const handleBracketDelete = index => {
    const updatedBracket = bracketsData;
    updatedBracket.splice(index, 1);
    setBracketsData([...updatedBracket]);
  };

  return { fieldLabels, handleBracketInputChange, handleBracketDelete, handleBracketValidation };
};
