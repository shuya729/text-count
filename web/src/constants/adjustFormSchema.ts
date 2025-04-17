import { z } from "zod";

export const adjustFormSchema = z
  .object({
    input: z.string().trim(),
    count: z.coerce
      .number()
      .int({ message: "目標文字数は整数で入力して下さい。" })
      .min(200, { message: "目標文字数は200以上で入力して下さい。" })
      .max(2000, { message: "目標文字数は2000以下で入力して下さい。" }),
  })
  .refine(
    (args) => {
      const { input, count } = args;
      const length = input.trim().length;
      return length < count * 0.9 || length > count * 1.1;
    },
    {
      message: "文字数は十分に調整されています。",
      path: ["count"],
    }
  );
