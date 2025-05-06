import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { JSX } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { AdjustForm } from "@/components/custom/AdjustForm";
import type { adjustFormSchema } from "@/constants/adjustFormSchema";

interface AdjustDialogProps {
  input: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: SubmitHandler<z.infer<typeof adjustFormSchema>>;
}

export const AdjustDialog = (props: AdjustDialogProps): JSX.Element => {
  const { input, open, onOpenChange, onSubmit } = props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-base">文字数を調整</DialogTitle>
          <DialogDescription className="text-sm">
            設定した文字数±10%の範囲で調整を行います。
            <br />
            調整は失敗する場合があります。
          </DialogDescription>

          <AdjustForm input={input} onSubmit={onSubmit} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
