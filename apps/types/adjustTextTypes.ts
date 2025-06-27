export interface AdjustTextInput {
  text: string;
  count: number;
}

export interface AdjustTextOutput {
  text: string;
  state: AdjustState;
  message: string;
}

export const AdjustState = {
  success: 0,
  failed: 1,
  error: 2,
} as const;
export type AdjustState = (typeof AdjustState)[keyof typeof AdjustState];