import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect, type JSX } from "react";

export const HorizontalAds = (): JSX.Element => {
  const isLg = useMediaQuery("(min-width: 1024px)");
  useEffect(() => {
    if (!isLg) {
      globalThis.adsbygoogle = globalThis.adsbygoogle || [];
      globalThis.adsbygoogle.push({});
    }
  }, [isLg]);

  return (
    <div className="flex justify-center lg:hidden">
      <ins
        className="adsbygoogle w-full h-20 max-w-3xl max-h-16 sm:max-h-20 block lg:hidden"
        data-ad-client="ca-pub-9057495563597980"
        data-ad-slot="4804367984"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
