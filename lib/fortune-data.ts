/**
 * 運勢データ型定義とデータソース
 *
 * このモジュールは運勢レベルとメッセージのマスターデータを提供します。
 * TypeScript strict modeで型安全性を保証し、イミュータブルなデータ構造を採用しています。
 */

/**
 * 運勢レベルを表すインターフェース
 *
 * @property id - 一意識別子（URL-safe: 英数字、ハイフン、アンダースコアのみ）
 * @property name - 表示名（例: "大吉", "吉"）
 * @property weight - 確率の重み（1-100の整数、合計100）
 * @property rank - 順序（1=最高、7=最低）
 */
export interface FortuneLevel {
  id: string;
  name: string;
  weight: number;
  rank: number;
}

/**
 * 運勢メッセージを表すインターフェース
 *
 * @property omikujiId - おみくじの一意識別子（例: 'daily-luck'）
 * @property fortuneId - 運勢レベルの一意識別子（例: 'daikichi'）
 * @property message - メッセージ本文（100文字程度）
 */
export interface FortuneMessage {
  omikujiId: string;
  fortuneId: string;
  message: string;
}

/**
 * 運勢レベルのマスターデータ（7種類）
 *
 * イミュータブルな配列として定義し、データの一貫性を保証します。
 * 重み付き確率分布:
 * - 中吉が最も高確率（34%）でポジティブな体験を提供
 * - 大吉・吉・中吉: 高確率（合計73%）
 * - 小吉・末吉: 通常確率（合計20%）
 * - 凶・大凶: 低確率（合計7%）
 */
export const fortuneLevels: readonly FortuneLevel[] = [
  { id: 'daikichi', name: '大吉', weight: 16, rank: 1 },
  { id: 'kichi', name: '吉', weight: 23, rank: 2 },
  { id: 'chukichi', name: '中吉', weight: 34, rank: 3 },
  { id: 'shokichi', name: '小吉', weight: 12, rank: 4 },
  { id: 'suekichi', name: '末吉', weight: 8, rank: 5 },
  { id: 'kyo', name: '凶', weight: 4, rank: 6 },
  { id: 'daikyo', name: '大凶', weight: 3, rank: 7 },
] as const;

/**
 * 運勢メッセージのマスターデータ（28パターン）
 *
 * 4種類のおみくじ×7段階の運勢=28パターンのメッセージを提供します。
 * 各メッセージはエンジニアの業務に関連した表現を含み、
 * 運勢レベルに応じた適切なトーン（大吉は励まし、凶は注意喚起）で作成されています。
 */
