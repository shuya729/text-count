import { httpsCallable } from "firebase/functions";
import { analytics, functions } from "@/service/firebase";
import { logEvent } from "firebase/analytics";

interface Output {
  output: string;
  state: number; // 0: 成功, 1: 失敗, 2: エラー
  message: string;
}

export async function adjustText(
  input: string,
  count: number
): Promise<Output> {
  // anlytics のイベントを記録
  logEvent(analytics, "adjust_text", { input: input, count: count });

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
