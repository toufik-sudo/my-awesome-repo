import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';

import { byteConverter } from 'services/ConverterService';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import mediaStyle from 'sass-boilerplate/stylesheets/components/wall/PostMedia.module.scss';

/**
 * Atom component used to render download file block
 * @param media
 * @constructor
 */
const MediaFile = ({ media }) => {
  const { withGrayAccentColor, withFontSmall, textCenter } = coreStyle;

  return (
    <a href={media.url} rel="noopener noreferrer" className={`${textCenter} ${mediaStyle.mediaFile}`} target="_blank">
      <FontAwesomeIcon icon={faFile} size="2x" className={withGrayAccentColor} />
      <div className={mediaStyle.mediaFileNameSize}>
        <p className={withFontSmall}>{media.title}</p>
        <p className={`${withFontSmall} ${withGrayAccentColor}`}>{byteConverter(media.size)}</p>
      </div>
    </a>
  );
};

export default MediaFile;
