import { DELAY_TYPES } from '@/constants/animations';

/**
 * Method returns a react spring config (scale)
 *
 * @param delay
 */
export const setScale = (delay: number) => {
  return {
    opacity: 1,
    transform: 'scale(1)',
    from: { opacity: 0, transform: 'scale(0)' },
    config: { tension: 300, friction: 10 },
    delay
  };
};

/**
 * Method returns a react spring config (translate)
 *
 * @param delay
 */
export const setTranslate = (delay?: number) => {
  return {
    opacity: 1,
    transform: 'translateX(0px)',
    from: { opacity: 0, transform: 'translateX(-200px)' },
    delay: delay || DELAY_TYPES.NONE,
    config: { tension: 300, friction: 10 }
  };
};

/**
 * Method returns a react spring config (trail)
 */
export const setTrail = () => {
  return {
    config: { mass: 5, tension: 2000, friction: 200 },
    opacity: 1,
    x: 0,
    height: 100,
    from: { opacity: 0, x: 40, height: 0 }
  };
};

/**
 * Method returns a fade in animation config
 * @param delay
 */
export const setFadeIn = (delay: number = 0) => {
  return {
    opacity: 1,
    from: { opacity: 0 },
    delay,
    config: { tension: 200, friction: 20 }
  };
};

/**
 * Method returns a slide up animation config
 * @param delay
 */
export const setSlideUp = (delay: number = 0) => {
  return {
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    delay,
    config: { tension: 300, friction: 20 }
  };
};
