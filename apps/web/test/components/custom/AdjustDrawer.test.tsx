import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AdjustDrawer } from '@/components/custom/AdjustDrawer';
import type { AdjustDrawerProps } from '@/components/custom/AdjustDrawer';
import type { AdjustFormProps } from '@/components/custom/AdjustForm';

// AdjustFormをモック
vi.mock('@/components/custom/AdjustForm', () => ({
  AdjustForm: ({ text, lastCount, onSubmit }: AdjustFormProps) => (
    <div data-testid="adjust-form">
      <div data-testid="form-text">{text}</div>
      <div data-testid="form-last-count">{lastCount}</div>
      <button onClick={() => onSubmit({ text, count: 100 })}>Submit</button>
    </div>
  ),
}));

describe('AdjustDrawer', () => {
  const defaultProps: AdjustDrawerProps = {
    text: 'テスト用のテキスト',
    lastCount: 50,
    open: true,
    onOpenChange: vi.fn(),
    onSubmit: vi.fn(),
  };

  describe('基本的なレンダリング', () => {
    it('Drawerが表示されること', () => {
      render(<AdjustDrawer {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('タイトルと説明が表示されること', () => {
      render(<AdjustDrawer {...defaultProps} />);
      expect(screen.getByText('文字数を調整')).toBeInTheDocument();
      expect(screen.getByText(/設定した文字数±10%の範囲で調整を行います。/)).toBeInTheDocument();
    });

    it('AdjustFormが表示されること', () => {
      render(<AdjustDrawer {...defaultProps} />);
      expect(screen.getByTestId('adjust-form')).toBeInTheDocument();
    });
  });

  describe('プロパティの反映', () => {
    it('textとlastCountがAdjustFormに渡されること', () => {
      const testText = 'テストテキスト';
      const testLastCount = 123;
      render(<AdjustDrawer {...defaultProps} text={testText} lastCount={testLastCount} />);

      expect(screen.getByTestId('form-text')).toHaveTextContent(testText);
      expect(screen.getByTestId('form-last-count')).toHaveTextContent('123');
    });
  });

  describe('表示状態制御', () => {
    it('openプロパティでDrawerの表示が制御されること', () => {
      const { rerender } = render(<AdjustDrawer {...defaultProps} open={true} />);
      expect(screen.getByRole('dialog')).toHaveAttribute('data-state', 'open');

      rerender(<AdjustDrawer {...defaultProps} open={false} />);
      expect(screen.getByRole('dialog')).toHaveAttribute('data-state', 'closed');
    });
  });

  describe('ユーザーインタラクション', () => {
    it('onSubmitコールバックが呼び出されること', () => {
      const mockOnSubmit = vi.fn();
      render(<AdjustDrawer {...defaultProps} onSubmit={mockOnSubmit} />);

      fireEvent.click(screen.getByText('Submit'));
      expect(mockOnSubmit).toHaveBeenCalledWith({ text: defaultProps.text, count: 100 });
    });

    it('EscキーでonOpenChangeが呼び出されること', () => {
      const mockOnOpenChange = vi.fn();
      render(<AdjustDrawer {...defaultProps} onOpenChange={mockOnOpenChange} />);

      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('アクセシビリティ', () => {
    it('タイトルが適切なheading要素として認識されること', () => {
      render(<AdjustDrawer {...defaultProps} />);
      expect(screen.getByRole('heading', { name: '文字数を調整' })).toBeInTheDocument();
    });

    it('適切なクラス名が設定されること', () => {
      render(<AdjustDrawer {...defaultProps} />);
      expect(screen.getByText('文字数を調整')).toHaveClass('text-base');
    });
  });
});