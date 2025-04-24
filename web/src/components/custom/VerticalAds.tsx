import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect, type JSX } from "react";

export const VerticalAds = ({ slot }: { slot: string }): JSX.Element => {
  const isLg = useMediaQuery("(min-width: 1024px)");
  useEffect(() => {
    if (isLg) {
      globalThis.adsbygoogle = globalThis.adsbygoogle || [];
      globalThis.adsbygoogle.push({});
    }
  }, [isLg]);

  return (
    <div className="justify-center items-center py-4 hidden lg:flex">
      <ins
        className="adsbygoogle h-full min-w-32 w-[calc(50svw-384px)] max-w-3xs hidden lg:block"
        data-ad-client="ca-pub-9057495563597980"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
