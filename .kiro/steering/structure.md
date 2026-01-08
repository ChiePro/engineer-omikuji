# プロジェクト構造

## 現在の状態
- MVP実装完了（トップページ統合）
- ドメイン層、インフラ層の基盤構築済み
- API Routes とフロントエンド統合済み
- 包括的テストスイート構築済み

## 主要ディレクトリ構成

```
enginer-omikuji/
├── .kiro/                    # Kiro SDD関連
│   ├── steering/            # プロジェクトステアリング
│   └── specs/              # 機能仕様
├── app/                     # Next.js App Router（プレゼンテーション層）
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # ホームページ
│   ├── api/               # APIルート
│   │   ├── fortune/types/ # 運勢タイプAPI
│   │   └── omikuji/draw/  # おみくじ抽選API
│   ├── components/        # App Router用コンポーネント
│   ├── features/          # App Router用機能コンポーネント
│   └── lib/              # App Router用ライブラリ
├── src/                     # ソースコード（ドメイン・インフラ層）
│   ├── domain/            # ドメイン層（ビジネスロジック）
│   │   ├── entities/      # エンティティ
│   │   ├── valueObjects/  # 値オブジェクト
│   │   ├── repositories/  # リポジトリインターフェース
│   │   ├── services/      # ドメインサービス
│   │   └── errors/        # ドメインエラー
│   ├── infrastructure/    # インフラストラクチャ層
│   │   ├── repositories/  # リポジトリ実装
│   │   │   └── json/     # JSON実装
│   │   └── external/      # 外部サービス連携
│   ├── features/          # 機能別プレゼンテーション層
│   │   ├── omikuji/      # おみくじ機能UI
│   │   └── motivation/   # モチベーション機能UI
│   ├── animations/        # アニメーション機能
│   ├── design-system/    # デザインシステム（色、間隔、トークン）
│   ├── lib/              # 共通ライブラリ
│   ├── hooks/            # 共通カスタムフック
│   ├── types/            # 共通型定義
│   └── test/             # テストヘルパー・テストファイル
├── data/                # 実装済みデータファイル
│   ├── fortune/        # 運勢定義データ
│   └── results/        # おみくじ結果データ（5種類）
├── public/               # 静的ファイル
└── package.json         # プロジェクト設定
```

## モジュール設計

### おみくじ機能 (`features/omikuji/`)
- `OmikujiSelector`: おみくじ種類選択コンポーネント
- `OmikujiDrawer`: おみくじを引くコンポーネント
- `OmikujiResult`: 結果表示コンポーネント
- `useOmikuji`: おみくじロジックのカスタムフック
- `omikujiData`: おみくじデータ定義

### シェア機能 (`features/share/`)
- `ShareButtons`: SNSシェアボタン群
- `ShareModal`: シェア用モーダル
- `useShare`: シェア機能のカスタムフック

## APIエンドポイント設計

```
/api/fortune/
├── types/             # 実装済み：運勢タイプ一覧
│   └── GET: => { fortunes: FortuneData[] }
/api/omikuji/
├── draw/              # 実装済み：おみくじを引く
│   └── POST: { type: string, saisen?: number } => { result: OmikujiResult }
└── stats/             # 将来実装：統計情報
    └── GET: => { stats: Statistics }
```

## 型定義構造

```typescript
// おみくじタイプ
interface OmikujiType {
  id: string
  name: string
  description: string
  icon: string
}

// おみくじ結果
interface OmikujiResult {
  id: string
  type: string
  fortune: string      // 運勢（大吉、中吉など）
  message: string      // メッセージ
  advice: string       // アドバイス
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  shareText: string    // シェア用テキスト
}
```

## 実装進捗
### 完了済み機能
- **ドメイン層**: Fortune、Saisen、OmikujiType、OmikujiResult、EmotionAttribute等の値オブジェクト・エンティティ
- **ドメインサービス**: OmikujiDrawService、EmotionAttributeCalculator、RarityCalculatorService
- **インフラ層**: JSON Repository、API Routes（fortune/types、omikuji/draw）
- **プレゼンテーション層**: 統合されたトップページ（app/page.tsx）、OmikujiFlow
- **デザインシステム**: ShrineColorPalette、ShrineSpacing、ShrineDesignTokens
- **アニメーション**: MysteriousAppearance、SmoothTransitions、HoverEffects
- **テスト基盤**: ユニット、統合、E2E、パフォーマンス、アクセシビリティテスト

### 完了済み仕様（.kiro/specs/）
- top-page, fortune-system, saisen-system, omikuji-results, fortune-randomization, omikuji-animation

### 実装パターン
- **コンポーネント統合**: 個別コンポーネントをトップページに統合
- **データフロー**: JSON → API Routes → Frontend fetch → React state
- **型安全性**: TypeScript strict mode、ドメイン駆動設計
- **アクセシビリティ**: ARIA属性、セマンティックHTML、自動テスト
- **おみくじ抽選**: 感情属性ベースのランダム化でコンテンツ一貫性を確保

## 開発フロー  
1. `.kiro/specs/`に機能仕様を作成（Spec-Driven Development）
2. TDD：テストファースト実装
3. Domain層 → Infrastructure層 → Presentation層の順で実装
4. PRを作成してレビュー
5. mainブランチにマージ
6. Vercelで自動デプロイ