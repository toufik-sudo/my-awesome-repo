import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render row errors on user declarations upload
 * @param rowNumber
 * @param errors
 * @constructor
 */
const UserDeclarationUploadRowErrors = ({ rowNumber, errors = [] }) => {
  const { flexSpace1, flexSpace05, w100, displayFlex, mb15, textLeft, flexAlignItemsStart, pr05 } = coreStyle;

  return (
    <div className={displayFlex}>
      <p className={`${flexSpace05} ${pr05}`}>{rowNumber}</p>
      <ul className={`${flexSpace1} ${pr05}`}>
        {errors.map(({ code, field }) => (
          <li className={`${mb15} ${textLeft}`} key={`error_${field}_${code}`}>
            <div className={`${displayFlex} ${flexAlignItemsStart} ${w100} ${coreStyle['flex-direction-row']}`}>
              <p className={`${flexSpace1} ${pr05}`}>{field}</p>
              <DynamicFormattedMessage
                tag={HTML_TAGS.P}
                id={`wall.userDeclaration.upload.error.field.${code}`}
                className={`${flexSpace1} ${pr05}`}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDeclarationUploadRowErrors;
