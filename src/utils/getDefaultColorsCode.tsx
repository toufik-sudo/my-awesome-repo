import { CUSTOMISE_COLORS } from 'constants/wall/design';

/**
 * Function used to get default color code
 * @param item
 */
export const getDefaultColorsCode = (item = null) => {
  const defaultColorCodes = [];

  CUSTOMISE_COLORS.map(color => {
    if (color.colors) {
      return color.colors.map(nestedColor => {
        defaultColorCodes[nestedColor.name] = nestedColor.color;
      });
    }

    return (defaultColorCodes[color.name] = color.color);
  });

  if (!item) return defaultColorCodes;

  return defaultColorCodes[item];
};
