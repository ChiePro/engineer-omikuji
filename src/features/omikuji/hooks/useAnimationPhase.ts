import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * アニメーションフェーズ
 *
 * 鳥居通過→参道表示→おみくじ筒振り→棒飛び出し→結果表示の5段階
 */
export type AnimationPhase =
  | 'torii-pass'      // 鳥居通過
  | 'sando-reveal'    // 参道表示
  | 'cylinder-shake'  // おみくじ筒振り
  | 'stick-eject'     // 棒飛び出し
  | 'fortune-reveal'; // 結果表示

/**
 * アニメーションフェーズ設定
 */
export interface AnimationPhaseConfig {
  phase: AnimationPhase;
  duration: number;
  startTime: number;
}

/**
 * アニメーションフェーズ設定配列
 * 鳥居アニメーションを4秒に延長
 */
export const ANIMATION_PHASE_CONFIGS: AnimationPhaseConfig[] = [
  { phase: 'torii-pass', duration: 4000, startTime: 0 },
  { phase: 'sando-reveal', duration: 500, startTime: 4000 },
  { phase: 'cylinder-shake', duration: 1500, startTime: 4500 },
  { phase: 'stick-eject', duration: 1000, startTime: 6000 },
  { phase: 'fortune-reveal', duration: 500, startTime: 7000 }
];

// ステータスメッセージ更新間隔（ミリ秒）
const MESSAGE_UPDATE_INTERVAL = 500;

/**
 * useAnimationPhaseフックのオプション
 */
export interface UseAnimationPhaseOptions {
  onPhaseChange?: (phase: AnimationPhase) => void;
  onComplete?: () => void;
  reducedMotion?: boolean;
}

/**
 * useAnimationPhaseフックの戻り値
 */
export interface UseAnimationPhaseReturn {
  phase: AnimationPhase;
  isComplete: boolean;
  currentMessageIndex: number;
  restart: () => void;
}

/**
 * アニメーションフェーズ管理フック
 *
 * 5段階のアニメーションフェーズを自動的に遷移させる
 * - torii-pass: 0-1秒
 * - sando-reveal: 1-2秒
 * - cylinder-shake: 2-3.5秒
 * - stick-eject: 3.5-4.5秒
 * - fortune-reveal: 4.5-5秒
 */
export function useAnimationPhase(options: UseAnimationPhaseOptions): UseAnimationPhaseReturn {
  const { onPhaseChange, onComplete, reducedMotion = false } = options;

  // reduced-motion時は即座に完了状態
  const [phase, setPhase] = useState<AnimationPhase>(
    reducedMotion ? 'fortune-reveal' : 'torii-pass'
  );
  const [isComplete, setIsComplete] = useState(reducedMotion);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // タイマーIDの参照
  const phaseTimersRef = useRef<NodeJS.Timeout[]>([]);
  const messageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteCalledRef = useRef(false);

  // コールバックを参照で保持（re-render時の参照変更を防ぐ）
  const onPhaseChangeRef = useRef(onPhaseChange);
  const onCompleteRef = useRef(onComplete);
  onPhaseChangeRef.current = onPhaseChange;
  onCompleteRef.current = onComplete;

  // タイマーのクリア関数
  const clearAllTimers = useCallback(() => {
    phaseTimersRef.current.forEach(timer => clearTimeout(timer));
    phaseTimersRef.current = [];
    if (messageTimerRef.current) {
      clearInterval(messageTimerRef.current);
      messageTimerRef.current = null;
    }
  }, []);

  // アニメーションの開始
  const startAnimation = useCallback(() => {
    clearAllTimers();
    onCompleteCalledRef.current = false;
    setPhase('torii-pass');
    setIsComplete(false);
    setCurrentMessageIndex(0);

    // 各フェーズの遷移タイマーを設定
    ANIMATION_PHASE_CONFIGS.slice(1).forEach((config) => {
      const timer = setTimeout(() => {
        setPhase(config.phase);
        onPhaseChangeRef.current?.(config.phase);

        // fortune-revealに遷移したら完了フラグを立てる
        if (config.phase === 'fortune-reveal') {
          // duration後に完了
          const completeTimer = setTimeout(() => {
            setIsComplete(true);
            if (!onCompleteCalledRef.current) {
              onCompleteCalledRef.current = true;
              onCompleteRef.current?.();
            }
          }, config.duration);
          phaseTimersRef.current.push(completeTimer);
        }
      }, config.startTime);
      phaseTimersRef.current.push(timer);
    });

    // ステータスメッセージの更新タイマー
    messageTimerRef.current = setInterval(() => {
      setCurrentMessageIndex(prev => prev + 1);
    }, MESSAGE_UPDATE_INTERVAL);
  }, [clearAllTimers]);

  // 初期化
  useEffect(() => {
    if (reducedMotion) {
      // reduced-motion時は即座にonCompleteを呼び出す
      if (!onCompleteCalledRef.current) {
        onCompleteCalledRef.current = true;
        onComplete?.();
      }
      return;
    }

    startAnimation();

    return () => {
      clearAllTimers();
    };
  }, [reducedMotion, startAnimation, clearAllTimers, onComplete]);

  // restart関数
  const restart = useCallback(() => {
    startAnimation();
  }, [startAnimation]);

  return {
    phase,
    isComplete,
    currentMessageIndex,
    restart
  };
}
