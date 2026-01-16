import React from 'react';

import BlockElement from 'components/atoms/landing/BlockElement';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render a list of BlockElements
 *
 * @param labels
 * @param isAlternative
 * @constructor
 */
const BlockElementList = ({ labels, isAlternative = false }) => {
  const { lead, withPrimaryColorSecondaryAccent, withDefaultColor, mb3 } = coreStyle;
  // @ts-ignore
  return (
    <>
      {labels.map(key => (
        <BlockElement
          key={key}
          titleId={key}
          textId={`${key}.info`}
          additionalTitleClass={isAlternative ? `${withPrimaryColorSecondaryAccent} ${mb3}` : `${withDefaultColor}`}
          additionalContentClass={!isAlternative ? lead : ''}
        />
      ))}
    </>
  );
};

export default BlockElementList;
