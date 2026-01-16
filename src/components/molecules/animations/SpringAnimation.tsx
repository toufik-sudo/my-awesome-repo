import { IAnimationProps } from 'interfaces/IGeneral';
import React, { FC } from 'react';
import { animated, useSpring } from 'react-spring';

/**
 * Animation component that triggers a spring animation
 *
 * @param children
 * @param className
 * @param settings
 * @param disable
 * @constructor
 */
const SpringAnimation: FC<IAnimationProps> = ({ children, className, settings, disable }) => {
  const style = useSpring(settings);

  return (
    <animated.div style={!disable ? style : {}} className={className}>
      {children}
    </animated.div>
  );
};

export default SpringAnimation;
