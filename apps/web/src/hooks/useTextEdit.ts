import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { adjustText } from "@/service/adjustText";
import { AdjustState, type AdjustTextInput, type AdjustTextOutput } from "~/types/adjustTextTypes";

interface TextSet { text: string; date: number; }

export const useTextEdit = () => {
  const { getInitialText, updateUrlParam } = useTextParam();
  const [textSet, setTextSet] = useState<TextSet>({ text: getInitialText(), date: Date.now() });

  const { undo, redo, canUndo, canRedo, clearUndo, addUndo, clearRedo } = useTextHistory();
  const {
    lastCount,
    adjustForms,
    adjustStatus,
    openAdjustForms,
    formsOpenChange,
    onSubmitForm,
  } = useAdjustForms();

  const updateTextSet = useCallback((text: string): { inputSet: TextSet, lastSet: TextSet } => {
    const inputSet = { text: text, date: Date.now() };
    const lastSet = textSet;
    setTextSet(inputSet);
    updateUrlParam(text);
    return { inputSet, lastSet };
  }, [textSet, updateUrlParam]);

  const updateText = useCallback((text: string): void => {
    const { inputSet, lastSet } = updateTextSet(text);
    clearRedo();
    if (inputSet.text !== lastSet.text && inputSet.date - lastSet.date > 500) {
      addUndo(lastSet.text);
    }
  }, [updateTextSet, clearRedo, addUndo]);

  const handleTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const text = event.target.value;
    updateText(text);
  }, [updateText]);

  const handleUndo = useCallback(() => {
    const text = undo(textSet);
    if (text !== undefined) {
      updateTextSet(text);
    }
  }, [textSet, undo, updateTextSet]);

  const handleRedo = useCallback(() => {
    const text = redo(textSet);
    if (text !== undefined) {
      updateTextSet(text);
    }
  }, [textSet, redo, updateTextSet]);

  const handleClear = useCallback((): void => {
    updateText("");
    clearUndo();
  }, [updateText, clearUndo]);

  const handleCopy = useCallback(async (): Promise<void> => {
    const text = textSet.text;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("クリップボードにコピーしました");
    } catch {
      toast.error("クリップボードへのコピーに失敗しました");
    }
  }, [textSet.text]);

  const handleAdjust = useCallback(() => {
    openAdjustForms(textSet);
  }, [openAdjustForms, textSet]);

  const onSubmit = useCallback((input: AdjustTextInput): void => {
    onSubmitForm(input, updateText, updateTextSet);
  }, [onSubmitForm, updateText, updateTextSet]);

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
    text: textSet.text,
    adjustForms,
    adjustStatus,
    lastCount,
    canUndo,
    canRedo,
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

const useTextParam = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialText = useCallback((): string => {
    return searchParams.get("text") || "";
  }, [searchParams]);

  const updateUrlParam = useCallback((text: string): void => {
    if (text) {
      searchParams.set("text", text);
    } else {
      searchParams.delete("text");
    }
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return { getInitialText, updateUrlParam };
};

const useTextHistory = () => {
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  const clearUndo = useCallback((): void => {
    setUndoStack((prev) => prev.length > 0 ? [] : prev);
  }, []);

  const addUndo = useCallback((text: string): void => {
    setUndoStack((prev) => [...prev, text]);
  }, []);

  const clearRedo = useCallback((): void => {
    setRedoStack((prev) => prev.length > 0 ? [] : prev);
  }, []);

  const addRedo = useCallback((text: string): void => {
    setRedoStack((prev) => [...prev, text]);
  }, []);

  const undo = useCallback((textSet: TextSet): string | undefined => {
    const stack = [...undoStack];
    if (stack.length > 0) {
      const text = stack.pop();
      setUndoStack(stack);
      if (text !== undefined) {
        addRedo(textSet.text);
        return text;
      }
    }
    return undefined;
  }, [undoStack, addRedo]);

  const redo = useCallback((textSet: TextSet): string | undefined => {
    const stack = [...redoStack];
    if (stack.length > 0) {
      const text = stack.pop();
      setRedoStack(stack);
      if (text !== undefined) {
        addUndo(textSet.text);
        return text;
      }
    }
    return undefined;
  }, [redoStack, addUndo]);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    clearUndo,
    addUndo,
    clearRedo,
    addRedo,
  };
};

const useAdjustForms = () => {
  const [adjustForms, setAdjustForms] = useState<number>(0);
  const [adjustStatus, setAdjustStatus] = useState<number>(0);
  const [lastCount, setLastCount] = useState<number>(0);

  const openAdjustForms = useCallback((textSet: TextSet): void => {
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
  }, []);

  const formsOpenChange = useCallback((open: boolean): void => {
    if (!open) setAdjustForms(0);
  }, []);

  const writeOutput = useCallback((
    output: string,
    baseDate: number,
    updateTextSet: (text: string) => object
  ): void => {
    const diff = Math.max(0, Date.now() - baseDate);
    const end = Math.floor(diff / 10);
    if (end < output.length) {
      updateTextSet(output.slice(0, end));
      setTimeout(() => writeOutput(output, baseDate, updateTextSet), 10);
    } else {
      updateTextSet(output);
      setAdjustStatus(0);
    }
  }, []);

  const onSubmitForm = useCallback(async (
    input: AdjustTextInput,
    updateText: (text: string) => void,
    updateTextSet: (text: string) => object
  ): Promise<void> => {
    setAdjustStatus(1);
    setAdjustForms(0);
    setLastCount(input.count);
    const output: AdjustTextOutput = await adjustText(input);

    if (output.state === AdjustState.success) {
      updateText("");
      setAdjustStatus(2);
      writeOutput(output.text, Date.now(), updateTextSet);
    } else {
      updateText(output.text);
      toast.error(output.message);
      setAdjustStatus(0);
    }
  }, [writeOutput]);

  return {
    lastCount,
    adjustForms,
    adjustStatus,
    openAdjustForms,
    formsOpenChange,
    onSubmitForm,
  };
};
