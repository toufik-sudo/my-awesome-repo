import React, { useEffect, useRef, useState } from 'react';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

/**
 * Organism component used to render the accordion
 *
 * @param title
 * @param children
 * @param shouldBeOpened
 * @constructor
 */
const Accordion = ({ title, children, shouldBeOpened = false }) => {
  const {
    overflowHidden,
    withShadowLight,
    borderRadius1,
    p2,
    mb2,
    mb4,
    px2,
    pr1,
    textMd,
    fontWeight700,
    withGrayColor,
    withSecondaryColor,
    transitionEaseIn,
    transitionDuration300,
    pointer
  } = coreStyle;

  const [isActive, setActive] = useState(false);
  const [accordionHeight, setAccordionHeight] = useState('0px');
  const contentRef = useRef(null);

  useEffect(() => {
    const getAccordionHeight = () => {
      setAccordionHeight(!isActive ? '0px' : `${contentRef.current.scrollHeight}px`);
    };
    window.addEventListener('resize', getAccordionHeight);

    return () => {
      window.removeEventListener('resize', getAccordionHeight);
    };
  });

  useEffect(() => {
    if (shouldBeOpened) {
      toggleAccordion();
    }
  }, [shouldBeOpened]);

  const toggleAccordion = () => {
    setActive(!isActive);
    setAccordionHeight(isActive ? '0px' : `${contentRef.current.scrollHeight}px`);
  };

  return (
    <div className={`${withShadowLight} ${mb2} ${borderRadius1}`}>
      <div
        className={`${coreStyle['flex-space-between']} ${pointer} ${coreStyle['flex-center-vertical']} ${p2} ${
          isActive ? mb4 : ''
        }}`}
        onClick={() => toggleAccordion()}
      >
        <span className={`${textMd} ${fontWeight700} ${pr1} ${isActive ? withSecondaryColor : withGrayColor}`}>
          {title}
        </span>
        <FontAwesomeIcon icon={faChevronDown} flip={isActive ? 'vertical' : 'horizontal'} className={withGrayColor} />
      </div>
      <div
        ref={contentRef}
        className={`${overflowHidden} ${transitionEaseIn} ${transitionDuration300} ${px2} ${withGrayColor}`}
        style={{ maxHeight: `${accordionHeight}` }}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
