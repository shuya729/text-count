/**
 * 実行方法
 * cd functions/test
 * node check.mjs
 */

import { readFile, writeFile } from "fs/promises";

async function main() {
  const inputFile = await readFile("./data/input.json", "utf-8");
  const inputJson = JSON.parse(inputFile);
  const outputFile = await readFile("./data/output.json", "utf-8");
  const outputJson = JSON.parse(outputFile);

  const inputLength = inputJson.length;
  for (let i = 0; i < inputLength; i++) {
    const input = inputJson[i];
    const output = outputJson[i];
  }
}

main();
