import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/wall/WallPostBaseBlock.module.scss';

/**
 * Atom component used to render file upload for post
 */
const UploadedFile = ({ postFile, onRemove }) => {
  if (!postFile || !postFile.file) {
    return null;
  }

  return (
    <div className={style.wallPostFilePreview}>
      <FontAwesomeIcon icon={faTimes} onClick={onRemove} />
      <p>{postFile.file.name}</p>
      {postFile.error && (
        <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={postFile.error} values={{ ...postFile.fileType }} />
      )}
    </div>
  );
};

export default UploadedFile;
