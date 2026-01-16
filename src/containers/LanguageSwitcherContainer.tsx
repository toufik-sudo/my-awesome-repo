import { useDispatch, useSelector } from 'react-redux';

import { ILanguageOption } from 'interfaces/store/actions/ILanguageActions';
import { setLanguage } from 'store/actions/languageActions';
import { IStore } from 'interfaces/store/IStore';

/**
 * Language switcher container used to render dropdown from where a language is selected
 *
 * @constructor
 */
const LanguageSwitcherContainer = ({ children }) => {
  const selectedLanguage = useSelector((state: IStore) => state.languageReducer.selectedLanguage);
  const dispatch = useDispatch();
  const handleLanguageChange = (language: ILanguageOption) => dispatch(setLanguage(language));

  return children({ selectedLanguage, handleLanguageChange });
};

export default LanguageSwitcherContainer;
