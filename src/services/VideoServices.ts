export const setWindowResize = (handlerResize, initialHeight) => {
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => handlerResize(initialHeight), 500);
  });

  return () => {
    window.removeEventListener('resize', () => handlerResize(initialHeight));
  };
};
