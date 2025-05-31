import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyBnFPyovtyH8lkFVgq4xv78ogs4HiCpatY",
  authDomain: "text-count.firebaseapp.com",
  projectId: "text-count",
  storageBucket: "text-count.firebasestorage.app",
  messagingSenderId: "514525907177",
  appId: "1:514525907177:web:a5943b1177ea6bba8d0878",
  measurementId: "G-B3P1DQ8NZF",
};

const app = initializeApp(firebaseConfig);
initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    "6LcIhgsrAAAAAMIAf98P2oRYvsrAdFhBGTaFKFOO"
  ),
  isTokenAutoRefreshEnabled: true,
});
export const analytics = getAnalytics(app);
export const functions = getFunctions(app, "asia-northeast1");

if (import.meta.env.DEV) {
  globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}