export const fortuneMessages: readonly FortuneMessage[] = [
  // 今日の運勢 (daily-luck) × 7運勢
  {
    omikujiId: 'daily-luck',
    fortuneId: 'daikichi',
    message: '今日は最高の1日！コードもレビューもスムーズに進み、素晴らしい成果が出せるでしょう。',
  },
  {
    omikujiId: 'daily-luck',
    fortuneId: 'kichi',
    message: '良い1日になりそうです。積極的にチャレンジすれば、順調に開発が進むでしょう。',
  },
  {
    omikujiId: 'daily-luck',
    fortuneId: 'chukichi',
    message: 'まずまず良い運勢です。集中して取り組めば、着実に進捗が出せるでしょう。',
  },
  {
    omikujiId: 'daily-luck',
    fortuneId: 'shokichi',
    message: '小さな幸運がありそうです。丁寧にコードを書けば、良い結果につながるでしょう。',
  },
  {
    omikujiId: 'daily-luck',
    fortuneId: 'suekichi',
    message: '地道な努力が報われる日。焦らず一歩ずつ進めば、成果が見えてくるでしょう。',
  },
  {
    omikujiId: 'daily-luck',
    fortuneId: 'kyo',
    message: '今日は慎重に。細かい部分の確認を怠らず、落ち着いて対応しましょう。',
  },
  {
    omikujiId: 'daily-luck',
    fortuneId: 'daikyo',
    message: '今日は注意が必要です。実装前の設計見直しとテストを念入りに行いましょう。',
  },

  // コードレビュー運 (code-review) × 7運勢
  {
    omikujiId: 'code-review',
    fortuneId: 'daikichi',
    message: 'レビューは絶好調！的確なフィードバックがもらえ、スムーズに承認されるでしょう。',
  },
  {
    omikujiId: 'code-review',
    fortuneId: 'kichi',
    message: 'レビューは順調です。建設的なコメントをもらい、コードの質が向上するでしょう。',
  },
  {
    omikujiId: 'code-review',
    fortuneId: 'chukichi',
    message: 'レビューは概ね良好です。いくつか指摘はあるかもしれませんが、問題なく対応できるでしょう。',
  },
  {
    omikujiId: 'code-review',
    fortuneId: 'shokichi',
    message: 'レビューで小さな指摘がありそうです。丁寧に対応すれば、すぐに承認されるでしょう。',
  },
  {
    omikujiId: 'code-review',
    fortuneId: 'suekichi',
    message: 'レビューには時間がかかるかもしれません。焦らず、一つ一つ丁寧に対応しましょう。',
  },
  {
    omikujiId: 'code-review',
    fortuneId: 'kyo',
    message: 'レビューは厳しめかも。指摘をポジティブに受け止め、コード品質の向上に活かしましょう。',
  },
  {
    omikujiId: 'code-review',
    fortuneId: 'daikyo',
    message: 'レビューで多くの指摘がありそうです。事前にセルフレビューを徹底し、テストケースを充実させましょう。',
  },

  // バグ遭遇運 (bug-encounter) × 7運勢
  {
    omikujiId: 'bug-encounter',
    fortuneId: 'daikichi',
    message: 'バグとは無縁の日！コードは安定して動作し、問題なく開発が進むでしょう。',
  },
  {
    omikujiId: 'bug-encounter',
    fortuneId: 'kichi',
    message: 'バグは少なめです。たとえ見つかっても、すぐに原因を特定して解決できるでしょう。',
  },
  {
    omikujiId: 'bug-encounter',
    fortuneId: 'chukichi',
    message: '小さなバグに遭遇するかもしれません。落ち着いてデバッグすれば、すぐに解決できるでしょう。',
  },
  {
    omikujiId: 'bug-encounter',
    fortuneId: 'shokichi',
    message: 'いくつかバグが見つかるかもしれません。一つずつ丁寧に対処すれば、大丈夫です。',
  },
  {
    omikujiId: 'bug-encounter',
    fortuneId: 'suekichi',
    message: 'バグ対応に時間がかかりそうです。ログをしっかり確認し、地道にデバッグしましょう。',
  },
  {
    omikujiId: 'bug-encounter',
    fortuneId: 'kyo',
    message: '厄介なバグに遭遇しそうです。エラーログを丁寧に読み、慎重にデバッグを進めましょう。',
  },
  {
    omikujiId: 'bug-encounter',
    fortuneId: 'daikyo',
    message: '深刻なバグに注意。実装前のコードレビューとテストを徹底し、問題の早期発見を心がけましょう。',
  },

  // デプロイ運 (deploy-luck) × 7運勢
  {
    omikujiId: 'deploy-luck',
    fortuneId: 'daikichi',
    message: 'デプロイは完璧！本番環境でも問題なく動作し、スムーズにリリースできるでしょう。',
  },
  {
    omikujiId: 'deploy-luck',
    fortuneId: 'kichi',
    message: 'デプロイは順調です。念のため最終確認を行えば、安心してリリースできるでしょう。',
  },
  {
    omikujiId: 'deploy-luck',
    fortuneId: 'chukichi',
    message: 'デプロイは概ね良好です。手順を確認しながら進めれば、問題なくリリースできるでしょう。',
  },
  {
    omikujiId: 'deploy-luck',
    fortuneId: 'shokichi',
    message: 'デプロイには注意が必要です。チェックリストを確認しながら、慎重に進めましょう。',
  },
  {
    omikujiId: 'deploy-luck',
    fortuneId: 'suekichi',
    message: 'デプロイには時間をかけて。ステージング環境で十分にテストしてから本番リリースしましょう。',
  },
  {
    omikujiId: 'deploy-luck',
    fortuneId: 'kyo',
    message: 'デプロイは慎重に進めましょう。ロールバック手順を確認し、監視体制を整えてからリリースを。',
  },
  {
    omikujiId: 'deploy-luck',
    fortuneId: 'daikyo',
    message:
      'デプロイは要注意。設定ファイルとデータベースマイグレーションを念入りに確認し、段階的にリリースしましょう。',
  },
] as const;
