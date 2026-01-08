# Research & Design Decisions

## Summary
- **Feature**: omikuji-animation
- **Discovery Scope**: Extension（既存のOmikujiFlowへの統合）
- **Key Findings**:
  - 既存OmikujiFlowには'transitioning'と'loading'状態が存在し、ここにアニメーションを挿入可能
  - Framer Motion 12.23+のシーケンスアニメーション機能が複雑なアニメーション連携に最適
  - 既存のShrineColorPalette/ShrineDesignTokensがアニメーションのスタイリングに活用可能

## Research Log

### Framer Motion シーケンスアニメーション機能
- **Context**: 複数段階のアニメーション（鳥居通過→参道表示→おみくじ筒振り→棒飛び出し）の実装方法調査
- **Sources Consulted**:
  - [Framer Motion公式ドキュメント](https://www.framer.com/motion/animation/)
  - [Advanced animation patterns with Framer Motion](https://blog.maximeheckel.com/posts/advanced-animation-patterns-with-framer-motion/)
- **Findings**:
  - `animate()`関数がシーケンスアニメーションをサポート（各定義が順番に再生）
  - `at`オプションで絶対時間、相対時間、ラベルを使った同期が可能
  - `staggerChildren`で子要素の段階的アニメーションを実現
  - `variants`でDOMツリー全体へのアニメーション伝播が可能
- **Implications**:
  - アニメーションフェーズをvariantsで定義し、状態管理でフェーズを制御
  - `AnimatePresence`で各フェーズの出入りアニメーションを管理

### 既存OmikujiFlowの統合ポイント
- **Context**: 既存フローへのアニメーション挿入方法の調査
- **Sources Consulted**: `src/features/omikuji/components/OmikujiFlow.tsx`
- **Findings**:
  - FlowState: 'selection' | 'transitioning' | 'loading' | 'result' | 'error'
  - 'transitioning'と'loading'状態が既に存在（現在は200msのディレイのみ）
  - `AnimatePresence`が既に使用されている
  - OmikujiLoadingIndicatorが'loading'状態で表示されている
- **Implications**:
  - 新しい'animation'状態を追加、または'loading'状態をアニメーションに置き換え
  - OmikujiAnimationコンポーネントをOmikujiLoadingIndicatorの代わりに使用
  - API呼び出しはアニメーション中に並行実行可能

### 既存アニメーションシステムとの整合性
- **Context**: プロジェクトの既存アニメーションパターンの調査
- **Sources Consulted**: `src/animations/`ディレクトリ
- **Findings**:
  - `SmoothTransitions`: ページ遷移、おみくじ選択遷移、レアリティ遷移を提供
  - `MysteriousAppearance`: 霧フェード、波紋アニメーションなど神社テーマのアニメーション
  - カスタムイージング（mystical, shrine, divine, gentle）が定義済み
- **Implications**:
  - 新アニメーションは既存のイージング関数を活用
  - `MysteriousAppearance`のパターンを拡張して鳥居通過アニメーションを実装

### デザインシステムとの統合
- **Context**: 神社風デザイントークンの活用方法
- **Sources Consulted**: `src/design-system/`
- **Findings**:
  - `ShrineColorPalette`: shu（朱）、kin（金）、sumi（墨）、shiro（白）、cyber、neon
  - `ShrineDesignTokens`: torii、shaden、saisenboxの建築要素トークン
  - Tech要素（terminal、code）とのフュージョンスタイル生成機能
- **Implications**:
  - 鳥居は`torii`トークン（borderRadius: 0px, borderWidth: 4px, shadowColor: rgba(229, 57, 53, 0.3)）
  - エンジニア要素は`terminal`トークンのスタイルを適用

### reduced-motion対応
- **Context**: アクセシビリティ要件の実装方法
- **Sources Consulted**: 既存コード、Web標準
- **Findings**:
  - `MysteriousAppearance.getReducedMotionAnimation()`が既に存在
  - `prefers-reduced-motion`メディアクエリをReactフックで検出可能
  - Framer Motionの`useReducedMotion()`フックが利用可能
- **Implications**:
  - reduced-motion時はフェードインのみの簡略版アニメーションを表示
  - 段階的なシーケンスをスキップし、即座に結果表示

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| 単一コンポーネント | 全アニメーションを1つのコンポーネントで管理 | シンプル、状態管理が容易 | コードが肥大化、再利用性低 | サンプルコードがこのパターン |
| コンポーネント分割 | 視覚要素をサブコンポーネントに分離 | 再利用性、テスト容易性 | 状態同期の複雑さ | 推奨アプローチ |
| カスタムフック抽出 | アニメーションロジックをフックに | ロジック再利用、テスト容易 | 適度な複雑さ | ベストプラクティス |

## Design Decisions

### Decision: アニメーションフェーズ管理
- **Context**: 5段階のアニメーションシーケンスの状態管理方法
- **Alternatives Considered**:
  1. useStateで単一のフェーズ変数を管理
  2. useReducerでより複雑な状態遷移を管理
  3. Framer Motionのvariantsのみで管理
- **Selected Approach**: useStateでフェーズ変数 + Framer Motion variants
- **Rationale**: シンプルなフェーズ遷移にはuseStateで十分、variantsでアニメーション定義を分離
- **Trade-offs**: 複雑な条件分岐には向かないが、本機能では線形シーケンスのため問題なし
- **Follow-up**: フェーズ遷移のテストを作成

### Decision: OmikujiFlowへの統合方法
- **Context**: 既存フローを最小限の変更で拡張する方法
- **Alternatives Considered**:
  1. OmikujiFlowを直接修正して'animation'状態を追加
  2. アニメーションをOmikujiLoadingIndicatorの代替として挿入
  3. ラッパーコンポーネントとしてOmikujiFlowを包む
- **Selected Approach**: OmikujiFlowを修正し、'loading'状態でOmikujiAnimationを表示
- **Rationale**: 最小限の変更で統合可能、既存のAnimatePresenceを活用
- **Trade-offs**: OmikujiFlowの変更が必要だが、影響範囲は限定的
- **Follow-up**: 既存テストの更新が必要

### Decision: おみくじ種類別タイトルの管理
- **Context**: 5種類のおみくじに対応する動的タイトルの管理方法
- **Alternatives Considered**:
  1. OmikujiType型にtitleを含める
  2. 外部マッピングオブジェクトで管理
  3. OmikujiAnimationコンポーネント内でマッピング
- **Selected Approach**: 専用のタイトルマッピング定数をコンポーネント内で定義
- **Rationale**: タイトルはアニメーション固有の関心事、OmikujiTypeへの影響を避ける
- **Trade-offs**: マッピングの更新が必要な場合にコンポーネント修正が必要
- **Follow-up**: 将来的にはOmikujiTypeの拡張も検討

## Risks & Mitigations
- **リスク1**: アニメーション時間が長すぎてUXを損なう → 3〜5秒の制限を厳守、スキップ機能の検討
- **リスク2**: モバイルでのパフォーマンス低下 → GPU最適化プロパティの使用、reduced-motion対応
- **リスク3**: API応答がアニメーション完了前に来る → 結果をキャッシュし、アニメーション完了後に表示

## References
- [Framer Motion公式ドキュメント](https://www.framer.com/motion/animation/)
- [Advanced animation patterns with Framer Motion](https://blog.maximeheckel.com/posts/advanced-animation-patterns-with-framer-motion/)
- [Mastering Framer Motion 2025](https://www.luxisdesign.io/blog/mastering-framer-motion-advanced-animation-techniques-for-2025)
