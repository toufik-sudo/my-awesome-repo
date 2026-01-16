import Cookies from 'js-cookie';

import envConfig from 'config/envConfig';
import { ZONE_EUROPE, ZONE_SELECTION, ZONE_US, ZONE_US_URL } from 'constants/general';

/**
 * Hook used to change zone cookie value
 *
 * @param zone
 * @param removeCookie
 */
export const changeZone = (zone, removeCookie = true) => {
  const zoneCookie = Cookies.get(ZONE_SELECTION);
  if (zoneCookie && removeCookie) {
    Cookies.remove(ZONE_SELECTION);
  }

  checkUrlAndSetZoneCookie(zone);

  switch (zone) {
    case ZONE_EUROPE:
      // window.location = (envConfig.zoneUrl.Europe as unknown) as Location;
      window.location.reload();
      return;
    case ZONE_US:
      // window.location = (envConfig.zoneUrl.US as unknown) as Location;
      window.location.reload();
      return;
    default:
      // window.location = (envConfig.zoneUrl.Europe as unknown) as Location;
      window.location.reload();
      return;
  }
};

/**
 * Hook used to change zone cookie value
 *
 * @param location
 */
export const checkAndCreateZoneCookie = location => {
  const zoneCookie = Cookies.get(ZONE_SELECTION);

  if (!zoneCookie) {
    if (location.includes(envConfig.zoneUrl.US) || location.includes(ZONE_US_URL)) {
      Cookies.set(ZONE_SELECTION, ZONE_US, { expires: 60 });
      return;
    }

    Cookies.set(ZONE_SELECTION, ZONE_EUROPE, { expires: 60 });
  }
};

/**
 * Check url and set zone based on the url of the app (for us.rewardzai.com should set US zone, etc.)
 *
 * @param zone
 */
const checkUrlAndSetZoneCookie = zone => {
  if (zone === ZONE_US) {
    Cookies.set(ZONE_SELECTION, ZONE_US, { expires: 60 });
    return;
  }
  if (zone === ZONE_EUROPE) {
    Cookies.set(ZONE_SELECTION, ZONE_EUROPE, { expires: 60 });
    return;
  }
};
