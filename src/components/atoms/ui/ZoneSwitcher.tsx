import React from 'react';
import Select from 'react-select';

import { ZONE_OPTIONS } from 'constants/i18n';
import { customStyles, onboardingCustomStyles } from 'constants/languageSwitcher';

import style from 'assets/style/components/Navbar.module.scss';

/**
 * Zone switcher atom component renders a dropdown that can output a value|label selected option
 *
 * @param selectedZone
 * @param handleZoneChange
 * @param isOnboardingFlow
 * @param customClass
 * @constructor
 */
const ZoneSwitcher = ({ selectedZone, handleZoneChange, isOnboardingFlow = false, customClass = '' }) => (
  <Select
    isSearchable={true}
    value={selectedZone}
    onChange={zone => handleZoneChange(zone)}
    options={ZONE_OPTIONS}
    styles={isOnboardingFlow ? onboardingCustomStyles : customStyles}
    classNamePrefix="language"
    className={`${style.lswitch} ${customClass}`}
  />
);

export default ZoneSwitcher;
