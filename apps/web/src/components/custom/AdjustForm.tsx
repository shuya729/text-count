import type { AdjustTextInput } from "~/types/adjustTextTypes";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { adjustFormSchema } from "@/constants/adjustFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { JSX } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { z } from "zod";

interface AdjustFormProps {
  text: string;
  count: number;
  onSubmit: SubmitHandler<AdjustTextInput>;
}

export const AdjustForm = ({ text, count, onSubmit }: AdjustFormProps): JSX.Element => {

  const lowerCount = (count: number): number => Math.ceil(count * 0.9);
  const upperCount = (count: number): number => Math.floor(count * 1.1);

  const adjustForm = useForm<z.infer<typeof adjustFormSchema>>({
    resolver: zodResolver(adjustFormSchema),
    defaultValues: { text: text, count: count },
  });

  return (
    <Form {...adjustForm}>
      <form
        onSubmit={adjustForm.handleSubmit(onSubmit)}
        className="pt-2 px-4 space-y-8"
      >
        <div className="hidden">
          <FormField
            control={adjustForm.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} className="text-center text-base" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={adjustForm.control}
          name="count"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">文字数（200〜2000文字に対応）</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  autoFocus
                  className="text-center"
                />
              </FormControl>
              <FormDescription className="text-sm text-center">
                {`調整後の文字数： ${lowerCount(field.value)} ~ ${upperCount(field.value)} 文字`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-sm">
          AIで調整する
        </Button>
      </form>
    </Form>
  );
};
