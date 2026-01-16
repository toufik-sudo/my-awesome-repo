import React from 'react';
import { Link } from 'react-router-dom';

import { BUTTON_MAIN_VARIANT } from 'constants/ui';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';

/**
 * Atom component used to render User ranking cta
 * @param buttonText
 * @param route
 * @param className
 * @constructor
 */
const UserRankingCta = ({ buttonText, route, className = '' }) => {
  return (
    <Link to={route} className={className}>
      <ButtonFormatted buttonText={buttonText} type={BUTTON_MAIN_VARIANT.INVERTED} />
    </Link>
  );
};

export default UserRankingCta;
