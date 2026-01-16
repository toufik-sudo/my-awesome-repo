import React from 'react';

import Nav from 'components/organisms/landing/Nav';

/**
 * Landing navigation container used to render navbar template component for landing page
 *
 * @constructor
 */
const LandingNavContainer = ({ setActive }) => {
  return <Nav {...{ setActive }} />;
};

export default LandingNavContainer;
