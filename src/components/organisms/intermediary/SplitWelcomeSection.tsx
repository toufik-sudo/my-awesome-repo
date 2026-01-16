import React from 'react';
import { useLocation } from 'react-router-dom';

import { ID } from 'constants/landing';
import style from 'assets/style/components/WelcomePage.module.scss';
import WelcomeTitleLogo from 'components/molecules/intermediary/WelcomeTitleLogo';
import WelcomeNavigationBottom from 'components/molecules/intermediary/WelcomeNavigationBottom';
import NavLanguageSelector from 'components/molecules/onboarding/NavLanguageSelector';

/**
 * Split welcome component that renders content based on the type query parameter (LAUNCH, TAILORED)
 *
 * @constructor
 */
const SplitWelcomeSection = ({ type }) => {
  const id = new URLSearchParams(useLocation().search).get(ID);

  return (
    <>
      <NavLanguageSelector />
      <div className={style.wrapper}>
        <WelcomeTitleLogo {...{ type }} />
        <WelcomeNavigationBottom {...{ type, id }} />
      </div>
    </>
  );
};

export default SplitWelcomeSection;
