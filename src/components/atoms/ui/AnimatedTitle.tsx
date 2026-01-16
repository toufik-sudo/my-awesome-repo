import React from 'react';
import { animated, useTrail } from 'react-spring';
import { useIntl } from 'react-intl';

import { setTrail } from 'utils/animations';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/landing/LandingSectionCta.module.scss';

/**
 * Atom component used to render an animated text (array of string)
 *
 * @param intl
 * @param contentArray
 * @constructor
 *
 * @see HeadingStory
 */
const AnimatedTitle = ({ contentArray }) => {
  const { heroTitle } = coreStyle;
  const trail = useTrail(contentArray.length, setTrail());
  const intl = useIntl();

  return (
    <h1 className={`${heroTitle}`}>
      {trail.map(({ x, ...rest }, index) => (
        <animated.span
          key={index}
          style={{ ...rest, transform: (x as any).interpolate(x => `translate3d(0,${x}px,0)`) }}
        >
          <animated.div className={componentStyle.animatedLandingTitle} style={{ height: '65px' }}>
            {intl.formatMessage({ id: `landing.title.${contentArray[index]}` })}
          </animated.div>
        </animated.span>
      ))}
    </h1>
  );
};

export default AnimatedTitle;
