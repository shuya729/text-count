import type { JSX } from "react";

export interface TermTextProps {
  type: "headline" | "text";
  text: string;
  indent: 0 | 1 | 2 | 3;
}

export const TermText = ({ type, text, indent }: TermTextProps): JSX.Element => {
  if (type === "headline") {
    if (indent === 1) {
      return <h3 className="text-base font-semibold pt-10 pb-4 pl-4" > {text} </h3>;
    } else if (indent === 2) {
      return <h3 className="text-base font-semibold pt-10 pb-4 pl-8" > {text} </h3>;
    } else {
      return <h3 className="text-base font-semibold pt-10 pb-4" > {text} </h3>;
    }
  } else {
    if (indent === 1) {
      return <p className="py-1 text-sm pl-4" > {text} </p>;
    } else if (indent === 2) {
      return <p className="py-1 text-sm pl-8" > {text} </p>;
    } else if (indent === 3) {
      return <p className="py-1 text-sm pl-12">{text}</p>;
    } else {
      return <p className="py-1 text-sm" > {text} </p>;
    }
  }
};
