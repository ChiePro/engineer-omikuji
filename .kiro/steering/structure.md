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
├── src/                     # ソースコード
│   ├── app/                # Next.js App Router（プレゼンテーション層）
│   │   ├── layout.tsx      # ルートレイアウト
│   │   ├── page.tsx        # ホームページ
│   │   ├── api/           # APIルート
│   │   └── omikuji/       # おみくじページ
│   ├── domain/            # ドメイン層（ビジネスロジック）
│   │   ├── entities/      # エンティティ
│   │   ├── valueObjects/  # 値オブジェクト
│   │   ├── repositories/  # リポジトリインターフェース
│   │   └── services/      # ドメインサービス
│   ├── application/       # アプリケーション層
│   │   └── useCases/     # ユースケース
│   ├── infrastructure/    # インフラストラクチャ層
│   │   ├── repositories/  # リポジトリ実装
│   │   │   └── json/     # JSON実装
│   │   └── external/      # 外部サービス連携
│   ├── components/        # 共通UIコンポーネント
│   │   ├── ui/           # 基本UIコンポーネント
│   │   └── layout/       # レイアウトコンポーネント
│   ├── features/          # 機能別プレゼンテーション層
│   │   ├── omikuji/      # おみくじ機能UI
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types.ts
│   │   └── share/        # シェア機能UI
│   ├── lib/              # 共通ライブラリ
│   ├── hooks/            # 共通カスタムフック
│   ├── types/            # 共通型定義
│   └── styles/           # グローバルスタイル
├── public/               # 静的ファイル
├── data/                # 実装済みデータファイル
│   └── fortune/        # 運勢定義データ
│       └── fortune-types.json     # 運勢タイプ（大吉〜大凶）
├── tests/               # テストファイル
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
/api/omikuji/          # 将来実装
├── draw/              # おみくじを引く
│   └── POST: { type: string } => { result: OmikujiResult }
└── stats/             # 統計情報
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
### 完了済み（Phase 4.2）
- **ドメイン層**: Fortune、Saisen、OmikujiType等の値オブジェクト・エンティティ
- **インフラ層**: JSON Repository、API Routes
- **プレゼンテーション層**: 統合されたトップページ（app/page.tsx）
- **テスト基盤**: ユニット、統合、E2E、パフォーマンステスト

### 実装パターン
- **コンポーネント統合**: 個別コンポーネントをトップページに統合
- **データフロー**: JSON → API Routes → Frontend fetch → React state
- **型安全性**: TypeScript strict mode、ドメイン駆動設計
- **アクセシビリティ**: ARIA属性、セマンティックHTML、自動テスト

## 開発フロー  
1. `.kiro/specs/`に機能仕様を作成（Spec-Driven Development）
2. TDD：テストファースト実装
3. Domain層 → Infrastructure層 → Presentation層の順で実装
4. PRを作成してレビュー
5. mainブランチにマージ
6. Vercelで自動デプロイ