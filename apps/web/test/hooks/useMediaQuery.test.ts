import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// matchMediaのモック
const mockMatchMedia = vi.fn();

// resizeイベントリスナーの管理用
let resizeListeners: (() => void)[] = [];

// globalThisのモック
const mockAddEventListener = vi.fn((event: string, callback: () => void) => {
  if (event === 'resize') {
    resizeListeners.push(callback);
  }
});

const mockRemoveEventListener = vi.fn((event: string, callback: () => void) => {
  if (event === 'resize') {
    resizeListeners = resizeListeners.filter(listener => listener !== callback);
  }
});

describe('useMediaQuery', () => {
  beforeEach(() => {
    mockMatchMedia.mockClear();
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
    resizeListeners = [];

    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    Object.defineProperty(globalThis, 'addEventListener', {
      writable: true,
      value: mockAddEventListener,
    });

    Object.defineProperty(globalThis, 'removeEventListener', {
      writable: true,
      value: mockRemoveEventListener,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('フック初期化', () => {
    it('メディアクエリがマッチする場合にtrueを返す', () => {
      mockMatchMedia.mockReturnValue({ matches: true });

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      expect(result.current).toBe(true);
      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px)');
    });

    it('メディアクエリがマッチしない場合にfalseを返す', () => {
      mockMatchMedia.mockReturnValue({ matches: false });

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      expect(result.current).toBe(false);
      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px)');
    });
  });

  describe('リアクティブ更新', () => {
    it('ウィンドウサイズ変更時に値が適切に更新される', () => {
      mockMatchMedia.mockReturnValue({ matches: false });

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      expect(result.current).toBe(false);

      act(() => {
        mockMatchMedia.mockReturnValue({ matches: true });
        resizeListeners.forEach(listener => listener());
      });

      expect(result.current).toBe(true);
    });

    it('複数回のリサイズイベントで正しく更新される', () => {
      let matchState = false;
      mockMatchMedia.mockImplementation(() => ({ matches: matchState }));

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      expect(result.current).toBe(false);

      act(() => {
        matchState = true;
        resizeListeners.forEach(listener => listener());
      });

      expect(result.current).toBe(true);

      act(() => {
        matchState = false;
        resizeListeners.forEach(listener => listener());
      });

      expect(result.current).toBe(false);
    });
  });

  describe('イベントリスナー管理', () => {
    it('コンポーネントマウント時にイベントリスナーが追加される', () => {
      mockMatchMedia.mockReturnValue({ matches: false });

      renderHook(() => useMediaQuery('(min-width: 768px)'));

      expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('コンポーネントアンマウント時にイベントリスナーが削除される', () => {
      mockMatchMedia.mockReturnValue({ matches: false });

      const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('境界値テスト', () => {
    it('異なるメディアクエリで異なる結果を返す', () => {
      mockMatchMedia.mockImplementation((query: string) => {
        if (query === '(min-width: 768px)') {
          return { matches: false };
        }
        if (query === '(max-width: 767px)') {
          return { matches: true };
        }
        return { matches: false };
      });

      const { result: result1 } = renderHook(() => useMediaQuery('(min-width: 768px)'));
      const { result: result2 } = renderHook(() => useMediaQuery('(max-width: 767px)'));

      expect(result1.current).toBe(false);
      expect(result2.current).toBe(true);
    });

    it('空文字列のクエリでも正常に動作する', () => {
      mockMatchMedia.mockReturnValue({ matches: false });

      const { result } = renderHook(() => useMediaQuery(''));

      expect(result.current).toBe(false);
      expect(mockMatchMedia).toHaveBeenCalledWith('');
    });
  });
});