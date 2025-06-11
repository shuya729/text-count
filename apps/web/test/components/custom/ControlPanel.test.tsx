import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ControlPanel } from '@/components/custom/ControlPanel';
import type { ControlPanelProps } from '@/components/custom/ControlPanel';

describe('ControlPanel', () => {
  const defaultProps: ControlPanelProps = {
    text: 'テスト用のテキスト',
    onUndo: vi.fn(),
    onRedo: vi.fn(),
    onClear: vi.fn(),
    onCopy: vi.fn(),
    onAdjust: vi.fn(),
    disableUndo: false,
    disableRedo: false,
    disableClear: false,
    disableCopy: false,
    disableAdjust: false,
  };

  describe('基本的なレンダリング', () => {
    it('文字数表示と全ボタンが表示されること', () => {
      render(<ControlPanel {...defaultProps} />);

      expect(screen.getByLabelText('文字数')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /戻る/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /進む/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /クリア/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /コピー/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /AI調整/ })).toBeInTheDocument();
    });

    it('文字数が正しく計算されて表示されること', () => {
      const testText = 'これは13文字のテストです';
      render(<ControlPanel {...defaultProps} text={testText} />);

      const countInput = screen.getByLabelText('文字数') as HTMLInputElement;
      expect(countInput.value).toBe('13');
      expect(countInput).toBeDisabled();
    });
  });

  describe('プロパティの反映', () => {
    it('各disableプロパティがボタンの無効状態に反映されること', () => {
      render(
        <ControlPanel
          {...defaultProps}
          disableUndo={true}
          disableRedo={true}
          disableClear={true}
          disableCopy={true}
          disableAdjust={true}
        />
      );

      expect(screen.getByRole('button', { name: /戻る/ })).toBeDisabled();
      expect(screen.getByRole('button', { name: /進む/ })).toBeDisabled();
      expect(screen.getByRole('button', { name: /クリア/ })).toBeDisabled();
      expect(screen.getByRole('button', { name: /コピー/ })).toBeDisabled();
      expect(screen.getByRole('button', { name: /AI調整/ })).toBeDisabled();
    });

    it('空文字の場合に文字数が0と表示されること', () => {
      render(<ControlPanel {...defaultProps} text="" />);
      const countInput = screen.getByLabelText('文字数') as HTMLInputElement;
      expect(countInput.value).toBe('0');
    });
  });

  describe('ユーザーインタラクション', () => {
    it('各ボタンクリック時に対応するコールバックが呼び出されること', () => {
      const mockCallbacks = {
        onUndo: vi.fn(),
        onRedo: vi.fn(),
        onClear: vi.fn(),
        onCopy: vi.fn(),
        onAdjust: vi.fn(),
      };
      render(<ControlPanel {...defaultProps} {...mockCallbacks} />);

      fireEvent.click(screen.getByRole('button', { name: /戻る/ }));
      expect(mockCallbacks.onUndo).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: /進む/ }));
      expect(mockCallbacks.onRedo).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: /クリア/ }));
      expect(mockCallbacks.onClear).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: /コピー/ }));
      expect(mockCallbacks.onCopy).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: /AI調整/ }));
      expect(mockCallbacks.onAdjust).toHaveBeenCalledTimes(1);
    });

    it('無効状態のボタンがクリックされても関数が呼ばれないこと', () => {
      const mockOnUndo = vi.fn();
      render(<ControlPanel {...defaultProps} onUndo={mockOnUndo} disableUndo={true} />);

      fireEvent.click(screen.getByRole('button', { name: /戻る/ }));
      expect(mockOnUndo).not.toHaveBeenCalled();
    });
  });

  describe('表示状態制御', () => {
    it('AI調整ボタンの状態に応じてアイコンが変わること', () => {
      const { rerender } = render(<ControlPanel {...defaultProps} disableAdjust={false} />);
      let adjustButton = screen.getByRole('button', { name: /AI調整/ });
      expect(adjustButton.querySelector('svg:not([class*="animate-spin"])')).toBeInTheDocument();

      rerender(<ControlPanel {...defaultProps} disableAdjust={true} />);
      adjustButton = screen.getByRole('button', { name: /AI調整/ });
      expect(adjustButton.querySelector('svg[class*="animate-spin"]')).toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なクラス名とラベルが設定されること', () => {
      render(<ControlPanel {...defaultProps} />);

      const countInput = screen.getByLabelText('文字数');
      const label = screen.getByText('文字数');

      expect(countInput).toHaveClass('text-center', 'disabled:opacity-100');
      expect(label).toHaveAttribute('for', 'count');
    });

    it('セパレータが表示されること', () => {
      render(<ControlPanel {...defaultProps} />);
      const separator = document.querySelector('[data-orientation="vertical"]');
      expect(separator).toBeInTheDocument();
    });
  });
});