import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { adjustText } from "@/service/adjustText";
import type { AdjustTextInput, AdjustTextOutput } from "~/types/adjustTextTypes";

interface TextSet {
  text: string;
  date: number;
  func: number; // 0: input, 1: undo, 2: redo, 3: clear, 4: adjust 5:adjust:start
}

export const useTextEdit = () => {
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
        inputSet.date - lastSet.date > 500
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
      toast.success("�������k���W~W_");
    } catch {
      toast.error("�������xn���k1WW~W_");
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

  const onSubmit = async (input: AdjustTextInput) => {
    setAdjustStatus(1);
    setAdjustForms(0);
    setLastCount(input.count);
    const output: AdjustTextOutput = await adjustText(input);

    if (output.state === 0) {
      updateTextSet({ text: "", func: 5 });
      setAdjustStatus(2);
      writeOutput(output.text, Date.now());
    } else {
      updateTextSet({ text: output.text, func: 5 });
      toast.error(output.message);
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

  return {
    adjustStatus,
    adjustForms,
    lastCount,
    textSet,
    undoStack,
    redoStack,
    handleTextChange,
    handleUndo,
    handleRedo,
    handleClear,
    handleCopy,
    handleAdjust,
    formsOpenChange,
    onSubmit,
  };
};