import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import style from 'sass-boilerplate/stylesheets/components/wall/ProgramJoin.module.scss';
import mainLogo from 'assets/images/logo/logoColored.png';
import { FREEMIUM, PROGRAM_TYPES } from '../../../constants/wall/launch';

/**
 * Molecule component used to render program header
 * @param logo
 * @param programName
 * @param programType
 * @constructor
 */
const ProgramJoinHeader = ({ logo, programName, programType }) => {
  const { textCenter, withBoldFont, w100, tLandscapeMt5 } = coreStyle;

  return (
    <div
      className={`${coreStyle['flex-direction-column']} ${textCenter} ${w100} ${tLandscapeMt5} ${style.programJoinLogoWrapper}`}
    >
      <div className={style.programJoinLogo}>
        <img src={logo ? logo : mainLogo} alt="program logo" />
      </div>
      <DynamicFormattedMessage
        id={programType === PROGRAM_TYPES[FREEMIUM] ? 'program.join.title.freemium' : 'program.join.title'}
        values={{ programName }}
        tag={HTML_TAGS.DIV}
        className={withBoldFont}
      />
    </div>
  );
};

export default ProgramJoinHeader;
