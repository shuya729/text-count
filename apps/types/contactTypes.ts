export interface ContactInput {
  name: string; // 1-40文字
  mail: string; // 1-400文字
  content: string; // 1-2000文字
}

export interface ContactOutput {
  state: ContactState;
  message: string;
}

export const ContactState = {
  success: 0,
  error: 1,
} as const;
export type ContactState = (typeof ContactState)[keyof typeof ContactState];