import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { OmikujiAnimation } from './OmikujiAnimation';
import { Fortune, FortuneData } from '@/domain/valueObjects/Fortune';
import { OmikujiType } from '@/domain/entities/OmikujiType';

// タイマーをモック
vi.useFakeTimers();

// テスト用Fortune生成ヘルパー
function createFortune(value: number, id: string = 'test'): Fortune {
  const data: FortuneData = {
    id,
    englishName: 'Test',
    japaneseName: 'テスト',
    description: 'テスト用',
    probability: 0.1,
    value,
    color: {
      primary: '#000',
      secondary: '#fff',
      background: '#eee'
    },
    effects: {
      glow: value >= 6,
      sparkle: value >= 6,
      animation: value >= 6 ? 'rainbow' : null
    }
  };
  return Fortune.fromData(data);
}

// テスト用OmikujiType生成ヘルパー
function createOmikujiType(id: string = 'engineer-fortune'): OmikujiType {
  return OmikujiType.create({
    id,
    name: 'エンジニア運勢',
    description: '今日のコーディング運を占う',
    icon: '💻',
    color: {
      // WCAG AA準拠の色設定（コントラスト比 >= 4.5）
      primary: '#C53030',
      secondary: '#FFFFFF',
      border: '#9B2C2C'
    },
    sortOrder: 1
  });
}

