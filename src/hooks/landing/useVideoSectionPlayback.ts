import { useEffect, useRef } from 'react';

import { VIDEO_SECTION } from 'constants/routes';

/**
 * Hook used to manage video playback
 *
 * @param currentActiveSection
 */
export const useVideoSectionPlayback = currentActiveSection => {
  const activeSection = currentActiveSection === VIDEO_SECTION;
  const videoElement = useRef(null);

  useEffect(() => {
    activeSection ? videoElement.current.play() : videoElement.current.pause();
  }, [currentActiveSection, activeSection]);

  return { videoElement };
};
