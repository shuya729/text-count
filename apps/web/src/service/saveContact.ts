import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebase";
import { ContactState, type ContactInput, type ContactOutput } from "~/types/contactTypes";

export async function saveContact(input: ContactInput): Promise<ContactOutput> {
  const saveContact = httpsCallable(functions, "saveContact");
  try {
    const res = await saveContact(input);
    return res.data as ContactOutput;
  } catch {
    return {
      state: ContactState.error,
      message: "エラーが発生しました。",
    };
  }
}
