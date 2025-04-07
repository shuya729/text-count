import { termTexts } from "@/constants/termTexts";
import { JSX } from "react";

interface TermText {
  type: string; // headline or text
  text: string;
  indent: number; // 0 or 1 or 2
}

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
          {termTexts.map((termText, index) => (
            <TermText key={index} {...termText} />
          ))}
          <div className="py-12 text-end">
            <span className="text-sm">以上</span>
          </div>
        </div>
      </div>
    </>
  );
};

const TermText = (termText: TermText): JSX.Element => {
  const { type, text, indent } = termText;

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
    } else {
      return <p className="py-1 text-sm">{text}</p>;
    }
  }
};
