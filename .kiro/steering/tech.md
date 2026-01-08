# 技術仕様

## 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 16.1.1 (App Router)
- **言語**: TypeScript
- **ランタイム**: React 19.2.3 (最新版)
- **スタイリング**: Tailwind CSS 4
- **アニメーション**: Framer Motion 12.23+
- **状態管理**: React 19 built-ins + 必要に応じてZustand
- **パフォーマンス最適化**: Web Vitals監視、React 19並行機能

### 現在のアーキテクチャ決定
- **統合アプローチ**: 初期実装では個別コンポーネントを単一ページに統合
- **漸進的分離**: 将来的なページ分割を見越したコンポーネント設計
- **データフェッチ**: サーバー・クライアント双方でのフォールバック戦略

### バックエンド
- **API**: Next.js API Routes
- **データベース**: 
  - 初期: インメモリ/JSONファイル（Repositoryパターン経由）
  - 将来: Supabase（PostgreSQL）
- **認証**: 
  - 初期: 不要
  - 将来: Supabase Auth

### インフラ・デプロイ
- **ホスティング**: Vercel
- **CDN**: Vercel Edge Network
- **環境**: 開発・ステージング・本番

### 開発ツール
- **パッケージマネージャー**: npm (Volta管理)
- **ランタイム管理**: Volta (Node.js 24.12.0)
- **リンター**: ESLint 9
- **テスト**: Vitest 4 + React Testing Library 16+ + Playwright (E2E)
- **パフォーマンス**: Web Vitals 5.1+ 統合

## アーキテクチャ設計

### クリーンアーキテクチャ（DDD準拠）
Eric EvansのDomain Driven Designに基づいたクリーンアーキテクチャを採用。ビジネスロジックをフレームワークから独立させる。

### ディレクトリ構造
```
app/                      # Next.js App Router（プレゼンテーション層）
├── api/                  # APIルート
├── components/           # App Router用コンポーネント
├── features/             # App Router用機能コンポーネント
└── lib/                  # App Router用ライブラリ
src/
├── domain/               # ドメイン層（ビジネスロジック）
│   ├── entities/         # エンティティ
│   ├── valueObjects/     # 値オブジェクト
│   ├── repositories/     # リポジトリインターフェース
│   ├── services/         # ドメインサービス
│   └── errors/           # ドメインエラー
├── infrastructure/       # インフラストラクチャ層
│   ├── repositories/     # リポジトリ実装
│   └── external/         # 外部サービス連携
├── features/             # 機能別のプレゼンテーション層
│   ├── omikuji/         # おみくじ機能UI
│   └── motivation/      # モチベーション機能UI
├── animations/          # アニメーション機能
├── design-system/       # デザインシステム
├── lib/                  # ユーティリティ関数
├── hooks/               # カスタムフック
├── types/               # 共通TypeScript型定義
└── test/                # テストヘルパー
data/
├── fortune/             # 運勢定義データ
└── results/             # おみくじ結果データ（5種類）
```

### データフロー（クリーンアーキテクチャ）
1. **プレゼンテーション層**: クライアントからのリクエスト受信
2. **アプリケーション層**: ユースケースの実行
3. **ドメイン層**: ビジネスロジックの処理（おみくじ生成）
4. **インフラストラクチャ層**: 必要に応じてデータ永続化
5. **プレゼンテーション層**: 結果をクライアントに返却

### DDD設計

#### エンティティ
- `OmikujiType`: おみくじの種類（ID、名前、説明、アイコンを持つ）
- `OmikujiResult`: おみくじ結果（ID、運勢、コンテンツ、感情属性を持つ）
- `SaisenSession`: お賽銭セッション（お賽銭情報を保持）

#### 値オブジェクト
- `Fortune`: 運勢（大吉、中吉、小吉、吉、末吉、凶、大凶）
- `Rarity`: レアリティ（Common, Rare, Epic, Legendary）
- `Saisen`: お賽銭金額
- `EmotionAttribute`: 感情属性（positive/neutral/challenging）
- `FortuneCategory`: 運勢カテゴリ（仕事運、恋愛運、金運など）
- `TitlePhrase`: おみくじのタイトルフレーズ
- `Description`: おみくじの説明テキスト

#### ドメインサービス
- `OmikujiDrawService`: おみくじ抽選ロジック（感情属性ベースのランダム化）
- `RarityCalculatorService`: レアリティ計算サービス
- `SaisenEffectCalculatorService`: お賽銭効果計算サービス
- `EmotionAttributeCalculator`: 感情属性計算サービス
- `OmikujiTypeService`: おみくじ種類管理サービス

#### リポジトリインターフェース
- `IOmikujiResultRepository`: おみくじ結果の取得インターフェース

### データアクセス層の設計

#### 初期実装（インメモリ/JSON）
```typescript
// リポジトリインターフェース
interface IOmikujiResultRepository {
  findByTypeAndId(type: OmikujiType, id: string): Promise<OmikujiResult | null>
  findAllByType(type: OmikujiType): Promise<OmikujiResult[]>
}

// 初期実装（JSONファイルから読み込み）
class JsonOmikujiResultRepository implements IOmikujiResultRepository {
  // data/omikuji-results.json から読み込み
}
```

#### 将来実装（Supabase）
```typescript
// 同じインターフェースを実装
class SupabaseOmikujiResultRepository implements IOmikujiResultRepository {
  // Supabaseクライアントを使用してDBアクセス
}
```

#### データ管理方針
- 実装済み: `data/fortune/fortune-types.json` で運勢データ管理
- API Routes (`/api/fortune/types`) でJSONデータを提供
- クライアントサイドでのfetch統合とフォールバック機能
- Repositoryパターンとドメイン層での型安全性確保

## パフォーマンス要件
- First Contentful Paint: < 1.2秒
- Time to Interactive: < 2.5秒
- Core Web Vitals準拠

## セキュリティ
- CSP（Content Security Policy）の設定
- Rate Limitingの実装（API保護）
- 環境変数の適切な管理

## 開発規約

### テスト駆動開発（TDD）
t-wadaのTDD手法に基づいた開発プロセスを採用。

#### TDDサイクル
1. **Red**: 失敗するテストを書く
2. **Green**: テストを通る最小限のコードを書く
3. **Refactor**: コードをリファクタリングする

#### テスト方針
- **テストファースト**: 実装前にテストを書く
- **小さなステップ**: 一度に一つのことだけをテストする
- **明確な名前**: テストケースは日本語で記述可
- **AAA原則**: Arrange（準備）、Act（実行）、Assert（検証）
- **テストダブル**: モックよりもスタブを優先

#### テストの種類
1. **ユニットテスト**: ドメイン層（src/domain/**/*.test.ts）
2. **コンポーネントテスト**: React Testing Library 16+ での各コンポーネント
3. **統合テスト**: トップページ統合、API Routes、アクセシビリティ
4. **E2Eテスト**: Playwright でクリティカルユーザーフロー
5. **パフォーマンステスト**: Web Vitals自動測定

### コーディング規約
- コミットメッセージ: Conventional Commits
- ブランチ戦略: GitHub Flow
- コードレビュー必須
- TypeScript strictモード有効
- 依存性逆転の原則（DIP）の遵守
- ドメイン層はフレームワークに依存しない