import { onCallGenkit } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { defineSecret } from "firebase-functions/params";
import { genkit, z } from "genkit";
import googleAI, { gemini20Flash } from "@genkit-ai/googleai";
import { enableFirebaseTelemetry } from "@genkit-ai/firebase";

enableFirebaseTelemetry();

const geminiApiKey = defineSecret("GEMINI_API_KEY");
const ai = genkit({ plugins: [googleAI()], model: gemini20Flash });

const adjustInputSchema = z
  .object({
    input: z
      .string()
      .trim()
      .min(200, "入力文字数は200文字以上で入力してください。")
      .max(2000, "入力文字数は2000文字以下で入力してください。"),
    count: z
      .number()
      .int("目標文字数は整数で入力して下さい。")
      .min(200, "目標文字数は200以上で入力して下さい。")
      .max(2000, "目標文字数は2000以下で入力して下さい。"),
  })
  .refine(
    (args) => {
      const { input, count } = args;
      return !judge(input, count);
    },
    {
      message: "文字数は十分に調整されています。",
      path: ["count"],
    }
  );

const adjustOutputSchema = z.object({
  output: z.string().trim(),
  state: z.number().int(), // 0: 成功, 1: 失敗, 2: エラー
  message: z.string(),
});

interface AdjustLog {
  type: "functionLog";
  function: string;
  input: { input: string; count: number };
  output: { output: string; state: number; message: string };
  times: number;
  position: number;
}

/**
 * 文字数が範囲内に収まっているか判定
 * @param {string} text 文字列
 * @param {number} count 文字数
 * @return {boolean} 判定結果
 */
const judge = (text: string, count: number): boolean => {
  const length: number = text.length;
  return count * 0.9 <= length && length <= count * 1.1;
};

/**
 * モデルに与えるシステムプロンプトを生成
 * @param {string} text 文字列
 * @param {number} count 文字数
 * @return {string} システムプロンプト
 */
const system = (text: string, count: number): string => {
  const length: number = text.length;
  const diff: number = length - count;
  const sentences: number = Math.floor(Math.abs(diff) / 36);
  const words: number = Math.floor(Math.abs(diff) / 3);

  if (36 <= diff) {
    return `日本語の入力の文章に基づき、元の文章の雰囲気や表現を維持しながら、${sentences}個の文を削除することで、文章を短縮して下さい。  #定義 文章: いくつもの文が集まっているもの 文: まとまった1つの意味があり、句点(。)や段落等で終わるもの  #手順 1.理解:文章全体を注意深く読み、主題、文体（常体・敬体）、頻繁に用いられる語彙、文法的な特徴を把握して下さい。 2.評価:文章全体を文ごとに分割し、各文の重要度を評価し、順位をつけて下さい。 3.短縮:重要度が低い文から順に${sentences}個の文を削除して下さい。 4.再構成:主題に沿った自然な文章となるよう文章を整えて下さい。特に、元の文章の文体、語彙、文法的な特徴が維持され、指示語や接続詞が適切に使用されるよう確認して下さい。  #出力 入力の文章から元の文章の雰囲気や表現を維持しつつ、${sentences}個の文を削除した自然な流れの文章をプレーンテキストで提供して下さい。  #注意 削除する文の個数は${sentences}個です。過不足がないように注意して下さい。`;
  }
  if (0 < diff) {
    return `日本語の入力の文章に基づき、元の文章の雰囲気や表現を維持しながら、${words}個の単語を削除することで、文章を短縮して下さい。  #定義 文章: いくつもの文が集まっているもの 単語: 言葉として意味を持つ最小の単位  #手順 1.理解:文章全体を注意深く読み、主題、文体（常体・敬体）、頻繁に用いられる語彙、文法的な特徴を把握して下さい。 2.評価:文章全体を単語ごとに分割し、各単語の重要度を評価し、順位をつけて下さい。 3.短縮:重要度が低い単語から順に${words}個の文を削除して下さい。 4.再構成:主題に沿った自然な文章となるよう整えて下さい。特に、元の文章の文体、語彙、文法的な特徴が維持され、指示語や接続詞が適切に使用されるよう確認して下さい。  #出力 入力の文章から元の文章の雰囲気や表現を維持しつつ、${words}個の文を削除した自然な流れの文章をプレーンテキストで提供して下さい。  #注意 削除する単語の個数は${words}個です。過不足がないように注意して下さい。`;
  }
  if (-36 < diff) {
    return `日本語の入力の文章に基づき、元の文章の雰囲気や表現を維持しながら、${words}個の単語を追加することで、文章を拡張して下さい。  #定義 文章: いくつもの文が集まっているもの 単語: 言葉として意味を持つ最小の単位  #手順 1.理解:文章全体を注意深く読み、主題、文体（常体・敬体）、頻繁に用いられる語彙、文法的な特徴を把握して下さい。 2.評価:文章全体を単語ごとに分割し、各単語の情報の不足（より詳細な情報の提供が可能かどうか）度を評価し、順位をつけて下さい。 3.短縮:情報の不足度が低い単語から順に${words}個の単語へ追加の単語を付加して下さい。 4.再構成:主題に沿った自然な文章となるよう整えて下さい。特に、元の文章の文体、語彙、文法的な特徴が維持され、指示語や接続詞が適切に使用されるよう確認して下さい。  #出力 入力の文章から元の文章の雰囲気や表現を維持しつつ、${words}個の単語を追加した自然な流れの文章をプレーンテキストで提供して下さい。  #注意 追加する単語の個数は${words}個です。過不足がないように注意して下さい。`;
  }
  return `日本語の入力の文章に基づき、元の文章の雰囲気や表現を維持しながら、${sentences}個の文を追加することで、文章を拡張して下さい。  #定義 文章: いくつもの文が集まっているもの 文: まとまった1つの意味があり、句点(。)や段落等で終わるもの  #手順 1.理解:文章全体を注意深く読み、主題、文体（常体・敬体）、頻繁に用いられる語彙、文法的な特徴を把握して下さい。 2.評価:文章全体を文ごとに分割し、各文の情報の不足（より詳細な情報の提供が可能かどうか）度を評価し、順位をつけて下さい。 3.短縮:情報の不足度が低い文から順に${sentences}個の文へ追加の文を付加して下さい。 4.再構成:主題に沿った自然な文章となるよう整えて下さい。特に、元の文章の文体、語彙、文法的な特徴が維持され、指示語や接続詞が適切に使用されるよう確認して下さい。  #出力 入力の文章から元の文章の雰囲気や表現を維持しつつ、${sentences}個の文を追加した自然な流れの文章をプレーンテキストで提供して下さい。  #注意 追加する文の個数は${sentences}個です。過不足がないように注意して下さい。`;
};

