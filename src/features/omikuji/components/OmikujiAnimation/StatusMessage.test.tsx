import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusMessage, ANIMATION_TITLES, DEFAULT_STATUS_MESSAGES } from './StatusMessage';

describe('StatusMessage', () => {
  describe('レンダリング', () => {
    it('ステータスメッセージコンテナが表示される', () => {
      // Arrange & Act
      render(
        <StatusMessage
          omikujiTypeId="engineer-fortune"
          currentMessageIndex={0}
        />
      );

      // Assert
      expect(screen.getByTestId('status-message')).toBeInTheDocument();
    });

    it('タイトルが表示される', () => {
      // Arrange & Act
      render(
        <StatusMessage
          omikujiTypeId="engineer-fortune"
          currentMessageIndex={0}
        />
      );

      // Assert
      expect(screen.getByTestId('animation-title')).toBeInTheDocument();
    });

    it('ステータスメッセージが表示される', () => {
      // Arrange & Act
      render(
        <StatusMessage
          omikujiTypeId="engineer-fortune"
          currentMessageIndex={0}
        />
      );

      // Assert
      expect(screen.getByTestId('status-text')).toBeInTheDocument();
    });
  });

  describe('タイトルマッピング', () => {
    it('engineer-fortuneの場合「運命をデプロイ中...」が表示される', () => {
      // Arrange & Act
      render(
        <StatusMessage
          omikujiTypeId="engineer-fortune"
          currentMessageIndex={0}
        />
      );

      // Assert
      expect(screen.getByTestId('animation-title')).toHaveTextContent('運命をデプロイ中...');
    });

    it('tech-selectionの場合「技術スタックをビルド中...」が表示される', () => {
      // Arrange & Act
      render(
        <StatusMessage
          omikujiTypeId="tech-selection"
          currentMessageIndex={0}
        />
      );

      // Assert
      expect(screen.getByTestId('animation-title')).toHaveTextContent('技術スタックをビルド中...');
    });

    it('debug-fortuneの場合「バグを探索中...」が表示される', () => {
      // Arrange & Act
      render(
        <StatusMessage
          omikujiTypeId="debug-fortune"
          currentMessageIndex={0}
        />
      );

      // Assert
      expect(screen.getByTestId('animation-title')).toHaveTextContent('バグを探索中...');
    });

    it('code-reviewの場合「コードを解析中...」が表示される', () => {
      // Arrange & Act
      render(
        <StatusMessage
          omikujiTypeId="code-review"
          currentMessageIndex={0}
        />
      );

      // Assert
      expect(screen.getByTestId('animation-title')).toHaveTextContent('コードを解析中...');
    });

    it('deploy-fortuneの場合「本番環境にプッシュ中...」が表示される', () => {
      // Arrange & Act
      render(
        <StatusMessage
          omikujiTypeId="deploy-fortune"
          currentMessageIndex={0}
        />
      );

      // Assert
      expect(screen.getByTestId('animation-title')).toHaveTextContent('本番環境にプッシュ中...');
    });

    it('5種類のタイトルが定義されている', () => {
      // Assert
      expect(Object.keys(ANIMATION_TITLES)).toHaveLength(5);
    });

    it('未知のタイプの場合はデフォルトタイトルが表示される', () => {
      // Arrange & Act
      render(
        <StatusMessage
          omikujiTypeId="unknown-type"
          currentMessageIndex={0}
        />
      );

      // Assert
      expect(screen.getByTestId('animation-title')).toHaveTextContent('運命をデプロイ中...');
    });
  });

  describe('ステータスメッセージ', () => {
    it('デフォルトメッセージが6種類定義されている', () => {
      // Assert
      expect(DEFAULT_STATUS_MESSAGES).toHaveLength(6);
    });

    it('currentMessageIndexに応じたメッセージが表示される', () => {
      // Arrange & Act
      render(
        <StatusMessage
          omikujiTypeId="engineer-fortune"
          currentMessageIndex={0}
        />
      );

      // Assert
      expect(screen.getByTestId('status-text')).toHaveTextContent('Booting divine core...');
    });

    it('インデックスが進むとメッセージが更新される', () => {
      // Arrange & Act
      render(
        <StatusMessage
          omikujiTypeId="engineer-fortune"
          currentMessageIndex={2}
        />
      );

      // Assert
      expect(screen.getByTestId('status-text')).toHaveTextContent('Validating spirit-auth...');
    });

    it('インデックスが範囲外の場合は最後のメッセージが表示される', () => {
      // Arrange & Act
      render(
        <StatusMessage
          omikujiTypeId="engineer-fortune"
          currentMessageIndex={100}
        />
      );

      // Assert
      expect(screen.getByTestId('status-text')).toHaveTextContent('Deployment Successful.');
    });

    it('カスタムメッセージが渡された場合はそれを使用する', () => {
      // Arrange
      const customMessages = ['Custom message 1', 'Custom message 2'];

      // Act
      render(
        <StatusMessage
          omikujiTypeId="engineer-fortune"
          currentMessageIndex={1}
          customMessages={customMessages}
        />
      );

      // Assert
      expect(screen.getByTestId('status-text')).toHaveTextContent('Custom message 2');
    });
  });

  describe('スタイリング', () => {
    it('通常時は朱色のスタイルが適用される', () => {
      // Arrange & Act
      render(
        <StatusMessage
          omikujiTypeId="engineer-fortune"
          currentMessageIndex={0}
        />
      );

      // Assert
      expect(screen.getByTestId('animation-title')).toHaveClass('text-[#cc3300]');
    });

    it('isDaikichiがtrueの時は金色のスタイルが適用される', () => {
      // Arrange & Act
      render(
        <StatusMessage
          omikujiTypeId="engineer-fortune"
          currentMessageIndex={0}
          isDaikichi={true}
        />
      );

      // Assert
      expect(screen.getByTestId('animation-title')).toHaveClass('text-yellow-500');
    });

    it('isDaikyoがtrueの時は赤いスタイルが適用される', () => {
      // Arrange & Act
      render(
        <StatusMessage
          omikujiTypeId="engineer-fortune"
          currentMessageIndex={0}
          isDaikyo={true}
        />
      );

      // Assert
      expect(screen.getByTestId('animation-title')).toHaveClass('text-red-700');
    });

    it('ステータステキストにモノスペースフォントが適用される', () => {
      // Arrange & Act
      render(
        <StatusMessage
          omikujiTypeId="engineer-fortune"
          currentMessageIndex={0}
        />
      );

      // Assert
      expect(screen.getByTestId('status-text')).toHaveClass('font-mono');
    });
  });

  describe('アクセシビリティ', () => {
    it('aria-live属性が設定される', () => {
      // Arrange & Act
      render(
        <StatusMessage
          omikujiTypeId="engineer-fortune"
          currentMessageIndex={0}
        />
      );

      // Assert
      expect(screen.getByTestId('status-message')).toHaveAttribute('aria-live', 'polite');
    });
  });
});
