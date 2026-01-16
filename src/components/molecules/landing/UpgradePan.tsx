import React from 'react';

import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { UPGRADE_PLAN, WALL } from 'constants/routes';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render a column for pricing section
 * @constructor
 */
const UpgradePan = () => {
  const {
    withBackgroundGradient,
    withDefaultColor,
    p3,
    mt1,
    textCenter,
    borderRadius1,
    textUppercase,
    textMd,
    fontWeight700,
    text3xl,
    mb1,
    shadowLight,
    relative
  } = coreStyle;

  return (
    <Link to={`/${WALL}${UPGRADE_PLAN}`}>
      <div
        className={`${withBackgroundGradient} ${relative} ${shadowLight} ${withDefaultColor}  ${mb1} ${mt1} ${p3} ${textCenter} ${borderRadius1}`}
      >
        <FontAwesomeIcon icon={faArrowCircleUp} className={`${text3xl} ${mb1}`} />
        <DynamicFormattedMessage
          tag={HTML_TAGS.P}
          id="upgrade.plan"
          className={`${textUppercase} ${textMd} ${fontWeight700}`}
        />
      </div>
    </Link>
  );
};
export default UpgradePan;
