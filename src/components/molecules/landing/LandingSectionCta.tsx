import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-scroll/modules';

import Button from 'components/atoms/ui/Button';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { DELAY_TYPES } from 'constants/animations';
import { PRICING } from 'constants/routes';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { setTranslate } from 'utils/animations';

import componentStyle from 'sass-boilerplate/stylesheets/components/landing/LandingSectionCta.module.scss';

/**
 * Molecule component used to render landing section cta
 *
 * @constructor
 */
const LandingSectionCta = () => {
  return (
    <SpringAnimation settings={setTranslate(DELAY_TYPES.TITLE)}>
      <Link to={PRICING} spy smooth>
        <Button className={componentStyle.heroButtonSpacing} type={BUTTON_MAIN_TYPE.PRIMARY}>
          <FormattedMessage id="label.more" />
        </Button>
      </Link>
    </SpringAnimation>
  );
};

export default LandingSectionCta;
