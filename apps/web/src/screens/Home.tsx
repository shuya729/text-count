import { AdjustAlertDialog } from "../components/custom/AdjustAlertDialog";
import { AdjustDialog } from "../components/custom/AdjustDialog";
import { AdjustDrawer } from "../components/custom/AdjustDrawer";
import { ControlPanel } from "../components/custom/ControlPanel";
import { TextEditor } from "../components/custom/TextEditor";
import { type JSX } from "react";
import { TopAds } from "../components/custom/TopAds";
import { LeftAds } from "../components/custom/LeftAds";
import { RightAds } from "../components/custom/RightAds";
import { useTextEdit } from "../hooks/useTextEdit";

export const Home = (): JSX.Element => {
  const {
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
  } = useTextEdit();

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
        text={textSet.text}
        count={lastCount || textSet.text.trim().length}
        open={adjustForms === 2}
        onOpenChange={formsOpenChange}
        onSubmit={onSubmit}
      />

      <AdjustDialog
        text={textSet.text}
        count={lastCount || textSet.text.trim().length}
        open={adjustForms === 3}
        onOpenChange={formsOpenChange}
        onSubmit={onSubmit}
      />
    </>
  );
};
