import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { setLanguage } from '@/store/actions/languageActions';
import { ILanguageOption, LANGUAGE_OPTIONS } from '@/constants/i18n';

/**
 * Hook for managing language selection
 */
export const useLanguage = () => {
  const dispatch = useAppDispatch();
  const { selectedLanguage, messages } = useAppSelector(state => state.languageReducer);

  const changeLanguage = useCallback((language: ILanguageOption) => {
    dispatch(setLanguage(language));
  }, [dispatch]);

  return {
    selectedLanguage,
    messages,
    changeLanguage,
    languageOptions: LANGUAGE_OPTIONS
  };
};
