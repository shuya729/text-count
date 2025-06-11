import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Home } from '@/screens/Home';

const mockUseTextEdit = vi.fn();
vi.mock('@/hooks/useTextEdit', () => ({
  useTextEdit: () => mockUseTextEdit(),
}));

// シンプルなコンポーネントモック
vi.mock('@/components/custom/TopAds', () => ({
  TopAds: () => <div data-testid="top-ads">TopAds</div>,
}));
vi.mock('@/components/custom/LeftAds', () => ({
  LeftAds: () => <div data-testid="left-ads">LeftAds</div>,
}));
vi.mock('@/components/custom/RightAds', () => ({
  RightAds: () => <div data-testid="right-ads">RightAds</div>,
}));
vi.mock('@/components/custom/ControlPanel', () => ({
  ControlPanel: () => <div data-testid="control-panel">ControlPanel</div>,
}));
vi.mock('@/components/custom/TextEditor', () => ({
  TextEditor: () => <div data-testid="text-editor">TextEditor</div>,
}));
vi.mock('@/components/custom/AdjustAlertDialog', () => ({
  AdjustAlertDialog: () => <div data-testid="adjust-alert-dialog">AdjustAlertDialog</div>,
}));
vi.mock('@/components/custom/AdjustDrawer', () => ({
  AdjustDrawer: () => <div data-testid="adjust-drawer">AdjustDrawer</div>,
}));
vi.mock('@/components/custom/AdjustDialog', () => ({
  AdjustDialog: () => <div data-testid="adjust-dialog">AdjustDialog</div>,
}));

describe('Home', () => {
  const mockTextEditValues = {
    text: 'テストテキスト',
    adjustForms: 0,
    adjustStatus: 0,
    lastCount: 50,
    canUndo: true,
    canRedo: false,
    handleTextChange: vi.fn(),
    handleUndo: vi.fn(),
    handleRedo: vi.fn(),
    handleClear: vi.fn(),
    handleCopy: vi.fn(),
    handleAdjust: vi.fn(),
    formsOpenChange: vi.fn(),
    onSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTextEdit.mockReturnValue(mockTextEditValues);
  });

  describe('基本的なレンダリング', () => {
    it('ホームページが正しくレンダリングされること', () => {
      render(<Home />);
      expect(screen.getByTestId('top-ads')).toBeInTheDocument();
      expect(screen.getByTestId('control-panel')).toBeInTheDocument();
      expect(screen.getByTestId('text-editor')).toBeInTheDocument();
    });
  });

  describe('SEO設定', () => {
    it('ページタイトルが正しく設定されること', () => {
      render(<Home />);
      const titleElement = document.querySelector('title');
      expect(titleElement?.textContent).toBe('AI文字数調整くん｜文字数カウント・調整ツール');
    });

    it('メタディスクリプションが正しく設定されること', () => {
      render(<Home />);
      const metaElement = document.querySelector('meta[name="description"]');
      expect(metaElement?.getAttribute('content')).toBe(
        'AI文字数調整くんは、文章の文字数をAIで自然に調整できるツールです。レポート、ES、SNS投稿など文字数制限がある場面で便利です。現在200〜2000文字の範囲で調整可能です。'
      );
    });
  });

  describe('コンテンツ表示', () => {
    it('主要コンポーネントが表示されること', () => {
      render(<Home />);
      expect(screen.getByTestId('top-ads')).toBeInTheDocument();
      expect(screen.getByTestId('control-panel')).toBeInTheDocument();
      expect(screen.getByTestId('text-editor')).toBeInTheDocument();
      expect(screen.getByTestId('left-ads')).toBeInTheDocument();
      expect(screen.getByTestId('right-ads')).toBeInTheDocument();
    });

    it('調整ダイアログコンポーネントが表示されること', () => {
      render(<Home />);
      expect(screen.getByTestId('adjust-alert-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('adjust-drawer')).toBeInTheDocument();
      expect(screen.getByTestId('adjust-dialog')).toBeInTheDocument();
    });
  });

  describe('ナビゲーション', () => {
    it('useTextEditフックが正しく呼び出されること', () => {
      render(<Home />);
      expect(mockUseTextEdit).toHaveBeenCalled();
    });
  });

  describe('統合機能', () => {
    it('ページ全体が正しく統合されて表示されること', () => {
      render(<Home />);
      // 全ての主要コンポーネントの存在確認
      expect(screen.getByTestId('top-ads')).toBeInTheDocument();
      expect(screen.getByTestId('control-panel')).toBeInTheDocument();
      expect(screen.getByTestId('text-editor')).toBeInTheDocument();
      expect(screen.getByTestId('left-ads')).toBeInTheDocument();
      expect(screen.getByTestId('right-ads')).toBeInTheDocument();
      expect(screen.getByTestId('adjust-alert-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('adjust-drawer')).toBeInTheDocument();
      expect(screen.getByTestId('adjust-dialog')).toBeInTheDocument();
      
      // useTextEditが正しく呼び出されていることを確認
      expect(mockUseTextEdit).toHaveBeenCalled();
    });
  });
});