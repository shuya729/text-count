import { Button } from "@/components/ui/button";
import type { JSX } from "react";
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
            AI文字数調整くんは、文字数カウントとAI文字数調整機能を搭載した、日本語の文章を編集するためのツールです。
          </p>
          <p className="py-1 text-sm">
            レポートやエントリーシート（ES）、作文、SNS投稿など、文字数の指定や制限がある文章の編集に適しています。
          </p>

          <h3 className="text-base font-semibold pt-8">AI文字数調整機能</h3>
          <h4 className="text-base font-medium pl-4 pt-2">特徴</h4>
          <p className="py-1 text-sm pl-8">
            AIを活用して文章の雰囲気や意味を損なうことなく、自然な表現を保ったまま文字数の調整が可能です。
          </p>
          <h4 className="text-base font-medium pl-4 pt-2">機能</h4>
          <p className="py-1 text-sm pl-8">
            指定した目標文字数の±10%の範囲で調整を行います。
          </p>
          <h4 className="text-base font-medium pl-4 pt-2">制限</h4>
          <p className="py-1 text-sm pl-8">
            現在、入力は100〜3000文字、出力は200〜2000文字の調整に対応しています。
          </p>
          <h4 className="text-base font-medium pl-4 pt-2">注意</h4>
          <p className="py-1 text-sm pl-8">
            文章によっては、AIがうまく調整できない場合があります。
            <br />
            調整した文章は、必ずご自身で確認してください。
          </p>

          <h3 className="text-base font-semibold pt-8">ツールの使い方</h3>
          <h4 className="text-base font-medium pl-4 pt-2">文字数カウント</h4>
          <p className="py-1 text-sm pl-8">
            中央のテキストエリアに文章を入力すると、文字数が自動的にカウントされます。
          </p>
          <h4 className="text-base font-medium pl-4 pt-2">AI文字数調整</h4>
          <p className="py-1 text-sm pl-8">
            文字数を調整したい文章を入力し、右上の「AI調整」ボタンをクリックします。
            <br />
            調整したい文字数を指定し、「AIで調整する」ボタンをクリックすると、AIが文章を調整します。
          </p>
          <h4 className="text-base font-medium pl-4 pt-2">その他の機能</h4>
          <p className="py-1 text-sm pl-8">
            ・「戻る」ボタン: 直前の操作に戻ります。
            <br />
            ・「進む」ボタン: 戻った操作を再実行します。
            <br />
            ・「クリア」ボタン: 入力された文章をクリアします。
            <br />
            ・「コピー」ボタン: 入力された文章をクリップボードにコピーします。
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
