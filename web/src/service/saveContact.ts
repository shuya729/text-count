import { httpsCallable } from "firebase/functions";
import { functions } from "@/service/firebase";

interface Output {
  state: number; // 0: 成功,  1: エラー
  message: string;
}

export async function saveContact(
  name: string,
  mail: string,
  content: string
): Promise<Output> {
  const saveContact = httpsCallable(functions, "saveContact");
  try {
    const res = await saveContact({ name: name, mail: mail, content: content });
    return res.data as Output;
  } catch {
    return {
      state: 1,
      message: "エラーが発生しました。",
    };
  }
}
