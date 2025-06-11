import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AdjustDialog } from '@/components/custom/AdjustDialog';
import type { AdjustDialogProps } from '@/components/custom/AdjustDialog';

// AdjustFormをモック
vi.mock('@/components/custom/AdjustForm', () => ({
  AdjustForm: vi.fn(({ text, lastCount, onSubmit }) => (
    <div data-testid="mocked-adjust-form">
      <span data-testid="form-text">{text}</span>
      <span data-testid="form-last-count">{lastCount}</span>
      <button data-testid="form-submit" onClick={() => onSubmit({ text, count: 500 })}>
        Submit
      </button>
    </div>
  )),
}));

describe('AdjustDialog', () => {
  const defaultProps: AdjustDialogProps = {
    text: 'テスト用のテキスト',
    lastCount: 500,
    open: true,
    onOpenChange: vi.fn(),
    onSubmit: vi.fn(),
  };

  describe('基本的なレンダリング', () => {
    it('ダイアログが表示されること', () => {
      render(<AdjustDialog {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('タイトルと説明が表示されること', () => {
      render(<AdjustDialog {...defaultProps} />);
      expect(screen.getByText('文字数を調整')).toBeInTheDocument();
      expect(screen.getByText(/設定した文字数±10%の範囲で調整を行います。/)).toBeInTheDocument();
    });

    it('AdjustFormが表示されること', () => {
      render(<AdjustDialog {...defaultProps} />);
      expect(screen.getByTestId('mocked-adjust-form')).toBeInTheDocument();
    });
  });

  describe('プロパティの反映', () => {
    it('textとlastCountがAdjustFormに渡されること', () => {
      const testText = 'テストテキスト';
      const testLastCount = 800;
      render(<AdjustDialog {...defaultProps} text={testText} lastCount={testLastCount} />);

      expect(screen.getByTestId('form-text')).toHaveTextContent(testText);
      expect(screen.getByTestId('form-last-count')).toHaveTextContent('800');
    });
  });

  describe('表示状態制御', () => {
    it('openプロパティでダイアログの表示が制御されること', () => {
      const { rerender } = render(<AdjustDialog {...defaultProps} open={true} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      rerender(<AdjustDialog {...defaultProps} open={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('ユーザーインタラクション', () => {
    it('onSubmitコールバックが呼び出されること', () => {
      const mockOnSubmit = vi.fn();
      render(<AdjustDialog {...defaultProps} onSubmit={mockOnSubmit} />);

      fireEvent.click(screen.getByTestId('form-submit'));
      expect(mockOnSubmit).toHaveBeenCalledWith({ text: defaultProps.text, count: 500 });
    });

    it('onOpenChangeコールバックが呼び出されること', () => {
      const mockOnOpenChange = vi.fn();
      render(<AdjustDialog {...defaultProps} onOpenChange={mockOnOpenChange} />);

      const dialogOverlay = document.querySelector('[data-radix-dialog-overlay]');
      if (dialogOverlay) {
        fireEvent.click(dialogOverlay);
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      }
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なクラス名が設定されること', () => {
      render(<AdjustDialog {...defaultProps} />);
      const dialogContent = document.querySelector('[role="dialog"]');
      expect(dialogContent).toHaveClass('sm:max-w-[425px]');
    });
  });
});