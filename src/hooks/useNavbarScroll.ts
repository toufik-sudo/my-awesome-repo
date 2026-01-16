import { useState, useEffect } from 'react';

/**
 * Hook used to detect scroll
 */
export const useNavbarScroll = () => {
  const [scroll, setScroll] = useState<boolean>(true);

  useEffect(() => {
    const onScroll = () => {
      const scrollCheck = window.pageYOffset < 58;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    };

    document.addEventListener('scroll', onScroll);

    return () => document.removeEventListener('scroll', onScroll);
  }, [scroll, setScroll]);

  return scroll;
};
