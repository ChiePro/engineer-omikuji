'use client';

import { OmikujiFlow } from '@/features/omikuji/components/OmikujiFlow';
import { OmikujiResult } from '@/domain/entities/OmikujiResult';

const omikujiTypes = [
  {
    id: 'engineer-fortune',
    name: 'エンジニア運勢',
    description: '今日のコーディング運を占う',
    icon: '💻',
    color: { primary: '#1E40AF', secondary: '#FFFFFF' }
  },
  {
    id: 'debug-fortune',
    name: 'デバッグ運',
    description: 'バグ解決の運を試す',
    icon: '🐛',
    color: { primary: '#DC2626', secondary: '#FFFFFF' }
  },
  {
    id: 'deploy-fortune',
    name: 'デプロイ運',
    description: 'デプロイの成功を占う',
    icon: '🚀',
    color: { primary: '#059669', secondary: '#FFFFFF' }
  },
  {
    id: 'code-review-fortune',
    name: 'コードレビュー運',
    description: 'レビューの結果を予想',
    icon: '👀',
    color: { primary: '#7C3AED', secondary: '#FFFFFF' }
  }
];

export default function DemoPage() {
  const handleFlowComplete = (result: OmikujiResult) => {
    console.log('Flow completed:', result);
  };

  const handleError = (error: string) => {
    console.error('Flow error:', error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            OmikujiFlow Animation Demo
          </h1>
          <p className="text-gray-600">
            おみくじを選択してアニメーションを確認してください
          </p>
        </header>

        <main className="bg-white rounded-xl shadow-lg p-6 min-h-[700px]">
          <OmikujiFlow
            omikujiTypes={omikujiTypes}
            onFlowComplete={handleFlowComplete}
            onError={handleError}
          />
        </main>

        <footer className="text-center mt-8 text-sm text-gray-500">
          OmikujiAnimation Integration Demo
        </footer>
      </div>
    </div>
  );
}
