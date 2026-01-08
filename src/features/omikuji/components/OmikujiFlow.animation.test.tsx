import { describe, it, expect, beforeEach, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OmikujiFlow } from './OmikujiFlow';

// Mock OmikujiAnimation to avoid timer issues
let mockOnComplete: (() => void) | null = null;
vi.mock('./OmikujiAnimation', () => ({
  OmikujiAnimation: ({ fortune, omikujiType, onComplete }: {
    fortune: { japaneseName: string; getValue: () => number };
    omikujiType: { id: string };
    onComplete: () => void;
  }) => {
    // Store onComplete for test control
    mockOnComplete = onComplete;
    const fortuneValue = fortune.getValue();
    const isDaikichi = fortuneValue >= 6;

    return (
      <div data-testid="omikuji-animation">
        <div data-testid="animation-title">運命をデプロイ中...</div>
        <div data-testid="omikuji-stick">
          <div data-testid="fortune-text">{fortune.japaneseName}</div>
        </div>
        {isDaikichi && (
          <div data-testid="special-effects-container">
            <div data-testid="daikichi-effect" />
          </div>
        )}
      </div>
    );
  }
}));

// Mock API response
const mockApiResponse = {
  success: true,
  data: {
    id: 'test-result-001',
    omikujiType: {
      id: 'engineer-fortune',
      name: 'エンジニア運勢',
      description: 'プログラマーのためのおみくじ',
      icon: '💻',
      color: {
        primary: '#1E40AF',
        secondary: '#FFFFFF'
      }
    },
    fortune: {
      id: 'kichi',
      japaneseName: '吉',
      englishName: 'Good Fortune',
      description: '良い運勢',
      value: 4,
      probability: 0.25,
      color: {
        primary: '#000000',
        secondary: '#666666',
        background: '#ffffff'
      },
      effects: {
        glow: false,
        sparkle: false,
        animation: null
      }
    },
    createdAt: '2025-01-04T12:00:00Z'
  }
};

// 大吉用API response
const mockDaikichiApiResponse = {
  success: true,
  data: {
    ...mockApiResponse.data,
    fortune: {
      id: 'daikichi',
      japaneseName: '大吉',
      englishName: 'Great Fortune',
      description: '最高の運勢',
      value: 6,
      probability: 0.03,
      color: {
        primary: '#FFD700',
        secondary: '#FFA500',
        background: '#FFFACD'
      },
      effects: {
        glow: true,
        sparkle: true,
        animation: 'rainbow'
      }
    }
  }
};

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock SmoothTransitions
vi.mock('@/animations/transitions/SmoothTransitions', () => ({
  SmoothTransitions: {
    getOmikujiSelectionTransition: () => ({
      cardExit: { scale: 1.2, opacity: 0 },
      resultEntrance: {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 }
      }
    }),
    getPageEntranceTransition: () => ({
      initial: { opacity: 0 },
      animate: { opacity: 1 }
    })
  }
}));

const mockOmikujiTypes = [
  {
    id: 'engineer-fortune',
    name: 'エンジニア運勢',
    description: 'プログラマーのためのおみくじ',
    icon: '💻',
    color: { primary: '#1E40AF', secondary: '#FFFFFF' }
  },
  {
    id: 'debug-fortune',
    name: 'デバッグ運',
    description: 'バグ解決の運を試す',
    icon: '🐛',
    color: { primary: '#DC2626', secondary: '#FFFFFF' }
  }
];

