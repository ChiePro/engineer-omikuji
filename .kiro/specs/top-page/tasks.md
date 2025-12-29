# トップページ実装タスク一覧

## タスク概要

設計書に基づいてトップページの実装を4つのフェーズに分けて段階的に実行する。各タスクはTDDアプローチで実装し、型安全性とアクセシビリティを確保する。

## Phase 1: 基礎インフラとドメイン層

### T1.1: プロジェクト基盤セットアップ
**優先度**: 必須  
**工数見積**: 2時間  
**依存関係**: なし  

#### 実装内容
- [ ] 必要なパッケージの追加
  - `framer-motion`: アニメーション
  - `@radix-ui/react-*`: アクセシブルUIプリミティブ
  - `clsx`: className管理
  - `@testing-library/jest-dom`: テストユーティリティ
- [ ] TypeScriptの設定調整（strictモード確認）
- [ ] Tailwind CSSの設定拡張（カスタムカラーパレット）
- [ ] ESLintとPrettierの設定確認

#### 受け入れ基準
- すべてのパッケージが正常にインストールされる
- TypeScriptコンパイルがエラーなく通る
- 開発サーバーが正常に起動する

### T1.2: ドメインエンティティの実装（BDD/TDD準拠）
**優先度**: 必須  
**工数見積**: 5時間  
**依存関係**: T1.1  

#### 実装内容（t-wada TDD手法）
**Red-Green-Refactorサイクルで実装**

- [ ] **BDDシナリオ実装**: Gherkin仕様からテストケース作成
- [ ] **OmikujiType.test.ts** の実装（失敗テストから開始）
  ```typescript
  describe('OmikujiType', () => {
    describe('作成時', () => {
      describe('正常系', () => {
        it('有効なパラメータでおみくじタイプが作成される', () => {
          // AAA パターン: Arrange-Act-Assert
        });
      });
      describe('異常系', () => {
        it('無効なIDの場合、InvalidOmikujiTypeIdErrorを投げる', () => {});
      });
    });
    describe('振る舞い', () => {
      it('表示順序で比較できる', () => {});
      it('同一のIDのおみくじタイプは等しいと判定される', () => {});
    });
  });
  ```
- [ ] **OmikujiType エンティティ** の実装
  ```typescript
  export class OmikujiType {
    // 振る舞いメソッドを含む完全実装
    compareByOrder(other: OmikujiType): number;
    equals(other: OmikujiType): boolean;
    getDisplayName(): string;
  }
  ```
- [ ] **OmikujiTypeId 値オブジェクト** の実装とテスト
- [ ] **OmikujiColorScheme.test.ts** の実装
- [ ] **OmikujiColorScheme 値オブジェクト** の実装
  ```typescript
  export class OmikujiColorScheme {
    isAccessible(): boolean;
    toTailwindClasses(): { primary: string; secondary: string; accent?: string };
  }
  ```
- [ ] **Rarity.test.ts** の実装
- [ ] **Rarity 値オブジェクト** の実装
  ```typescript
  export class Rarity {
    isMoreValuableThan(other: Rarity): boolean;
    hasSpecialEffects(): boolean;
    getProbability(): number;
  }
  ```
- [ ] **ドメインエラークラス** の実装
  - `InvalidOmikujiTypeIdError`
  - `InvalidColorCodeError`
  - `InsufficientContrastError`

#### TDD実践手順
1. **Red**: BDDシナリオから失敗テストを作成
2. **Green**: テストを通すための最小実装
3. **Refactor**: ドメインモデルの洗練

#### 受け入れ基準
- 全BDDシナリオがテストケースとして実装されている
- ドメインエンティティの全振る舞いがテストされている
- ユニットテストカバレッジ100%
- WCAG準拠のカラーコントラスト検証が動作する
- 型安全性が完全に確保されている

### T1.3: ドメインサービス実装
**優先度**: 必須  
**工数見積**: 2時間  
**依存関係**: T1.2  

#### 実装内容（TDD準拠）
- [ ] **OmikujiTypeOrderingService.test.ts** の実装
  ```typescript
  describe('OmikujiTypeOrderingService', () => {
    describe('優先順位でソート', () => {
      it('sortOrder順に並べ替えられる', () => {});
    });
    describe('推奨タイプ取得', () => {
      it('先頭のおみくじタイプを推奨として返す', () => {});
    });
  });
  ```
