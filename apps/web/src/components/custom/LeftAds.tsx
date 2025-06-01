import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useEffect, type JSX } from "react";

export const LeftAds = (): JSX.Element => {
  const isLg = useMediaQuery("(min-width: 1024px)");
  useEffect(() => {
    if (isLg) {
      globalThis.adsbygoogle = globalThis.adsbygoogle || [];
      globalThis.adsbygoogle.push({});
    }
  }, [isLg]);

  if (!isLg) {
    return <></>;
  }

  return (
    <div className="flex justify-center items-center py-4">
      <ins
        className="adsbygoogle h-full min-w-32 w-[calc(50svw-384px)] max-w-3xs block"
        data-ad-client="ca-pub-9057495563597980"
        data-ad-slot="5272562846"
      />
    </div>
  );
};
