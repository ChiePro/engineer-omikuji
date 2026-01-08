import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToriiAnimation } from './ToriiAnimation';

describe('ToriiAnimation', () => {
  describe('レンダリング', () => {
    it('isActiveがtrueの時に鳥居が表示される', () => {
      // Arrange & Act
      render(<ToriiAnimation isActive={true} onComplete={vi.fn()} />);

      // Assert
      expect(screen.getByTestId('torii-animation')).toBeInTheDocument();
    });

    it('isActiveがfalseの時は何も表示されない', () => {
      // Arrange & Act
      render(<ToriiAnimation isActive={false} onComplete={vi.fn()} />);

      // Assert
      expect(screen.queryByTestId('torii-animation')).not.toBeInTheDocument();
    });

    it('鳥居の構造が正しく表示される', () => {
      // Arrange & Act
      render(<ToriiAnimation isActive={true} onComplete={vi.fn()} />);

      // Assert
      expect(screen.getByTestId('torii-frame')).toBeInTheDocument();
      expect(screen.getByTestId('torii-plaque')).toBeInTheDocument();
    });
  });

  describe('スタイリング', () => {
    it('通常時は朱色のスタイルが適用される', () => {
      // Arrange & Act
      render(<ToriiAnimation isActive={true} onComplete={vi.fn()} />);

      // Assert
      const frame = screen.getByTestId('torii-frame');
      expect(frame).toHaveClass('border-[#cc3300]');
    });

    it('isDaikyoがtrueの時は暗いスタイルが適用される', () => {
      // Arrange & Act
      render(<ToriiAnimation isActive={true} onComplete={vi.fn()} isDaikyo={true} />);

      // Assert
      const frame = screen.getByTestId('torii-frame');
      expect(frame).toHaveClass('border-[#300000]');
    });

    it('3D遠近法用のperspectiveが設定される', () => {
      // Arrange & Act
      render(<ToriiAnimation isActive={true} onComplete={vi.fn()} />);

      // Assert
      const container = screen.getByTestId('torii-animation');
      expect(container).toHaveStyle({ perspective: '1200px' });
    });
  });

  describe('プラーク（奉納札）', () => {
    it('通常時は「奉納」と表示される', () => {
      // Arrange & Act
      render(<ToriiAnimation isActive={true} onComplete={vi.fn()} />);

      // Assert
      expect(screen.getByTestId('torii-plaque')).toHaveTextContent('奉納');
    });

    it('isDaikyoがtrueの時は「禁忌」と表示される', () => {
      // Arrange & Act
      render(<ToriiAnimation isActive={true} onComplete={vi.fn()} isDaikyo={true} />);

      // Assert
      expect(screen.getByTestId('torii-plaque')).toHaveTextContent('禁忌');
    });
  });

  describe('アニメーション', () => {
    it('torii-passアニメーションが適用される', () => {
      // Arrange & Act
      render(<ToriiAnimation isActive={true} onComplete={vi.fn()} />);

      // Assert
      const frame = screen.getByTestId('torii-frame');
      expect(frame).toHaveClass('animate-torii-pass');
    });
  });

  describe('コールバック', () => {
    it('アニメーション完了時にonCompleteが呼び出される', async () => {
      // Arrange
      vi.useFakeTimers();
      const onComplete = vi.fn();

      // Act
      render(<ToriiAnimation isActive={true} onComplete={onComplete} />);

      // アニメーション時間（2.8秒）後
      await vi.advanceTimersByTimeAsync(2800);

      // Assert
      expect(onComplete).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
  });

  describe('アクセシビリティ', () => {
    it('aria-hidden属性が設定される（装飾的要素）', () => {
      // Arrange & Act
      render(<ToriiAnimation isActive={true} onComplete={vi.fn()} />);

      // Assert
      expect(screen.getByTestId('torii-animation')).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
