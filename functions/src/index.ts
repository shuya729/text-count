import { initializeApp } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions";

setGlobalOptions({ region: "asia-northeast1" });
initializeApp();

export { adjustText } from "./adjustText";
export { saveContact } from "./saveContact";
