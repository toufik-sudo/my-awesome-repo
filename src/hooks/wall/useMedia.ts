import { useState } from 'react';

import { resolveMediaType } from 'services/WallServices';

/**
 * Hook used to manage media data for posts/comments
 * @param file
 */
const useMedia = file => {
  const mediaType = file && resolveMediaType(file.type);
  const [showModal, setShowModal] = useState(false);

  return { mediaType, showModal, setShowModal };
};

export default useMedia;
