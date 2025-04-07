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
  const rate: number = ((count - length) / length) * 100;
  return -10 <= rate && rate <= 10;
};

/**
 * モデルに与えるシステムプロンプトを生成
 * @param {string} text 文字列
 * @param {number} count 文字数
 * @return {string} システムプロンプト
 */
const system = (text: string, count: number): string => {
  const length: number = text.length;
  const rate: number = ((count - length) / length) * 100;
  const dispRate: number = Math.round(Math.abs(rate));
  if (rate < -40) {
    return `日本語の文章を入力に基づき、文章の長さを${dispRate}%短縮してください。重要度が低い部分から順に削除または短縮することでこれを実現してください。#Steps1.理解:入力された文章をよく読み、その主題や重要なポイント、全体の流れ、および文体や表現の癖を把握します。2.評価:各部分の重要度を評価し、優先順位をつけます。3.削除・短縮:重要度が低い部分から順に${dispRate}%を削除または短縮し、全体の長さを${dispRate}%短縮します。文体や表現の癖を可能な限り保ちます。4.再構築:元の文体を保ちつつ、全体として意味が通るように流れを整え文章を再構成します。#OutputFormat文章の流れや意味が損なわれないように、短縮された文章を適切に整えて提供してください。また元の文体や表現の癖が維持されていることを確認してください。#Notes-全体として元の文章の意味や流れを変えずに短縮してください。-文体や表現の癖として文末の表現や繰り返し使用される表現を維持してください。`;
  } else if (rate < 0) {
    return `日本語の文章を入力に基づき、文章の長さを${dispRate}%短縮してください。重要度が低い部分から順に一部の単語を削除することでこれを実現してください。#Steps1.理解:入力された文章をよく読み、その主題や重要なポイント、全体の流れ、および文体や表現の癖を把握します。2.評価:各部分の重要度を評価し、優先順位をつけます。3.削除:重要度が低い部分から順に${dispRate}%だけ不要な一部の単語を削除し、全体の長さを${dispRate}%短縮します。文体や表現の癖を可能な限り保ちます。4.再構築:元の文体を保ちつつ、全体として意味が通るように流れを整え文章を再構成します。#OutputFormat文章の流れや意味が損なわれないように、拡張された文章を適切に整えて提供してください。また元の文体や表現の癖が維持されていることを確認してください。#Notes-${dispRate}%の軽微な短縮であることに注意してください。-全体として元の文章の意味や流れを変えずに拡張してください。-文体や表現の癖として文末の表現や繰り返し使用される表現を維持してください。`;
  } else if (rate < 60) {
    return `日本語の文章を入力に基づき、文章の長さを${dispRate}%拡張してください。重要度が高い部分から順に短い単語を付加することでこれを実現してください。#Steps1.理解:入力された文章をよく読み、その主題や重要なポイント、全体の流れ、および文体や表現の癖を把握します。2.評価:各部分の重要度を評価し、優先順位をつけます。3.拡張:重要度が高い部分から順に${dispRate}%だけ短い単語を付加し、全体の長さを${dispRate}%拡張します。文体や表現の癖を可能な限り保ちます。4.再構築:元の文体を保ちつつ、全体として意味が通るように流れを整え文章を再構成します。#OutputFormat文章の流れや意味が損なわれないように、拡張された文章を適切に整えて提供してください。また元の文体や表現の癖が維持されていることを確認してください。#Notes-${dispRate}%の軽微な拡張であることに注意してください。-全体として元の文章の意味や流れを変えずに拡張してください。-文体や表現の癖として文末の表現や繰り返し使用される表現を維持してください。`;
  } else {
    return `日本語の文章を入力に基づき、文章の長さを${dispRate}%拡張してください。重要度が高い部分から順に新たな内容を追加することでこれを実現してください。#Steps1.理解:入力された文章をよく読み、その主題や重要なポイント、全体の流れ、および文体や表現の癖を把握します。2.評価:各部分の重要度を評価し、優先順位をつけます。3.拡張:重要度が高い部分から順に${dispRate}%へ新たな内容を追加し、全体の長さを${dispRate}%拡張します。文体や表現の癖を可能な限り保ちます。4.再構築:元の文体を保ちつつ、全体として意味が通るように流れを整え文章を再構成します。#OutputFormat文章の流れや意味が損なわれないように、拡張された文章を適切に整えて提供してください。また元の文体や表現の癖が維持されていることを確認してください。#Notes-全体として元の文章の意味や流れを変えずに拡張してください。-文体や表現の癖として文末の表現や繰り返し使用される表現を維持してください。`;
  }
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
  const inputRate: number = ((count - inputLength) / inputLength) * 100;
  let negClosestText: string = inputText;
  let posClosestText: string = inputText;
  let negClosestRate: number = inputRate;
  let posClosestRate: number = inputRate;

  for (let i = 1; i < texts.length; i++) {
    const length: number = texts[i].length;
    const rate: number = ((count - length) / length) * 100;
    if (rate < 0) {
      if (negClosestRate > 0 || negClosestRate < rate) {
        negClosestText = texts[i];
        negClosestRate = rate;
      }
    } else {
      if (posClosestRate < 0 || posClosestRate > rate) {
        posClosestText = texts[i];
        posClosestRate = rate;
      }
    }
  }

  if (negClosestRate > 0) {
    return posClosestText;
  } else if (posClosestRate < 0) {
    return negClosestText;
  } else {
    const sum = negClosestRate + posClosestRate;
    if (sum < -5) {
      return posClosestText;
    } else if (sum > 5) {
      return negClosestText;
    } else {
      if (inputRate < 0) {
        return posClosestText;
      } else {
        return negClosestText;
      }
    }
  }
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

    if (ret !== null && (ret.state === 0 || ret.state === 1)) {
      logger.info(log);
    } else {
      logger.error(log);
    }

    return ret;
  }
);

export const adjustText = onCallGenkit(
  {
    secrets: [geminiApiKey],
    enforceAppCheck: true,
  },
  adjustTextFlow
);
