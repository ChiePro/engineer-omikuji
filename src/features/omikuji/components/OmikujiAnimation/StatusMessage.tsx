'use client';

import React, { memo } from 'react';

export interface StatusMessageProps {
  /** おみくじの種類ID */
  omikujiTypeId: string;
  /** 現在のメッセージインデックス */
  currentMessageIndex: number;
  /** カスタムメッセージ配列（オプション） */
  customMessages?: string[];
  /** 大吉時の金色スタイル */
  isDaikichi?: boolean;
  /** 大凶時の赤いスタイル */
  isDaikyo?: boolean;
}

/**
 * おみくじ種類とタイトルのマッピング
 */
export const ANIMATION_TITLES: Record<string, string> = {
  'engineer-fortune': '運命をデプロイ中...',
  'tech-selection': '技術スタックをビルド中...',
  'debug-fortune': 'バグを探索中...',
  'code-review': 'コードを解析中...',
  'deploy-fortune': '本番環境にプッシュ中...'
};

/**
 * デフォルトステータスメッセージ
 */
export const DEFAULT_STATUS_MESSAGES: string[] = [
  "Booting divine core...",
  "Pulling karma-repo...",
  "Validating spirit-auth...",
  "Optimizing blessing-loop...",
  "Encrypting future.log...",
  "Deployment Successful."
];

/**
 * ステータスメッセージコンポーネント
 *
 * おみくじ種類に応じた動的なタイトルとメッセージを表示
 * - おみくじ種類とタイトルのマッピング定義（5種類対応）
 * - デフォルトステータスメッセージの定義
 * - メッセージの段階的な更新表示
 * - カスタムメッセージ配列の受け取り対応
 * - 大吉時の金色スタイル、大凶時の赤いスタイル対応
 */
export const StatusMessage = memo(function StatusMessage({
  omikujiTypeId,
  currentMessageIndex,
  customMessages,
  isDaikichi = false,
  isDaikyo = false
}: StatusMessageProps) {
  // タイトルの取得（未知のタイプはデフォルト）
  const title = ANIMATION_TITLES[omikujiTypeId] || ANIMATION_TITLES['engineer-fortune'];

  // メッセージ配列の決定
  const messages = customMessages || DEFAULT_STATUS_MESSAGES;

  // 現在のメッセージ（範囲外の場合は最後のメッセージ）
  const currentMessage = messages[Math.min(currentMessageIndex, messages.length - 1)];

  // タイトルスタイルの決定
  let titleStyle = 'text-[#cc3300]';
  let textShadow = '2px 2px 0 white, -1px -1px 0 white';

  if (isDaikichi) {
    titleStyle = 'text-yellow-500';
    textShadow = '0 0 10px gold';
  } else if (isDaikyo) {
    titleStyle = 'text-red-700 blur-[0.5px]';
    textShadow = '0 0 10px red';
  }

  // ステータステキストスタイルの決定
  let statusStyle = 'bg-white/70 border-red-900/20 text-[#800000]';
  if (isDaikyo) {
    statusStyle = 'bg-red-950 border-red-600 text-red-600';
  }

  return (
    <div
      data-testid="status-message"
      aria-live="polite"
      className="text-center z-40"
    >
      {/* ステータステキスト */}
      <div
        data-testid="status-text"
        className={`
          inline-block px-3 py-1 border rounded-full
          font-mono text-sm tracking-wider mb-2.5
          transition-all duration-1000
          ${statusStyle}
        `}
      >
        {currentMessage}
      </div>

      {/* タイトル */}
      <h1
        data-testid="animation-title"
        className={`
          text-3xl font-black tracking-[0.3rem]
          transition-all duration-1000
          ${titleStyle}
        `}
        style={{ textShadow }}
      >
        {title}
      </h1>
    </div>
  );
});
