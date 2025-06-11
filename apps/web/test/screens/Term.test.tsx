import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Term } from '@/screens/Term';
import { termTexts } from '@/constants/termTexts';
import type { TermTextProps } from '@/components/custom/TermText';

const MockTermText = ({ type, text, indent }: TermTextProps) => (
  <div data-testid="term-text" data-type={type} data-indent={indent}>
    {text}
  </div>
);

vi.mock('@/components/custom/TermText', () => ({
  TermText: ({ type, text, indent }: TermTextProps) => MockTermText({ type, text, indent }),
}));

describe('Term', () => {
  describe('基本的なレンダリング', () => {
    it('コンポーネントが正しくレンダリングされること', () => {
      render(<Term />);
      expect(screen.getByText('利用規約')).toBeInTheDocument();
    });
  });

  describe('SEO設定', () => {
    it('ページタイトルが正しく設定されること', () => {
      render(<Term />);
      const titleElement = document.querySelector('title');
      expect(titleElement?.textContent).toBe('利用規約');
    });

    it('メタディスクリプションが正しく設定されること', () => {
      render(<Term />);
      const metaElement = document.querySelector('meta[name="description"]');
      expect(metaElement?.getAttribute('content')).toBe(
        'AI文字数調整くんの利用規約ページです。'
      );
    });
  });

  describe('コンテンツ表示', () => {
    it('メインタイトルが表示されること', () => {
      render(<Term />);
      const heading = screen.getByRole('heading', { level: 2, name: '利用規約' });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('利用規約');
    });

    it('主要な条項が表示されること', () => {
      render(<Term />);
      expect(screen.getByText('第1条（適用）')).toBeInTheDocument();
      expect(screen.getByText('第2条（本サービスの利用）')).toBeInTheDocument();
      expect(screen.getByText('第3条（禁止事項）')).toBeInTheDocument();
      expect(screen.getByText('第6条（AIの利用および生成されるコンテンツについて）')).toBeInTheDocument();
      expect(screen.getByText('第13条（準拠法・裁判管轄）')).toBeInTheDocument();
    });

    it('重要な利用規約内容が表示されること', () => {
      render(<Term />);
      expect(screen.getByText((content) => content.includes('この利用規約（以下，「本規約」といいます。）は，AI文字数調整くん運営者'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('本サービスは、Google Cloud Platform が提供する Vertex AI 上の Gemini モデル'))).toBeInTheDocument();
    });

    it('TermTextコンポーネントが正しく表示されること', () => {
      render(<Term />);
      const termTextElements = screen.getAllByTestId('term-text');
      expect(termTextElements).toHaveLength(termTexts.length);
    });

    it('終了テキストが表示されること', () => {
      render(<Term />);
      expect(screen.getByText('以上')).toBeInTheDocument();
    });
  });

  describe('ナビゲーション', () => {
    it('利用規約コンテンツが正しく構造化されていること', () => {
      render(<Term />);
      // 見出しとテキストのタイプ別検証
      const headlineElements = screen.getAllByTestId('term-text').filter(
        element => element.getAttribute('data-type') === 'headline'
      );
      const textElements = screen.getAllByTestId('term-text').filter(
        element => element.getAttribute('data-type') === 'text'
      );
      
      const expectedHeadlines = termTexts.filter(item => item.type === 'headline');
      const expectedTexts = termTexts.filter(item => item.type === 'text');
      
      expect(headlineElements).toHaveLength(expectedHeadlines.length);
      expect(textElements).toHaveLength(expectedTexts.length);
    });
  });

  describe('統合機能', () => {
    it('ページ全体の構造が正しく表示されること', () => {
      render(<Term />);
      // メインコンテナの構造確認
      const container = screen.getByText('利用規約').closest('div');
      expect(container).toHaveClass('w-full', 'py-4', 'px-6', 'mx-auto', 'max-w-4xl', 'sm:px-18');
      
      // メインタイトルのスタイル確認
      const heading = screen.getByRole('heading', { level: 2, name: '利用規約' });
      expect(heading).toHaveClass('text-center', 'text-lg', 'font-medium', 'sm:py-4');
      
      // 終了テキストのスタイル確認
      const endText = screen.getByText('以上');
      expect(endText).toHaveClass('text-sm');
      const endTextContainer = endText.closest('div');
      expect(endTextContainer).toHaveClass('py-12', 'text-end');
      
      // termTextsデータの整合性確認
      expect(termTexts).toBeDefined();
      expect(termTexts.length).toBeGreaterThan(0);
      
      // 適切な数の条項が含まれていることを確認
      const headlineItems = termTexts.filter(item => item.type === 'headline');
      const clauseHeadlines = headlineItems.filter(item => item.text.includes('第') && item.text.includes('条'));
      expect(clauseHeadlines.length).toBeGreaterThanOrEqual(13);
    });
  });
});