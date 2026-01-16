import React from 'react';

import HeadingAtom from 'components/atoms/ui/Heading';
import style from 'assets/style/components/launch/Launch.module.scss';

/**
 * Molecule component used to create Launch Program Title
 *
 * @constructor
 */
const LaunchProgramTitle = props => {
  const { launchHeadingTitle, launchHeadingSubtitle } = style;
  const { titleId, subtitleId, subtitleCustomClass } = props;

  return (
    <>
      <HeadingAtom className={launchHeadingTitle} size="3" textId={titleId} />
      {subtitleId && (
        <HeadingAtom
          className={`${launchHeadingSubtitle} ${subtitleCustomClass ? subtitleCustomClass : ''}`}
          size="5"
          textId={subtitleId}
        />
      )}
    </>
  );
};

export default LaunchProgramTitle;
