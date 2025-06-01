export interface AdjustTextInput {
  text: string;
  count: number;
}

export interface AdjustTextOutput {
  text: string;
  state: 0 | 1 | 2; // 0: 成功, 1: 失敗, 2: エラー
  message: string;
}