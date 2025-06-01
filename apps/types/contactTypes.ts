export interface ContactInput {
  name: string; // 1-40文字
  mail: string; // 1-400文字
  content: string; // 1-2000文字
}

export interface ContactOutput {
  state: number; // 0: 成功, 1: エラー
  message: string;
}