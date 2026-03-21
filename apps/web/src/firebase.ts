import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";

const isDev = import.meta.env.DEV;

type RequiredEnvKey =
  | "VITE_FIREBASE_API_KEY"
  | "VITE_FIREBASE_AUTH_DOMAIN"
  | "VITE_FIREBASE_PROJECT_ID"
  | "VITE_FIREBASE_STORAGE_BUCKET"
  | "VITE_FIREBASE_MESSAGING_SENDER_ID"
  | "VITE_FIREBASE_APP_ID"
  | "VITE_FIREBASE_MEASUREMENT_ID"
  | "VITE_FIREBASE_APPCHECK_SITE_KEY";

const getRequiredEnv = (key: RequiredEnvKey): string => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`環境変数 ${key} が設定されていません。apps/web/.env を確認してください。`);
  }

  return value;
};

const firebaseConfig = {
  apiKey: getRequiredEnv("VITE_FIREBASE_API_KEY"),
  authDomain: getRequiredEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getRequiredEnv("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getRequiredEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getRequiredEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getRequiredEnv("VITE_FIREBASE_APP_ID"),
  measurementId: getRequiredEnv("VITE_FIREBASE_MEASUREMENT_ID"),
};

if (isDev) {
  globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const app = initializeApp(firebaseConfig);
initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    getRequiredEnv("VITE_FIREBASE_APPCHECK_SITE_KEY")
  ),
  isTokenAutoRefreshEnabled: true,
});
export const analytics = getAnalytics(app);
export const functions = getFunctions(app, "asia-northeast1");

if (isDev) {
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}
