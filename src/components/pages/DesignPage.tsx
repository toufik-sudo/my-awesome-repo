/* eslint-disable quotes */
import React, { createContext } from 'react';

import GoogleFontLoader from 'react-google-font-loader';
import DesignStep from 'components/organisms/launch/design/DesignStep';
import { useAvatarPictureConfigurations } from 'hooks/useAvatarPictureConfigurations';
import { CUSTOMIZE_FONTS } from 'constants/wall/design';

export const DesignAvatarContext = createContext(null);
export const DesignCoverContext = createContext(null);

/**
 * Page component used to render design page
 *
 * @constructor
 */
const DesignPage = () => {
  const logoConfig = useAvatarPictureConfigurations();
  const backgroundConfig = useAvatarPictureConfigurations();

  return (
    <div>
      {CUSTOMIZE_FONTS.map(font => (
        <GoogleFontLoader key={font} fonts={[{ font }]} />
      ))}
      <DesignAvatarContext.Provider value={logoConfig}>
        <DesignCoverContext.Provider value={backgroundConfig}>
          <DesignStep />
        </DesignCoverContext.Provider>
      </DesignAvatarContext.Provider>
    </div>
  );
};

export default DesignPage;
