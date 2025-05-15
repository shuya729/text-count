/**
 * 実行方法
 * cd functions/test
 * node index.mjs
 */

import { readFile, writeFile } from "fs/promises";
import { genkit } from "genkit";
import { gemini20Flash, googleAI } from "@genkit-ai/googleai";
import {
  SUB_WORDS_PROMPT,
  ADD_WORDS_PROMPT,
  ADD_SENTENCES_PROMPT,
  SUB_SENTENCES_PROMPT,
} from "./prompt.mjs";

// configure a Genkit instance
const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

const judge = (text, count) => {
  const length = text.length;
  return count * 0.9 <= length && length <= count * 1.1;
};

const system = (text, count) => {
  const length = text.length;
  const diff = length - count;
  const sentences = Math.floor(Math.abs(diff) / 36);
  const words = Math.floor(Math.abs(diff) / 6);

  if (36 <= diff) {
    return SUB_SENTENCES_PROMPT.replace(/{sentences}/g, sentences.toString());
  }
  if (0 < diff) {
    return SUB_WORDS_PROMPT.replace(/{words}/g, words.toString());
  }
  if (-36 < diff) {
    return ADD_WORDS_PROMPT.replace(/{words}/g, words.toString());
  }
  return ADD_SENTENCES_PROMPT.replace(/{sentences}/g, sentences.toString());
};

const closestText = (texts, count) => {
  const inputText = texts[0];
  const inputLength = inputText.length;
  const inputDiff = inputLength - count;
  let negClosestText = inputText;
  let posClosestText = inputText;
  let negClosestDiff = inputDiff;
  let posClosestDiff = inputDiff;

  for (let i = 1; i < texts.length; i++) {
    const length = texts[i].length;
    const diff = length - count;
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
  },
  async ({ input, count }) => {
    const functionName = "adjustText";
    let ret = null;
    let position = 0;
    let text = input.trim();
    const texts = [text];

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
        console.log("エラーが発生しました。");
        if (e instanceof Error) {
          console.log(e.message);
        }
        position = 1;
        ret = {
          output: input,
          state: 2,
          message: "エラーが発生しました。",
        };
        break;
      }

      if (judge(text, count)) {
        position = 2;
        ret = {
          output: text,
          state: 0,
          message: "文字数を調整しました。",
        };
        break;
      }
    }

    if (ret === null) {
      position = 3;
      ret = {
        output: closestText(texts, count),
        state: 1,
        message: "文字数の調整に失敗しました。",
      };
    }

    // const log = {
    //   type: "functionLog",
    //   function: functionName,
    //   input: { input: input, count: count },
    //   output: ret,
    //   times: i,
    //   position: position,
    // };

    // console.log(log);

    // return ret;
    return {
      state: ret.state,
      tgt_count: count,
      times: i,
      input: input,
      input_count: input.length,
      output: ret.output,
      output_count: ret.output.length,
      message: ret.message,
    };
  }
);

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

async function main() {
  const inputFile = await readFile("./data/input.json", "utf-8");
  const inputJson = JSON.parse(inputFile);

  const output = [];
  let errorCount = 0;
  let times = 0;
  let org_times = 0;
  let state_0 = 0;
  let state_1 = 0;
  let state_2 = 0;
  let org_state_0 = 0;
  let org_state_1 = 0;
  let org_state_2 = 0;
  const inputLength = inputJson.length;
  for (let i = 0; i < inputLength; i++) {
    console.log(i);

    const input = inputJson[i];

    const result = await adjustTextFlow({
      input: input.input,
      count: input.tgt_count,
    });
    output.push(result);

    if (input.state == 0) {
      org_state_0++;
    } else if (input.state == 1) {
      org_state_1++;
    } else if (input.state == 2) {
      org_state_2++;
    }

    if (result.state == 0) {
      errorCount = 0;
      state_0++;
    } else if (result.state == 1) {
      errorCount = 0;
      state_1++;
    } else if (result.state == 2) {
      errorCount++;
      state_2++;
    }

    org_times += Number(input.times);
    times += Number(result.times);

    if (errorCount > 2) {
      console.log("エラーが複数回発生しました。処理を中断します。");
      break;
    }

    await sleep(20 * 1000);
  }

  const outputJson = JSON.stringify(output, null, 2);
  await writeFile("./data/output.json", outputJson, "utf-8");

  console.table([
    { state: 0, count: state_0, org_count: org_state_0 },
    { state: 1, count: state_1, org_count: org_state_1 },
    { state: 2, count: state_2, org_count: org_state_2 },
  ]);
  console.log("合計処理回数　　:", times);
  console.log("元の合計処理回数:", org_times);
}

main();
