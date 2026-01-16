import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

import { resolveVideoType } from 'services/WallServices';

import mediaStyle from 'sass-boilerplate/stylesheets/components/wall/PostMedia.module.scss';

/**
 * Atom component used to render video file block
 * @param media
 * @param setShowModal
 * @constructor
 */
const VideoFilePreview = ({ media, setShowModal }) => {
  const { mediaVideo, mediaVideoPlay } = mediaStyle;

  return (
    <div className={mediaVideo} onClick={() => setShowModal(true)}>
      <video width="100%">
        <source src={media.url} type={`video/${resolveVideoType(media.ext)}`} />
        Your browser does not support the video tag.
      </video>
      <FontAwesomeIcon icon={faPlayCircle} className={mediaVideoPlay} />
    </div>
  );
};

export default VideoFilePreview;
