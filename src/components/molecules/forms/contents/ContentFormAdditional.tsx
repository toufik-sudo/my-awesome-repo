import React from 'react';
import { FormattedMessage } from 'react-intl';

import ContentsPageEditor from 'components/atoms/launch/contents/ContentPageEditor';

/**
 * Molecule component used to render Contents Form Additional elements
 *
 * @constructor
 */
const ContentFormAdditional = ({ contentBlock, wysiwigDataParam, stepIndex, form }) => {
  return (
    <>
      <ContentsPageEditor {...{ contentBlock, wysiwigDataParam, stepIndex, form }} />
    </>
  );
};

export default ContentFormAdditional;
