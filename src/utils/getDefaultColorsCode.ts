import { CUSTOMISE_COLORS } from '@/constants/wall/design';

interface ColorItem {
  name: string;
  color: string;
  colors?: ColorItem[];
}

/**
 * Function used to get default color code
 * @param item - Optional item name to get specific color
 */
export const getDefaultColorsCode = (item: string | null = null): Record<string, string> | string | undefined => {
  const defaultColorCodes: Record<string, string> = {};

  CUSTOMISE_COLORS.forEach((color: ColorItem) => {
    if (color.colors) {
      color.colors.forEach((nestedColor: ColorItem) => {
        defaultColorCodes[nestedColor.name] = nestedColor.color;
      });
    } else {
      defaultColorCodes[color.name] = color.color;
    }
  });

  if (!item) return defaultColorCodes;

  return defaultColorCodes[item];
};
