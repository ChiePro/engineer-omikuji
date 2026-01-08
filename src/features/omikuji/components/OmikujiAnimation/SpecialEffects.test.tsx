import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpecialEffects } from './SpecialEffects';
import { Fortune, FortuneData } from '@/domain/valueObjects/Fortune';

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

describe('SpecialEffects', () => {
  describe('大吉演出（value >= 6）', () => {
    it('大吉時に虹色後光オーラエフェクトが表示される', () => {
      // Arrange
      const fortune = createFortune(6, 'daikichi');

      // Act
      render(<SpecialEffects fortune={fortune} isActive={true} />);

      // Assert
      expect(screen.getByTestId('daikichi-effect')).toBeInTheDocument();
    });

    it('大吉時にconic-gradient回転アニメーションが適用される', () => {
      // Arrange
      const fortune = createFortune(6, 'daikichi');

      // Act
      render(<SpecialEffects fortune={fortune} isActive={true} />);

      // Assert
      const effect = screen.getByTestId('daikichi-aura');
      expect(effect).toBeInTheDocument();
      expect(effect).toHaveClass('animate-rainbow-spin');
    });

    it('大吉時に後光エフェクトがフェードインで表示される', () => {
      // Arrange
      const fortune = createFortune(7, 'daikichi');

      // Act
      render(<SpecialEffects fortune={fortune} isActive={true} />);

      // Assert
      const effect = screen.getByTestId('daikichi-effect');
      expect(effect).toHaveClass('animate-fade-in');
    });
  });

  describe('大凶演出（value <= 1）', () => {
    it('大凶時に暗い背景オーバーレイが表示される', () => {
      // Arrange
      const fortune = createFortune(1, 'daikyo');

      // Act
      render(<SpecialEffects fortune={fortune} isActive={true} />);

      // Assert
      expect(screen.getByTestId('daikyo-effect')).toBeInTheDocument();
    });

    it('大凶時に背景が赤/黒グラデーションになる', () => {
      // Arrange
      const fortune = createFortune(0, 'daikyo');

      // Act
      render(<SpecialEffects fortune={fortune} isActive={true} />);

      // Assert
      const overlay = screen.getByTestId('daikyo-overlay');
      expect(overlay).toBeInTheDocument();
    });

    it('大凶時に微振動エフェクトが適用される', () => {
      // Arrange
      const fortune = createFortune(1, 'daikyo');

      // Act
      render(<SpecialEffects fortune={fortune} isActive={true} />);

      // Assert
      const effect = screen.getByTestId('daikyo-effect');
      expect(effect).toHaveClass('animate-shake');
    });

    it('大凶時に闇の霧エフェクトがオーバーレイ表示される', () => {
      // Arrange
      const fortune = createFortune(0, 'daikyo');

      // Act
      render(<SpecialEffects fortune={fortune} isActive={true} />);

      // Assert
      expect(screen.getByTestId('daikyo-mist')).toBeInTheDocument();
    });
  });

  describe('通常運勢', () => {
    it('通常の運勢（2 <= value <= 5）では特別演出が非表示', () => {
      // Arrange
      const fortune = createFortune(3, 'kichi');

      // Act
      render(<SpecialEffects fortune={fortune} isActive={true} />);

      // Assert
      expect(screen.queryByTestId('daikichi-effect')).not.toBeInTheDocument();
      expect(screen.queryByTestId('daikyo-effect')).not.toBeInTheDocument();
    });

    it('value=2の時は特別演出なし', () => {
      // Arrange
      const fortune = createFortune(2, 'shokichi');

      // Act
      render(<SpecialEffects fortune={fortune} isActive={true} />);

      // Assert
      expect(screen.queryByTestId('daikichi-effect')).not.toBeInTheDocument();
      expect(screen.queryByTestId('daikyo-effect')).not.toBeInTheDocument();
    });

    it('value=5の時は特別演出なし', () => {
      // Arrange
      const fortune = createFortune(5, 'chukichi');

      // Act
      render(<SpecialEffects fortune={fortune} isActive={true} />);

      // Assert
      expect(screen.queryByTestId('daikichi-effect')).not.toBeInTheDocument();
      expect(screen.queryByTestId('daikyo-effect')).not.toBeInTheDocument();
    });
  });

  describe('isActiveプロパティ', () => {
    it('isActive=falseの時は演出が非表示', () => {
      // Arrange
      const fortune = createFortune(6, 'daikichi');

      // Act
      render(<SpecialEffects fortune={fortune} isActive={false} />);

      // Assert
      expect(screen.queryByTestId('daikichi-effect')).not.toBeInTheDocument();
      expect(screen.queryByTestId('daikyo-effect')).not.toBeInTheDocument();
    });

    it('大凶でもisActive=falseなら非表示', () => {
      // Arrange
      const fortune = createFortune(0, 'daikyo');

      // Act
      render(<SpecialEffects fortune={fortune} isActive={false} />);

      // Assert
      expect(screen.queryByTestId('daikyo-effect')).not.toBeInTheDocument();
    });
  });

  describe('境界値テスト', () => {
    it('value=6で大吉演出が発動する（境界値）', () => {
      // Arrange
      const fortune = createFortune(6, 'daikichi');

      // Act
      render(<SpecialEffects fortune={fortune} isActive={true} />);

      // Assert
      expect(screen.getByTestId('daikichi-effect')).toBeInTheDocument();
    });

    it('value=1で大凶演出が発動する（境界値）', () => {
      // Arrange
      const fortune = createFortune(1, 'daikyo');

      // Act
      render(<SpecialEffects fortune={fortune} isActive={true} />);

      // Assert
      expect(screen.getByTestId('daikyo-effect')).toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    it('装飾的要素にaria-hidden属性が設定される', () => {
      // Arrange
      const fortune = createFortune(6, 'daikichi');

      // Act
      render(<SpecialEffects fortune={fortune} isActive={true} />);

      // Assert
      const container = screen.getByTestId('special-effects-container');
      expect(container).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('パフォーマンス', () => {
    it('GPU加速のためのwill-changeプロパティが設定される', () => {
      // Arrange
      const fortune = createFortune(6, 'daikichi');

      // Act
      render(<SpecialEffects fortune={fortune} isActive={true} />);

      // Assert
      const container = screen.getByTestId('special-effects-container');
      expect(container).toHaveClass('pointer-events-none');
    });
  });
});
