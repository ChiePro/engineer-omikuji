'use client';

import React, { useMemo, memo } from 'react';

export interface SakuraPetalsProps {
  /** 大吉時の増量表示 */
  isDaikichi?: boolean;
}

// 花びらの数
const NORMAL_PETAL_COUNT = 15;
const DAIKICHI_PETAL_COUNT = 40;

interface PetalConfig {
  id: string;
  size: number;
  left: number;
  duration: number;
  delay: number;
}

/**
 * 花びらの設定を生成
 * 安定したランダム値のためにシード値を使用
 */
function generatePetals(count: number, isDaikichi: boolean): PetalConfig[] {
  return Array.from({ length: count }).map((_, i) => {
    // 疑似ランダム（一貫性のため）
    const seed = (i * 7 + 13) % 100;
    const seed2 = (i * 11 + 17) % 100;
    const seed3 = (i * 13 + 19) % 100;
    const seed4 = (i * 17 + 23) % 100;

    return {
      id: `petal-${i}`,
      size: (seed / 100) * (isDaikichi ? 12 : 8) + 6,
      left: seed2,
      duration: (seed3 / 100) * (isDaikichi ? 2 : 4) + 2,
      delay: (seed4 / 100) * 5
    };
  });
}

/**
 * 桜の花びらエフェクトコンポーネント
 *
 * 舞い落ちる花びらを表示
 * - ランダムな位置・サイズ・速度での花びら生成（15〜40個）
 * - 回転しながら落下するアニメーション
 * - 大吉時の花びら増量対応
 * - パフォーマンス最適化（GPU加速プロパティ使用）
 */
export const SakuraPetals = memo(function SakuraPetals({
  isDaikichi = false
}: SakuraPetalsProps) {
  const petalCount = isDaikichi ? DAIKICHI_PETAL_COUNT : NORMAL_PETAL_COUNT;
  const petalColor = isDaikichi ? 'bg-[#ff69b4]' : 'bg-[#ffd1dc]';

  const petals = useMemo(
    () => generatePetals(petalCount, isDaikichi),
    [petalCount, isDaikichi]
  );

  return (
    <div
      data-testid="sakura-petals"
      aria-hidden="true"
      className="absolute inset-0 z-[4] pointer-events-none overflow-hidden"
    >
      {/* Keyframes定義 */}
      <style>{`
        @keyframes sakura-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-sakura-fall {
          animation: sakura-fall var(--duration) linear var(--delay) infinite;
          will-change: transform, opacity;
        }
      `}</style>

      {petals.map((petal) => (
        <div
          key={petal.id}
          data-testid="petal"
          className={`absolute ${petalColor} animate-sakura-fall`}
          style={{
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            left: `${petal.left}%`,
            borderRadius: '100% 0 100% 0',
            '--duration': `${petal.duration}s`,
            '--delay': `${petal.delay}s`
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
});
