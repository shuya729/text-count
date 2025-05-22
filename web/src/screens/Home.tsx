import { AdjustAlertDialog } from "@/components/custom/AdjustAlertDialog";
import { AdjustDialog } from "@/components/custom/AdjustDialog";
import { AdjustDrawer } from "@/components/custom/AdjustDrawer";
import { ControlPanel } from "@/components/custom/ControlPanel";
import { TextEditor } from "@/components/custom/TextEditor";
import type { adjustFormSchema } from "@/constants/adjustFormSchema";
import { type JSX, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import { adjustText } from "@/service/adjustText";
import { TopAds } from "@/components/custom/TopAds";
import { LeftAds } from "@/components/custom/LeftAds";
import { RightAds } from "@/components/custom/RightAds";

interface TextSet {
  text: string;
  date: number;
  func: number; // 0: input, 1: undo, 2: redo, 3: clear, 4: adjust 5:adjust:start
}

interface AdjustRes {
  output: string;
  state: number; // 0: 成功, 1: 失敗, 2: エラー
  message: string;
}

export const Home = (): JSX.Element => {
  const [adjustStatus, setAdjustStatus] = useState<number>(0);
  const [adjustForms, setAdjustForms] = useState<number>(0);

  const [lastCount, setLastCount] = useState<number>(0);
  const [textSet, setTextSet] = useState<TextSet>({
    text: "",
    date: Date.now(),
    func: 0,
  });
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const updateTextSet = useCallback((textProps: { text: string, func: number }) => {
    const inputSet: TextSet = { text: textProps.text, date: Date.now(), func: textProps.func };
    const lastSet = textSet;
    if (inputSet.func === 1) {
      setRedoStack([...redoStack, lastSet.text]);
    } else if (inputSet.func === 2) {
      setUndoStack([...undoStack, lastSet.text]);
    } else if (inputSet.func !== 4) {
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
  }, [textSet, undoStack, redoStack]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    updateTextSet({ text: text, func: 0 });
  };

  const handleUndo = useCallback(() => {
    const stack = [...undoStack];
    if (stack.length > 0) {
      const text = stack.pop();
      setUndoStack(stack);
      if (text !== undefined) {
        updateTextSet({ text: text, func: 1 });
      }
    }
  }, [undoStack, updateTextSet]);

  const handleRedo = useCallback(() => {
    const stack = [...redoStack];
    if (stack.length > 0) {
      const text = stack.pop();
      setRedoStack(stack);
      if (text !== undefined) {
        updateTextSet({ text: text, func: 2 });
      }
    }
  }, [redoStack, updateTextSet]);

  const handleClear = useCallback(() => {
    updateTextSet({ text: "", func: 3 });
  }, [updateTextSet]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(textSet.text);
      toast.success("クリップボードにコピーしました。");
    } catch {
      toast.error("クリップボードへのコピーに失敗しました。");
    }
  }, [textSet.text]);

  const handleAdjust = useCallback(() => {
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
  }, [textSet.text]);

  const formsOpenChange = (open: boolean) => {
    if (!open) setAdjustForms(0);
  };

  const onSubmit = async (values: z.infer<typeof adjustFormSchema>) => {
    setAdjustStatus(1);
    setAdjustForms(0);
    setLastCount(values.count);
    const adjustRes: AdjustRes = await adjustText(values.input, values.count);

    if (adjustRes.state === 0) {
      updateTextSet({ text: "", func: 5 });
      setAdjustStatus(2);
      writeOutput(adjustRes.output, Date.now());
    } else {
      updateTextSet({ text: adjustRes.output, func: 5 });
      toast.error(adjustRes.message);
      setAdjustStatus(0);
    }
  };

  const writeOutput = (output: string, baseDate: number) => {
    const diff = Math.max(0, Date.now() - baseDate);
    const end = Math.floor(diff / 10);
    if (end < output.length) {
      updateTextSet({ text: output.slice(0, end), func: 4 });
      setTimeout(() => writeOutput(output, baseDate), 10);
    } else {
      updateTextSet({ text: output, func: 4 });
      setAdjustStatus(0);
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      const isMac = (navigator.userAgentData?.platform ?? "").includes("mac") || navigator.userAgent.includes("Mac");
      const ctrlKey = isMac ? event.metaKey : event.ctrlKey;
      if (ctrlKey) {
        if ((isMac && event.shiftKey && event.key === "z") || (!isMac && event.key === "y")) {
          event.preventDefault();
          handleRedo();
        } else if (event.key === "z") {
          event.preventDefault();
          handleUndo();
        } else if (event.key === "Enter") {
          if (adjustStatus === 0) {
            event.preventDefault();
            handleAdjust();
          }
        }
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [adjustStatus, handleUndo, handleRedo, handleAdjust]);

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
        count={lastCount || textSet.text.trim().length}
        open={adjustForms === 2}
        onOpenChange={formsOpenChange}
        onSubmit={onSubmit}
      />

      <AdjustDialog
        input={textSet.text}
        count={lastCount || textSet.text.trim().length}
        open={adjustForms === 3}
        onOpenChange={formsOpenChange}
        onSubmit={onSubmit}
      />
    </>
  );
};
