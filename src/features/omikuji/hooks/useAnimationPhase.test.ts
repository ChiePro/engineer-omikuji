import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAnimationPhase, AnimationPhase, ANIMATION_PHASE_CONFIGS } from './useAnimationPhase';

describe('useAnimationPhase', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('初期状態', () => {
    it('正常に初期化される', () => {
      // Arrange & Act
      const { result } = renderHook(() => useAnimationPhase({}));

      // Assert
      expect(result.current.phase).toBe('torii-pass');
      expect(result.current.isComplete).toBe(false);
      expect(result.current.currentMessageIndex).toBe(0);
    });

    it('最初のフェーズがtorii-passである', () => {
      // Arrange & Act
      const { result } = renderHook(() => useAnimationPhase({}));

      // Assert
      expect(result.current.phase).toBe('torii-pass');
    });
  });

  describe('フェーズ遷移', () => {
    it('torii-passからsando-revealに1秒後に遷移する', async () => {
      // Arrange
      const { result } = renderHook(() => useAnimationPhase({}));
      expect(result.current.phase).toBe('torii-pass');

      // Act
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Assert
      expect(result.current.phase).toBe('sando-reveal');
    });

    it('sando-revealからcylinder-shakeに2秒後に遷移する', async () => {
      // Arrange
      const { result } = renderHook(() => useAnimationPhase({}));

      // Act - 2秒経過（torii-pass終了 + sando-reveal開始）
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Assert
      expect(result.current.phase).toBe('cylinder-shake');
    });

    it('cylinder-shakeからstick-ejectに3.5秒後に遷移する', async () => {
      // Arrange
      const { result } = renderHook(() => useAnimationPhase({}));

      // Act - 3.5秒経過
      act(() => {
        vi.advanceTimersByTime(3500);
      });

      // Assert
      expect(result.current.phase).toBe('stick-eject');
    });

    it('stick-ejectからfortune-revealに4.5秒後に遷移する', async () => {
      // Arrange
      const { result } = renderHook(() => useAnimationPhase({}));

      // Act - 4.5秒経過
      act(() => {
        vi.advanceTimersByTime(4500);
      });

      // Assert
      expect(result.current.phase).toBe('fortune-reveal');
    });

    it('fortune-revealでisCompleteがtrueになる', async () => {
      // Arrange
      const { result } = renderHook(() => useAnimationPhase({}));

      // Act - 5秒経過（全アニメーション完了）
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Assert
      expect(result.current.phase).toBe('fortune-reveal');
      expect(result.current.isComplete).toBe(true);
    });
  });

  describe('コールバック', () => {
    it('onPhaseChange がフェーズ変更時に呼び出される', async () => {
      // Arrange
      const onPhaseChange = vi.fn();
      renderHook(() => useAnimationPhase({ onPhaseChange }));

      // Act - フェーズ遷移
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Assert
      expect(onPhaseChange).toHaveBeenCalledWith('sando-reveal');
    });

    it('onComplete がアニメーション完了時に呼び出される', async () => {
      // Arrange
      const onComplete = vi.fn();
      renderHook(() => useAnimationPhase({ onComplete }));

      // Act - 全アニメーション完了
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Assert
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('onComplete が1回だけ呼び出される', async () => {
      // Arrange
      const onComplete = vi.fn();
      renderHook(() => useAnimationPhase({ onComplete }));

      // Act - アニメーション完了後もタイマーを進める
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Assert
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('reduced-motion対応', () => {
    it('reducedMotionがtrueの場合、即座にfortune-revealに遷移する', () => {
      // Arrange & Act
      const { result } = renderHook(() => useAnimationPhase({ reducedMotion: true }));

      // Assert
      expect(result.current.phase).toBe('fortune-reveal');
      expect(result.current.isComplete).toBe(true);
    });

    it('reducedMotionがtrueの場合、onCompleteが即座に呼び出される', () => {
      // Arrange
      const onComplete = vi.fn();

      // Act
      renderHook(() => useAnimationPhase({ reducedMotion: true, onComplete }));

      // Assert
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('ステータスメッセージインデックス', () => {
    it('初期値は0', () => {
      // Arrange & Act
      const { result } = renderHook(() => useAnimationPhase({}));

      // Assert
      expect(result.current.currentMessageIndex).toBe(0);
    });

    it('時間経過とともにメッセージインデックスが更新される', () => {
      // Arrange
      const { result } = renderHook(() => useAnimationPhase({}));

      // Act - 500ms経過（メッセージ更新間隔）
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Assert
      expect(result.current.currentMessageIndex).toBe(1);
    });

    it('メッセージインデックスが段階的に増加する', () => {
      // Arrange
      const { result } = renderHook(() => useAnimationPhase({}));

      // Act - 1.5秒経過（3回の更新）
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      // Assert
      expect(result.current.currentMessageIndex).toBe(3);
    });
  });

  describe('restart機能', () => {
    it('restartを呼ぶとフェーズがtorii-passに戻る', async () => {
      // Arrange
      const { result } = renderHook(() => useAnimationPhase({}));

      // 途中まで進める
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(result.current.phase).toBe('cylinder-shake');

      // Act
      act(() => {
        result.current.restart();
      });

      // Assert
      expect(result.current.phase).toBe('torii-pass');
      expect(result.current.isComplete).toBe(false);
      expect(result.current.currentMessageIndex).toBe(0);
    });

    it('restart後にアニメーションが再開される', async () => {
      // Arrange
      const { result } = renderHook(() => useAnimationPhase({}));

      // 完了まで進める
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(result.current.isComplete).toBe(true);

      // Act - restart
      act(() => {
        result.current.restart();
      });

      // フェーズ遷移を確認
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Assert
      expect(result.current.phase).toBe('sando-reveal');
    });
  });

  describe('ANIMATION_PHASE_CONFIGS', () => {
    it('5つのフェーズ設定が定義されている', () => {
      expect(ANIMATION_PHASE_CONFIGS).toHaveLength(5);
    });

    it('各フェーズの開始時刻と持続時間が正しく設定されている', () => {
      expect(ANIMATION_PHASE_CONFIGS[0]).toEqual({
        phase: 'torii-pass',
        duration: 1000,
        startTime: 0
      });
      expect(ANIMATION_PHASE_CONFIGS[1]).toEqual({
        phase: 'sando-reveal',
        duration: 1000,
        startTime: 1000
      });
      expect(ANIMATION_PHASE_CONFIGS[2]).toEqual({
        phase: 'cylinder-shake',
        duration: 1500,
        startTime: 2000
      });
      expect(ANIMATION_PHASE_CONFIGS[3]).toEqual({
        phase: 'stick-eject',
        duration: 1000,
        startTime: 3500
      });
      expect(ANIMATION_PHASE_CONFIGS[4]).toEqual({
        phase: 'fortune-reveal',
        duration: 500,
        startTime: 4500
      });
    });
  });

  describe('クリーンアップ', () => {
    it('アンマウント時にタイマーがクリアされる', () => {
      // Arrange
      const onComplete = vi.fn();
      const { unmount } = renderHook(() => useAnimationPhase({ onComplete }));

      // Act - 途中でアンマウント
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      unmount();

      // タイマーを進めてもコールバックが呼ばれない
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Assert - コールバックが呼ばれていないことを確認
      expect(onComplete).not.toHaveBeenCalled();
    });
  });
});
