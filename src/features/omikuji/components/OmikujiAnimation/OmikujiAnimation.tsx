'use client';

import React, { memo, useMemo, useCallback } from 'react';
import { Fortune } from '@/domain/valueObjects/Fortune';
import { OmikujiType } from '@/domain/entities/OmikujiType';
import { useAnimationPhase } from '../../hooks/useAnimationPhase';
import { ToriiAnimation } from './ToriiAnimation';
import { SandoBackground } from './SandoBackground';
import { SakuraPetals } from './SakuraPetals';
import { OmikujiCylinder } from './OmikujiCylinder';
import { OmikujiStick } from './OmikujiStick';
import { CodeLogStream } from './CodeLogStream';
import { StatusMessage } from './StatusMessage';
import { SpecialEffects } from './SpecialEffects';

// 大吉判定閾値（fortune-types.jsonでdaikichiのvalueは4）
const DAIKICHI_THRESHOLD = 4;
// 大凶判定閾値（fortune-types.jsonでdaikyoのvalueは-2）
const DAIKYO_THRESHOLD = -2;

export interface OmikujiAnimationProps {
  /** 運勢結果 */
  fortune: Fortune;
  /** おみくじの種類 */
  omikujiType: OmikujiType;
  /** アニメーション完了時のコールバック */
  onComplete: () => void;
  /** ステータスメッセージ配列（オプション） */
  statusMessages?: string[];
}

/**
 * reduced-motionの検出
 */
function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * おみくじアニメーションコンポーネント
 *
 * すべてのサブコンポーネントを統合し、アニメーションシーケンスを管理
 * - useAnimationPhaseフックを使用したフェーズ管理
 * - 各サブコンポーネントへの適切なprops配布
 * - フェーズに応じたサブコンポーネントの表示/非表示制御
 * - アニメーション完了時のonCompleteコールバック呼び出し
 * - reduced-motion検出とフォールバック表示
 */
export const OmikujiAnimation = memo(function OmikujiAnimation({
  fortune,
  omikujiType,
  onComplete,
  statusMessages
}: OmikujiAnimationProps) {
  // reduced-motion検出
  const reducedMotion = useReducedMotion();

  // アニメーションフェーズ管理
  const { phase, currentMessageIndex } = useAnimationPhase({
    onComplete,
    reducedMotion
  });

  // 運勢値に基づく演出タイプの判定
  const fortuneValue = fortune.getValue();
  const isDaikichi = fortuneValue >= DAIKICHI_THRESHOLD;
  const isDaikyo = fortuneValue <= DAIKYO_THRESHOLD;

  // フェーズに応じた表示フラグ
  const showTorii = phase === 'torii-pass';
  const showSando = phase !== 'torii-pass';
  const showCylinder = phase === 'cylinder-shake' || phase === 'stick-eject' || phase === 'fortune-reveal';
  const showStick = phase === 'stick-eject' || phase === 'fortune-reveal';
  const showSpecialEffects = (isDaikichi || isDaikyo) && phase === 'fortune-reveal';

  // ToriiAnimationのonCompleteコールバック（空関数 - フェーズ管理はuseAnimationPhaseで行う）
  const handleToriiComplete = useCallback(() => {
    // フェーズ管理はuseAnimationPhaseで行うため、ここでは何もしない
  }, []);

  // OmikujiCylinderのonCompleteコールバック
  const handleCylinderComplete = useCallback(() => {
    // フェーズ管理はuseAnimationPhaseで行うため、ここでは何もしない
  }, []);

  // おみくじ種類IDを取得
  const omikujiTypeId = useMemo(() => omikujiType.id.getValue(), [omikujiType]);

  // 運勢テキストを取得
  const fortuneText = useMemo(() => fortune.getJapaneseName(), [fortune]);

  return (
    <div
      data-testid="omikuji-animation"
      role="status"
      aria-label="おみくじ結果を表示中"
      className="relative w-full h-full min-h-[750px] overflow-hidden"
      style={{
        background: isDaikyo
          ? 'linear-gradient(to bottom, #1a0000, #000000)'
          : 'linear-gradient(to bottom, #87CEEB, #FFF8E7)'
      }}
    >
      {/* 背景：コードログストリーム */}
      <CodeLogStream isDaikyo={isDaikyo} />

      {/* 参道背景（鳥居通過後に表示） */}
      {showSando && <SandoBackground isVisible={showSando} isDaikyo={isDaikyo} />}

      {/* 桜の花びら */}
      <SakuraPetals isDaikichi={isDaikichi} />

      {/* 鳥居通過アニメーション */}
      {showTorii && (
        <ToriiAnimation
          isActive={showTorii}
          onComplete={handleToriiComplete}
          isDaikyo={isDaikyo}
        />
      )}

      {/* おみくじ筒と棒のコンテナ（やや下寄りに配置して棒の飛び出し余白を確保） */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pt-[100px]">
        <div className="relative">
          {/* おみくじ筒 */}
          {showCylinder && (
            <OmikujiCylinder
              isShaking={phase === 'cylinder-shake'}
              onComplete={handleCylinderComplete}
              isDaikyo={isDaikyo}
            />
          )}

          {/* おみくじ棒 */}
          {showStick && (
            <OmikujiStick
              isEjecting={showStick}
              fortuneText={fortuneText}
              isDaikyo={isDaikyo}
            />
          )}
        </div>
      </div>

      {/* 運勢別特別演出 */}
      {showSpecialEffects && (
        <SpecialEffects fortune={fortune} isActive={showSpecialEffects} />
      )}

      {/* ステータスメッセージ */}
      <div className="absolute bottom-8 left-0 right-0 px-4 z-30">
        <StatusMessage
          omikujiTypeId={omikujiTypeId}
          currentMessageIndex={currentMessageIndex}
          customMessages={statusMessages}
          isDaikichi={isDaikichi}
          isDaikyo={isDaikyo}
        />
      </div>
    </div>
  );
});
