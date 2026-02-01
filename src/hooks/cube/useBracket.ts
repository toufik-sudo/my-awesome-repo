// -----------------------------------------------------------------------------
// useBracket Hook
// Migrated from old_app/src/hooks/launch/cube/allocation/useBracket.ts
// -----------------------------------------------------------------------------

import { useBracketLabels } from './useBracketLabels';
import { cubeFieldValidationManager, type IBracket } from '@/services/cube/CubeServices';

/**
 * Hook used to handle all bracket data
 */
export const useBracket = (
  goalIndex: number,
  bracketsData: IBracket[],
  setBracketsData: (data: IBracket[]) => void,
  inputType: Record<string, any>
) => {
  const { fieldLabels } = useBracketLabels(goalIndex, inputType);

  const handleBracketInputChange = (target: string, value: string | number, index: number) => {
    const updatedBracketsData = [...bracketsData];
    updatedBracketsData.splice(index, 1, { ...bracketsData[index], [target]: value });
    setBracketsData(updatedBracketsData);
  };

  const handleBracketValidation = (
    target: string,
    value: string | number,
    index: number,
    validation: Record<string, any>
  ): string => {
    const updatedBracketsData = [...bracketsData];
    const errorList = cubeFieldValidationManager(validation, value, bracketsData, index);
    updatedBracketsData.splice(index, 1, {
      ...updatedBracketsData[index],
      errors: { ...updatedBracketsData[index].errors, [target]: errorList }
    });

    return errorList;
  };

  const handleBracketDelete = (index: number) => {
    const updatedBracket = [...bracketsData];
    updatedBracket.splice(index, 1);
    setBracketsData(updatedBracket);
  };

  return { fieldLabels, handleBracketInputChange, handleBracketDelete, handleBracketValidation };
};

export default useBracket;
