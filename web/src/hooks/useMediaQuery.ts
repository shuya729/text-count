import { useSyncExternalStore } from "react";

const subscribeWindowSizeChange = (callback: () => void) => {
  globalThis.addEventListener("resize", callback);
  return () => globalThis.removeEventListener("resize", callback);
};

const matchQury = (query: string): boolean => {
  return globalThis.matchMedia(query).matches;
};

export const useMediaQuery = (query: string): boolean => {
  const matches = useSyncExternalStore(subscribeWindowSizeChange, () =>
    matchQury(query)
  );

  return matches;
};
