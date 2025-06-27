import { ContactState, type ContactInput } from "~/types/contactTypes";
import { contactFormSchema } from "@/constants/contactFormSchema";
import { saveContact } from "@/service/saveContact";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export const useContact = () => {
  const [sending, setSending] = useState(false);

  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", mail: "", content: "" },
  });

  const onSubmit = async (input: ContactInput) => {
    setSending(true);
    const res = await saveContact(input);
    if (res.state === ContactState.success) {
      contactForm.reset();
      toast.success("問い合わせ内容を送信しました。");
    } else {
      toast.error("送信に失敗しました。");
    }

    setSending(false);
  };
  return { contactForm, sending, onSubmit };
}