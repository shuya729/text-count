import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect, type JSX } from "react";

export const SquareAds = (): JSX.Element => {
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
        className="adsbygoogle w-full h-[calc(100svw-32px)] max-w-3xl max-h-80 block lg:hidden"
        data-ad-client="ca-pub-9057495563597980"
        data-ad-slot="4804367984"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
