import React from 'react';
import HeadingAtom from 'components/atoms/ui/Heading';

/**
 * Atom component used to render a container title
 *
 * @constructor
 *
 * @see ContainerTitleStory
 */
const ContainerTitle = ({ textId }) => (
  <div className="row">
    <div className="container">
      <HeadingAtom {...{ textId }} size="2" />
    </div>
  </div>
);

export default ContainerTitle;
