// -----------------------------------------------------------------------------
// AnimatedTitle Atom Component
// Migrated from old_app/src/components/atoms/ui/AnimatedTitle.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { animated, useTrail } from '@react-spring/web';
import { cn } from '@/lib/utils';

interface AnimatedTitleProps {
  contentArray: string[];
  className?: string;
  itemClassName?: string;
}

const setTrail = () => ({
  from: { opacity: 0, x: 20 },
  to: { opacity: 1, x: 0 },
  config: { mass: 1, tension: 280, friction: 60 },
});

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  contentArray,
  className,
  itemClassName,
}) => {
  const trail = useTrail(contentArray.length, setTrail());

  return (
    <h1 className={cn('text-4xl md:text-5xl font-bold', className)}>
      {trail.map((style, index) => (
        <animated.span
          key={index}
          style={{
            ...style,
            transform: style.x.to((x) => `translate3d(0,${x}px,0)`),
          }}
        >
          <animated.div className={cn('h-16', itemClassName)}>
            {contentArray[index]}
          </animated.div>
        </animated.span>
      ))}
    </h1>
  );
};

export { AnimatedTitle };
export default AnimatedTitle;
