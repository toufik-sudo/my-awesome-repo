import React from 'react';

/**
 * Molecule component used to render components from arrays or constants
 * @param props
 * @param component
 * @constructor
 */
const DynamicComponent = ({ props, component }) => {
  const DynamicElement = component;
  if (component === null) return null;

  return <DynamicElement {...{ ...props }} />;
};

export default DynamicComponent;
