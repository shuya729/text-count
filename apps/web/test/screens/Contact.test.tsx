import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import { Contact } from '@/screens/Contact';

vi.mock('@/service/saveContact', () => ({
  saveContact: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { saveContact } from '@/service/saveContact';
import { toast } from 'sonner';

const mockSaveContact = vi.mocked(saveContact);
const mockToast = vi.mocked(toast);

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('Contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSaveContact.mockResolvedValue({ state: 0, message: '成功' });
  });

  describe('基本的なレンダリング', () => {
    it('コンポーネントが正しくレンダリングされること', () => {
      renderWithRouter(<Contact />);
      expect(screen.getByText('お問い合わせ')).toBeInTheDocument();
    });
  });

  describe('SEO設定', () => {
    it('ページタイトルが正しく設定されること', () => {
      renderWithRouter(<Contact />);
      const titleElement = document.querySelector('title');
      expect(titleElement?.textContent).toBe('お問い合わせ');
    });

    it('メタディスクリプションが正しく設定されること', () => {
      renderWithRouter(<Contact />);
      const metaElement = document.querySelector('meta[name="description"]');
      expect(metaElement?.getAttribute('content')).toBe(
        'AI文字数調整くんへのお問い合わせページです。'
      );
    });
  });

  describe('コンテンツ表示', () => {
    it('メインタイトルが表示されること', () => {
      renderWithRouter(<Contact />);
      const mainTitle = screen.getByRole('heading', { level: 2 });
      expect(mainTitle).toHaveTextContent('お問い合わせ');
    });

    it('必要なフォーム要素が表示されること', () => {
      renderWithRouter(<Contact />);
      expect(screen.getByText('以下のフォームよりご連絡ください。')).toBeInTheDocument();
      expect(screen.getByLabelText('名前')).toBeInTheDocument();
      expect(screen.getByLabelText('メール（返信が必要な場合）')).toBeInTheDocument();
      expect(screen.getByLabelText('問い合わせ内容（必須）')).toBeInTheDocument();
    });

    it('送信ボタンが表示されること', () => {
      renderWithRouter(<Contact />);
      const submitButton = screen.getByRole('button', { name: '送信する' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('ナビゲーション', () => {
    it('フォームが正しく動作すること', async () => {
      renderWithRouter(<Contact />);

      // 基本的な入力操作が可能であることを確認
      expect(screen.getByLabelText('名前')).not.toBeDisabled();
      expect(screen.getByLabelText('問い合わせ内容（必須）')).not.toBeDisabled();
      expect(screen.getByRole('button', { name: '送信する' })).not.toBeDisabled();
    });
  });

  describe('統合機能', () => {
    it('フォーム送信が正しく機能すること', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Contact />);

      // フィールドに入力
      await user.type(screen.getByLabelText('問い合わせ内容（必須）'), 'テスト内容');
      await user.click(screen.getByRole('button', { name: '送信する' }));

      // saveContactが呼ばれ、成功メッセージが表示される
      await waitFor(() => {
        expect(mockSaveContact).toHaveBeenCalled();
        expect(mockToast.success).toHaveBeenCalledWith('問い合わせ内容を送信しました。');
      });
    });

    it('エラーハンドリングが正しく機能すること', async () => {
      mockSaveContact.mockResolvedValue({ state: 1, message: 'エラー' });
      const user = userEvent.setup();
      renderWithRouter(<Contact />);

      await user.type(screen.getByLabelText('問い合わせ内容（必須）'), 'テスト内容');
      await user.click(screen.getByRole('button', { name: '送信する' }));

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('送信に失敗しました。');
      });
    });

    it('ページレイアウトが正しく表示されること', () => {
      renderWithRouter(<Contact />);
      // メインコンテナの構造確認
      const container = screen.getByText('お問い合わせ').closest('div');
      expect(container).toHaveClass('w-full', 'p-4', 'mx-auto', 'max-w-xl');

      // フォーム要素の属性確認
      const mailInput = screen.getByLabelText('メール（返信が必要な場合）');
      expect(mailInput).toHaveAttribute('type', 'mail');

      const contentField = screen.getByLabelText('問い合わせ内容（必須）');
      expect(contentField.tagName.toLowerCase()).toBe('textarea');
    });
  });
});