import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { Privacy } from '@/screens/Privacy';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('Privacy', () => {
  describe('基本的なレンダリング', () => {
    it('コンポーネントが正しくレンダリングされること', () => {
      renderWithRouter(<Privacy />);
      expect(screen.getByText('プライバシーポリシー')).toBeInTheDocument();
    });
  });

  describe('SEO設定', () => {
    it('ページタイトルが正しく設定されること', () => {
      renderWithRouter(<Privacy />);
      const titleElement = document.querySelector('title');
      expect(titleElement?.textContent).toBe('プライバシーポリシー');
    });

    it('メタディスクリプションが正しく設定されること', () => {
      renderWithRouter(<Privacy />);
      const metaElement = document.querySelector('meta[name="description"]');
      expect(metaElement?.getAttribute('content')).toBe(
        'AI文字数調整くんのプライバシーポリシーページです。'
      );
    });
  });

  describe('コンテンツ表示', () => {
    it('メインタイトルが表示されること', () => {
      renderWithRouter(<Privacy />);
      const mainTitle = screen.getByRole('heading', { level: 2 });
      expect(mainTitle).toHaveTextContent('プライバシーポリシー');
    });

    it('主要な条項が表示されること', () => {
      renderWithRouter(<Privacy />);
      expect(screen.getByText('第1条（個人情報及び利用者情報）')).toBeInTheDocument();
      expect(screen.getByText('第2条（個人情報及び利用者情報の収集方法）')).toBeInTheDocument();
      expect(screen.getByText('第9条（Cookie及び外部サービスの利用について）')).toBeInTheDocument();
      expect(screen.getByText('第11条（お問い合わせ窓口）')).toBeInTheDocument();
    });

    it('重要な情報の定義が表示されること', () => {
      renderWithRouter(<Privacy />);
      expect(screen.getByText((content) => content.includes('「個人情報」とは，個人情報の保護に関する法律'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('「利用者情報」とは、個人情報には該当しないものの、Cookie'))).toBeInTheDocument();
    });

    it('Googleサービスの利用に関する説明が表示されること', () => {
      renderWithRouter(<Privacy />);
      expect(screen.getByText((content) => content.includes('Google Analytics」（Firebase Analyticsを含む）および広告サービス「Google AdSense'))).toBeInTheDocument();
    });

    it('終了テキストが表示されること', () => {
      renderWithRouter(<Privacy />);
      expect(screen.getByText('以上')).toBeInTheDocument();
    });
  });

  describe('ナビゲーション', () => {
    it('問い合わせページへのリンクが正しく設定されること', () => {
      renderWithRouter(<Privacy />);
      const link = screen.getByRole('link', { name: '問い合わせページへ' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/contact');
    });

    it('リンクボタンが正しく表示されること', () => {
      renderWithRouter(<Privacy />);
      const button = screen.getByRole('button', { name: '問い合わせページへ' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('問い合わせページへ');
    });
  });

  describe('統合機能', () => {
    it('ページ全体の構造が正しく表示されること', () => {
      renderWithRouter(<Privacy />);
      // メインコンテナの構造確認
      const container = screen.getByText('プライバシーポリシー').closest('div');
      expect(container).toHaveClass('w-full', 'py-4', 'px-6', 'mx-auto', 'max-w-4xl', 'sm:px-18');
      
      // メインタイトルのスタイル確認
      const mainTitle = screen.getByRole('heading', { level: 2 });
      expect(mainTitle).toHaveClass('text-center', 'text-lg', 'font-medium', 'sm:py-4');
      
      // 終了テキストのスタイル確認
      const endingText = screen.getByText('以上');
      expect(endingText).toHaveClass('text-sm');
      const endingTextContainer = endingText.closest('div');
      expect(endingTextContainer).toHaveClass('py-12', 'text-end');
      
      // リンクボタンのスタイル確認
      const button = screen.getByRole('button', { name: '問い合わせページへ' });
      expect(button).toHaveClass('w-80', 'h-10');
    });
  });
});