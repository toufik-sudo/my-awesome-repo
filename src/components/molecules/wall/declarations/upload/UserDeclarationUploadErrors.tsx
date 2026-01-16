import React from 'react';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import UserDeclarationUploadRowErrors from './UserDeclarationUploadRowErrors';

/**
 * Molecule component used to render errors on user declarations upload
 * @param uploadResponse
 * @constructor
 */
const UserDeclarationUploadErrors = ({ uploadResponse }) => {
  const { invalidRecords } = uploadResponse;
  const { w100, mt2, mb2, textLeft, displayFlex, flexSpace1, mh40, scrollableY, withGrayAccentColor } = coreStyle;

  if (!invalidRecords || !invalidRecords.length) {
    return null;
  }

  //TODO: needs a nicer way to display errors

  return (
    <div className={`${mt2} ${w100}`}>
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        id="wall.userDeclaration.upload.invalidLines"
        values={{ count: uploadResponse.totalInvalid }}
        className={`${mb2} ${coreStyle.withDangerColor}`}
      />
      <div
        className={`${displayFlex} ${textLeft} ${mb2} ${w100} ${withGrayAccentColor} ${coreStyle['flex-direction-row']}`}
      >
        <DynamicFormattedMessage className={flexSpace1} tag={HTML_TAGS.P} id="wall.userDeclaration.upload.row" />
        <DynamicFormattedMessage className={flexSpace1} tag={HTML_TAGS.P} id="wall.userDeclaration.upload.column" />
        <DynamicFormattedMessage
          className={flexSpace1}
          tag={HTML_TAGS.P}
          id="wall.userDeclaration.upload.errorHeader"
        />
      </div>
      <div className={`${mh40} ${scrollableY}`}>
        {invalidRecords.map((rowErrors, index) => (
          <UserDeclarationUploadRowErrors key={`${rowErrors.rowNumber}_${index}`} {...rowErrors} />
        ))}
      </div>
    </div>
  );
};

export default UserDeclarationUploadErrors;
