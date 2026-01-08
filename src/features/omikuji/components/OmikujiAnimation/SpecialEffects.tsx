'use client';

import React, { memo } from 'react';
import { Fortune } from '@/domain/valueObjects/Fortune';

export interface SpecialEffectsProps {
  /** 運勢 */
  fortune: Fortune;
  /** 効果表示開始フラグ */
  isActive: boolean;
}

// 大吉判定閾値
const DAIKICHI_THRESHOLD = 6;
// 大凶判定閾値
const DAIKYO_THRESHOLD = 1;

/**
 * 大吉演出コンポーネント
 * - 虹色後光オーラエフェクト（conic-gradient回転）
 * - フェードインアニメーション
 */
const DaikichiEffect = memo(function DaikichiEffect() {
  return (
    <div
      data-testid="daikichi-effect"
      className="absolute inset-0 flex items-center justify-center animate-fade-in"
    >
      {/* Keyframes定義 */}
      <style>{`
        @keyframes rainbow-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-rainbow-spin {
          animation: rainbow-spin 3s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>

      {/* 虹色後光オーラ */}
      <div
        data-testid="daikichi-aura"
        className="absolute w-[300px] h-[300px] rounded-full animate-rainbow-spin opacity-70"
        style={{
          background: 'conic-gradient(from 0deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)',
          filter: 'blur(40px)',
          willChange: 'transform'
        }}
      />

      {/* 輝きのセンターポイント */}
      <div
        className="absolute w-[100px] h-[100px] rounded-full bg-white opacity-60"
        style={{
          boxShadow: '0 0 60px 30px rgba(255, 215, 0, 0.8)',
          willChange: 'opacity'
        }}
      />
    </div>
  );
});

/**
 * 大凶演出コンポーネント
 * - 背景暗転（赤/黒グラデーション）
 * - 微振動エフェクト
 * - 闇の霧オーバーレイ
 */
const DaikyoEffect = memo(function DaikyoEffect() {
  return (
    <div
      data-testid="daikyo-effect"
      className="absolute inset-0 animate-shake"
    >
      {/* Keyframes定義 */}
      <style>{`
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-2px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(2px);
          }
        }
        @keyframes mist-drift {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          50% {
            opacity: 0.6;
            transform: translateY(-10px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out infinite;
        }
        .animate-mist-drift {
          animation: mist-drift 4s ease-in-out infinite;
        }
      `}</style>

      {/* 背景暗転オーバーレイ（赤/黒グラデーション） */}
      <div
        data-testid="daikyo-overlay"
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.9) 100%)',
          willChange: 'opacity'
        }}
      />

      {/* 闇の霧エフェクト */}
      <div
        data-testid="daikyo-mist"
        className="absolute inset-0 animate-mist-drift"
        style={{
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 50%, rgba(0, 0, 0, 0.8) 100%)',
          willChange: 'transform, opacity'
        }}
      />

      {/* 渦巻くエフェクト */}
      <div
        className="absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-[200px] h-[200px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(255, 0, 0, 0.5) 0%, transparent 70%)',
            animation: 'mist-drift 3s ease-in-out infinite reverse'
          }}
        />
      </div>
    </div>
  );
});

/**
 * 運勢別特別演出コンポーネント
 *
 * 運勢に応じた視覚効果を表示
 * - 大吉（value >= 6）: 虹色後光オーラエフェクト
 * - 大凶（value <= 1）: 背景暗転、微振動、闇の霧
 * - 通常: 特別演出なし
 */
export const SpecialEffects = memo(function SpecialEffects({
  fortune,
  isActive
}: SpecialEffectsProps) {
  // isActiveがfalseの場合は非表示
  if (!isActive) {
    return null;
  }

  const fortuneValue = fortune.getValue();
  const isDaikichi = fortuneValue >= DAIKICHI_THRESHOLD;
  const isDaikyo = fortuneValue <= DAIKYO_THRESHOLD;

  // 通常運勢は特別演出なし
  if (!isDaikichi && !isDaikyo) {
    return null;
  }

  return (
    <div
      data-testid="special-effects-container"
      aria-hidden="true"
      className="absolute inset-0 z-[5] pointer-events-none overflow-hidden"
    >
      {isDaikichi && <DaikichiEffect />}
      {isDaikyo && <DaikyoEffect />}
    </div>
  );
});