- [ ] **OmikujiTypeOrderingService** の実装
- [ ] **RarityCalculatorService.test.ts** の実装
- [ ] **RarityCalculatorService** の実装

#### 受け入れ基準
- ドメインサービスの振る舞いがテストされている
- ビジネスロジックが適切に分離されている
- ユニットテストが全て通過する

### T1.4: リポジトリインターフェースと実装
**優先度**: 必須  
**工数見積**: 2時間  
**依存関係**: T1.3  

#### 実装内容
- [ ] `src/domain/repositories/IOmikujiTypeRepository.ts`の定義
- [ ] `src/infrastructure/repositories/json/JsonOmikujiTypeRepository.ts`の実装
- [ ] `data/omikuji/`ディレクトリとJSONデータファイルの作成
  - `engineer-fortune.json`
  - `tech-selection.json`  
  - `debug-fortune.json`
  - `review-fortune.json`
  - `deploy-fortune.json`
- [ ] リポジトリの統合テスト

#### 受け入れ基準
- JSONファイルからデータが正常に読み込める
- リポジトリパターンが正しく実装されている
- 統合テストが通過する

## Phase 2: UI基盤コンポーネント

### T2.1: レイアウトコンポーネントの実装
**優先度**: 必須  
**工数見積**: 4時間  
**依存関係**: T1.4  

#### 実装内容
- [ ] `src/components/layout/HeroSection/index.tsx`の実装
  - Server Component として実装
  - レスポンシブデザイン対応
  - 神社背景の配置
- [ ] `src/components/layout/HeroSection/ShrineBgVisual.tsx`の実装
- [ ] `src/components/layout/HeroSection/CatchCopy.tsx`の実装
- [ ] レイアウトコンポーネントのStorybookストーリー作成
- [ ] Visual Regression Tests

#### 受け入れ基準
- デスクトップ・タブレット・モバイルで適切に表示される
- Lighthouseパフォーマンススコア90以上
- Storybookで各variantが確認できる

### T2.2: 基本UIコンポーネントライブラリ
**優先度**: 必須  
**工数見積**: 3時間  
**依存関係**: T2.1  

#### 実装内容
- [ ] `src/components/ui/Button/index.tsx`の実装
  - アクセシビリティ対応（focus状態、ARIA）
  - キーボードナビゲーション
- [ ] `src/components/ui/Card/index.tsx`の実装
- [ ] `src/components/ui/Icon/index.tsx`の実装
- [ ] 各コンポーネントのユニットテスト
- [ ] アクセシビリティテスト（@testing-library/jest-dom）

#### 受け入れ基準
- すべてのコンポーネントがWCAG 2.1 AA準拠
- キーボードのみで操作可能
- ユニットテストが90%以上のカバレッジ

## Phase 3: おみくじ機能コンポーネント

### T3.1: OmikujiCard コンポーネント（BDD統合）
**優先度**: 必須  
**工数見積**: 6時間  
**依存関係**: T2.2  

#### 実装内容
- [ ] **コンポーネントテスト** の実装（TDD）
  ```typescript
  describe('OmikujiCard', () => {
    describe('表示', () => {
      it('おみくじタイプの情報が正しく表示される', () => {});
      it('アクセシビリティ属性が適切に設定される', () => {});
    });
    describe('インタラクション', () => {
      it('クリック時にonSelectコールバックが実行される', () => {});
      it('キーボード操作（Enter/Space）で選択できる', () => {});
    });
  });
  ```
- [ ] `src/features/omikuji/components/OmikujiCard/index.tsx`の実装
  - Client Component（"use client"）
  - ドメインエンティティのメソッド活用
  - `omikujiType.getDisplayName()`の使用
  - `colorScheme.toTailwindClasses()`の使用
- [ ] `src/features/omikuji/components/OmikujiCard/animations.ts`の実装
- [ ] `src/features/omikuji/components/OmikujiCard/types.ts`の実装
- [ ] prefers-reduced-motionへの対応
- [ ] アクセシビリティテスト（axe-core統合）

#### 実装詳細
```typescript
// アニメーション仕様
export const cardVariants = {
  initial: { scale: 1, y: 0 },
  hover: { 
    scale: 1.05, 
    y: -8,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  tap: { scale: 0.98 }
};
```

#### 受け入れ基準
- スムーズなアニメーション（60fps維持）
- アクセシビリティ対応（キーボード操作、スクリーンリーダー）
- アニメーション無効設定の尊重

