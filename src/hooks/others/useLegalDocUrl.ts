import { useSelector } from 'react-redux';
import { IStore } from '../../interfaces/store/IStore';
import { FR_VALUE } from '../../constants/i18n';
import envConfig from '../../config/envConfig';

/**
 * Hook used to get legal doc url by language
 */
export const useLegalDocUrl = () => {
  const { value: selectedLanguage } = useSelector((state: IStore) => state.languageReducer.selectedLanguage);
  const legalDocUrl = envConfig.onboarding[selectedLanguage === FR_VALUE ? 'legalUrlFr' : 'legalUrlEn'];

  return { legalDocUrl };
};
