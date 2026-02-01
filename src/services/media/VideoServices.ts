/**
 * Sets up window resize handler for video elements
 * @param handlerResize - Function to handle resize
 * @param initialHeight - Initial height value
 */
export const setWindowResize = (
  handlerResize: (height: number) => void,
  initialHeight: number
): (() => void) => {
  let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
  
  const handleResize = () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => handlerResize(initialHeight), 500);
  };

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
  };
};

/**
 * Checks if a video element is in viewport
 * @param element - Video element to check
 */
export const isVideoInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Plays video with promise handling
 * @param videoElement - HTML video element
 */
export const playVideo = async (videoElement: HTMLVideoElement): Promise<void> => {
  try {
    await videoElement.play();
  } catch (error) {
    console.error('Video playback failed:', error);
  }
};

/**
 * Pauses video safely
 * @param videoElement - HTML video element
 */
export const pauseVideo = (videoElement: HTMLVideoElement): void => {
  try {
    videoElement.pause();
  } catch (error) {
    console.error('Video pause failed:', error);
  }
};
