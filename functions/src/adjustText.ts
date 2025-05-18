import { onCallGenkit } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { genkit, z } from "genkit";
import { gemini20Flash, vertexAI } from "@genkit-ai/vertexai";
import { enableFirebaseTelemetry } from "@genkit-ai/firebase";
import {
  ADD_SENTENCES_PROMPT,
  ADD_WORDS_PROMPT,
  SUB_SENTENCES_PROMPT,
  SUB_WORDS_PROMPT,
} from "./prompt";

enableFirebaseTelemetry();

const ai = genkit({
  plugins: [vertexAI({ location: "us-central1" })],
  model: gemini20Flash,
});

const adjustInputSchema = z
  .object({
    input: z
      .string()
      .trim()
      .min(100, "入力文字数は100文字以上で入力してください。")
      .max(3000, "入力文字数は3000文字以下で入力してください。"),
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
  const sentences: number = Math.floor(Math.abs(diff) / 40);
  const words: number = Math.floor(Math.abs(diff) / 8);

  if (40 <= diff) {
    return SUB_SENTENCES_PROMPT.replace(/{sentences}/g, sentences.toString());
  }
  if (0 < diff) {
    return SUB_WORDS_PROMPT.replace(/{words}/g, words.toString());
  }
  if (-40 < diff) {
    return ADD_WORDS_PROMPT.replace(/{words}/g, words.toString());
  }
  return ADD_SENTENCES_PROMPT.replace(/{sentences}/g, sentences.toString());
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
  if (sum < -40) {
    return posClosestText;
  }
  if (sum > 40) {
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
          prompt: "# 入力\n ```\n" + text + "\n ```\n",
          config: {
            maxOutputTokens: 8000,
            temperature: 0.7,
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
        message: "文字数の調整に失敗しました。再度お試しください。",
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

export const adjustText = onCallGenkit(adjustTextFlow);
