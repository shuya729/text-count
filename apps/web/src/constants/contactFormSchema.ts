import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().max(40, "40文字以下で入力して下さい。").or(z.literal("")),
  mail: z
    .string()
    .email("メールアドレスの形式で入力して下さい。")
    .max(400, "400文字以下で入力して下さい。")
    .or(z.literal("")),
  content: z
    .string()
    .min(1, "必須項目です。")
    .max(2000, "2000文字以下で入力して下さい。"),
});
