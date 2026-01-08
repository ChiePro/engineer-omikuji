'use client';

import React, { useEffect, memo } from 'react';

export interface OmikujiCylinderProps {
  /** アニメーション開始フラグ */
  isShaking: boolean;
  /** 完了時コールバック */
  onComplete: () => void;
  /** 大凶時の暗いスタイル適用 */
  isDaikyo?: boolean;
}

// 振りアニメーション時間（0.35秒 × 4回 ≈ 1500ms）
const SHAKE_DURATION = 1500;

/**
 * おみくじ筒コンポーネント
 *
 * 振りアニメーションを実装
 * - 六角形の竹製おみくじ筒をイメージ
 * - 木目調のグラデーションで質感を表現
 * - 上部の口と金属リング
 * - rotate + translateYによる振りモーション
 * - 約1.5秒、4回の振りサイクル
 * - 大凶時の暗いスタイル対応
 */
export const OmikujiCylinder = memo(function OmikujiCylinder({
  isShaking,
  onComplete,
  isDaikyo = false
}: OmikujiCylinderProps) {
  useEffect(() => {
    if (!isShaking) return;

    const timer = setTimeout(() => {
      onComplete();
    }, SHAKE_DURATION);

    return () => clearTimeout(timer);
  }, [isShaking, onComplete]);

  // カラーパレット
  const colors = isDaikyo
    ? {
        body: 'linear-gradient(135deg, #1a0a00 0%, #0a0000 30%, #1a0000 50%, #0a0000 70%, #1a0a00 100%)',
        bodyBorder: '#330000',
        ring: 'linear-gradient(to bottom, #1a0000, #330000, #1a0000)',
        ringBorder: '#660000',
        opening: '#000000',
        openingBorder: '#220000',
        label: '#0a0000',
        labelBorder: '#660000',
        labelText: '#cc0000',
        woodGrain: 'rgba(100, 0, 0, 0.15)'
      }
    : {
        body: 'linear-gradient(135deg, #8B4513 0%, #A0522D 30%, #CD853F 50%, #A0522D 70%, #8B4513 100%)',
        bodyBorder: '#5D4037',
        ring: 'linear-gradient(to bottom, #B8860B, #DAA520, #FFD700, #DAA520, #B8860B)',
        ringBorder: '#8B7500',
        opening: '#2d1f1a',
        openingBorder: '#4a3728',
        label: '#fffdf0',
        labelBorder: '#333',
        labelText: '#1a1a1a',
        woodGrain: 'rgba(0, 0, 0, 0.1)'
      };

  return (
    <>
      {/* Keyframes定義 */}
      <style>{`
        @keyframes shake {
          0%, 100% {
            transform: rotate(-12deg) translateY(0);
          }
          50% {
            transform: rotate(12deg) translateY(-10px);
          }
        }
        .animate-shake {
          animation: shake 0.35s ease-in-out 4;
          transform-origin: bottom center;
        }
      `}</style>

      <div
        data-testid="omikuji-cylinder"
        aria-label="おみくじ筒"
        className={`
          relative z-30
          transition-colors duration-2000
          ${isShaking ? 'animate-shake' : ''}
        `}
      >
        {/* 上部の口（棒が出る穴） */}
        <div
          className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-[50px] h-[16px] rounded-full z-20"
          style={{
            background: colors.opening,
            border: `3px solid ${colors.openingBorder}`,
            boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.6)'
          }}
        />

        {/* 上部の金属リング */}
        <div
          className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-[90px] h-[12px] rounded-[50%] z-10"
          style={{
            background: colors.ring,
            border: `2px solid ${colors.ringBorder}`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
          }}
        />

        {/* 筒本体 */}
        <div
          className="relative w-[80px] h-[200px] rounded-b-lg overflow-hidden"
          style={{
            background: colors.body,
            border: `4px solid ${colors.bodyBorder}`,
            borderTop: 'none',
            boxShadow: `
              inset -8px 0 16px rgba(0,0,0,0.3),
              inset 8px 0 16px rgba(255,255,255,0.1),
              4px 4px 12px rgba(0,0,0,0.4)
            `
          }}
        >
          {/* 木目テクスチャ */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 8px,
                  ${colors.woodGrain} 9px,
                  transparent 10px
                )
              `
            }}
          />

          {/* 縦の木目線 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 15px,
                  ${colors.woodGrain} 16px,
                  transparent 17px
                )
              `
            }}
          />

          {/* おみくじラベル（和紙風） */}
          <div
            data-testid="omikuji-label"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-4 font-black text-lg tracking-[4px] whitespace-nowrap"
            style={{
              writingMode: 'vertical-rl',
              background: colors.label,
              border: `2px solid ${colors.labelBorder}`,
              color: colors.labelText,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              textShadow: isDaikyo ? '0 0 4px #ff0000' : 'none'
            }}
          >
            おみくじ
          </div>

          {/* 下部の金属リング */}
          <div
            className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-[88px] h-[10px] rounded-[50%]"
            style={{
              background: colors.ring,
              border: `2px solid ${colors.ringBorder}`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
            }}
          />
        </div>

        {/* 底面（楕円で立体感を出す） */}
        <div
          className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-[76px] h-[14px] rounded-[50%]"
          style={{
            background: isDaikyo
              ? 'linear-gradient(to bottom, #1a0000, #0a0000)'
              : 'linear-gradient(to bottom, #5D4037, #3E2723)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.5)'
          }}
        />
      </div>
    </>
  );
});
