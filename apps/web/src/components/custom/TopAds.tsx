import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect, type JSX } from "react";

export const TopAds = (): JSX.Element => {
  const isLg = useMediaQuery("(min-width: 1024px)");
  useEffect(() => {
    if (!isLg) {
      globalThis.adsbygoogle = globalThis.adsbygoogle || [];
      globalThis.adsbygoogle.push({});
    }
  }, [isLg]);

  if (isLg) {
    return <></>;
  }

  return (
    <div className="flex justify-center">
      <ins
        className="adsbygoogle w-full h-20 max-w-2xl max-h-16 sm:max-h-20 block"
        data-ad-client="ca-pub-9057495563597980"
        data-ad-slot="4804367984"
      />
    </div>
  );
};
