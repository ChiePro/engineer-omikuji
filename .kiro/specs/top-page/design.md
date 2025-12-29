# トップページ技術設計書

## 概要

エンジニア向けおみくじWebサービスのトップページの技術設計書。要件定義（WHAT）をアーキテクチャ設計（HOW）に変換し、実装可能な技術仕様を定義する。

## アーキテクチャパターン

### レイヤードアーキテクチャ
```
┌─────────────────────────────────────────────────┐
│         Presentation Layer (Next.js App)         │
├─────────────────────────────────────────────────┤
│           Application Layer (Use Cases)          │
├─────────────────────────────────────────────────┤
│            Domain Layer (Business Logic)         │
├─────────────────────────────────────────────────┤
│       Infrastructure Layer (Repositories)        │
└─────────────────────────────────────────────────┘
```

### コンポーネント境界マップ
```
src/app/page.tsx (Server Component)
├── components/layout/HeroSection
│   ├── ShrineBgVisual (Server)
│   └── CatchCopy (Server)
├── features/omikuji/TopPageOmikujiSection (Server)
│   ├── OmikujiTypeGrid (Server)
│   └── OmikujiCard (Client) ← アニメーション
├── features/motivation/RarityPreview (Client)
│   └── RarityTier (Client) ← エフェクト
└── features/motivation/SaisenHint (Server)
    └── SaisenBox3D (Client) ← 3Dアニメーション
```

## 技術スタックと整合性

### フロントエンド技術選定
| 技術 | 用途 | 選定理由 |
|------|------|----------|
| Next.js 14 App Router | フレームワーク | Server Components対応、高速な初期表示 |
| TypeScript 5.x | 言語 | 型安全性の確保、DDD実装支援 |
| Tailwind CSS | スタイリング | ユーティリティファースト、高速開発 |
| Framer Motion | アニメーション | 高パフォーマンス、宣言的API |
| Radix UI | UIプリミティブ | アクセシビリティ対応済み |

### 開発環境
- pnpm: パッケージ管理
- Vitest: ユニットテスト
- Playwright: E2Eテスト
- Storybook: コンポーネントカタログ

## コンポーネントと インターフェース定義

### 1. HeroSection (FR-TOP-001)
#### 概要
神社×テクノロジーの融合ビジュアルを表現するヒーローセクション。

#### インターフェース
```typescript
// src/components/layout/HeroSection/types.ts
export interface HeroSectionProps {
  catchCopy: {
    main: string;
    sub: string;
  };
  backgroundVariant?: 'default' | 'festival' | 'night';
}

// src/components/layout/HeroSection/index.tsx
export const HeroSection: React.FC<HeroSectionProps> = ({
  catchCopy,
  backgroundVariant = 'default'
}) => {
  // Server Component実装
};
```

#### 実装詳細
- Server Componentとして実装（静的コンテンツ）
- 背景画像は`next/image`で最適化
- CSS Grid/Flexboxでレスポンシブ対応

### 2. OmikujiCard (FR-TOP-002)
#### 概要
各おみくじ種類を表示するインタラクティブカード。

#### インターフェース
```typescript
// src/features/omikuji/components/OmikujiCard/types.ts
export interface OmikujiTypeData {
  id: string;
  name: string;
  description: string;
  icon: string | React.ReactNode;
  color: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  route: string;
}

export interface OmikujiCardProps {
  omikujiType: OmikujiTypeData;
  onSelect: (typeId: string) => void;
  isDisabled?: boolean;
}

// src/features/omikuji/components/OmikujiCard/index.tsx
'use client';

export const OmikujiCard: React.FC<OmikujiCardProps> = ({
  omikujiType,
  onSelect,
  isDisabled = false
}) => {
  // Client Component実装（アニメーション）
};
```

#### アニメーション仕様
```typescript
// src/features/omikuji/components/OmikujiCard/animations.ts
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

### 3. RarityPreview (FR-TOP-003)
#### 概要
レアリティシステムの視覚的プレビュー。

#### インターフェース
```typescript
// src/features/motivation/components/RarityPreview/types.ts
export enum Rarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export interface RarityTierData {
  rarity: Rarity;
  label: string;
  probability: number;
  color: string;
  effects?: {
    glow?: boolean;
    sparkle?: boolean;
    animation?: string;
  };
}

export interface RarityPreviewProps {
  tiers: RarityTierData[];
  showProbabilities?: boolean;
  animateOnScroll?: boolean;
}
```

### 4. SaisenBox (FR-TOP-003)
#### 概要
お賽銭システムの3Dビジュアル表現。

#### インターフェース
```typescript
// src/features/motivation/components/SaisenBox/types.ts
export interface SaisenBoxProps {
  variant?: 'subtle' | 'prominent';
  showHint?: boolean;
  onInteract?: () => void;
}
```

## データモデル設計

### ドメインエンティティ
```typescript
// src/domain/entities/OmikujiType.ts
export class OmikujiType {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly icon: string,
    public readonly color: OmikujiColorScheme,
    public readonly sortOrder: number
  ) {}

  static create(params: OmikujiTypeParams): OmikujiType {
    // ファクトリーメソッド実装
  }
}

// src/domain/valueObjects/OmikujiColorScheme.ts
export class OmikujiColorScheme {
  constructor(
    public readonly primary: string,
    public readonly secondary: string,
    public readonly accent?: string
  ) {
    this.validate();
  }

