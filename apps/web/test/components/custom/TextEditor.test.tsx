import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TextEditor } from '@/components/custom/TextEditor';
import type { TextEditorProps } from '@/components/custom/TextEditor';

describe('TextEditor', () => {
  const defaultProps: TextEditorProps = {
    text: 'テスト用のテキスト',
    onChange: vi.fn(),
    disabled: false,
    adjustStatus: 0,
  };

  describe('基本的なレンダリング', () => {
    it('adjustStatus=0の時にTextareaが表示されること', () => {
      render(<TextEditor {...defaultProps} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toBeInstanceOf(HTMLTextAreaElement);
    });

    it('適切なプレースホルダーが表示されること', () => {
      render(<TextEditor {...defaultProps} text="" />);
      const textarea = screen.getByRole('textbox');
      const placeholder = textarea.getAttribute('placeholder');
      expect(placeholder).toContain('文章を入力して下さい。');
      expect(placeholder).toContain('左上のボックスに入力中の文字数が表示され');
      expect(placeholder).toContain('右上のボタンよりAI文字数調整機能を利用できます。');
    });
  });

  describe('プロパティの反映', () => {
    it('textプロパティがTextareaのvalueに反映されること', () => {
      const testText = 'これはテスト用の文章です。';
      render(<TextEditor {...defaultProps} text={testText} />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.value).toBe(testText);
    });

    it('disabledプロパティがTextareaに反映されること', () => {
      const { rerender } = render(<TextEditor {...defaultProps} disabled={false} />);
      expect(screen.getByRole('textbox')).not.toBeDisabled();

      rerender(<TextEditor {...defaultProps} disabled={true} />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('表示状態制御', () => {
    it('adjustStatus=1の時にSkeletonが表示されること', () => {
      render(<TextEditor {...defaultProps} adjustStatus={1} />);
      
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBe(8);
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('adjustStatus=2の時にTextareaが表示されること', () => {
      render(<TextEditor {...defaultProps} adjustStatus={2} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('Skeleton表示時に適切なスタイルが設定されること', () => {
      render(<TextEditor {...defaultProps} adjustStatus={1} />);
      const container = screen.getByText((_, element) => {
        return element?.classList.contains('cursor-not-allowed') === true &&
               element?.classList.contains('opacity-50') === true;
      });
      expect(container).toBeInTheDocument();
    });
  });

  describe('ユーザーインタラクション', () => {
    it('テキスト入力時にonChangeが呼び出されること', () => {
      const mockOnChange = vi.fn();
      render(<TextEditor {...defaultProps} onChange={mockOnChange} />);

      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: '新しいテキスト' } });

      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('disabled時でもonChangeプロパティが設定されること', () => {
      const mockOnChange = vi.fn();
      render(<TextEditor {...defaultProps} onChange={mockOnChange} disabled={true} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveProperty('onchange');
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なクラス名が設定されること', () => {
      render(<TextEditor {...defaultProps} />);

      const textarea = screen.getByRole('textbox');
      const container = textarea.closest('div');

      expect(textarea.className).toContain('w-full');
      expect(textarea.className).toContain('text-sm');
      expect(textarea.className).toContain('disabled:opacity-100');

      expect(container).toHaveClass(
        'flex',
        'justify-center',
        'flex-auto',
        'w-full',
        'max-w-2xl'
      );
    });

    it('レスポンシブな高さクラスが設定されること', () => {
      render(<TextEditor {...defaultProps} />);
      const container = screen.getByRole('textbox').closest('div');
      
      expect(container?.className).toContain('min-h-80');
      expect(container?.className).toContain('h-[calc(100svh-214px)]');
      expect(container?.className).toContain('sm:h-[calc(100svh-286px)]');
      expect(container?.className).toContain('lg:h-[calc(100svh-190px)]');
    });
  });
});