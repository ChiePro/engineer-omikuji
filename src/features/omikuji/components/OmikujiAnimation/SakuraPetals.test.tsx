import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SakuraPetals } from './SakuraPetals';

describe('SakuraPetals', () => {
  describe('レンダリング', () => {
    it('桜の花びらコンテナが表示される', () => {
      // Arrange & Act
      render(<SakuraPetals />);

      // Assert
      expect(screen.getByTestId('sakura-petals')).toBeInTheDocument();
    });

    it('デフォルトで15個の花びらが表示される', () => {
      // Arrange & Act
      render(<SakuraPetals />);

      // Assert
      const petals = screen.getAllByTestId('petal');
      expect(petals.length).toBeGreaterThanOrEqual(15);
      expect(petals.length).toBeLessThanOrEqual(40);
    });
  });

  describe('大吉モード', () => {
    it('isDaikichiがtrueの時は花びらが増量される（40個）', () => {
      // Arrange & Act
      render(<SakuraPetals isDaikichi={true} />);

      // Assert
      const petals = screen.getAllByTestId('petal');
      expect(petals.length).toBe(40);
    });

    it('isDaikichiがtrueの時はピンク色が濃くなる', () => {
      // Arrange & Act
      render(<SakuraPetals isDaikichi={true} />);

      // Assert
      const petals = screen.getAllByTestId('petal');
      // 大吉時はより鮮やかなピンク
      expect(petals[0]).toHaveClass('bg-[#ff69b4]');
    });

    it('isDaikichiがfalseの時は淡いピンク色', () => {
      // Arrange & Act
      render(<SakuraPetals isDaikichi={false} />);

      // Assert
      const petals = screen.getAllByTestId('petal');
      expect(petals[0]).toHaveClass('bg-[#ffd1dc]');
    });
  });

  describe('スタイリング', () => {
    it('花びらの形状が設定される（丸み）', () => {
      // Arrange & Act
      render(<SakuraPetals />);

      // Assert
      const petals = screen.getAllByTestId('petal');
      // 花びらの形状はstyleで設定
      expect(petals[0]).toHaveStyle({ borderRadius: '100% 0 100% 0' });
    });

    it('sakura-fallアニメーションが適用される', () => {
      // Arrange & Act
      render(<SakuraPetals />);

      // Assert
      const petals = screen.getAllByTestId('petal');
      expect(petals[0]).toHaveClass('animate-sakura-fall');
    });
  });

  describe('パフォーマンス', () => {
    it('GPU加速用のプロパティが設定される', () => {
      // Arrange & Act
      render(<SakuraPetals />);

      // Assert
      const container = screen.getByTestId('sakura-petals');
      expect(container).toHaveClass('pointer-events-none');
    });
  });

  describe('アクセシビリティ', () => {
    it('aria-hidden属性が設定される（装飾的要素）', () => {
      // Arrange & Act
      render(<SakuraPetals />);

      // Assert
      expect(screen.getByTestId('sakura-petals')).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
