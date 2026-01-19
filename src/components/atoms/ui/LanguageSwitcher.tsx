import React from 'react';
import Select from 'react-select';

import { ILanguageOption } from 'interfaces/store/actions/ILanguageActions';
import { LANGUAGE_OPTIONS } from 'constants/i18n';
import { customStyles, onboardingCustomStyles } from 'constants/languageSwitcher';
import style from 'assets/style/components/Navbar.module.scss';

/**
 * Language switcher atom component renders a dropdown that can output a value|label selected option
 *
 * @param selectedLanguage
 * @param handleLanguageChange
 * @param isOnboardingFlow
 * @param customClass
 * @constructor
 */
const LanguageSwitcher = ({ selectedLanguage, handleLanguageChange, isOnboardingFlow = false, customClass = '' }) => {
  console.log('selectedLanguage', selectedLanguage);
  if (selectedLanguage && !isOnboardingFlow) {
    selectedLanguage.shortLabel = selectedLanguage.value == 'en' ? 'EN' : 'FR';
  }
  const formatOptionLabel = (option, { context }) => {
    if (context === 'menu') {
      // Ce qui s'affiche dans le dropdown
      return (
        <div>
          <strong>{option.label}</strong>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {option.description}
          </div>
        </div>
      );
    }
    // Ce qui s'affiche dans l'input une fois sélectionné
    return option.shortLabel || option.label;
  };
  return (
    <Select
      isSearchable={true}
      value={selectedLanguage}
      onChange={language => handleLanguageChange(language as ILanguageOption)}
      options={LANGUAGE_OPTIONS}
      styles={isOnboardingFlow ? onboardingCustomStyles : customStyles}
      classNamePrefix="language"
      className={`${style.lswitch} ${customClass}`}
      formatOptionLabel={formatOptionLabel}
    />
  );

}

export default LanguageSwitcher;
