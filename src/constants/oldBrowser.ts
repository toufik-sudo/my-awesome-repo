const MSG = 'msg';
const MSG_MORE = 'msgmore';
const B_IGNORE = 'bignore';
const B_UPDATE = 'bupdate';
const REMIND = 'remind';
const B_NEVER = 'bnever';

export const OLD_BROWSER_MSG_LIST = [MSG, MSG_MORE, B_IGNORE, B_UPDATE, REMIND, B_NEVER];
// Example of how the library uses the names for the browser
// c:"Chrome",f:'Firefox',s:'Safari',e:"Edge",i:'Internet Explorer',ios:"iOS",samsung:"Samsung Internet",o:'Opera', y:"Yandex Browser",v:"Vivaldi",uc:"UC Browser",a:"Android Browser",x:"Other",silk:"Silk"
export const REQUIRED_OPTIONS = {
  // Modified only for testing;
  e: 42, // Edge
  i: 11, // Internet Explorer
  f: 72, // Firefox
  o: 66, // Opera
  s: 13, // Safari
  c: 80, // Chrome
  ios: -1, // IOS,
  a: -1 // Android Browser
};

export const SESSION_SHOW_OLD_BROWSER_STR = 'showOldBrowserPopUp';
