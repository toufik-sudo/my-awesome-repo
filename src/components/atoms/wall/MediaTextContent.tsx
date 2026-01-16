import React from 'react';
import * as linkify from 'linkifyjs';
import hashtag from 'linkifyjs/plugins/hashtag';
import Linkify from 'linkifyjs/react';

import MediaBlock from 'components/molecules/wall/postBlock/media/MediaBlock';
import useMedia from 'hooks/wall/useMedia';
import { FILE } from 'constants/files';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import { AutomaticTypeAdditionalContent } from './posts/AutomaticTypeAdditionalContent';

import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/wall/PostList.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import mediaStyle from 'sass-boilerplate/stylesheets/components/wall/PostMedia.module.scss';

/**
 * Atom component used to show post content block
 * @param content
 * @param file
 * @param endDate
 * @param objectId
 * @param isAutomatic
 * @param automaticType
 * @constructor
 */

hashtag(linkify);

const MediaTextContent = ({
  content,
  file,
  endDate = undefined,
  objectId = undefined,
  isAutomatic = false,
  automaticType = undefined
}) => {
  const { mediaType, showModal, setShowModal } = useMedia(file);
  const { colorFont } = useSelectedProgramDesign();

  return (
    <div
      className={`${componentStyle.postContentOrder} ${mediaType === FILE ? mediaStyle.mediaFileWrapper : ''} ${grid['mb-4']
        }`}
    >
      <span className={`${componentStyle.postContentText} ${coreStyle.withFontMedium}`} style={{ color: colorFont, whiteSpace: 'pre-line' }}>
        <Linkify>
          {!isAutomatic && content}
          {isAutomatic && (
            <div>
              <div dangerouslySetInnerHTML={{ __html: content }} />
              <AutomaticTypeAdditionalContent {...{ endDate, objectId, automaticType }} />
            </div>
          )}
        </Linkify>
      </span>
      {file && mediaType && (
        <MediaBlock
          mediaType={mediaType}
          showModal={showModal}
          setShowModal={setShowModal}
          media={{
            url: file.publicPath, //file and video
            ext: file.extension,
            src: file.publicPath, //src for image
            size: file.size,
            title: file.originalFilename,
            alt: file.originalFilename
          }}
        />
      )}
    </div>
  );
};

export default MediaTextContent;
