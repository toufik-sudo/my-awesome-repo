import React from 'react';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render media image component
 * @param media
 * @param setShowModal
 * @constructor
 */
const MediaImage = ({ media, setShowModal }) => (
  <img
    onClick={() => setShowModal(true)}
    className={coreStyle.imgFluid}
    src={media.src}
    alt={media.alt}
    title={media.title}
  />
);

export default MediaImage;
