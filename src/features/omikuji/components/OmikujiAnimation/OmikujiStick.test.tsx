import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OmikujiStick } from './OmikujiStick';

describe('OmikujiStick', () => {
  describe('レンダリング', () => {
    it('isEjectingがtrueの時におみくじ棒が表示される', () => {
      // Arrange & Act
      render(<OmikujiStick isEjecting={true} fortuneText="大吉" />);

      // Assert
      expect(screen.getByTestId('omikuji-stick')).toBeInTheDocument();
    });

    it('isEjectingがfalseの時は何も表示されない', () => {
      // Arrange & Act
      render(<OmikujiStick isEjecting={false} fortuneText="大吉" />);

      // Assert
      expect(screen.queryByTestId('omikuji-stick')).not.toBeInTheDocument();
    });

    it('運勢テキストが表示される', () => {
      // Arrange & Act
      render(<OmikujiStick isEjecting={true} fortuneText="大吉" />);

      // Assert
      expect(screen.getByTestId('fortune-text')).toHaveTextContent('大吉');
    });
  });

  describe('スタイリング', () => {
    it('通常時は木製の茶色スタイルが適用される', () => {
      // Arrange & Act
      render(<OmikujiStick isEjecting={true} fortuneText="大吉" />);

      // Assert
      const stick = screen.getByTestId('omikuji-stick');
      expect(stick).toHaveClass('bg-gradient-to-b');
      expect(stick).toHaveClass('from-[#deb887]');
    });

    it('isDaikyoがtrueの時は暗いスタイルが適用される', () => {
      // Arrange & Act
      render(<OmikujiStick isEjecting={true} fortuneText="大凶" isDaikyo={true} />);

      // Assert
      const stick = screen.getByTestId('omikuji-stick');
      expect(stick).toHaveClass('bg-black');
    });

    it('運勢テキストが縦書きで表示される', () => {
      // Arrange & Act
      render(<OmikujiStick isEjecting={true} fortuneText="大吉" />);

      // Assert
      const text = screen.getByTestId('fortune-text');
      expect(text).toHaveStyle({ writingMode: 'vertical-rl' });
    });
  });

  describe('飛び出しアニメーション', () => {
    it('eject-and-floatアニメーションが適用される', () => {
      // Arrange & Act
      render(<OmikujiStick isEjecting={true} fortuneText="大吉" />);

      // Assert
      const stick = screen.getByTestId('omikuji-stick');
      expect(stick).toHaveClass('animate-eject');
    });
  });

  describe('運勢別スタイル', () => {
    it('通常時の運勢テキストは赤色', () => {
      // Arrange & Act
      render(<OmikujiStick isEjecting={true} fortuneText="大吉" />);

      // Assert
      const text = screen.getByTestId('fortune-text');
      expect(text).toHaveClass('text-[#800000]');
    });

    it('isDaikyoがtrueの時は赤い光るテキスト', () => {
      // Arrange & Act
      render(<OmikujiStick isEjecting={true} fortuneText="大凶" isDaikyo={true} />);

      // Assert
      const text = screen.getByTestId('fortune-text');
      expect(text).toHaveClass('text-red-600');
    });
  });

  describe('アクセシビリティ', () => {
    it('aria-label属性が設定される', () => {
      // Arrange & Act
      render(<OmikujiStick isEjecting={true} fortuneText="大吉" />);

      // Assert
      expect(screen.getByTestId('omikuji-stick')).toHaveAttribute('aria-label', '運勢: 大吉');
    });
  });
});