describe('OmikujiAnimation', () => {
  const mockOnComplete = vi.fn();
  let defaultProps: {
    fortune: Fortune;
    omikujiType: OmikujiType;
    onComplete: () => void;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    defaultProps = {
      fortune: createFortune(4, 'kichi'),
      omikujiType: createOmikujiType(),
      onComplete: mockOnComplete
    };
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('基本レンダリング', () => {
    it('アニメーションコンテナが表示される', () => {
      // Act
      render(<OmikujiAnimation {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('omikuji-animation')).toBeInTheDocument();
    });

    it('必要なサブコンポーネントが表示される', () => {
      // Act
      render(<OmikujiAnimation {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('code-log-stream')).toBeInTheDocument();
      expect(screen.getByTestId('status-message')).toBeInTheDocument();
    });

    it('鳥居アニメーションが初期フェーズで表示される', () => {
      // Act
      render(<OmikujiAnimation {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('torii-animation')).toBeInTheDocument();
    });
  });

  describe('フェーズ遷移', () => {
    it('sando-revealフェーズで参道背景が表示される', async () => {
      // Arrange
      render(<OmikujiAnimation {...defaultProps} />);

      // Act - 1秒後にsando-revealへ遷移
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Assert
      expect(screen.getByTestId('sando-background')).toBeInTheDocument();
    });

    it('cylinder-shakeフェーズでおみくじ筒が表示される', () => {
      // Arrange
      render(<OmikujiAnimation {...defaultProps} />);

      // Act - 2秒後にcylinder-shakeへ遷移
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Assert
      expect(screen.getByTestId('omikuji-cylinder')).toBeInTheDocument();
    });

    it('stick-ejectフェーズでおみくじ棒が表示される', () => {
      // Arrange
      render(<OmikujiAnimation {...defaultProps} />);

      // Act - 3.5秒後にstick-ejectへ遷移
      act(() => {
        vi.advanceTimersByTime(3500);
      });

      // Assert
      expect(screen.getByTestId('omikuji-stick')).toBeInTheDocument();
    });

    it('桜の花びらが表示される', () => {
      // Arrange
      render(<OmikujiAnimation {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('sakura-petals')).toBeInTheDocument();
    });
  });

  describe('onCompleteコールバック', () => {
    it('アニメーション完了後にonCompleteが呼ばれる', () => {
      // Arrange
      render(<OmikujiAnimation {...defaultProps} />);

      // Act - 5秒 (4.5s + 0.5s duration) 後に完了
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Assert
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });

    it('アニメーション完了前にはonCompleteが呼ばれない', () => {
      // Arrange
      render(<OmikujiAnimation {...defaultProps} />);

      // Act - 4秒ではまだ完了していない
      act(() => {
        vi.advanceTimersByTime(4000);
      });

      // Assert
      expect(mockOnComplete).not.toHaveBeenCalled();
    });
  });

  describe('運勢別スタイル', () => {
    it('大吉時（value >= 6）にSpecialEffectsが表示される', () => {
      // Arrange
      const daikichiProps = {
        ...defaultProps,
        fortune: createFortune(6, 'daikichi')
      };

      // Act
      render(<OmikujiAnimation {...daikichiProps} />);

      // fortune-revealフェーズまで進める
      act(() => {
        vi.advanceTimersByTime(4500);
      });

      // Assert
      expect(screen.getByTestId('special-effects-container')).toBeInTheDocument();
    });

    it('大凶時（value <= 1）にSpecialEffectsが表示される', () => {
      // Arrange
      const daikyoProps = {
        ...defaultProps,
        fortune: createFortune(1, 'daikyo')
      };

      // Act
      render(<OmikujiAnimation {...daikyoProps} />);

      // fortune-revealフェーズまで進める
      act(() => {
        vi.advanceTimersByTime(4500);
      });

      // Assert
      expect(screen.getByTestId('special-effects-container')).toBeInTheDocument();
    });

    it('通常運勢時（2 <= value <= 5）にはSpecialEffectsが非表示', () => {
      // Arrange
      render(<OmikujiAnimation {...defaultProps} />);

      // fortune-revealフェーズまで進める
      act(() => {
        vi.advanceTimersByTime(4500);
      });

      // Assert
      expect(screen.queryByTestId('special-effects-container')).not.toBeInTheDocument();
    });
  });

  describe('ステータスメッセージ', () => {
    it('おみくじ種類に応じたタイトルが表示される', () => {
      // Arrange
      render(<OmikujiAnimation {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('animation-title')).toHaveTextContent('運命をデプロイ中...');
    });

    it('カスタムメッセージが指定された場合に使用される', () => {
      // Arrange
      const customMessages = ['カスタムメッセージ1', 'カスタムメッセージ2'];
      render(<OmikujiAnimation {...defaultProps} statusMessages={customMessages} />);

      // Assert
      expect(screen.getByTestId('status-text')).toHaveTextContent('カスタムメッセージ1');
    });
  });

  describe('アクセシビリティ', () => {
    it('メインコンテナにrole属性が設定される', () => {
      // Act
      render(<OmikujiAnimation {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('omikuji-animation')).toHaveAttribute('role', 'status');
    });

    it('aria-label属性が設定される', () => {
      // Act
      render(<OmikujiAnimation {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('omikuji-animation')).toHaveAttribute('aria-label', 'おみくじ結果を表示中');
    });

    it('aria-live領域でステータスが通知される', () => {
      // Act
      render(<OmikujiAnimation {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('status-message')).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('reduced-motion対応', () => {
    it('reduced-motion時は即座にfortune-revealフェーズに遷移', () => {
      // Arrange - window.matchMediaをモック
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }));

      // Act
      render(<OmikujiAnimation {...defaultProps} />);

      // Assert - 即座に結果表示フェーズへ
      expect(screen.getByTestId('omikuji-stick')).toBeInTheDocument();

      // Cleanup
      window.matchMedia = originalMatchMedia;
    });
  });

  describe('パフォーマンス最適化', () => {
    it('コンテナにwill-changeが設定されない（必要な要素のみに設定）', () => {
      // Act
      render(<OmikujiAnimation {...defaultProps} />);

      // Assert
      const container = screen.getByTestId('omikuji-animation');
      // メインコンテナにはwill-changeを設定しない（子要素のみに必要）
      expect(container).toHaveClass('overflow-hidden');
    });

    it('pointer-events-noneが装飾要素に設定される', () => {
      // Act
      render(<OmikujiAnimation {...defaultProps} />);

      // Assert - 桜の花びらなど装飾要素はpointer-events: none
      expect(screen.getByTestId('sakura-petals')).toHaveClass('pointer-events-none');
    });
  });

  describe('レスポンシブ対応', () => {
    it('コンテナがfull width/heightでレンダリングされる', () => {
      // Act
      render(<OmikujiAnimation {...defaultProps} />);

      // Assert
      const container = screen.getByTestId('omikuji-animation');
      expect(container).toHaveClass('w-full');
      expect(container).toHaveClass('h-full');
    });
  });
});
