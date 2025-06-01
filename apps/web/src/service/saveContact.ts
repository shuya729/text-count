import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import type { ContactInput, ContactOutput } from "@/types/contactTypes";

export async function saveContact(input: ContactInput): Promise<ContactOutput> {
  const saveContact = httpsCallable(functions, "saveContact");
  try {
    const res = await saveContact(input);
    return res.data as ContactOutput;
  } catch {
    return {
      state: 1,
      message: "エラーが発生しました。",
    };
  }
}
