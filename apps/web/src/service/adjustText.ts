import { httpsCallable } from "firebase/functions";
import { analytics, functions } from "@/firebase";
import { logEvent } from "firebase/analytics";
import type { AdjustTextInput, AdjustTextOutput } from "~/types/adjustTextTypes";

export async function adjustText(input: AdjustTextInput): Promise<AdjustTextOutput> {
  // anlytics のイベントを記録
  logEvent(analytics, "adjust_text", {
    input_count: input.text.trim().length,
    tgt_count: input.count,
  });

  const adjustText = httpsCallable(functions, "adjustText");
  try {
    const output = await adjustText(input);
    return output.data as AdjustTextOutput;
  } catch {
    return {
      text: input.text,
      state: 2,
      message: "エラーが発生しました。",
    };
  }
}
