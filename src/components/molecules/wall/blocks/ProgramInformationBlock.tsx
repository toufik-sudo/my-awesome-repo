import React from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { setScale } from 'utils/animations';
import { DELAY_TYPES } from 'constants/animations';

import style from 'sass-boilerplate/stylesheets/components/wall/beneficiary/IntroBlock.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render program information block on wall
 *
 * @constructor
 */
const ProgramInformationBlock = ({ children, isBodyOpen, setBody, className = '' }) => {
  const { withShadowLight, withBackgroundDefault, relative, w100 } = coreStyle;
  const { introBlockBody, introBlockArrow, introBlockHidden, introBlockArrowReversed } = style;

  let contentOutput = children;

  if (isBodyOpen) {
    contentOutput = (
      <SpringAnimation settings={setScale(DELAY_TYPES.NONE)} className={w100}>
        {children}
      </SpringAnimation>
    );
  }

  return (
    <div
      className={`${introBlockBody} ${withShadowLight} ${relative} ${withBackgroundDefault} ${
        !isBodyOpen ? introBlockHidden : ''
      } ${className}`}
    >
      <FontAwesomeIcon
        icon={faChevronDown}
        className={`${introBlockArrow} ${!isBodyOpen ? introBlockArrowReversed : ''}`}
        onClick={() => setBody(!isBodyOpen)}
      />
      {contentOutput}
    </div>
  );
};

export default ProgramInformationBlock;
