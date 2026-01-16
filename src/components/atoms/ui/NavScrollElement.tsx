import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-scroll/modules';

import { INavScrollElementProps } from 'interfaces/ICommon';
import style from '../../../assets/style/components/Navbar.module.scss';

/**
 * Atom component that outputs a nav element used in landing navbar
 *
 * @param title
 * @param id
 * @param handleSetActive
 * @constructor
 *
 * @see NavScrollElementStory
 */
const NavScrollElement: FC<INavScrollElementProps> = ({
  title,
  id,
  setActive,
  offsetHeight,
  styleCustom,
  closeNav
}) => {
  return (
    <li className={style[title]}>
      <Link
        onSetActive={setActive}
        className={styleCustom}
        onClick={closeNav}
        activeClass="active"
        to={title}
        spy
        smooth
        offset={offsetHeight}
      >
        <FormattedMessage id={`landing.nav.${id || title}`} />
      </Link>
    </li>
  );
};

export default NavScrollElement;
