// -----------------------------------------------------------------------------
// useBracketAdd Hook
// Migrated from old_app/src/hooks/launch/cube/allocation/useBracketAdd.ts
// -----------------------------------------------------------------------------

import { ALPHABETIC_LIMIT, BASE_BRACKET_VALUE, BRACKET_TYPE, DISABLED } from '@/constants/wall/launch';
import type { IBracket } from '@/services/cube/CubeServices';

/**
 * Hook used to handle bracket addition
 */
export const useBracketAdd = (
  setBracketsData: (data: IBracket[]) => void,
  bracketsData: IBracket[]
) => {
  const handleAddBracket = () =>
    setBracketsData([...bracketsData, { ...BASE_BRACKET_VALUE, [BRACKET_TYPE.STATUS]: DISABLED } as IBracket]);
  
  const addBracketVisible =
    bracketsData[bracketsData.length - 1]?.status !== DISABLED && 
    bracketsData.length < ALPHABETIC_LIMIT;

  return { handleAddBracket, addBracketVisible };
};

export default useBracketAdd;
