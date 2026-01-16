import Cookies from 'js-cookie';

import { ZONE_SELECTION } from 'constants/general';
import { changeZone } from 'hooks/general/changeZone';

/**
 * Zone switcher container used to render dropdown from where a zone is selected
 *
 * @constructor
 */
const ZoneSwitcherContainer = ({ children }) => {
  const zoneCookie = Cookies.get(ZONE_SELECTION);
  const selectedZone = { value: zoneCookie, label: zoneCookie };

  const handleZoneChange = zone => {
    changeZone(zone.value, false);
  };

  return children({ selectedZone, handleZoneChange });
};

export default ZoneSwitcherContainer;
