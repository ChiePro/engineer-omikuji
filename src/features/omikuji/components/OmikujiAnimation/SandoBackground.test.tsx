import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SandoBackground } from './SandoBackground';

describe('SandoBackground', () => {
  describe('レンダリング', () => {
    it('isVisibleがtrueの時に参道背景が表示される', () => {
      // Arrange & Act
      render(<SandoBackground isVisible={true} />);

      // Assert
      expect(screen.getByTestId('sando-background')).toBeInTheDocument();
    });

    it('isVisibleがfalseの時は何も表示されない', () => {
      // Arrange & Act
      render(<SandoBackground isVisible={false} />);

      // Assert
      expect(screen.queryByTestId('sando-background')).not.toBeInTheDocument();
    });
  });

  describe('構成要素', () => {
    it('注連縄が表示される', () => {
      // Arrange & Act
      render(<SandoBackground isVisible={true} />);

      // Assert
      expect(screen.getByTestId('shimenawa')).toBeInTheDocument();
    });

    it('神社シルエットが表示される', () => {
      // Arrange & Act
      render(<SandoBackground isVisible={true} />);

      // Assert
      expect(screen.getByTestId('shrine-silhouette')).toBeInTheDocument();
    });

    it('参道（石畳）が表示される', () => {
      // Arrange & Act
      render(<SandoBackground isVisible={true} />);

      // Assert
      expect(screen.getByTestId('stone-path')).toBeInTheDocument();
    });

    it('左右の石灯籠が表示される', () => {
      // Arrange & Act
      render(<SandoBackground isVisible={true} />);

      // Assert
      expect(screen.getByTestId('lantern-left')).toBeInTheDocument();
      expect(screen.getByTestId('lantern-right')).toBeInTheDocument();
    });
  });

  describe('スタイリング', () => {
    it('通常時は明るいスタイルが適用される', () => {
      // Arrange & Act
      render(<SandoBackground isVisible={true} />);

      // Assert
      const shimenawa = screen.getByTestId('shimenawa');
      expect(shimenawa).toHaveClass('bg-[#d7ccc8]');
    });

    it('isDaikyoがtrueの時は暗いスタイルが適用される', () => {
      // Arrange & Act
      render(<SandoBackground isVisible={true} isDaikyo={true} />);

      // Assert
      const shimenawa = screen.getByTestId('shimenawa');
      expect(shimenawa).toHaveClass('bg-[#330000]');
    });
  });

  describe('石灯籠', () => {
    it('石灯籠にflickerアニメーションが適用される', () => {
      // Arrange & Act
      render(<SandoBackground isVisible={true} />);

      // Assert
      const lanternLeft = screen.getByTestId('lantern-left');
      const light = lanternLeft.querySelector('[data-testid="lantern-light"]');
      expect(light).toHaveClass('animate-flicker');
    });
  });

  describe('注連縄', () => {
    it('注連縄に紙垂（しで）が5つ表示される', () => {
      // Arrange & Act
      render(<SandoBackground isVisible={true} />);

      // Assert
      const shide = screen.getAllByTestId('shide');
      expect(shide).toHaveLength(5);
    });

    it('紙垂にswayアニメーションが適用される', () => {
      // Arrange & Act
      render(<SandoBackground isVisible={true} />);

      // Assert
      const shide = screen.getAllByTestId('shide')[0];
      expect(shide).toHaveClass('animate-sway');
    });
  });

  describe('アクセシビリティ', () => {
    it('aria-hidden属性が設定される（装飾的要素）', () => {
      // Arrange & Act
      render(<SandoBackground isVisible={true} />);

      // Assert
      expect(screen.getByTestId('sando-background')).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