/**
 * 最も目標に近い文字列を選択
 * @param {string[]} texts 文字列リスト
 * @param {number} count 文字数
 * @return {string} 最も目標に近い文字列
 */
const closestText = (texts: string[], count: number): string => {
  const inputText: string = texts[0];
  const inputLength: number = inputText.length;
  const inputDiff: number = inputLength - count;
  let negClosestText: string = inputText;
  let posClosestText: string = inputText;
  let negClosestDiff: number = inputDiff;
  let posClosestDiff: number = inputDiff;

  for (let i = 1; i < texts.length; i++) {
    const length: number = texts[i].length;
    const diff: number = length - count;
    if (diff < 0) {
      if (negClosestDiff > 0 || negClosestDiff < diff) {
        negClosestText = texts[i];
        negClosestDiff = diff;
      }
    } else {
      if (posClosestDiff < 0 || posClosestDiff > diff) {
        posClosestText = texts[i];
        posClosestDiff = diff;
      }
    }
  }

  if (negClosestDiff > 0) {
    return posClosestText;
  }
  if (posClosestDiff < 0) {
    return negClosestText;
  }
  const sum = negClosestDiff + posClosestDiff;
  if (sum < -36) {
    return posClosestText;
  }
  if (sum > 36) {
    return negClosestText;
  }
  if (inputDiff < 0) {
    return posClosestText;
  }
  return negClosestText;
};

const adjustTextFlow = ai.defineFlow(
  {
    name: "adjustTextFlow",
    inputSchema: adjustInputSchema,
    outputSchema: adjustOutputSchema,
  },
  async ({ input, count }) => {
    const functionName = "adjustText";
    let ret = null;
    let position = 0;
    let text = input.trim();
    const texts: string[] = [text];

    let i = 0;
    for (i = 0; i < 5; i++) {
      try {
        const res = await ai.generate({
          system: system(text, count),
          prompt: text,
          config: {
            maxOutputTokens: 8000,
            temperature: 0.6,
            // topP: 0.5,
            // topK: 40,
          },
        });

        text = res.text.trim();
        texts.push(text);
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e);
        }
        position = 1;
        ret = adjustOutputSchema.parse({
          output: input,
          state: 2,
          message: "エラーが発生しました。",
        });
        break;
      }

      if (judge(text, count)) {
        position = 2;
        ret = adjustOutputSchema.parse({
          output: text,
          state: 0,
          message: "文字数を調整しました。",
        });
        break;
      }
    }

    if (ret === null) {
      position = 3;
      ret = adjustOutputSchema.parse({
        output: closestText(texts, count),
        state: 1,
        message: "文字数の調整に失敗しました。",
      });
    }

    const log: AdjustLog = {
      type: "functionLog",
      function: functionName,
      input: { input: input, count: count },
      output: ret,
      times: i,
      position: position,
    };

    logger.info(log);

    return ret;
  }
);

export const adjustText = onCallGenkit(
  { secrets: [geminiApiKey] },
  adjustTextFlow
);
