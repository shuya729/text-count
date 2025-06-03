import { termTexts } from "@/constants/termTexts";
import type { JSX } from "react";
import { TermText } from "@/components/custom/TermText";

export const Term = (): JSX.Element => {
  return (
    <>
      <title>利用規約</title>
      <meta
        name="description"
        content="AI文字数調整くんの利用規約ページです。"
      />

      <div className="w-full py-4 px-6 mx-auto max-w-4xl sm:px-18">
        <h2 className="text-center text-lg font-medium sm:py-4">利用規約</h2>
        <div className="py-6 sm:py-8">
          {termTexts.map((termText) => (
            <TermText key={termText.text} {...termText} />
          ))}
          <div className="py-12 text-end">
            <span className="text-sm">以上</span>
          </div>
        </div>
      </div>
    </>
  );
};
