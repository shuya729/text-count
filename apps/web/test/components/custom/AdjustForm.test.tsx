import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AdjustForm } from '@/components/custom/AdjustForm';
import type { AdjustFormProps } from '@/components/custom/AdjustForm';

describe('AdjustForm', () => {
  const defaultProps: AdjustFormProps = {
    text: 'これはテスト用の文章です。',
    lastCount: 500,
    onSubmit: vi.fn(),
  };

  describe('基本的なレンダリング', () => {
    it('フォーム要素が正しく表示される', () => {
      render(<AdjustForm {...defaultProps} />);

      expect(document.querySelector('form')).toBeInTheDocument();
      expect(screen.getByLabelText('文字数（200〜2000文字に対応）')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'AIで調整する' })).toBeInTheDocument();
    });
  });

  describe('プロパティの反映', () => {
    it('lastCountがデフォルト値として設定される', () => {
      render(<AdjustForm {...defaultProps} />);

      const countInput = screen.getByLabelText('文字数（200〜2000文字に対応）') as HTMLInputElement;
      expect(countInput.value).toBe('500');
    });

    it('lastCountが0の場合はtext.trim().lengthが使用される', () => {
      const props = {
        ...defaultProps,
        text: 'あいうえおかきくけこ',
        lastCount: 0,
      };
      render(<AdjustForm {...props} />);

      const countInput = screen.getByLabelText('文字数（200〜2000文字に対応）') as HTMLInputElement;
      expect(countInput.value).toBe('10');
    });
  });

  describe('バリデーション', () => {
    it('200未満の値でエラーが表示される', async () => {
      render(<AdjustForm {...defaultProps} />);

      const countInput = screen.getByLabelText('文字数（200〜2000文字に対応）');
      const submitButton = screen.getByRole('button', { name: 'AIで調整する' });

      fireEvent.change(countInput, { target: { value: '150' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('目標文字数は200以上で入力して下さい。')).toBeInTheDocument();
      });
    });

    it('2000を超える値でエラーが表示される', async () => {
      render(<AdjustForm {...defaultProps} />);

      const countInput = screen.getByLabelText('文字数（200〜2000文字に対応）');
      const submitButton = screen.getByRole('button', { name: 'AIで調整する' });

      fireEvent.change(countInput, { target: { value: '2500' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('目標文字数は2000以下で入力して下さい。')).toBeInTheDocument();
      });
    });
  });

  describe('フォーム送信', () => {
    it('有効な値でonSubmitが呼び出される', async () => {
      const mockOnSubmit = vi.fn();
      const props = {
        ...defaultProps,
        onSubmit: mockOnSubmit,
      };
      render(<AdjustForm {...props} />);

      const countInput = screen.getByLabelText('文字数（200〜2000文字に対応）');
      const submitButton = screen.getByRole('button', { name: 'AIで調整する' });

      fireEvent.change(countInput, { target: { value: '500' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            text: 'これはテスト用の文章です。',
            count: 500,
          }),
          expect.anything()
        );
      });
    });

    it('無効な値でonSubmitが呼び出されない', async () => {
      const mockOnSubmit = vi.fn();
      const props = {
        ...defaultProps,
        onSubmit: mockOnSubmit,
      };
      render(<AdjustForm {...props} />);

      const countInput = screen.getByLabelText('文字数（200〜2000文字に対応）');
      const submitButton = screen.getByRole('button', { name: 'AIで調整する' });

      fireEvent.change(countInput, { target: { value: '100' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('目標文字数は200以上で入力して下さい。')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('境界値テスト', () => {
    it('文字数調整範囲の表示が正しく計算される', async () => {
      render(<AdjustForm {...defaultProps} />);

      const countInput = screen.getByLabelText('文字数（200〜2000文字に対応）');
      fireEvent.change(countInput, { target: { value: '1000' } });

      await waitFor(() => {
        expect(screen.getByText('調整後の文字数： 900 ~ 1100 文字')).toBeInTheDocument();
      });
    });

    it('小数点入力も適切に処理される', () => {
      render(<AdjustForm {...defaultProps} />);

      const countInput = screen.getByLabelText('文字数（200〜2000文字に対応）');
      fireEvent.change(countInput, { target: { value: '500.5' } });

      expect(countInput).toHaveValue(500.5);
    });
  });

  describe('エラーハンドリング', () => {
    it('無効なフォーム送信でエラーが発生しない', () => {
      const props = {
        text: '',
        lastCount: 0,
        onSubmit: vi.fn(),
      };

      expect(() => {
        render(<AdjustForm {...props} />);
      }).not.toThrow();

      const countInput = screen.getByLabelText('文字数（200〜2000文字に対応）') as HTMLInputElement;
      expect(countInput.value).toBe('0');
    });
  });
});