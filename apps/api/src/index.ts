import { initializeApp } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions/options";

const isDev = process.env.FIREBASE_DEBUG_MODE === "true";

setGlobalOptions({
  region: "asia-northeast1",
  enforceAppCheck: !isDev,
  memory: "256MiB",
  timeoutSeconds: 60,
});
initializeApp();

export { adjustText } from "./adjustText/";
export { saveContact } from "./saveContact/";
