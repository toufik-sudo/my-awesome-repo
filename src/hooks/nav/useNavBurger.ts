import { useEffect, useState } from 'react';

import componentStyle from 'assets/style/components/LeftSideLayout.module.scss';

export const useNavBurger = () => {
  const [bodyClass, setBodyClass] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const body = document.body.classList;

  const toggleClass = () => {
    setBodyClass(!bodyClass);
    setChecked(!isChecked);
  };

  const closeNav = () => {
    setBodyClass(false);
    setChecked(false);
  };

  useEffect(() => {
    bodyClass ? body.add(componentStyle.navOpened) : body.remove(componentStyle.navOpened);
  }, [bodyClass]);

  return { toggleClass, isChecked, closeNav };
};
