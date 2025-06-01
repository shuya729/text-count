import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import type { JSX } from "react";
import type { SubmitHandler } from "react-hook-form";
import { AdjustForm } from "../custom/AdjustForm";
import type { AdjustTextInput } from "@/types/adjustTextTypes";

interface AdjustDialogProps {
  text: string;
  count: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: SubmitHandler<AdjustTextInput>;
}

export const AdjustDialog = ({
  text,
  count,
  open,
  onOpenChange,
  onSubmit,
}: AdjustDialogProps): JSX.Element => {
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

          <AdjustForm text={text} count={count} onSubmit={onSubmit} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
