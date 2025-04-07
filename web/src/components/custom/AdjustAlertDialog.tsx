import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { JSX } from "react";

interface AdjustAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdjustAlertDialog = (
  props: AdjustAlertDialogProps
): JSX.Element => {
  const { open, onOpenChange } = props;
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">
            この文章は文字数調整できません。
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            現在、文字数調整機能は200〜2000文字（末尾の空白・改行を除く）の文章に対応しています。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>分かりました</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
