import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFunctions } from "firebase/functions";
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

// デバッグ時のみAppCheckデバッグトークンを使用
if (import.meta.env.DEV) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    "6LcIhgsrAAAAAMIAf98P2oRYvsrAdFhBGTaFKFOO"
  ),
  isTokenAutoRefreshEnabled: true,
});
getAnalytics(app);
export const functions = getFunctions(app, "asia-northeast1");
