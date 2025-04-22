import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { JSX } from "react";

interface TextEditorProps {
  text: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
  adjustStatus: number;
}

export const TextEditor = (props: TextEditorProps): JSX.Element => {
  const { text, onChange, disabled, adjustStatus } = props;

  if (adjustStatus === 1) {
    return (
      <div className="flex justify-center flex-auto w-full max-w-2xl min-h-80 h-[calc(100svh-214px)] sm:h-[calc(100svh-278px)] lg:h-[calc(100svh-198px)]">
        <div className="w-full border-input rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none cursor-not-allowed opacity-50 space-y-1">
          <Skeleton className="h-4 w-[60%]" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[100%]" />
          <Skeleton className="h-4 w-[70%]" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[50%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center flex-auto w-full max-w-2xl min-h-80 h-[calc(100svh-214px)] sm:h-[calc(100svh-278px)] lg:h-[calc(100svh-198px)]">
      <Textarea
        placeholder="文章を入力して下さい。"
        value={text}
        disabled={disabled}
        onChange={onChange}
        className="w-full text-sm disabled:opacity-100"
      />
    </div>
  );
};
