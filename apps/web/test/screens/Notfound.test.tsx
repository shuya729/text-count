import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { Notfound } from '@/screens/Notfound';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('Notfound', () => {
  describe('基本的なレンダリング', () => {
    it('コンポーネントが正しくレンダリングされること', () => {
      renderWithRouter(<Notfound />);
      expect(screen.getByText('404')).toBeInTheDocument();
    });
  });

  describe('SEO設定', () => {
    it('ページタイトルが正しく設定されること', () => {
      renderWithRouter(<Notfound />);
      const titleElement = document.querySelector('title');
      expect(titleElement?.textContent).toBe('ページが見つかりません');
    });

    it('メタディスクリプションが正しく設定されること', () => {
      renderWithRouter(<Notfound />);
      const metaElement = document.querySelector('meta[name="description"]');
      expect(metaElement?.getAttribute('content')).toBe(
        'AI文字数調整くんのページが見つかりませんでした。'
      );
    });
  });

  describe('コンテンツ表示', () => {
    it('404エラーコードとメッセージが表示されること', () => {
      renderWithRouter(<Notfound />);
      expect(screen.getByRole('heading', { level: 2, name: '404' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Not Found' })).toBeInTheDocument();
      expect(screen.getByText('お探しのページは見つかりませんでした。')).toBeInTheDocument();
    });

    it('ツール使用案内が表示されること', () => {
      renderWithRouter(<Notfound />);
      expect(screen.getByRole('heading', { level: 5, name: 'ツールの使用はこちらから' })).toBeInTheDocument();
    });
  });

  describe('ナビゲーション', () => {
    it('ホームページへのリンクが正しく設定されること', () => {
      renderWithRouter(<Notfound />);
      const link = screen.getByRole('link', { name: 'AI文字数調整くん' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/');
    });

    it('リンクボタンが正しく表示されること', () => {
      renderWithRouter(<Notfound />);
      const button = screen.getByRole('button', { name: 'AI文字数調整くん' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('AI文字数調整くん');
    });
  });

  describe('統合機能', () => {
    it('ページ全体の構造が正しく表示されること', () => {
      renderWithRouter(<Notfound />);
      // メインコンテナの構造確認
      const container = screen.getByText('404').closest('div');
      expect(container).toHaveClass('w-full', 'py-4', 'px-6', 'mx-auto', 'max-w-4xl', 'sm:px-18');
      
      // 見出し構造の確認
      const h2Headings = screen.getAllByRole('heading', { level: 2 });
      expect(h2Headings).toHaveLength(2);
      
      const h5Headings = screen.getAllByRole('heading', { level: 5 });
      expect(h5Headings).toHaveLength(1);
      
      // 重要要素のスタイル確認
      const errorCode = screen.getByRole('heading', { level: 2, name: '404' });
      expect(errorCode).toHaveClass('text-center', 'text-4xl', 'font-semibold', 'pt-8', 'sm:pt-16');
      
      const link = screen.getByRole('link', { name: 'AI文字数調整くん' });
      expect(link).toBeVisible();
      expect(link).not.toHaveAttribute('aria-disabled');
    });
  });
});