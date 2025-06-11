import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { About } from '@/screens/About';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('About', () => {
  describe('基本的なレンダリング', () => {
    it('コンポーネントが正しくレンダリングされること', () => {
      renderWithRouter(<About />);
      expect(screen.getByText('ツールについて')).toBeInTheDocument();
    });
  });

  describe('SEO設定', () => {
    it('ページタイトルが正しく設定されること', () => {
      renderWithRouter(<About />);
      const titleElement = document.querySelector('title');
      expect(titleElement?.textContent).toBe('ツールについて');
    });

    it('メタディスクリプションが正しく設定されること', () => {
      renderWithRouter(<About />);
      const metaElement = document.querySelector('meta[name="description"]');
      expect(metaElement?.getAttribute('content')).toBe(
        'AI文字数調整くんについての説明ページです。AI文字数調整くんは、文章の文字数をAIで自然に調整できるツールです。現在200〜2000文字の範囲で調整可能です。'
      );
    });
  });

  describe('コンテンツ表示', () => {
    it('メインタイトルが表示されること', () => {
      renderWithRouter(<About />);
      const mainTitle = screen.getByRole('heading', { level: 2 });
      expect(mainTitle).toHaveTextContent('ツールについて');
    });

    it('主要セクション見出しが表示されること', () => {
      renderWithRouter(<About />);
      expect(screen.getByRole('heading', { level: 3, name: 'AI文字数調整機能' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: 'ツールの使い方' })).toBeInTheDocument();
    });

    it('ツール概要説明が表示されること', () => {
      renderWithRouter(<About />);
      expect(screen.getByText('AI文字数調整くんは、文字数カウントとAI文字数調整機能を搭載した、日本語の文章を編集するためのツールです。')).toBeInTheDocument();
    });

    it('AI機能の特徴説明が表示されること', () => {
      renderWithRouter(<About />);
      expect(screen.getByText('AIを活用して文章の雰囲気や意味を損なうことなく、自然な表現を保ったまま文字数の調整が可能です。')).toBeInTheDocument();
    });
  });

  describe('ナビゲーション', () => {
    it('ホームページへのリンクが正しく設定されること', () => {
      renderWithRouter(<About />);
      const link = screen.getByRole('link', { name: 'AI文字数調整くん' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/');
    });

    it('ツール使用案内が表示されること', () => {
      renderWithRouter(<About />);
      expect(screen.getByRole('heading', { level: 5, name: 'ツールの使用はこちらから' })).toBeInTheDocument();
    });
  });

  describe('統合機能', () => {
    it('ページ全体の構造が適切に表示されること', () => {
      renderWithRouter(<About />);
      // メインコンテナの存在確認
      const container = screen.getByText('ツールについて').closest('div');
      expect(container).toHaveClass('w-full', 'py-4', 'px-6', 'mx-auto', 'max-w-4xl', 'sm:px-18');
      
      // 重要な機能説明が全て含まれていることを確認
      expect(screen.getByText((content) => content.includes('戻る」ボタン'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('進む」ボタン'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('クリア」ボタン'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('コピー」ボタン'))).toBeInTheDocument();
    });
  });
});