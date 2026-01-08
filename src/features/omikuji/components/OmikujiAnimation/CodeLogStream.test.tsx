import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CodeLogStream, CODE_LOGS } from './CodeLogStream';

describe('CodeLogStream', () => {
  describe('レンダリング', () => {
    it('コードログストリームコンテナが表示される', () => {
      // Arrange & Act
      render(<CodeLogStream />);

      // Assert
      expect(screen.getByTestId('code-log-stream')).toBeInTheDocument();
    });

    it('複数のコードログが表示される', () => {
      // Arrange & Act
      render(<CodeLogStream />);

      // Assert
      const logs = screen.getAllByTestId('code-log');
      expect(logs.length).toBeGreaterThan(0);
      expect(logs.length).toBeLessThanOrEqual(12);
    });
  });

  describe('コードログ内容', () => {
    it('エンジニア風のコードログが定義されている', () => {
      // Assert
      expect(CODE_LOGS).toContain("git commit -m 'divine fix'");
      expect(CODE_LOGS).toContain("npm install blessings");
      expect(CODE_LOGS).toContain("docker-compose up -d shrine");
      expect(CODE_LOGS).toContain("SELECT fortune FROM spirit_db");
    });

    it('8種類のコードログが定義されている', () => {
      // Assert
      expect(CODE_LOGS).toHaveLength(8);
    });
  });

  describe('スタイリング', () => {
    it('通常時は茶色のスタイルが適用される', () => {
      // Arrange & Act
      render(<CodeLogStream />);

      // Assert
      const logs = screen.getAllByTestId('code-log');
      expect(logs[0]).toHaveClass('text-[#8b4513]');
    });

    it('isDaikyoがtrueの時は赤いスタイルが適用される', () => {
      // Arrange & Act
      render(<CodeLogStream isDaikyo={true} />);

      // Assert
      const logs = screen.getAllByTestId('code-log');
      expect(logs[0]).toHaveClass('text-red-600');
    });

    it('モノスペースフォントが適用される', () => {
      // Arrange & Act
      render(<CodeLogStream />);

      // Assert
      const logs = screen.getAllByTestId('code-log');
      expect(logs[0]).toHaveClass('font-mono');
    });
  });

  describe('アニメーション', () => {
    it('code-streamアニメーションが適用される', () => {
      // Arrange & Act
      render(<CodeLogStream />);

      // Assert
      const logs = screen.getAllByTestId('code-log');
      expect(logs[0]).toHaveClass('animate-code-stream');
    });
  });

  describe('アクセシビリティ', () => {
    it('aria-hidden属性が設定される（装飾的要素）', () => {
      // Arrange & Act
      render(<CodeLogStream />);

      // Assert
      expect(screen.getByTestId('code-log-stream')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('パフォーマンス', () => {
    it('pointer-events-noneが設定される', () => {
      // Arrange & Act
      render(<CodeLogStream />);

      // Assert
      expect(screen.getByTestId('code-log-stream')).toHaveClass('pointer-events-none');
    });
  });
});