### T3.2: OmikujiTypeGrid コンポーネント
**優先度**: 必須  
**工数見積**: 4時間  
**依存関係**: T3.1  

#### 実装内容
- [ ] `src/features/omikuji/components/OmikujiTypeGrid/index.tsx`の実装
  - 5つのおみくじカードのグリッド表示
  - レスポンシブグリッドレイアウト
  - キーボードナビゲーション（矢印キー）
- [ ] グリッドアクセシビリティの実装
  - role="grid", role="gridcell"
  - aria-label, aria-describedby
- [ ] グリッドコンポーネントのE2Eテスト（Playwright）

#### 受け入れ基準
- 5種類のおみくじが適切なレイアウトで表示される
- キーボードで全カードにアクセス可能
- スクリーンリーダーで構造が理解できる

### T3.3: おみくじ選択フック
**優先度**: 必須  
**工数見積**: 2時間  
**依存関係**: T3.2  

#### 実装内容
- [ ] `src/features/omikuji/hooks/useOmikujiSelection.ts`の実装
  - ページ遷移ロジック
  - ローディング状態管理
  - エラーハンドリング
- [ ] カスタムフックのユニットテスト

#### 受け入れ基準
- おみくじ選択時にスムーズに遷移する
- エラー時に適切なフィードバックを表示
- ローディング状態が適切に管理される

## Phase 4: モチベーション機能と最適化

### T4.1: RarityPreview コンポーネント
**優先度**: 高  
**工数見積**: 4時間  
**依存関係**: T3.3  

#### 実装内容
- [ ] `src/features/motivation/components/RarityPreview/index.tsx`の実装
  - 4段階のレアリティ表示
  - キラキラエフェクト（CSS/JS animation）
  - スクロール連動アニメーション（whileInView）
- [ ] `src/features/motivation/components/RarityTier/index.tsx`の実装
- [ ] レアリティエフェクトのCSS実装

#### 受け入れ基準
- レアリティ階層が視覚的に理解できる
- エフェクトが期待感を演出する
- モバイルでもスムーズに動作する

### T4.2: SaisenBox コンポーネント
**優先度**: 中  
**工数見積**: 3時間  
**依存関係**: T4.1  

#### 実装内容
- [ ] `src/features/motivation/components/SaisenBox/index.tsx`の実装
  - 3Dっぽいビジュアル表現
  - ホバーインタラクション
  - お賽銭システムの示唆
- [ ] SaisenBoxのマイクロインタラクション

#### 受け入れ基準
- お賽銭箱が神社の雰囲気を演出する
- インタラクションが楽しい
- パフォーマンスに影響しない

### T4.3: メインページ統合
**優先度**: 必須  
**工数見積**: 3時間  
**依存関係**: T4.2  

#### 実装内容
- [ ] `src/app/page.tsx`の実装
  - 全コンポーネントの統合
  - Server/Client Componentsの適切な分離
  - メタデータの設定（SEO）
- [ ] ページレベルのE2Eテスト
- [ ] パフォーマンステスト（Lighthouse CI）

#### 受け入れ基準
- すべてのコンポーネントが正常に表示される
- Lighthouse Performance score 90以上
- E2Eテストがすべて通過

## Phase 5: テストとアクセシビリティ検証（BDD検証含む）

### T5.1: BDDシナリオ統合テスト
**優先度**: 必須  
**工数見積**: 3時間  
**依存関係**: T4.3  

#### 実装内容
- [ ] **Gherkinシナリオの実装テスト**
  ```typescript
  describe('Feature: おみくじタイプの表示', () => {
    scenario('有効なおみくじタイプの作成', () => {
      given('以下のおみくじタイプが存在する', (dataTable) => {});
      when('"engineer-fortune"のIDで新しいおみくじタイプを作成する', () => {});
      then('おみくじタイプが正常に作成される', () => {});
    });
  });
  ```
- [ ] **ドメインモデル振る舞い総合テスト**
- [ ] **エンドツーエンドBDDテスト**（Playwright使用）

### T5.2: アクセシビリティ総合テスト
**優先度**: 必須  
**工数見積**: 2時間  
**依存関係**: T5.1  

