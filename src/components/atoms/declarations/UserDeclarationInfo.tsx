import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/wall/UsersDeclarationDetail.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render User Declaration Information Header
 * @param props
 * @param props.id declaration id
 * @param props.program declaration program
 * @param props.program.name declaration program name
 * @param props.program.type declaration program type
 * @constructor
 */
const UserDeclarationInfo = ({ id, program: { name: programName, type: programType } }) => {
  const { withPrimaryColor, withBoldFont, withGrayAccentColor, withFontXLarge, relative } = coreStyle;
  const { userDeclarationsDetailControls } = style;

  return (
    <div className={`${userDeclarationsDetailControls} ${relative}`}>
      <DynamicFormattedMessage
        className={`${withPrimaryColor} ${withBoldFont}`}
        tag={HTML_TAGS.P}
        id={`program.type.${programType}`}
      />
      <p className={`${withGrayAccentColor} ${withBoldFont} ${withFontXLarge}`}>{programName}</p>
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        className={withPrimaryColor}
        id="wall.userDeclarations.details.id"
        values={{ id }}
      />
    </div>
  );
};

export default UserDeclarationInfo;
