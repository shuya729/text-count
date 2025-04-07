import { httpsCallable } from "firebase/functions";
import { functions } from "@/service/firebase";

interface Output {
  output: string;
  state: number; // 0: 成功, 1: 失敗, 2: エラー
  message: string;
}

export async function adjustText(
  input: string,
  count: number
): Promise<Output> {
  const adjustText = httpsCallable(functions, "adjustText");
  try {
    const res = await adjustText({ input: input, count: count });
    return res.data as Output;
  } catch {
    return {
      output: input,
      state: 2,
      message: "エラーが発生しました。",
    };
  }
}
