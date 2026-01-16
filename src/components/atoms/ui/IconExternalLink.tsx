import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Atom component used to render a link with icon
 *
 * @param icon
 * @constructor
 *
 * @see IconExternalLinkStory
 */
const IconExternalLink = ({ icon: { url, platform } }) => (
  <a href={url} target="_blank" rel="noopener noreferrer">
    <FontAwesomeIcon icon={platform} />
  </a>
);
export default IconExternalLink;
