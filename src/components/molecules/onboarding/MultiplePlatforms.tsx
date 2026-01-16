import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { WELCOME_TAILORED_ROUTE } from 'constants/routes';
import style from 'assets/style/common/Labels.module.scss';

/**
 * Molecule component used to render multiple platforms text block
 *
 * @constructor
 */
const MultiplePlatforms = () => {
  const { block, bold, center } = style;

  return (
    <div className={`${block} ${center}`}>
      <FormattedMessage id="personalInformation.info.multiple.title" />
      <DynamicFormattedMessage
        tag={Link}
        target="_blank"
        to={WELCOME_TAILORED_ROUTE}
        className={bold}
        id="personalInformation.info.multiple.cta"
      />
    </div>
  );
};

export default MultiplePlatforms;
