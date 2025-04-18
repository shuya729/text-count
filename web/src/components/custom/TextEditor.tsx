import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { JSX } from "react";

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
      <div className="flex justify-center px-6 py-2 sm:py-4">
        <div className="max-w-3xl border-input w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none cursor-not-allowed opacity-50 space-y-1 min-h-80 h-[calc(100vh-160px)] sm:h-[calc(100vh-200px)]">
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
  } else {
    return (
      <div className="flex justify-center px-6 py-2 sm:py-4">
        <Textarea
          placeholder="文章を入力して下さい。"
          value={text}
          disabled={disabled}
          onChange={onChange}
          className="max-w-3xl text-sm min-h-80 h-[calc(100svh-150px)] sm:h-[calc(100svh-200px)] disabled:opacity-100"
        />
      </div>
    );
  }
};
