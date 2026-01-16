import React, { createContext } from 'react';

import DesignIdentificationStep from 'components/organisms/launch/design/DesignIdentificationStep';
import { useDesignIdentificationDataLaunch } from 'hooks/launch/design/useDesignIdentificationDataLaunch';

export const DesignIdentificationContext = createContext(null);

/**
 * Page component used to render Design Identification page
 *
 * @constructor
 */
const DesignIdentification = () => {
  const { designIdentificationCoverConfig } = useDesignIdentificationDataLaunch();

  return (
    <DesignIdentificationContext.Provider value={designIdentificationCoverConfig}>
      <DesignIdentificationStep />
    </DesignIdentificationContext.Provider>
  );
};

export default DesignIdentification;
