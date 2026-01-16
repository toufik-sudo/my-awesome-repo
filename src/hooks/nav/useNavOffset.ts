import { useLayoutEffect, useRef, useState } from 'react';
import { setWindowResize } from 'services/VideoServices';

export const useNavOffset = () => {
  const navElement = useRef(null);
  const [navHeight, setNavHeight] = useState(0);

  useLayoutEffect(() => {
    const initialHeight = navElement.current.offsetHeight;
    const handlerResize = height => setNavHeight(-height);
    setWindowResize(handlerResize, initialHeight);

    const timer = setTimeout(() => {
      setNavHeight(-initialHeight);
    }, 500);
    return () => clearTimeout(timer);
  }, [navHeight]);

  return { navHeight, navElement };
};
