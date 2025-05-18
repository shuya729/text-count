import { AdjustAlertDialog } from "@/components/custom/AdjustAlertDialog";
import { AdjustDialog } from "@/components/custom/AdjustDialog";
import { AdjustDrawer } from "@/components/custom/AdjustDrawer";
import { ControlPanel } from "@/components/custom/ControlPanel";
import { TextEditor } from "@/components/custom/TextEditor";
import type { adjustFormSchema } from "@/constants/adjustFormSchema";
import { type JSX, useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import { adjustText } from "@/service/adjustText";
import { TopAds } from "@/components/custom/TopAds";
import { LeftAds } from "@/components/custom/LeftAds";
import { RightAds } from "@/components/custom/RightAds";

interface TextSet {
  text: string;
  date: number;
  func: number; // 0: input, 1: undo, 2: redo, 3: clear, 4: adjust
}

interface AdjustRes {
  output: string;
  state: number; // 0: 成功, 1: 失敗, 2: エラー
  message: string;
}

export const Home = (): JSX.Element => {
  const [adjustStatus, setAdjustStatus] = useState<number>(0);
  const [adjustForms, setAdjustForms] = useState<number>(0);

  const [textSet, setTextSet] = useState<TextSet>({
    text: "",
    date: Date.now(),
    func: 0,
  });
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const updateTextSet = (inputSet: TextSet) => {
    const lastSet = textSet;
    if (inputSet.func === 1) {
      setRedoStack([...redoStack, lastSet.text]);
    } else if (inputSet.func === 2) {
      setUndoStack([...undoStack, lastSet.text]);
    } else {
      if (redoStack.length > 0) {
        setRedoStack([]);
      }
      if (
        lastSet.text !== inputSet.text &&
        inputSet.date - lastSet.date > 600
      ) {
        setUndoStack([...undoStack, lastSet.text]);
      }
    }
    setTextSet(inputSet);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    updateTextSet({ text: text, date: Date.now(), func: 0 });
  };

  const handleUndo = () => {
    const stack = [...undoStack];
    if (stack.length > 0) {
      const text = stack.pop();
      setUndoStack(stack);
      if (text !== undefined) {
        updateTextSet({ text: text, date: Date.now(), func: 1 });
      }
    }
  };

  const handleRedo = () => {
    const stack = [...redoStack];
    if (stack.length > 0) {
      const text = stack.pop();
      setRedoStack(stack);
      if (text !== undefined) {
        updateTextSet({ text: text, date: Date.now(), func: 2 });
      }
    }
  };

  const handleClear = () => {
    updateTextSet({ text: "", date: Date.now(), func: 3 });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textSet.text);
      toast.success("クリップボードにコピーしました。");
    } catch {
      toast.error("クリップボードへのコピーに失敗しました。");
    }
  };

  const handleAdjust = () => {
    const length = textSet.text.trim().length;
    if (length < 100 || 2000 < length) {
      setAdjustForms(1);
    } else {
      const isSm = globalThis.matchMedia("(min-width: 40rem)").matches;
      if (!isSm) {
        setAdjustForms(2);
      } else {
        setAdjustForms(3);
      }
    }
  };

  const formsOpenChange = (open: boolean) => {
    if (!open) setAdjustForms(0);
  };

  const onSubmit = async (values: z.infer<typeof adjustFormSchema>) => {
    setAdjustStatus(1);
    setAdjustForms(0);
    const adjustRes: AdjustRes = await adjustText(values.input, values.count);

    updateTextSet({ text: "", date: Date.now(), func: 4 });
    setAdjustStatus(2);

    if (adjustRes.state === 0) {
      let text = "";
      const intervalId = setInterval(() => {
        if (text.length < adjustRes.output.length) {
          text += adjustRes.output[text.length];
          updateTextSet({ text: text, date: Date.now(), func: 4 });
        } else {
          clearInterval(intervalId);
          setAdjustStatus(0);
        }
      }, 20);
    } else {
      updateTextSet({ text: adjustRes.output, date: Date.now(), func: 4 });
      toast.error(adjustRes.message);
      setAdjustStatus(0);
    }
  };

  return (
    <>
      <title>AI文字数調整くん｜文字数カウント・調整ツール</title>
      <meta
        name="description"
        content="AI文字数調整くんは、文章の文字数をAIで自然に調整できるツールです。レポート、ES、SNS投稿など文字数制限がある場面で便利です。現在200〜2000文字の範囲で調整可能です。"
      />

      <div className="flex flex-col px-6 pb-2 sm:pb-4 gap-2 sm:gap-4">
        <TopAds />

        <ControlPanel
          count={textSet.text.length}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClear}
          onCopy={handleCopy}
          onAdjust={handleAdjust}
          disableUndo={undoStack.length === 0 || adjustStatus !== 0}
          disableRedo={redoStack.length === 0 || adjustStatus !== 0}
          disableClear={adjustStatus !== 0}
          disableCopy={adjustStatus !== 0}
          disableAdjust={adjustStatus !== 0}
        />

        <div className="flex justify-center items-stretch lg:gap-6">
          <LeftAds />

          <TextEditor
            text={textSet.text}
            onChange={handleTextChange}
            disabled={adjustStatus !== 0}
            adjustStatus={adjustStatus}
          />

          <RightAds />
        </div>
      </div>

      <AdjustAlertDialog
        open={adjustForms === 1}
        onOpenChange={formsOpenChange}
      />

      <AdjustDrawer
        input={textSet.text}
        open={adjustForms === 2}
        onOpenChange={formsOpenChange}
        onSubmit={onSubmit}
      />

      <AdjustDialog
        input={textSet.text}
        open={adjustForms === 3}
        onOpenChange={formsOpenChange}
        onSubmit={onSubmit}
      />
    </>
  );
};
