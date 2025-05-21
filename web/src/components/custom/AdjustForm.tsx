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
  input: string;
  count: number;
  onSubmit: SubmitHandler<z.infer<typeof adjustFormSchema>>;
}

export const AdjustForm = (props: AdjustFormProps): JSX.Element => {
  const { input, count, onSubmit } = props;

  const lowerCount = (count: number): number => Math.ceil(count * 0.9);
  const upperCount = (count: number): number => Math.floor(count * 1.1);

  const adjustForm = useForm<z.infer<typeof adjustFormSchema>>({
    resolver: zodResolver(adjustFormSchema),
    defaultValues: { input: input, count: count },
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
            name="input"
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
