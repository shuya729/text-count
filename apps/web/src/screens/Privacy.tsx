import { TermText } from "@/components/custom/TermText";
import { Button } from "@/components/ui/button";
import { privacyTexts } from "@/constants/privacyTexts";
import type { JSX } from "react";
import { Link } from "react-router";

export const Privacy = (): JSX.Element => {
  return (
    <>
      <title>プライバシーポリシー</title>
      <meta
        name="description"
        content="AI文字数調整くんのプライバシーポリシーページです。"
      />

      <div className="w-full py-4 px-6 mx-auto max-w-4xl sm:px-18">
        <h2 className="text-center text-lg font-medium sm:py-4">
          プライバシーポリシー
        </h2>
        <div className="py-6 sm:py-8">
          {privacyTexts.map((privacyText) => (
            <TermText key={privacyText.text} {...privacyText} />
          ))}
          <div className="py-8 flex justify-center">
            <Link to="/contact">
              <Button variant="outline" className="w-80 h-10">
                問い合わせページへ
              </Button>
            </Link>
          </div>
          <div className="py-12 text-end">
            <span className="text-sm">以上</span>
          </div>
        </div>
      </div>
    </>
  );
};