#### 実装内容
- [ ] axe-core による自動アクセシビリティテスト
- [ ] キーボードのみでの操作テスト
- [ ] スクリーンリーダーテスト（NVDA/VoiceOver）
- [ ] **ドメインレベルでのカラーコントラスト検証**
  - `OmikujiColorScheme.isAccessible()`のテスト

#### 受け入れ基準
- WCAG 2.1 Level AA準拠
- axe-coreテストがすべて通過
- キーボード操作で全機能にアクセス可能
- ドメインエンティティレベルでアクセシビリティが保証されている

### T5.3: パフォーマンス最適化
**優先度**: 高  
**工数見積**: 3時間  
**依存関係**: T5.2  

#### 実装内容
- [ ] バンドルサイズ分析（webpack-bundle-analyzer）
- [ ] 画像最適化（WebP対応、適切なサイズ設定）
- [ ] Core Web Vitals最適化
  - LCP < 2.5秒
  - FID < 100ms
  - CLS < 0.1
- [ ] ページ speed insights での検証

#### 受け入れ基準
- Lighthouse Performance score 90以上
- Core Web Vitals すべて「良好」
- First Contentful Paint < 1.0秒

## API エンドポイント実装

### T6.1: おみくじタイプ一覧API
**優先度**: 必須  
**工数見積**: 2時間  
**依存関係**: T1.3  

#### 実装内容
- [ ] `src/app/api/omikuji/types/route.ts`の実装
  - GET エンドポイント
  - JSON レスポンス
  - エラーハンドリング
- [ ] APIのユニットテスト
- [ ] API統合テスト

#### 受け入れ基準
- APIが正常にデータを返す
- エラー時に適切なHTTPステータスを返す
- レスポンス時間 < 200ms

## テスト戦略

### ユニットテスト（t-wada TDD準拠）
- **対象**: 全ドメインエンティティ、値オブジェクト、ドメインサービス、ビジネスロジック
- **手法**: Test-First開発、Red-Green-Refactorサイクル、AAA（Arrange-Act-Assert）パターン
- **ツール**: Vitest + @testing-library/react
- **カバレッジ目標**: ドメイン層100%、その他90%以上
- **BDD統合**: GherkinシナリオからテストケースにMaping

### 統合テスト
- **対象**: API Routes、Repository実装
- **ツール**: Vitest + Supertest
- **カバレッジ目標**: 85%以上

### E2Eテスト
- **対象**: 主要なユーザーフロー（おみくじ選択〜遷移）
- **ツール**: Playwright
- **実行環境**: デスクトップ（Chrome, Firefox）、モバイル（Safari）

### アクセシビリティテスト
- **ツール**: axe-core, @testing-library/jest-dom
- **基準**: WCAG 2.1 Level AA
- **手動テスト**: キーボード操作、スクリーンリーダー

## 並列実装可能なタスク

以下のタスクグループは並列実装が可能：

### Group A（ドメイン層）
- T1.2: ドメインエンティティ（BDD/TDD）
- T1.3: ドメインサービス
- T1.4: リポジトリ実装

### Group B（UI基盤）
- T2.1: レイアウトコンポーネント
- T2.2: 基本UIコンポーネント

### Group C（機能コンポーネント）
- T3.1: OmikujiCard
- T4.1: RarityPreview
- T4.2: SaisenBox

### Group D（API & テスト）
- T6.1: API実装
- T5.1: アクセシビリティテスト
- T5.2: パフォーマンス最適化

## 完成定義（Definition of Done）

各タスクは以下の基準をすべて満たした時点で完了：

- [ ] 実装が設計仕様通りに動作する
- [ ] ユニットテストが実装され、通過する
- [ ] TypeScriptエラーが0件
- [ ] ESLintエラーが0件
- [ ] アクセシビリティ要件を満たす
- [ ] レスポンシブデザインが正常に動作する
- [ ] コードレビューが完了している
- [ ] 関連ドキュメントが更新されている

## 工数見積総計

- **Phase 1**: 9時間（BDD/TDD強化により+2時間）
- **Phase 2**: 7時間  
- **Phase 3**: 12時間（TDD統合により+1時間）
- **Phase 4**: 10時間
- **Phase 5**: 8時間（BDDテスト強化により+3時間）
- **API実装**: 2時間

**総計**: 48時間（約1.2週間）

### BDD/TDD追加工数内訳
- ドメインエンティティのBDDシナリオ実装: +2時間
- コンポーネントのテストファースト開発: +1時間
- 統合BDDシナリオテスト: +3時間