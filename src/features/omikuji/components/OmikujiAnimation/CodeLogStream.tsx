'use client';

import React, { useMemo, memo } from 'react';

export interface CodeLogStreamProps {
  /** 大凶時の赤いスタイル適用 */
  isDaikyo?: boolean;
}

/**
 * エンジニア風コードログ定義
 */
export const CODE_LOGS: string[] = [
  "git commit -m 'divine fix'",
  "npm install blessings",
  "docker-compose up -d shrine",
  "SELECT fortune FROM spirit_db",
  "while(alive) { pray(); }",
  "sudo systemctl restart fate",
  "const luck = Math.random();",
  "yarn add good-vibes"
];

// ログの数
const LOG_COUNT = 12;

interface LogConfig {
  id: string;
  text: string;
  left: number;
  duration: number;
  delay: number;
  fontSize: number;
}

/**
 * ログ設定を生成
 */
function generateLogs(): LogConfig[] {
  return Array.from({ length: LOG_COUNT }).map((_, i) => {
    // 疑似ランダム（一貫性のため）
    const seed1 = (i * 7 + 13) % 100;
    const seed2 = (i * 11 + 17) % 100;
    const seed3 = (i * 13 + 19) % 100;
    const seed4 = (i * 17 + 23) % 100;

    return {
      id: `log-${i}`,
      text: CODE_LOGS[Math.floor((seed1 / 100) * CODE_LOGS.length)],
      left: seed2 * 0.9, // 0-90%
      duration: (seed3 / 100) * 10 + 10, // 10-20秒
      delay: (seed4 / 100) * -20, // -20-0秒（ネガティブで開始位置をずらす）
      fontSize: (seed1 / 100) * 4 + 10 // 10-14px
    };
  });
}

/**
 * コードログストリームコンポーネント
 *
 * 背景にエンジニア風コードログをストリーム表示
 * - エンジニア風コードログの定義（git commit、npm install等）
 * - ランダムな位置とタイミングでの表示
 * - 上から下へ流れるストリームアニメーション
 * - 大凶時の赤いスタイル対応
 * - モノスペースフォントの適用
 */
export const CodeLogStream = memo(function CodeLogStream({
  isDaikyo = false
}: CodeLogStreamProps) {
  const logs = useMemo(() => generateLogs(), []);

  const textColor = isDaikyo ? 'text-red-600' : 'text-[#8b4513]';

  return (
    <div
      data-testid="code-log-stream"
      aria-hidden="true"
      className="absolute inset-0 z-[2] pointer-events-none overflow-hidden opacity-50"
    >
      {/* Keyframes定義 */}
      <style>{`
        @keyframes code-stream {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 0.1;
          }
          90% {
            opacity: 0.1;
          }
          100% {
            transform: translateY(600px);
            opacity: 0;
          }
        }
        .animate-code-stream {
          animation: code-stream var(--duration) linear var(--delay) infinite;
          will-change: transform, opacity;
        }
      `}</style>

      {logs.map((log) => (
        <div
          key={log.id}
          data-testid="code-log"
          className={`
            absolute font-mono font-bold whitespace-nowrap
            transition-colors duration-2000
            animate-code-stream
            ${textColor}
          `}
          style={{
            left: `${log.left}%`,
            fontSize: `${log.fontSize}px`,
            '--duration': `${log.duration}s`,
            '--delay': `${log.delay}s`
          } as React.CSSProperties}
        >
          {log.text}
        </div>
      ))}
    </div>
  );
});
