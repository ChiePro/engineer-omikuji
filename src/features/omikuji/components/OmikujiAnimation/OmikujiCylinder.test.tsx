import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OmikujiCylinder } from './OmikujiCylinder';

describe('OmikujiCylinder', () => {
  describe('レンダリング', () => {
    it('おみくじ筒が表示される', () => {
      // Arrange & Act
      render(<OmikujiCylinder isShaking={false} onComplete={vi.fn()} />);

      // Assert
      expect(screen.getByTestId('omikuji-cylinder')).toBeInTheDocument();
    });

    it('おみくじラベルが表示される', () => {
      // Arrange & Act
      render(<OmikujiCylinder isShaking={false} onComplete={vi.fn()} />);

      // Assert
      expect(screen.getByTestId('omikuji-label')).toHaveTextContent('おみくじ');
    });
  });

  describe('スタイリング', () => {
    it('通常時は朱色のスタイルが適用される', () => {
      // Arrange & Act
      render(<OmikujiCylinder isShaking={false} onComplete={vi.fn()} />);

      // Assert
      const cylinder = screen.getByTestId('omikuji-cylinder');
      expect(cylinder).toHaveClass('bg-gradient-to-br');
      expect(cylinder).toHaveClass('from-[#cc3300]');
    });

    it('isDaikyoがtrueの時は暗いスタイルが適用される', () => {
      // Arrange & Act
      render(<OmikujiCylinder isShaking={false} onComplete={vi.fn()} isDaikyo={true} />);

      // Assert
      const cylinder = screen.getByTestId('omikuji-cylinder');
      expect(cylinder).toHaveClass('bg-black');
    });

    it('ラベルが縦書きで表示される', () => {
      // Arrange & Act
      render(<OmikujiCylinder isShaking={false} onComplete={vi.fn()} />);

      // Assert
      const label = screen.getByTestId('omikuji-label');
      expect(label).toHaveStyle({ writingMode: 'vertical-rl' });
    });
  });

  describe('振りアニメーション', () => {
    it('isShakingがtrueの時にshakeアニメーションが適用される', () => {
      // Arrange & Act
      render(<OmikujiCylinder isShaking={true} onComplete={vi.fn()} />);

      // Assert
      const cylinder = screen.getByTestId('omikuji-cylinder');
      expect(cylinder).toHaveClass('animate-shake');
    });

    it('isShakingがfalseの時はshakeアニメーションが適用されない', () => {
      // Arrange & Act
      render(<OmikujiCylinder isShaking={false} onComplete={vi.fn()} />);

      // Assert
      const cylinder = screen.getByTestId('omikuji-cylinder');
      expect(cylinder).not.toHaveClass('animate-shake');
    });
  });

  describe('コールバック', () => {
    it('振りアニメーション完了時にonCompleteが呼び出される', async () => {
      // Arrange
      vi.useFakeTimers();
      const onComplete = vi.fn();

      // Act
      render(<OmikujiCylinder isShaking={true} onComplete={onComplete} />);

      // 振りアニメーション時間（0.35秒 × 4回 = 1.4秒 ≈ 1500ms）後
      await vi.advanceTimersByTimeAsync(1500);

      // Assert
      expect(onComplete).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });

    it('isShakingがfalseの時はonCompleteが呼び出されない', async () => {
      // Arrange
      vi.useFakeTimers();
      const onComplete = vi.fn();

      // Act
      render(<OmikujiCylinder isShaking={false} onComplete={onComplete} />);
      await vi.advanceTimersByTimeAsync(2000);

      // Assert
      expect(onComplete).not.toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  describe('アクセシビリティ', () => {
    it('aria-label属性が設定される', () => {
      // Arrange & Act
      render(<OmikujiCylinder isShaking={false} onComplete={vi.fn()} />);

      // Assert
      expect(screen.getByTestId('omikuji-cylinder')).toHaveAttribute('aria-label', 'おみくじ筒');
    });
  });
});