describe('OmikujiFlow アニメーション統合', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)' ? false : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
    mockOnComplete = null;
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse
    });
  });

  afterAll(() => {
    cleanup();
  });

  describe('animation状態でのOmikujiAnimation表示', () => {
    it('animation状態でOmikujiAnimationコンポーネントが表示される', async () => {
      // Given
      render(<OmikujiFlow omikujiTypes={mockOmikujiTypes} />);

      // When - おみくじカードを選択
      const engineerCard = screen.getByRole('button', { name: /エンジニア運勢を選択/ });
      await user.click(engineerCard);

      // Then - OmikujiAnimationが表示される（animation状態）
      await waitFor(() => {
        const flowContainer = screen.getByTestId('omikuji-flow-container');
        expect(flowContainer).toHaveAttribute('data-state', 'animation');
        expect(screen.getByTestId('omikuji-animation')).toBeInTheDocument();
      });
    });

    it('アニメーション中にfortune情報が正しく渡される', async () => {
      // Given
      render(<OmikujiFlow omikujiTypes={mockOmikujiTypes} />);

      // When
      const engineerCard = screen.getByRole('button', { name: /エンジニア運勢を選択/ });
      await user.click(engineerCard);

      // Then - fortune情報が表示される
      await waitFor(() => {
        expect(screen.getByTestId('omikuji-stick')).toBeInTheDocument();
        expect(screen.getByTestId('fortune-text')).toHaveTextContent('吉');
      });
    });

    it('アニメーション中におみくじ種類に応じたタイトルが表示される', async () => {
      // Given
      render(<OmikujiFlow omikujiTypes={mockOmikujiTypes} />);

      // When
      const engineerCard = screen.getByRole('button', { name: /エンジニア運勢を選択/ });
      await user.click(engineerCard);

      // Then
      await waitFor(() => {
        expect(screen.getByTestId('animation-title')).toHaveTextContent('運命をデプロイ中...');
      });
    });
  });

  describe('アニメーション完了後のflowState遷移', () => {
    it('アニメーション完了後にresult状態に遷移する', async () => {
      // Given
      render(<OmikujiFlow omikujiTypes={mockOmikujiTypes} />);

      // When - おみくじを引く
      const engineerCard = screen.getByRole('button', { name: /エンジニア運勢を選択/ });
      await user.click(engineerCard);

      // animation状態になるのを待つ
      await waitFor(() => {
        expect(screen.getByTestId('omikuji-animation')).toBeInTheDocument();
      });

      // アニメーション完了をシミュレート
      await act(async () => {
        if (mockOnComplete) {
          mockOnComplete();
        }
      });

      // Then - result状態に遷移
      await waitFor(() => {
        const flowContainer = screen.getByTestId('omikuji-flow-container');
        expect(flowContainer).toHaveAttribute('data-state', 'result');
      });
    });

    it('アニメーション完了後に結果表示コンポーネントが表示される', async () => {
      // Given
      render(<OmikujiFlow omikujiTypes={mockOmikujiTypes} />);

      // When
      const engineerCard = screen.getByRole('button', { name: /エンジニア運勢を選択/ });
      await user.click(engineerCard);

      await waitFor(() => {
        expect(screen.getByTestId('omikuji-animation')).toBeInTheDocument();
      });

      // アニメーション完了をシミュレート
      await act(async () => {
        if (mockOnComplete) {
          mockOnComplete();
        }
      });

      // Then
      await waitFor(() => {
        expect(screen.getByRole('article')).toHaveAttribute('aria-label', 'おみくじ結果: 吉');
      });
    });
  });

  describe('API結果とアニメーションの連携', () => {
    it('API結果がキャッシュされ、アニメーション完了後に表示される', async () => {
      // Given - APIは即座にレスポンスを返す
      render(<OmikujiFlow omikujiTypes={mockOmikujiTypes} />);

      // When
      const engineerCard = screen.getByRole('button', { name: /エンジニア運勢を選択/ });
      await user.click(engineerCard);

      // animation状態でAPI結果がキャッシュされている
      await waitFor(() => {
        expect(screen.getByTestId('fortune-text')).toHaveTextContent('吉');
      });

      // アニメーション完了
      await act(async () => {
        if (mockOnComplete) {
          mockOnComplete();
        }
      });

      // Then - キャッシュされた結果が表示される
      await waitFor(() => {
        expect(screen.getByRole('article')).toHaveAttribute('aria-label', 'おみくじ結果: 吉');
      });
    });

    it('大吉の場合、特別演出が表示される', async () => {
      // Given - 大吉のAPI response
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockDaikichiApiResponse
      });

      render(<OmikujiFlow omikujiTypes={mockOmikujiTypes} />);

      // When
      const engineerCard = screen.getByRole('button', { name: /エンジニア運勢を選択/ });
      await user.click(engineerCard);

      // Then - 特別演出が表示される
      await waitFor(() => {
        expect(screen.getByTestId('special-effects-container')).toBeInTheDocument();
        expect(screen.getByTestId('daikichi-effect')).toBeInTheDocument();
      });
    });
  });

  describe('reduced-motion対応', () => {
    it('reduced-motion設定時もアニメーションコンポーネントは表示される', async () => {
      // Given - reduced-motion設定をモック
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(<OmikujiFlow omikujiTypes={mockOmikujiTypes} />);

      // When
      const engineerCard = screen.getByRole('button', { name: /エンジニア運勢を選択/ });
      await user.click(engineerCard);

      // Then - animation状態になる（OmikujiAnimation内部でreduced-motionを処理）
      await waitFor(() => {
        const flowContainer = screen.getByTestId('omikuji-flow-container');
        expect(flowContainer).toHaveAttribute('data-state', 'animation');
      });

      // Cleanup - matchMediaを元に戻す
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    });
  });

  describe('onFlowCompleteコールバック', () => {
    it('アニメーション完了後にonFlowCompleteが呼ばれる', async () => {
      // Given
      const mockOnFlowComplete = vi.fn();
      render(<OmikujiFlow omikujiTypes={mockOmikujiTypes} onFlowComplete={mockOnFlowComplete} />);

      // When
      const engineerCard = screen.getByRole('button', { name: /エンジニア運勢を選択/ });
      await user.click(engineerCard);

      await waitFor(() => {
        expect(screen.getByTestId('omikuji-animation')).toBeInTheDocument();
      });

      // アニメーション完了をシミュレート
      await act(async () => {
        if (mockOnComplete) {
          mockOnComplete();
        }
      });

      // Then
      await waitFor(() => {
        expect(mockOnFlowComplete).toHaveBeenCalledTimes(1);
        expect(mockOnFlowComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            fortune: expect.objectContaining({
              japaneseName: '吉'
            })
          })
        );
      });
    });
  });
});
