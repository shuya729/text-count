import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Copy, Loader2, RefreshCcw, Redo, Undo, Edit2 } from "lucide-react";
import { JSX } from "react";

interface ControlPanelProps {
  count: number;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onCopy: () => void;
  onAdjust: () => void;
  disableUndo: boolean;
  disableRedo: boolean;
  disableClear: boolean;
  disableCopy: boolean;
  disableAdjust: boolean;
}

export const ControlPanel = (props: ControlPanelProps): JSX.Element => {
  const {
    count,
    onUndo,
    onRedo,
    onClear,
    onCopy,
    onAdjust,
    disableUndo,
    disableRedo,
    disableClear,
    disableCopy,
    disableAdjust,
  } = props;
  return (
    <div className="flex w-full h-fit justify-center items-center">
      <div className="flex rounded-lg bg-sidebar border-sidebar-border border-1 p-2 gap-2 sm:gap-4">
        <div className="flex flex-col items-start gap-1">
          <Label
            htmlFor="count"
            className="text-xs text-sidebar-foreground sm:p-1"
          >
            文字数
          </Label>
          <Input
            id="count"
            value={count}
            disabled
            className="bg-background w-24 shadow-none text-center disabled:pointer-events-auto disabled:cursor-text disabled:opacity-100"
          />
        </div>

        <div>
          <Separator orientation="vertical" className="bg-sidebar-border" />
        </div>

        <div className="flex items-end gap-2 sm:p-1">
          <Button variant="secondary" onClick={onUndo} disabled={disableUndo}>
            <Undo />
            <div className="hidden sm:inline-block">戻る</div>
          </Button>
          <Button variant="secondary" onClick={onRedo} disabled={disableRedo}>
            <Redo />
            <div className="hidden sm:inline-block">進む</div>
          </Button>
          <Button variant="secondary" onClick={onClear} disabled={disableClear}>
            <RefreshCcw />
            <div className="hidden sm:inline-block">クリア</div>
          </Button>
          <Button variant="secondary" onClick={onCopy} disabled={disableCopy}>
            <Copy />
            <div className="hidden sm:inline-block">コピー</div>
          </Button>
          <Button disabled={disableAdjust} onClick={onAdjust}>
            {disableAdjust ? <Loader2 className="animate-spin" /> : <Edit2 />}
            <div className="hidden sm:inline-block">AI調整</div>
          </Button>
        </div>
      </div>
    </div>
  );
};
