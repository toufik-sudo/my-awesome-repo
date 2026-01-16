import React from 'react';

import MediaModal from 'components/molecules/wall/postBlock/media/MediaModal';
import MediaImage from 'components/atoms/wall/MediaImage';
import MediaFile from 'components/atoms/wall/MediaFile';
import VideoFilePreview from 'components/atoms/wall/VideoFilePreview';
import { FILE, VIDEO } from 'constants/files';

import postStyle from 'sass-boilerplate/stylesheets/components/wall/PostList.module.scss';

/**
 * Molecule component used to render file preview of posts and comments based on type
 * @param media
 * @param mediaType
 * @param showModal
 * @param setShowModal
 * @constructor
 */
const MediaBlock = ({ media, mediaType, showModal, setShowModal }) => {
  let preview = <MediaImage {...{ media, setShowModal }} />;

  if (mediaType === FILE) {
    preview = <MediaFile media={media} />;
  }

  if (mediaType === VIDEO) {
    preview = <VideoFilePreview {...{ media, setShowModal }} />;
  }

  return (
    <>
      <div className={postStyle.postMediaContainer}>{preview}</div>
      <MediaModal {...{ setShowModal, media, mediaType, showModal }} />
    </>
  );
};

export default MediaBlock;
