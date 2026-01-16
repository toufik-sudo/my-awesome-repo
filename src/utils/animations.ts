import { DELAY_TYPES } from 'constants/animations';
import { config as DefaultConfig } from 'react-spring';

/**
 * Method returns a react spring config (scale)
 *
 * @param delay
 */
export const setScale = delay => {
  return {
    opacity: 1,
    transform: 'scale(1)',
    from: { opacity: 0, transform: 'scale(0)' },
    config: DefaultConfig.stiff,
    delay
  };
};

/**
 * Method returns a react spring config (translate)
 *
 * @param delay
 */
export const setTranslate = delay => {
  return {
    opacity: 1,
    transform: 'translateX(0px)',
    from: { opacity: 0, transform: 'translateX(-200px)' },
    delay: delay || DELAY_TYPES.NONE,
    config: DefaultConfig.stiff
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
