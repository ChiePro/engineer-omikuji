'use client';

import React, { useEffect, memo } from 'react';

export interface ToriiAnimationProps {
  /** アニメーション開始フラグ */
  isActive: boolean;
  /** 完了時コールバック */
  onComplete: () => void;
  /** 大凶時の暗いスタイル適用 */
  isDaikyo?: boolean;
}

// アニメーション時間（ミリ秒）- ゆっくり見せるため4秒に延長
const ANIMATION_DURATION = 4000;

/**
 * 鳥居通過アニメーションコンポーネント
 *
 * 3D遠近法で鳥居を奥から手前へ通過する演出を実装
 * - CSS transform（perspective + translateZ + scale）を使用した3D表現
 * - 約4秒のアニメーション時間
 * - 大凶時の暗いスタイル対応
 * - 現実的な鳥居構造（笠木、島木、額束、貫、柱）
 */
export const ToriiAnimation = memo(function ToriiAnimation({
  isActive,
  onComplete,
  isDaikyo = false
}: ToriiAnimationProps) {
  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      onComplete();
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [isActive, onComplete]);

  if (!isActive) {
    return null;
  }

  // 色設定
  const mainColor = isDaikyo ? '#300000' : '#cc3300';
  const darkColor = isDaikyo ? '#1a0000' : '#8B0000';
  const plaqueText = isDaikyo ? '禁忌' : '奉納';
  const plaqueStyle = isDaikyo
    ? 'bg-black text-red-600 border-red-900'
    : 'bg-[#1a1a1a] text-[#d4af37] border-[#d4af37]';

  return (
    <div
      data-testid="torii-animation"
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]"
      style={{ perspective: '1200px' }}
    >
      {/* Keyframes定義 */}
      <style>{`
        @keyframes torii-pass {
          0% {
            transform: translateZ(-1800px) scale(0.15);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateZ(600px) scale(4);
            opacity: 0;
          }
        }
        .animate-torii-pass {
          animation: torii-pass 4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
        }
      `}</style>

      {/* 鳥居全体 */}
      <div
        data-testid="torii-frame"
        className="relative w-[280px] h-[320px] animate-torii-pass"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 笠木（かさぎ）- 最上部の反り返った横木 */}
        <div
          className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-[340px] h-[20px]"
          style={{
            background: mainColor,
            borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        />
        {/* 笠木の両端の反り上がり */}
        <div
          className="absolute -top-[12px] -left-[38px] w-[30px] h-[16px]"
          style={{
            background: mainColor,
            transform: 'rotate(-15deg)',
            borderRadius: '50% 0 0 0'
          }}
        />
        <div
          className="absolute -top-[12px] -right-[38px] w-[30px] h-[16px]"
          style={{
            background: mainColor,
            transform: 'rotate(15deg)',
            borderRadius: '0 50% 0 0'
          }}
        />

        {/* 島木（しまぎ）- 笠木の下の横木 */}
        <div
          className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[300px] h-[18px]"
          style={{
            background: `linear-gradient(to bottom, ${mainColor}, ${darkColor})`,
            boxShadow: '0 3px 6px rgba(0,0,0,0.4)'
          }}
        />

        {/* 左の柱 */}
        <div
          className="absolute top-[28px] left-0 w-[24px] h-[290px]"
          style={{
            background: `linear-gradient(to right, ${darkColor}, ${mainColor}, ${darkColor})`,
            boxShadow: '2px 0 4px rgba(0,0,0,0.3)'
          }}
        />

        {/* 右の柱 */}
        <div
          className="absolute top-[28px] right-0 w-[24px] h-[290px]"
          style={{
            background: `linear-gradient(to right, ${darkColor}, ${mainColor}, ${darkColor})`,
            boxShadow: '-2px 0 4px rgba(0,0,0,0.3)'
          }}
        />

        {/* 柱の台座（左） */}
        <div
          className="absolute bottom-0 left-[-4px] w-[32px] h-[12px]"
          style={{
            background: isDaikyo ? '#1a0000' : '#8B4513',
            borderRadius: '2px'
          }}
        />

        {/* 柱の台座（右） */}
        <div
          className="absolute bottom-0 right-[-4px] w-[32px] h-[12px]"
          style={{
            background: isDaikyo ? '#1a0000' : '#8B4513',
            borderRadius: '2px'
          }}
        />

        {/* 貫（ぬき）- 2本の柱を繋ぐ横木 */}
        <div
          className="absolute top-[100px] left-[24px] right-[24px] h-[16px]"
          style={{
            background: `linear-gradient(to bottom, ${mainColor}, ${darkColor})`,
            boxShadow: '0 3px 6px rgba(0,0,0,0.4)'
          }}
        />

        {/* 額束（がくづか）- 中央の縦の部材 */}
        <div
          className="absolute top-[28px] left-1/2 -translate-x-1/2 w-[16px] h-[72px]"
          style={{
            background: mainColor
          }}
        />

        {/* 奉納札（プラーク） */}
        <div
          data-testid="torii-plaque"
          className={`
            absolute top-[36px] left-1/2 -translate-x-1/2
            px-3 py-2 text-[11px] border-2 font-bold
            transition-all duration-2000
            ${plaqueStyle}
          `}
          style={{
            writingMode: 'vertical-rl',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {plaqueText}
        </div>
      </div>
    </div>
  );
});
