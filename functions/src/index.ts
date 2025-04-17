import { initializeApp } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions/options";

setGlobalOptions({
  region: "asia-northeast1",
  enforceAppCheck: true,
  memory: "256MiB",
  timeoutSeconds: 40,
});
initializeApp();

export { adjustText } from "./adjustText";
export { saveContact } from "./saveContact";
