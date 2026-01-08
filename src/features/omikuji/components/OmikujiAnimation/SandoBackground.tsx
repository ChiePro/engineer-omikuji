'use client';

import React, { memo } from 'react';

export interface SandoBackgroundProps {
  /** 表示開始フラグ */
  isVisible: boolean;
  /** 大凶時の暗いスタイル適用 */
  isDaikyo?: boolean;
}

// 紙垂の遅延時間（秒）
const SHIDE_DELAYS = [0.5, 1.2, 0.2, 0.8, 0.3];

/**
 * 参道背景コンポーネント
 *
 * 神社の参道・石畳・石灯籠・注連縄を表示
 * - rotateXによる参道の奥行き感表現
 * - 石畳のパターン表示
 * - 左右に配置した石灯籠とflickerアニメーション
 * - 画面上部の注連縄とゆらぎアニメーション
 */
export const SandoBackground = memo(function SandoBackground({
  isVisible,
  isDaikyo = false
}: SandoBackgroundProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      data-testid="sando-background"
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden z-[1]"
    >
      {/* Keyframes定義 */}
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-flicker {
          animation: flicker 2s infinite;
        }
        .animate-sway {
          animation: sway 3s ease-in-out infinite;
          transform-origin: top center;
        }
      `}</style>

      {/* 注連縄（しめなわ） */}
      <div
        data-testid="shimenawa"
        className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[95%] z-10"
      >
        {/* 縄本体（太い部分） */}
        <div
          className="relative h-[28px] rounded-full"
          style={{
            background: isDaikyo
              ? 'linear-gradient(to bottom, #1a0000 0%, #330000 30%, #220000 50%, #330000 70%, #1a0000 100%)'
              : 'linear-gradient(to bottom, #d4a574 0%, #c9a167 30%, #b8945f 50%, #c9a167 70%, #d4a574 100%)',
            boxShadow: isDaikyo
              ? 'inset 0 2px 4px rgba(100,0,0,0.3), 0 4px 8px rgba(0,0,0,0.5)'
              : 'inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.3)'
          }}
        >
          {/* 縄の撚り目模様 */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: isDaikyo
                ? `repeating-linear-gradient(
                    -30deg,
                    transparent,
                    transparent 6px,
                    rgba(100, 0, 0, 0.3) 6px,
                    rgba(100, 0, 0, 0.3) 8px
                  )`
                : `repeating-linear-gradient(
                    -30deg,
                    transparent,
                    transparent 6px,
                    rgba(139, 90, 43, 0.4) 6px,
                    rgba(139, 90, 43, 0.4) 8px
                  )`
            }}
          />
          {/* 縄の反対方向の撚り目 */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: isDaikyo
                ? `repeating-linear-gradient(
                    30deg,
                    transparent,
                    transparent 8px,
                    rgba(50, 0, 0, 0.2) 8px,
                    rgba(50, 0, 0, 0.2) 10px
                  )`
                : `repeating-linear-gradient(
                    30deg,
                    transparent,
                    transparent 8px,
                    rgba(101, 67, 33, 0.2) 8px,
                    rgba(101, 67, 33, 0.2) 10px
                  )`
            }}
          />
        </div>

        {/* 縄の両端（垂れ下がり） */}
        <div
          className="absolute -left-[15px] top-[10px] w-[30px] h-[50px] rounded-b-full"
          style={{
            background: isDaikyo
              ? 'linear-gradient(to right, #1a0000, #330000, #1a0000)'
              : 'linear-gradient(to right, #b8945f, #c9a167, #b8945f)',
            transform: 'rotate(15deg)',
            transformOrigin: 'top center'
          }}
        />
        <div
          className="absolute -right-[15px] top-[10px] w-[30px] h-[50px] rounded-b-full"
          style={{
            background: isDaikyo
              ? 'linear-gradient(to right, #1a0000, #330000, #1a0000)'
              : 'linear-gradient(to right, #b8945f, #c9a167, #b8945f)',
            transform: 'rotate(-15deg)',
            transformOrigin: 'top center'
          }}
        />

        {/* 紙垂（しで）- より本格的なジグザグ形状 */}
        <div className="absolute top-[20px] left-0 right-0 flex justify-around">
          {SHIDE_DELAYS.map((delay, i) => (
            <div
              key={i}
              data-testid="shide"
              className="relative animate-sway"
              style={{ animationDelay: `${delay}s` }}
            >
              {/* 紙垂の本体 */}
              <div
                className="relative w-[18px] h-[55px]"
                style={{
                  background: isDaikyo ? '#2a2a2a' : '#ffffff',
                  boxShadow: isDaikyo
                    ? '0 2px 4px rgba(0,0,0,0.5)'
                    : '0 2px 4px rgba(0,0,0,0.15)',
                  clipPath: `polygon(
                    0% 0%, 100% 0%,
                    100% 20%, 50% 20%,
                    50% 40%, 100% 40%,
                    100% 60%, 50% 60%,
                    50% 80%, 100% 80%,
                    100% 100%, 0% 100%
                  )`
                }}
              />
              {/* 紙の質感（縦線） */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: isDaikyo
                    ? `repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 4px,
                        rgba(100, 0, 0, 0.1) 5px
                      )`
                    : `repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 4px,
                        rgba(0, 0, 0, 0.05) 5px
                      )`,
                  clipPath: `polygon(
                    0% 0%, 100% 0%,
                    100% 20%, 50% 20%,
                    50% 40%, 100% 40%,
                    100% 60%, 50% 60%,
                    50% 80%, 100% 80%,
                    100% 100%, 0% 100%
                  )`
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 神社本殿（エンジニア神社） */}
      <div
        data-testid="shrine-silhouette"
        className="absolute bottom-[220px] left-1/2 -translate-x-1/2 w-[340px] z-[1]"
      >
        {/* 屋根（伝統的な神社屋根） */}
        <div className="relative">
          {/* メイン屋根 */}
          <div
            className="w-[120%] -ml-[10%] h-[75px] relative"
            style={{
              background: isDaikyo
                ? 'linear-gradient(to bottom, #2a1515 0%, #1a0808 100%)'
                : 'linear-gradient(to bottom, #4a3a2a 0%, #3a2a1a 100%)',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              boxShadow: isDaikyo
                ? '0 6px 12px rgba(0,0,0,0.6)'
                : '0 6px 12px rgba(0,0,0,0.4)'
            }}
          >
            {/* 瓦の横線模様 */}
            <div
              className="absolute inset-0"
              style={{
                background: isDaikyo
                  ? 'repeating-linear-gradient(to bottom, transparent 0px, transparent 10px, rgba(60,30,30,0.3) 10px, rgba(60,30,30,0.3) 11px)'
                  : 'repeating-linear-gradient(to bottom, transparent 0px, transparent 10px, rgba(0,0,0,0.15) 10px, rgba(0,0,0,0.15) 11px)',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
              }}
            />
          </div>

          {/* 千木（左） */}
          <div
            className="absolute -top-[20px] left-[90px] w-[10px] h-[50px]"
            style={{
              background: isDaikyo
                ? 'linear-gradient(to right, #2a1515, #3a2020, #2a1515)'
                : 'linear-gradient(to right, #5d4a3a, #7d6050, #5d4a3a)',
              transform: 'rotate(-15deg)',
              transformOrigin: 'bottom center',
              clipPath: 'polygon(0% 100%, 100% 100%, 100% 10%, 50% 0%, 0% 10%)'
            }}
          />
          {/* 千木（右） */}
          <div
            className="absolute -top-[20px] right-[90px] w-[10px] h-[50px]"
            style={{
              background: isDaikyo
                ? 'linear-gradient(to right, #2a1515, #3a2020, #2a1515)'
                : 'linear-gradient(to right, #5d4a3a, #7d6050, #5d4a3a)',
              transform: 'rotate(15deg)',
              transformOrigin: 'bottom center',
              clipPath: 'polygon(0% 100%, 100% 100%, 100% 10%, 50% 0%, 0% 10%)'
            }}
          />

          {/* 鰹木（横木）- サーバーラック風LED付き */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute w-[100px] h-[8px] left-1/2 -translate-x-1/2 flex items-center justify-between px-[8px]"
              style={{
                top: `${10 + i * 14}px`,
                background: isDaikyo
                  ? 'linear-gradient(to bottom, #3a2020, #2a1515, #3a2020)'
                  : 'linear-gradient(to bottom, #6d5545, #5d4535, #6d5545)',
                borderRadius: '3px',
                boxShadow: '0 2px 3px rgba(0,0,0,0.4)'
              }}
            >
              {/* LED風ドット */}
              <div
                className="w-[4px] h-[4px] rounded-full"
                style={{ background: isDaikyo ? '#ff0000' : '#00ff00', opacity: 0.9 }}
              />
              <div
                className="w-[4px] h-[4px] rounded-full"
                style={{ background: isDaikyo ? '#ff0000' : '#00ff00', opacity: 0.7 }}
              />
            </div>
          ))}
        </div>

        {/* 本殿本体 */}
        <div
          className="relative h-[90px] mx-[35px]"
          style={{
            background: isDaikyo
              ? 'linear-gradient(to bottom, #1a0808 0%, #2a1010 100%)'
              : 'linear-gradient(to bottom, #8b7355 0%, #a08060 100%)',
            boxShadow: isDaikyo
              ? 'inset 0 0 20px rgba(0,0,0,0.5)'
              : 'inset 0 0 20px rgba(0,0,0,0.2)'
          }}
        >
          {/* 柱（左） */}
          <div
            className="absolute left-[12px] top-0 bottom-0 w-[14px]"
            style={{
              background: isDaikyo
                ? 'linear-gradient(to right, #2a1515, #3a2020, #2a1515)'
                : 'linear-gradient(to right, #6d5545, #8d7565, #6d5545)'
            }}
          />
          {/* 柱（右） */}
          <div
            className="absolute right-[12px] top-0 bottom-0 w-[14px]"
            style={{
              background: isDaikyo
                ? 'linear-gradient(to right, #2a1515, #3a2020, #2a1515)'
                : 'linear-gradient(to right, #6d5545, #8d7565, #6d5545)'
            }}
          />
          {/* 中央の扉 - ターミナル/モニター風 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-[12px] w-[90px] h-[65px] rounded-[3px]"
            style={{
              background: isDaikyo ? '#0a0000' : '#1a1a2e',
              boxShadow: isDaikyo
                ? 'inset 0 0 15px rgba(255,0,0,0.2), 0 0 10px rgba(255,0,0,0.1)'
                : 'inset 0 0 15px rgba(0,255,100,0.1), 0 0 10px rgba(0,200,100,0.1)',
              border: isDaikyo ? '2px solid #3a1010' : '2px solid #3d3d5c'
            }}
          >
            {/* ターミナル風テキスト */}
            <div className="p-[6px] font-mono text-[7px] leading-[9px] overflow-hidden h-full">
              <div style={{ color: isDaikyo ? '#ff3333' : '#00ff88' }}>
                {'>'} ./omikuji
              </div>
              <div style={{ color: isDaikyo ? '#cc2222' : '#00cc66', opacity: 0.8 }}>
                loading...
              </div>
              <div style={{ color: isDaikyo ? '#aa1111' : '#00aa55', opacity: 0.6 }}>
                {'>'} 運勢取得中
              </div>
              <div style={{ color: isDaikyo ? '#ff4444' : '#44ffaa' }}>
                █
              </div>
            </div>
          </div>
          {/* 額（がく）- バージョン表示風 */}
          <div
            className="absolute top-[2px] left-1/2 -translate-x-1/2 px-[8px] py-[2px] text-[6px] font-mono rounded-sm"
            style={{
              background: isDaikyo ? '#2a1010' : '#5d4037',
              color: isDaikyo ? '#ff6666' : '#d4af37',
              border: isDaikyo ? '1px solid #4a2020' : '1px solid #8b7355'
            }}
          >
            v1.0.0
          </div>
        </div>

        {/* 縁側/基壇 - 基板風パターン */}
        <div
          className="h-[18px] mx-[18px] relative overflow-hidden"
          style={{
            background: isDaikyo
              ? 'linear-gradient(to bottom, #2a1515, #1a0a0a)'
              : 'linear-gradient(to bottom, #2d5a27, #1a3d15)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {/* 基板の回路パターン */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: isDaikyo
                ? `linear-gradient(90deg, #4a2020 1px, transparent 1px),
                   linear-gradient(0deg, #4a2020 1px, transparent 1px)`
                : `linear-gradient(90deg, #4a8040 1px, transparent 1px),
                   linear-gradient(0deg, #4a8040 1px, transparent 1px)`,
              backgroundSize: '8px 8px'
            }}
          />
          {/* 回路の接点 */}
          <div className="absolute inset-0 flex justify-around items-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[4px] h-[4px] rounded-full"
                style={{
                  background: isDaikyo ? '#6a3030' : '#6a9a50',
                  boxShadow: isDaikyo ? '0 0 2px #ff0000' : '0 0 2px #88ff88'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 石階段 */}
      <div
        className="absolute bottom-[150px] left-1/2 -translate-x-1/2 z-[2] flex flex-col-reverse"
      >
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="relative mx-auto"
            style={{
              width: `${320 - i * 8}px`,
              height: '14px',
              marginBottom: '-1px',
              background: isDaikyo
                ? `linear-gradient(to top,
                    #1a1010 0%,
                    #2a1a1a 40%,
                    #3a2a2a 100%)`
                : `linear-gradient(to top,
                    #706860 0%,
                    #8a8078 40%,
                    #a09890 100%)`,
              boxShadow: isDaikyo
                ? '0 3px 4px rgba(0,0,0,0.6), inset 0 -1px 0 rgba(60,40,40,0.5)'
                : '0 3px 4px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(0,0,0,0.2)',
              borderRadius: '1px'
            }}
          >
            {/* 石の質感 */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: isDaikyo
                  ? `radial-gradient(circle 2px at 20% 50%, #4a3030 0%, transparent 100%),
                     radial-gradient(circle 1px at 60% 30%, #3a2020 0%, transparent 100%),
                     radial-gradient(circle 2px at 80% 60%, #4a3535 0%, transparent 100%)`
                  : `radial-gradient(circle 2px at 20% 50%, #6a6058 0%, transparent 100%),
                     radial-gradient(circle 1px at 60% 30%, #7a7068 0%, transparent 100%),
                     radial-gradient(circle 2px at 80% 60%, #8a8078 0%, transparent 100%)`,
                backgroundSize: '40px 14px'
              }}
            />
          </div>
        ))}
      </div>

      {/* 参道エリア全体 */}
      <div
        data-testid="stone-path"
        className="absolute bottom-0 w-[200%] left-[-50%] h-[350px] z-[1]"
        style={{
          transform: 'rotateX(65deg)',
          transformOrigin: 'bottom center'
        }}
      >
        {/* 左側の砂利道 */}
        <div
          className="absolute left-0 top-0 bottom-0 right-[65%]"
          style={{
            background: isDaikyo
              ? '#1a0a0a'
              : '#c9b896',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)'
          }}
        >
          {/* 砂利テクスチャ */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: isDaikyo
                ? `radial-gradient(ellipse 3px 2px at 20% 30%, #2a1515 0%, transparent 100%),
                   radial-gradient(ellipse 4px 3px at 60% 20%, #1a0808 0%, transparent 100%),
                   radial-gradient(ellipse 2px 2px at 80% 70%, #3a2020 0%, transparent 100%),
                   radial-gradient(ellipse 3px 2px at 40% 80%, #2a1010 0%, transparent 100%),
                   radial-gradient(ellipse 2px 3px at 10% 60%, #1a0505 0%, transparent 100%)`
                : `radial-gradient(ellipse 3px 2px at 20% 30%, #b8a882 0%, transparent 100%),
                   radial-gradient(ellipse 4px 3px at 60% 20%, #a89872 0%, transparent 100%),
                   radial-gradient(ellipse 2px 2px at 80% 70%, #d4c4a8 0%, transparent 100%),
                   radial-gradient(ellipse 3px 2px at 40% 80%, #c4b492 0%, transparent 100%),
                   radial-gradient(ellipse 2px 3px at 10% 60%, #9a8a6a 0%, transparent 100%)`,
              backgroundSize: '15px 12px'
            }}
          />
          {/* 砂利の細かい粒 */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: isDaikyo
                ? `radial-gradient(circle 1px at 30% 40%, #3a2020 0%, transparent 100%),
                   radial-gradient(circle 1px at 70% 60%, #2a1515 0%, transparent 100%),
                   radial-gradient(circle 1px at 50% 25%, #1a0a0a 0%, transparent 100%)`
                : `radial-gradient(circle 1px at 30% 40%, #8a7a5a 0%, transparent 100%),
                   radial-gradient(circle 1px at 70% 60%, #a09070 0%, transparent 100%),
                   radial-gradient(circle 1px at 50% 25%, #b0a080 0%, transparent 100%)`,
              backgroundSize: '8px 8px'
            }}
          />
        </div>

        {/* 右側の砂利道 */}
        <div
          className="absolute right-0 top-0 bottom-0 left-[65%]"
          style={{
            background: isDaikyo
              ? '#1a0a0a'
              : '#c9b896',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)'
          }}
        >
          {/* 砂利テクスチャ */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: isDaikyo
                ? `radial-gradient(ellipse 3px 2px at 25% 35%, #2a1515 0%, transparent 100%),
                   radial-gradient(ellipse 4px 3px at 65% 25%, #1a0808 0%, transparent 100%),
                   radial-gradient(ellipse 2px 2px at 85% 75%, #3a2020 0%, transparent 100%),
                   radial-gradient(ellipse 3px 2px at 45% 85%, #2a1010 0%, transparent 100%),
                   radial-gradient(ellipse 2px 3px at 15% 55%, #1a0505 0%, transparent 100%)`
                : `radial-gradient(ellipse 3px 2px at 25% 35%, #b8a882 0%, transparent 100%),
                   radial-gradient(ellipse 4px 3px at 65% 25%, #a89872 0%, transparent 100%),
                   radial-gradient(ellipse 2px 2px at 85% 75%, #d4c4a8 0%, transparent 100%),
                   radial-gradient(ellipse 3px 2px at 45% 85%, #c4b492 0%, transparent 100%),
                   radial-gradient(ellipse 2px 3px at 15% 55%, #9a8a6a 0%, transparent 100%)`,
              backgroundSize: '15px 12px'
            }}
          />
          {/* 砂利の細かい粒 */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: isDaikyo
                ? `radial-gradient(circle 1px at 35% 45%, #3a2020 0%, transparent 100%),
                   radial-gradient(circle 1px at 75% 65%, #2a1515 0%, transparent 100%),
                   radial-gradient(circle 1px at 55% 30%, #1a0a0a 0%, transparent 100%)`
                : `radial-gradient(circle 1px at 35% 45%, #8a7a5a 0%, transparent 100%),
                   radial-gradient(circle 1px at 75% 65%, #a09070 0%, transparent 100%),
                   radial-gradient(circle 1px at 55% 30%, #b0a080 0%, transparent 100%)`,
              backgroundSize: '8px 8px'
            }}
          />
        </div>

        {/* 中央の石畳 */}
        <div
          className="absolute left-[35%] right-[35%] top-0 bottom-0"
          style={{
            background: isDaikyo
              ? '#2a1a1a'
              : '#9a9080'
          }}
        >
          {/* 石畳の個々の石 */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: isDaikyo
                ? `
                  linear-gradient(to right, #1a0a0a 2px, transparent 2px),
                  linear-gradient(to bottom, #1a0a0a 2px, transparent 2px),
                  linear-gradient(135deg, #3a2a2a 25%, #2a1a1a 25%, #2a1a1a 50%, #3a2020 50%, #3a2020 75%, #2a1a1a 75%)
                `
                : `
                  linear-gradient(to right, #6a6050 2px, transparent 2px),
                  linear-gradient(to bottom, #6a6050 2px, transparent 2px),
                  linear-gradient(135deg, #a8a090 25%, #989080 25%, #989080 50%, #b0a898 50%, #b0a898 75%, #908878 75%)
                `,
              backgroundSize: '45px 35px, 45px 35px, 90px 70px'
            }}
          />
          {/* 石の質感（ノイズ） */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: isDaikyo
                ? `radial-gradient(circle 1px at 20% 30%, #4a3030 0%, transparent 100%),
                   radial-gradient(circle 1px at 70% 60%, #3a2020 0%, transparent 100%),
                   radial-gradient(circle 2px at 40% 80%, #2a1515 0%, transparent 100%),
                   radial-gradient(circle 1px at 90% 20%, #4a3535 0%, transparent 100%)`
                : `radial-gradient(circle 1px at 20% 30%, #7a7060 0%, transparent 100%),
                   radial-gradient(circle 1px at 70% 60%, #8a8070 0%, transparent 100%),
                   radial-gradient(circle 2px at 40% 80%, #6a6050 0%, transparent 100%),
                   radial-gradient(circle 1px at 90% 20%, #a09888 0%, transparent 100%)`,
              backgroundSize: '20px 20px'
            }}
          />
          {/* 苔のアクセント */}
          {!isDaikyo && (
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  radial-gradient(ellipse 8px 4px at 15% 45%, #4a6040 0%, transparent 100%),
                  radial-gradient(ellipse 6px 3px at 85% 25%, #3a5030 0%, transparent 100%),
                  radial-gradient(ellipse 10px 5px at 50% 75%, #5a7050 0%, transparent 100%)
                `,
                backgroundSize: '100px 80px'
              }}
            />
          )}
        </div>

        {/* 石畳と砂利の境界線（縁石） */}
        <div
          className="absolute top-0 bottom-0 w-[8px]"
          style={{
            left: '35%',
            transform: 'translateX(-50%)',
            background: isDaikyo
              ? 'linear-gradient(to right, #1a0808, #3a2020, #1a0808)'
              : 'linear-gradient(to right, #706050, #908070, #706050)',
            boxShadow: isDaikyo
              ? '2px 0 4px rgba(0,0,0,0.5)'
              : '2px 0 4px rgba(0,0,0,0.3)'
          }}
        />
        <div
          className="absolute top-0 bottom-0 w-[8px]"
          style={{
            right: '35%',
            transform: 'translateX(50%)',
            background: isDaikyo
              ? 'linear-gradient(to right, #1a0808, #3a2020, #1a0808)'
              : 'linear-gradient(to right, #706050, #908070, #706050)',
            boxShadow: isDaikyo
              ? '-2px 0 4px rgba(0,0,0,0.5)'
              : '-2px 0 4px rgba(0,0,0,0.3)'
          }}
        />
      </div>

      {/* 石灯籠（左） */}
      <StoneLantern side="left" isDaikyo={isDaikyo} />

      {/* 石灯籠（右） */}
      <StoneLantern side="right" isDaikyo={isDaikyo} />
    </div>
  );
});

interface StoneLanternProps {
  side: 'left' | 'right';
  isDaikyo: boolean;
}

const StoneLantern = memo(function StoneLantern({
  side,
  isDaikyo
}: StoneLanternProps) {
  const positionClass = side === 'left' ? 'left-[30px]' : 'right-[30px]';

  // 石のカラーパレット
  const stoneColors = isDaikyo
    ? {
        base: 'linear-gradient(135deg, #1a1015 0%, #2a1a20 50%, #1a1015 100%)',
        accent: '#2a1a1a',
        shadow: 'rgba(0,0,0,0.6)',
        texture: 'rgba(60, 30, 30, 0.3)',
        light: 'radial-gradient(circle, #4a0000 0%, #2a0000 50%, #1a0000 100%)',
        lightGlow: '0 0 20px rgba(255, 0, 0, 0.4), inset 0 0 10px rgba(255, 50, 50, 0.3)'
      }
    : {
        base: 'linear-gradient(135deg, #8a8a82 0%, #a0a098 50%, #909088 100%)',
        accent: '#707068',
        shadow: 'rgba(0,0,0,0.4)',
        texture: 'rgba(0, 0, 0, 0.15)',
        light: 'radial-gradient(circle, #fff8e0 0%, #ffeda0 50%, #ffd54f 100%)',
        lightGlow: '0 0 25px rgba(255, 200, 100, 0.6), inset 0 0 15px rgba(255, 255, 200, 0.4)'
      };

  return (
    <div
      data-testid={`lantern-${side}`}
      className={`
        absolute bottom-[80px] w-[70px] z-[3]
        flex flex-col items-center
        ${positionClass}
      `}
    >
      {/* 宝珠（頂上の玉） */}
      <div
        className="w-[12px] h-[14px] rounded-full mb-[-2px]"
        style={{
          background: stoneColors.base,
          boxShadow: `0 2px 4px ${stoneColors.shadow}`
        }}
      />

      {/* 笠（屋根）- 六角形風 */}
      <div
        className="w-[65px] h-[18px] relative"
        style={{
          background: stoneColors.base,
          clipPath: 'polygon(50% 0%, 95% 35%, 95% 100%, 5% 100%, 5% 35%)',
          boxShadow: `0 3px 6px ${stoneColors.shadow}`
        }}
      >
        {/* 笠の石模様 */}
        <div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 4px,
              ${stoneColors.texture} 4px,
              ${stoneColors.texture} 5px
            )`,
            clipPath: 'polygon(50% 0%, 95% 35%, 95% 100%, 5% 100%, 5% 35%)'
          }}
        />
      </div>

      {/* 火袋（灯りが入る部分） */}
      <div
        className="w-[40px] h-[45px] relative"
        style={{
          background: stoneColors.base,
          boxShadow: `inset 0 0 10px ${stoneColors.shadow}`
        }}
      >
        {/* 火袋の窓（四面） */}
        <div
          data-testid="lantern-light"
          className="absolute top-[6px] left-[8px] right-[8px] bottom-[6px] animate-flicker"
          style={{
            background: stoneColors.light,
            boxShadow: stoneColors.lightGlow,
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)'
          }}
        />
        {/* 火袋の格子模様 */}
        <div
          className="absolute top-[6px] left-[8px] right-[8px] bottom-[6px] pointer-events-none"
          style={{
            background: `
              linear-gradient(to right, ${stoneColors.accent} 2px, transparent 2px),
              linear-gradient(to bottom, ${stoneColors.accent} 2px, transparent 2px)
            `,
            backgroundSize: '12px 16px',
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)'
          }}
        />
      </div>

      {/* 中台（火袋の下の台） */}
      <div
        className="w-[45px] h-[10px]"
        style={{
          background: stoneColors.base,
          boxShadow: `0 2px 4px ${stoneColors.shadow}`
        }}
      />

      {/* 竿（柱） */}
      <div
        className="w-[20px] h-[55px] relative"
        style={{
          background: stoneColors.base,
          boxShadow: `2px 0 4px ${stoneColors.shadow}`
        }}
      >
        {/* 竿の石模様 */}
        <div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 10px,
              ${stoneColors.texture} 10px,
              ${stoneColors.texture} 11px
            )`
          }}
        />
      </div>

      {/* 基礎（台座） */}
      <div
        className="w-[50px] h-[12px]"
        style={{
          background: stoneColors.base,
          boxShadow: `0 3px 6px ${stoneColors.shadow}`
        }}
      />

      {/* 地覆（最下部） */}
      <div
        className="w-[60px] h-[8px]"
        style={{
          background: stoneColors.base,
          boxShadow: `0 4px 8px ${stoneColors.shadow}`
        }}
      />
    </div>
  );
});
