import { useSelector } from 'react-redux';

import { IStore } from 'interfaces/store/IStore';
import { getDefaultColorsCode } from 'utils/getDefaultColorsCode';
import { COLOR_TITLES } from 'constants/wall/design';
import { IArrayKey } from 'interfaces/IGeneral';

/**
 * Hook used to get the color for titles displayed in contents block
 */
export const useContentsTitlesColor = () => {
  const design = useSelector<IStore, IArrayKey<string> | undefined>((store: IStore) => store.launchReducer.design);
  let color = getDefaultColorsCode(COLOR_TITLES);
  if (design && design.colorTitles) {
    color = design.colorTitles;
  }

  return { color };
};
