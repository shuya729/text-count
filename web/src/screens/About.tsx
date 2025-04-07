import { Button } from "@/components/ui/button";
import { JSX } from "react";
import { Link } from "react-router";

export const About = (): JSX.Element => {
  return (
    <>
      <title>ツールについて</title>
      <meta
        name="description"
        content="AI文字数調整くんについての説明ページです。AI文字数調整くんは、文章の文字数をAIで自然に調整できるツールです。現在200〜2000文字の範囲で調整可能です。"
      />

      <div className="w-full py-4 px-6 mx-auto max-w-4xl sm:px-18">
        <h2 className="text-center text-lg font-medium sm:py-4">
          ツールについて
        </h2>
        <div className="py-6 sm:py-8">
          <p className="py-1 text-sm">
            AI文字数調整くんは、文章の文字数をカウントし、AIを用いて自然な形で文字数を調整できる便利なツールです。
          </p>
          <p className="py-1 text-sm">
            レポートやエントリーシート（ES）、作文、SNS投稿など、文字数制限がある文章の調整に最適です。
          </p>

          <h3 className="text-base font-semibold pt-8">AI文字数調整機能</h3>
          <h4 className="text-base font-medium pl-4 pt-2">特徴</h4>
          <p className="py-1 text-sm pl-8">
            AIを活用して文章の雰囲気や意味を損なうことなく、自然な表現を保ったまま文字数を調整します。
          </p>
          <h4 className="text-base font-medium pl-4 pt-2">機能</h4>
          <p className="py-1 text-sm pl-8">
            指定した目標文字数の±10%を目安として調整を行います。
          </p>
          <h4 className="text-base font-medium pl-4 pt-2">制限</h4>
          <p className="py-1 text-sm pl-8">
            現在、200〜2000文字の範囲で調整可能です。
          </p>
          <h4 className="text-base font-medium pl-4 pt-2">注意</h4>
          <p className="py-1 text-sm pl-8">
            文章によっては、AIがうまく調整できない場合があります。
            <br />
            特に、文字数と目標の差が大きい場合、調整に失敗しやすくなります。
          </p>

          <h5 className="text-base font-medium pt-20 text-center">
            ツールの使用はこちらから
          </h5>
          <div className="flex justify-center pt-4 pb-20">
            <Link to="/">
              <Button className="w-80 h-10 text-base font-medium">
                AI文字数調整くん
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
