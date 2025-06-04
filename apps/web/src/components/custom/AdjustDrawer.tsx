import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { JSX } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { AdjustForm } from "@/components/custom/AdjustForm";
import type { adjustFormSchema } from "@/constants/adjustFormSchema";

interface AdjustDrawerProps {
  text: string;
  lastCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: SubmitHandler<z.infer<typeof adjustFormSchema>>;
}

export const AdjustDrawer = ({
  text,
  lastCount,
  open,
  onOpenChange,
  onSubmit,
}: AdjustDrawerProps): JSX.Element => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-base">文字数を調整</DrawerTitle>
          <DrawerDescription className="text-sm">
            設定した文字数±10%の範囲で調整を行います。
            <br />
            調整は失敗する場合があります。
          </DrawerDescription>
        </DrawerHeader>

        <AdjustForm text={text} lastCount={lastCount} onSubmit={onSubmit} />
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
};
