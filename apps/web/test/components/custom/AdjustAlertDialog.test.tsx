import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AdjustAlertDialog } from '@/components/custom/AdjustAlertDialog';
import type { AdjustAlertDialogProps } from '@/components/custom/AdjustAlertDialog';

describe('AdjustAlertDialog', () => {
  const defaultProps: AdjustAlertDialogProps = {
    open: true,
    onOpenChange: vi.fn(),
  };

  describe('基本的なレンダリング', () => {
    it('AlertDialogが正しく表示される', () => {
      render(<AdjustAlertDialog {...defaultProps} />);

      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      expect(screen.getByText('この文章は文字数調整できません。')).toBeInTheDocument();
      expect(screen.getByText('現在、文字数調整機能は 100〜2000文字 の文章に対応しています。')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '分かりました' })).toBeInTheDocument();
    });
  });

  describe('表示状態制御', () => {
    it('openプロパティで表示状態が制御される', () => {
      const { rerender } = render(<AdjustAlertDialog {...defaultProps} open={true} />);
      
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();

      rerender(<AdjustAlertDialog {...defaultProps} open={false} />);
      
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  describe('ユーザーインタラクション', () => {
    it('ボタンクリック時にonOpenChangeが呼び出される', () => {
      const mockOnOpenChange = vi.fn();
      render(<AdjustAlertDialog {...defaultProps} onOpenChange={mockOnOpenChange} />);

      fireEvent.click(screen.getByRole('button', { name: '分かりました' }));

      expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('ESCキーで閉じられる', () => {
      const mockOnOpenChange = vi.fn();
      render(<AdjustAlertDialog {...defaultProps} onOpenChange={mockOnOpenChange} />);

      fireEvent.keyDown(screen.getByRole('alertdialog'), { key: 'Escape' });

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なARIAロールが設定されている', () => {
      render(<AdjustAlertDialog {...defaultProps} />);

      const alertDialog = screen.getByRole('alertdialog');
      expect(alertDialog).toBeInTheDocument();
      
      const title = screen.getByText('この文章は文字数調整できません。');
      expect(title.tagName).toBe('H2');
    });

    it('ボタンがフォーカス可能である', () => {
      render(<AdjustAlertDialog {...defaultProps} />);

      const button = screen.getByRole('button', { name: '分かりました' });
      button.focus();
      expect(button).toHaveFocus();
    });
  });
});