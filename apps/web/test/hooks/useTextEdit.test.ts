import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTextEdit } from '@/hooks/useTextEdit';
import type { AdjustTextInput, AdjustTextOutput } from '~/types/adjustTextTypes';

// モック設定
vi.mock('@/service/adjustText', () => ({ adjustText: vi.fn() }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { adjustText } from '@/service/adjustText';
import { toast } from 'sonner';

const mockAdjustText = vi.mocked(adjustText);
const mockToast = vi.mocked(toast);

// グローバルAPIのモック
Object.assign(navigator, { clipboard: { writeText: vi.fn() } });
const mockClipboard = vi.mocked(navigator.clipboard.writeText);

let eventListeners: { [key: string]: EventListener[] } = {};
const mockAddEventListener = vi.fn((event: string, listener: EventListener) => {
  if (!eventListeners[event]) eventListeners[event] = [];
  eventListeners[event].push(listener);
});
const mockRemoveEventListener = vi.fn((event: string, listener: EventListener) => {
  if (eventListeners[event]) {
    eventListeners[event] = eventListeners[event].filter(l => l !== listener);
  }
});

Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: query === "(min-width: 40rem)",
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('useTextEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    eventListeners = {};
    
    Object.defineProperty(document, 'addEventListener', { value: mockAddEventListener });
    Object.defineProperty(document, 'removeEventListener', { value: mockRemoveEventListener });
    
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('フック初期化', () => {
    it('初期状態とイベントリスナーが正しく設定される', () => {
      const { result } = renderHook(() => useTextEdit());

      expect(result.current.text).toBe('');
      expect(result.current.adjustForms).toBe(0);
      expect(result.current.adjustStatus).toBe(0);
      expect(result.current.lastCount).toBe(0);
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
      expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  describe('状態管理', () => {
    it('テキスト更新と履歴管理が正しく動作する', () => {
      const { result } = renderHook(() => useTextEdit());
      const createEvent = (value: string) => ({ target: { value } } as React.ChangeEvent<HTMLTextAreaElement>);

      // テキスト更新
      act(() => result.current.handleTextChange(createEvent('テスト1')));
      expect(result.current.text).toBe('テスト1');
      expect(result.current.canUndo).toBe(false);

      // 500ms経過前の変更は履歴に追加されない
      act(() => result.current.handleTextChange(createEvent('テスト2')));
      expect(result.current.text).toBe('テスト2');
      expect(result.current.canUndo).toBe(false);

      // 500ms経過後の変更は履歴に追加される
      act(() => vi.advanceTimersByTime(600));
      act(() => result.current.handleTextChange(createEvent('テスト3')));
      expect(result.current.text).toBe('テスト3');
      expect(result.current.canUndo).toBe(true);
    });

    it('Undo/Redo機能が正しく動作する', () => {
      const { result } = renderHook(() => useTextEdit());
      const createEvent = (value: string) => ({ target: { value } } as React.ChangeEvent<HTMLTextAreaElement>);

      // 履歴作成
      act(() => result.current.handleTextChange(createEvent('テスト1')));
      act(() => vi.advanceTimersByTime(600));
      act(() => result.current.handleTextChange(createEvent('テスト2')));

      // Undo
      act(() => result.current.handleUndo());
      expect(result.current.text).toBe('テスト1');
      expect(result.current.canRedo).toBe(true);

      // Redo
      act(() => result.current.handleRedo());
      expect(result.current.text).toBe('テスト2');
      expect(result.current.canRedo).toBe(false);

      // 範囲外のUndo/Redoは無効
      act(() => result.current.handleRedo());
      expect(result.current.text).toBe('テスト2');
    });

    it('基本操作が正しく動作する', async () => {
      const { result } = renderHook(() => useTextEdit());
      const createEvent = (value: string) => ({ target: { value } } as React.ChangeEvent<HTMLTextAreaElement>);

      act(() => result.current.handleTextChange(createEvent('テスト文字列')));

      // Clear
      act(() => result.current.handleClear());
      expect(result.current.text).toBe('');

      // Copy成功
      act(() => result.current.handleTextChange(createEvent('コピーテスト')));
      mockClipboard.mockResolvedValue(undefined);
      await act(async () => { await result.current.handleCopy(); });
      expect(mockClipboard).toHaveBeenCalledWith('コピーテスト');
      expect(mockToast.success).toHaveBeenCalledWith('クリップボードにコピーしました');

      // Copy失敗
      mockClipboard.mockRejectedValue(new Error('コピー失敗'));
      await act(async () => await result.current.handleCopy());
      expect(mockToast.error).toHaveBeenCalledWith('クリップボードへのコピーに失敗しました');
    });
  });



  describe('副作用処理', () => {
    it('調整フォーム表示が文字数に応じて動作する', () => {
      const { result } = renderHook(() => useTextEdit());
      const createEvent = (length: number) => ({ target: { value: 'a'.repeat(length) } } as React.ChangeEvent<HTMLTextAreaElement>);

      // 100文字未満 → アラートダイアログ
      act(() => result.current.handleTextChange(createEvent(50)));
      act(() => result.current.handleAdjust());
      expect(result.current.adjustForms).toBe(1);

      // フォームクローズ
      act(() => result.current.formsOpenChange(false));
      expect(result.current.adjustForms).toBe(0);

      // 100-2000文字 → 調整フォーム
      act(() => result.current.handleTextChange(createEvent(500)));
      act(() => result.current.handleAdjust());
      expect(result.current.adjustForms).toBe(3);

      // 2000文字超 → アラートダイアログ
      act(() => result.current.formsOpenChange(false));
      act(() => result.current.handleTextChange(createEvent(2500)));
      act(() => result.current.handleAdjust());
      expect(result.current.adjustForms).toBe(1);
    });

    it('調整処理の送信が正しく動作する', async () => {
      const { result } = renderHook(() => useTextEdit());
      const testInput: AdjustTextInput = { text: 'テスト文字列', count: 100 };

      // 成功ケース
      const successOutput: AdjustTextOutput = { state: 0, text: '調整済み', message: '成功' };
      mockAdjustText.mockResolvedValue(successOutput);

      await act(async () => { result.current.onSubmit(testInput); });
      expect(result.current.adjustStatus).toBe(2);
      expect(result.current.lastCount).toBe(100);
      
      act(() => vi.runAllTimers());
      expect(result.current.text).toBe('調整済み');
      expect(result.current.adjustStatus).toBe(0);

      // 失敗ケース
      const errorOutput: AdjustTextOutput = { state: 1, text: 'エラー', message: 'エラー発生' };
      mockAdjustText.mockResolvedValue(errorOutput);

      await act(async () => { await result.current.onSubmit(testInput); });
      expect(result.current.text).toBe('エラー');
      expect(mockToast.error).toHaveBeenCalledWith('エラー発生');
    });

    it('キーボードショートカットが正しく動作する', async () => {
      const { result } = renderHook(() => useTextEdit());
      const createEvent = (value: string) => ({ target: { value } } as React.ChangeEvent<HTMLTextAreaElement>);
      
      // 履歴作成
      act(() => result.current.handleTextChange(createEvent('テスト1')));
      act(() => vi.advanceTimersByTime(600));
      act(() => result.current.handleTextChange(createEvent('テスト2')));

      // Ctrl+Z (Undo)
      const undoEvent = { key: 'z', ctrlKey: true, preventDefault: vi.fn() } as unknown as KeyboardEvent;
      act(() => eventListeners.keydown[0](undoEvent));
      expect(result.current.text).toBe('テスト1');

      // Ctrl+Y (Redo)
      const redoEvent = { key: 'y', ctrlKey: true, preventDefault: vi.fn() } as unknown as KeyboardEvent;
      act(() => eventListeners.keydown[0](redoEvent));
      expect(result.current.text).toBe('テスト2');

      // Ctrl+Enter (調整フォーム起動)
      act(() => result.current.handleTextChange(createEvent('a'.repeat(500))));
      const adjustEvent = { key: 'Enter', ctrlKey: true, preventDefault: vi.fn() } as unknown as KeyboardEvent;
      act(() => eventListeners.keydown[0](adjustEvent));
      expect(result.current.adjustForms).toBe(3);

      // 処理中は起動しない
      act(() => result.current.formsOpenChange(false));
      const testInput: AdjustTextInput = { text: 'test', count: 100 };
      mockAdjustText.mockResolvedValue({ state: 0, text: 'processing', message: 'ok' });
      await act(async () => { result.current.onSubmit(testInput); });
      
      act(() => eventListeners.keydown[0](adjustEvent));
      expect(result.current.adjustForms).toBe(0);
    });
  });


  describe('クリーンアップ', () => {
    it('アンマウント時にイベントリスナーが正しく削除される', () => {
      const { unmount } = renderHook(() => useTextEdit());
      
      expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
      
      unmount();
      
      expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });
});