import { Button } from "@/components/ui/button";
import type { JSX } from "react";
import { Link } from "react-router";

export const Notfound = (): JSX.Element => {
  return (
    <>
      <title>ページが見つかりません</title>
      <meta
        name="description"
        content="AI文字数調整くんのページが見つかりませんでした。"
      />
      <meta name="robots" content="noindex" />

      <div className="w-full py-4 px-6 mx-auto max-w-4xl sm:px-18">
        <h2 className="text-center text-4xl font-semibold pt-8 sm:pt-16">
          404
        </h2>
        <h2 className="text-center text-lg font-medium sm:pb-4">Not Found</h2>
        <div className="py-6 sm:py-8">
          <p className="py-1 text-sm text-center">
            お探しのページは見つかりませんでした。
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
