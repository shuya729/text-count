import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { JSX } from "react";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { AdjustForm } from "@/components/custom/AdjustForm";
import { adjustFormSchema } from "@/constants/adjustFormSchema";

interface AdjustDrawerProps {
  input: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: SubmitHandler<z.infer<typeof adjustFormSchema>>;
}

export const AdjustDrawer = (props: AdjustDrawerProps): JSX.Element => {
  const { input, open, onOpenChange, onSubmit } = props;
  return (
    <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-base">文字数を調整</DrawerTitle>
          <DrawerDescription className="text-sm">
            AIは設定された文字数の±10%を目指して調整を行います。
            <br />
            調整に失敗する場合があります。
          </DrawerDescription>
        </DrawerHeader>

        <AdjustForm input={input} onSubmit={onSubmit} />
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
};
