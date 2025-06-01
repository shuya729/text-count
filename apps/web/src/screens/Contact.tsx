import { useContact } from "../hooks/useContact";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Loader2 } from "lucide-react";
import { type JSX } from "react";

export const Contact = (): JSX.Element => {
  const { contactForm, sending, onSubmit } = useContact();

  return (
    <>
      <title>お問い合わせ</title>
      <meta
        name="description"
        content="AI文字数調整くんへのお問い合わせページです。"
      />

      <div className="w-full p-4 mx-auto max-w-xl">
        <h2 className="text-center text-lg font-medium sm:py-4">
          お問い合わせ
        </h2>
        <div className="py-6 sm:py-8">
          <p className="text-sm font-normal">
            以下のフォームよりご連絡ください。
          </p>
          <div className="py-4">
            <Form {...contactForm}>
              <form
                onSubmit={contactForm.handleSubmit(onSubmit)}
                className="space-y-2 sm:space-y-4"
              >
                <FormField
                  control={contactForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">名前</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={sending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="mail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        メール（返信が必要な場合）
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="mail" disabled={sending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        問い合わせ内容（必須）
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-20 sm:min-h-40"
                          disabled={sending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center py-6 sm:py-12">
                  <Button
                    type="submit"
                    className="text-sm w-full sm:w-60"
                    disabled={sending}
                  >
                    {sending ? <Loader2 className="animate-spin" /> : null}
                    送信する
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};
