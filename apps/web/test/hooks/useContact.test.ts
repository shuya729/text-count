import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useContact } from '@/hooks/useContact';
import type { ContactOutput } from '~/types/contactTypes';

// モック設定
vi.mock('@/service/saveContact', () => ({
  saveContact: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// モジュールのインポート
import { saveContact } from '@/service/saveContact';
import { toast } from 'sonner';

const mockSaveContact = vi.mocked(saveContact);
const mockToast = vi.mocked(toast);

describe('useContact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('フック初期化', () => {
    it('初期状態が正しく設定される', () => {
      const { result } = renderHook(() => useContact());

      expect(result.current.contactForm.getValues()).toEqual({
        name: '',
        mail: '',
        content: '',
      });
      expect(result.current.sending).toBe(false);
    });
  });

  describe('フォーム状態管理', () => {
    it('フォーム値の更新が正しく動作する', async () => {
      const { result } = renderHook(() => useContact());

      await act(async () => {
        result.current.contactForm.setValue('name', 'テスト太郎');
        result.current.contactForm.setValue('mail', 'test@example.com');
        result.current.contactForm.setValue('content', 'テスト内容');
      });

      expect(result.current.contactForm.getValues()).toEqual({
        name: 'テスト太郎',
        mail: 'test@example.com',
        content: 'テスト内容',
      });
    });

    it('バリデーションエラーが正しく検出される', async () => {
      const { result } = renderHook(() => useContact());

      await act(async () => {
        result.current.contactForm.setValue('content', '');
        const isValid = await result.current.contactForm.trigger();
        expect(isValid).toBe(false);
      });

      expect(result.current.contactForm.formState.isValid).toBe(false);
    });
  });

  describe('送信処理ロジック', () => {
    const mockSuccessResponse: ContactOutput = { state: 0, message: '成功' };
    const mockErrorResponse: ContactOutput = { state: 1, message: 'エラー' };

    beforeEach(() => {
      mockSaveContact.mockResolvedValue(mockSuccessResponse);
    });

    it('送信中の状態管理が正しく動作する', async () => {
      let resolvePromise: (value: ContactOutput) => void;
      const delayedPromise = new Promise<ContactOutput>((resolve) => {
        resolvePromise = resolve;
      });
      mockSaveContact.mockReturnValue(delayedPromise);

      const { result } = renderHook(() => useContact());
      const testInput = {
        name: 'テスト太郎',
        mail: 'test@example.com',
        content: 'テスト内容',
      };

      act(() => {
        result.current.onSubmit(testInput);
      });

      expect(result.current.sending).toBe(true);

      await act(async () => {
        resolvePromise(mockSuccessResponse);
        await delayedPromise;
      });

      expect(result.current.sending).toBe(false);
    });

    it('送信成功時の処理が正しく実行される', async () => {
      const { result } = renderHook(() => useContact());

      await act(async () => {
        result.current.contactForm.setValue('name', 'テスト太郎');
        result.current.contactForm.setValue('mail', 'test@example.com');
        result.current.contactForm.setValue('content', 'テスト内容');
      });

      const testInput = {
        name: 'テスト太郎',
        mail: 'test@example.com',
        content: 'テスト内容',
      };

      await act(async () => {
        await result.current.onSubmit(testInput);
      });

      expect(result.current.sending).toBe(false);
      expect(result.current.contactForm.getValues()).toEqual({
        name: '',
        mail: '',
        content: '',
      });
      expect(mockToast.success).toHaveBeenCalledWith('問い合わせ内容を送信しました。');
    });

    it('送信失敗時の処理が正しく実行される', async () => {
      mockSaveContact.mockResolvedValue(mockErrorResponse);
      
      const { result } = renderHook(() => useContact());

      await act(async () => {
        result.current.contactForm.setValue('name', 'テスト太郎');
        result.current.contactForm.setValue('mail', 'test@example.com');
        result.current.contactForm.setValue('content', 'テスト内容');
      });

      const testInput = {
        name: 'テスト太郎',
        mail: 'test@example.com',
        content: 'テスト内容',
      };

      await act(async () => {
        await result.current.onSubmit(testInput);
      });

      expect(result.current.sending).toBe(false);
      expect(result.current.contactForm.getValues()).toEqual({
        name: 'テスト太郎',
        mail: 'test@example.com',
        content: 'テスト内容',
      });
      expect(mockToast.error).toHaveBeenCalledWith('送信に失敗しました。');
    });
  });

  describe('API連携テスト', () => {
    it('saveContactに正しいパラメータが渡される', async () => {
      const { result } = renderHook(() => useContact());
      const testInput = {
        name: 'テスト太郎',
        mail: 'test@example.com',
        content: 'テスト内容',
      };

      await act(async () => {
        await result.current.onSubmit(testInput);
      });

      expect(mockSaveContact).toHaveBeenCalledTimes(1);
      expect(mockSaveContact).toHaveBeenCalledWith(testInput);
    });
  });
});