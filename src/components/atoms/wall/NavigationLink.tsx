import React from 'react';
import { NavLink } from 'react-router-dom';

import { LINK_TARGET } from 'constants/ui';

import style from 'assets/style/components/wall/LeftNavigation.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render navigation item
 * @param url
 * @param children
 * @param isDisabled
 * @param external
 * @constructor
 *
 */
const NavigationLink = ({ url, children, isDisabled = false, external = false }) => {
  const opacity = coreStyle.opacity07;

  if (isDisabled) {
    return <div className={`${opacity} ${style.disabledElement}`}>{children}</div>;
  }

  if (external) {
    return (
      <a href={url} target={LINK_TARGET.BLANK} className={opacity}>
        {children}
      </a>
    );
  }

  return (
    <NavLink to={url} className={opacity} activeClassName={style.activeElement}>
      {children}
    </NavLink>
  );
};

export default NavigationLink;
