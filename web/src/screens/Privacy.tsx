import { Button } from "@/components/ui/button";
import { privacyTexts } from "@/constants/privacyTexts";
import { JSX } from "react";
import { Link } from "react-router";

interface PrivacyText {
  type: string; // headline or text
  text: string;
  indent: number; // 0 or 1 or 2
}

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
          {privacyTexts.map((privacyText, index) => (
            <PrivacyText key={index} {...privacyText} />
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

const PrivacyText = (privacyText: PrivacyText): JSX.Element => {
  const { type, text, indent } = privacyText;

  if (type === "headline") {
    if (indent === 1) {
      return (
        <h3 className="text-base font-semibold pt-10 pb-4 pl-4">{text}</h3>
      );
    } else if (indent === 2) {
      return (
        <h3 className="text-base font-semibold pt-10 pb-4 pl-8">{text}</h3>
      );
    } else {
      return <h3 className="text-base font-semibold pt-10 pb-4">{text}</h3>;
    }
  } else {
    if (indent === 1) {
      return <p className="py-1 text-sm pl-4">{text}</p>;
    } else if (indent === 2) {
      return <p className="py-1 text-sm pl-8">{text}</p>;
    } else if (indent === 3) {
      return <p className="py-1 text-sm pl-12">{text}</p>;
    } else {
      return <p className="py-1 text-sm">{text}</p>;
    }
  }
};
