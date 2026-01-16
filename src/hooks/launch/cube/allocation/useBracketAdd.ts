import { ALPHABETIC_LIMIT, BASE_BRACKET_VALUE, BRACKET_TYPE, DISABLED } from 'constants/wall/launch';

/**
 * Hook used to handle bracket
 *
 * @param setBracketsData
 * @param bracketsData
 */
export const useBracketAdd = (setBracketsData, bracketsData) => {
  const handleAddBracket = () =>
    setBracketsData([...bracketsData, { ...BASE_BRACKET_VALUE, [BRACKET_TYPE.STATUS]: DISABLED }]);
  const addBracketVisible =
    bracketsData[bracketsData.length - 1].status !== DISABLED && bracketsData.length < ALPHABETIC_LIMIT;

  return { handleAddBracket, addBracketVisible };
};
