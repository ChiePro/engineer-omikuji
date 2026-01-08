'use client';

import React, { memo } from 'react';

export interface OmikujiStickProps {
  /** 飛び出しアニメーション開始フラグ */
  isEjecting: boolean;
  /** 表示する運勢テキスト */
  fortuneText: string;
  /** 大凶時の暗いスタイル適用 */
  isDaikyo?: boolean;
}

/**
 * おみくじ棒コンポーネント
 *
 * 飛び出しアニメーションと運勢表示を実装
 * - 木製おみくじ棒の表示（竹や木の質感）
 * - 先端が細くなった形状
 * - 木目テクスチャと立体的な陰影
 * - translateY + rotateによる飛び出しアニメーション
 * - 運勢テキストの縦書き表示（writing-mode: vertical-rl）
 * - 大凶時の暗いスタイル対応
 */
export const OmikujiStick = memo(function OmikujiStick({
  isEjecting,
  fortuneText,
  isDaikyo = false
}: OmikujiStickProps) {
  if (!isEjecting) {
    return null;
  }

  // カラーパレット
  const colors = isDaikyo
    ? {
        body: 'linear-gradient(90deg, #1a0a00 0%, #2a1000 30%, #1a0800 50%, #2a1000 70%, #1a0a00 100%)',
        border: '#400000',
        woodGrain: 'rgba(80, 0, 0, 0.2)',
        text: '#cc0000',
        textShadow: '0 0 4px #ff0000',
        tipColor: '#0a0000'
      }
    : {
        body: 'linear-gradient(90deg, #c4a060 0%, #deb887 30%, #e8c88a 50%, #deb887 70%, #c4a060 100%)',
        border: '#8b6914',
        woodGrain: 'rgba(139, 90, 43, 0.15)',
        text: '#4a0000',
        textShadow: 'none',
        tipColor: '#a08050'
      };

  return (
    <>
      {/* Keyframes定義 */}
      <style>{`
        @keyframes eject-and-float {
          0% {
            transform: translate(-50%, 0);
            opacity: 0;
          }
          40% {
            transform: translate(-50%, -180px) rotate(15deg);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -160px) rotate(-3deg);
            opacity: 1;
          }
        }
        .animate-eject {
          animation: eject-and-float 2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
      `}</style>

      <div
        data-testid="omikuji-stick"
        aria-label={`運勢: ${fortuneText}`}
        className="absolute bottom-[60px] left-1/2 z-25 animate-eject"
      >
        {/* 棒本体 */}
        <div
          className="relative w-[16px] h-[160px] rounded-[2px]"
          style={{
            background: colors.body,
            border: `1px solid ${colors.border}`,
            boxShadow: `
              inset -2px 0 4px rgba(0,0,0,0.2),
              inset 2px 0 4px rgba(255,255,255,0.1),
              2px 2px 6px rgba(0,0,0,0.3)
            `
          }}
        >
          {/* 木目テクスチャ（縦線） */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[2px]"
            style={{
              background: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 12px,
                  ${colors.woodGrain} 13px,
                  transparent 14px
                )
              `
            }}
          />

          {/* 木目テクスチャ（横の節） */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[2px]"
            style={{
              background: `
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 5px,
                  ${colors.woodGrain} 6px,
                  transparent 7px
                )
              `
            }}
          />

          {/* 先端部分（少し細くなる） */}
          <div
            className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-[10px] h-[12px]"
            style={{
              background: colors.tipColor,
              clipPath: 'polygon(20% 100%, 80% 100%, 100% 0%, 0% 0%)',
              borderRadius: '2px 2px 0 0'
            }}
          />

          {/* 運勢テキスト */}
          <div
            className="absolute inset-0 flex items-center justify-center"
          >
            <span
              data-testid="fortune-text"
              className="text-[13px] font-black whitespace-nowrap tracking-[2px]"
              style={{
                writingMode: 'vertical-rl',
                color: colors.text,
                textShadow: colors.textShadow
              }}
            >
              {fortuneText}
            </span>
          </div>

          {/* 番号（おみくじ番号風の装飾） */}
          <div
            className="absolute bottom-[8px] left-1/2 -translate-x-1/2 text-[8px] font-bold opacity-60"
            style={{
              color: colors.text
            }}
          >
            壱
          </div>
        </div>
      </div>
    </>
  );
});
