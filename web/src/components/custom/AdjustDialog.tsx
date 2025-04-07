import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JSX } from "react";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { AdjustForm } from "@/components/custom/AdjustForm";
import { adjustFormSchema } from "@/constants/adjustFormSchema";

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
            AIは設定された文字数の±10%を目指して調整を行います。
            <br />
            調整に失敗する場合があります。
          </DialogDescription>

          <AdjustForm input={input} onSubmit={onSubmit} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
