export { };

/* eslint-disable no-var */
declare global {
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean;
  var adsbygoogle: Record<string, unknown>[];

  interface Navigator {
    userAgentData?: {
      platform: string;
    };
  }
}
