export {};

/* eslint-disable no-var */
interface NavigatorUAData {
  platform: string;
}

declare global {
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean;
  var adsbygoogle: { [key: string]: unknown }[];

  interface Navigator {
    userAgentData?: NavigatorUAData;
  }
}