  private validate(): void {
    // カラーコード検証
  }
}
```

### リポジトリインターフェース
```typescript
// src/domain/repositories/IOmikujiTypeRepository.ts
export interface IOmikujiTypeRepository {
  findAll(): Promise<OmikujiType[]>;
  findById(id: string): Promise<OmikujiType | null>;
}
```

## APIエンドポイント設計

### おみくじタイプ一覧取得
```typescript
// src/app/api/omikuji/types/route.ts
export async function GET() {
  const useCase = new GetOmikujiTypesUseCase(
    new JsonOmikujiTypeRepository()
  );
  
  const types = await useCase.execute();
  
  return NextResponse.json({
    types: types.map(type => ({
      id: type.id,
      name: type.name,
      description: type.description,
      icon: type.icon,
      color: type.color
    }))
  });
}
```

## 状態管理設計

### クライアント状態
```typescript
// src/features/omikuji/hooks/useOmikujiSelection.ts
export const useOmikujiSelection = () => {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const selectOmikuji = useCallback(async (typeId: string) => {
    setIsTransitioning(true);
    
    // ページ遷移前のアニメーション
    await animatePageExit();
    
    router.push(`/omikuji/${typeId}`);
  }, [router]);

  return { selectOmikuji, isTransitioning };
};
```

## パフォーマンス最適化戦略

### 1. Server Components活用
- 静的コンテンツはServer Componentで実装
- JavaScript バンドルサイズの削減

### 2. 画像最適化
```typescript
// 画像コンポーネント例
<Image
  src="/images/shrine-bg.webp"
  alt="神社の背景"
  width={1920}
  height={1080}
  priority // LCP最適化
  placeholder="blur"
  blurDataURL={shimmerDataUrl}
/>
```

### 3. アニメーション最適化
- `will-change`の適切な使用
- GPUアクセラレーション活用
- `useReducedMotion`でアクセシビリティ対応

## アクセシビリティ実装

### キーボードナビゲーション
```typescript
// src/features/omikuji/components/OmikujiGrid/index.tsx
export const OmikujiGrid = () => {
  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowRight':
        focusCard(index + 1);
        break;
      case 'ArrowLeft':
        focusCard(index - 1);
        break;
      case 'Enter':
      case ' ':
        selectCard(index);
        break;
    }
  };
};
```

### ARIAラベル実装
```typescript
<section aria-label="おみくじの種類を選択">
  <h2 id="omikuji-types">おみくじを選ぶ</h2>
  <div role="group" aria-labelledby="omikuji-types">
    {omikujiTypes.map((type) => (
      <button
        key={type.id}
        role="button"
        aria-label={`${type.name}を選択`}
        aria-describedby={`desc-${type.id}`}
      >
        {/* カード内容 */}
      </button>
    ))}
  </div>
</section>
```

## エラーハンドリング設計

### エラー境界
```typescript
// src/app/error.tsx
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <h2>申し訳ございません</h2>
      <p>神社の準備中です。しばらくお待ちください。</p>
      <button onClick={reset}>もう一度お参りする</button>
    </div>
  );
}
```

## テスト戦略

### ユニットテスト例
```typescript
// src/features/omikuji/components/OmikujiCard/OmikujiCard.test.tsx
describe('OmikujiCard', () => {
  it('おみくじタイプ情報が正しく表示される', () => {
    const mockType: OmikujiTypeData = {
      id: 'engineer-fortune',
      name: 'エンジニア運勢',
      description: '今日のコーディングを占う',
      icon: '⚡',
      color: { primary: '#3B82F6', secondary: '#1E40AF' },
      route: '/omikuji/engineer-fortune'
    };

    render(<OmikujiCard omikujiType={mockType} onSelect={vi.fn()} />);
    
    expect(screen.getByText('エンジニア運勢')).toBeInTheDocument();
    expect(screen.getByText('今日のコーディングを占う')).toBeInTheDocument();
  });

  it('クリック時にonSelectが呼ばれる', async () => {
    const onSelect = vi.fn();
    const mockType = createMockOmikujiType();

    render(<OmikujiCard omikujiType={mockType} onSelect={onSelect} />);
    
    await userEvent.click(screen.getByRole('button'));
    
    expect(onSelect).toHaveBeenCalledWith(mockType.id);
  });
});
```

## セキュリティ考慮事項

### CSP設定
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
    `.replace(/\s{2,}/g, ' ').trim()
  }
];
```

## 要件トレーサビリティマトリクス

| 要件ID | コンポーネント | 実装状況 |
|--------|--------------|---------|
| FR-TOP-001 | HeroSection, ShrineBgVisual, CatchCopy | 設計完了 |
| FR-TOP-002 | OmikujiCard, OmikujiTypeGrid | 設計完了 |
| FR-TOP-003 | RarityPreview, SaisenBox | 設計完了 |
| FR-TOP-004 | OmikujiCard (CTAボタン) | 設計完了 |
| NFR-TOP-001 | 全体アーキテクチャ（Server Components） | 設計完了 |
| NFR-TOP-002 | アクセシビリティ実装全般 | 設計完了 |
| NFR-TOP-003 | レスポンシブデザイン | 設計完了 |

## 実装優先順位

1. **Phase 1**: 基本構造とServer Components
   - HeroSection実装
   - OmikujiTypeGrid（静的表示）

2. **Phase 2**: インタラクティブ要素
   - OmikujiCard（アニメーション）
   - ページ遷移ロジック

3. **Phase 3**: 追加機能
   - RarityPreview
   - SaisenBox

4. **Phase 4**: 最適化とテスト
   - パフォーマンステスト
   - アクセシビリティ検証