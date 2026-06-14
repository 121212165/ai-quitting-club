'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function CheckInPage() {
  const router = useRouter();
  const [didDrink, setDidDrink] = useState<boolean | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (didDrink === null) {
      setError('请选择今天的状态');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          didDrink,
          note: note.trim() || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '打卡失败');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '打卡失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">{didDrink ? '💪' : '✅'}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {didDrink ? '记录完成' : '打卡成功！'}
          </h2>
          <p className="text-gray-600">
            {didDrink
              ? '没关系，明天是新的一天。'
              : '继续加油，你做得很好！'}
          </p>
          <p className="text-sm text-gray-500 mt-4">正在返回仪表盘...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">每日打卡</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">今天喝酒了吗？</h2>
            <p className="text-gray-600">诚实地面对自己，这是迈向改变的第一步</p>
          </div>

          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} onDismiss={() => setError(null)} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <button
                type="button"
                onClick={() => setDidDrink(false)}
                className={`p-8 rounded-xl border-2 transition-all ${
                  didDrink === false
                    ? 'bg-green-100 border-green-400 ring-2 ring-offset-2 ring-green-500'
                    : 'bg-gray-50 border-gray-200 hover:bg-green-50'
                }`}
              >
                <div className="text-5xl mb-3">✅</div>
                <div className="text-xl font-bold text-gray-900">没有喝</div>
                <div className="text-sm text-gray-600 mt-1">又坚持了一天</div>
              </button>

              <button
                type="button"
                onClick={() => setDidDrink(true)}
                className={`p-8 rounded-xl border-2 transition-all ${
                  didDrink === true
                    ? 'bg-red-100 border-red-400 ring-2 ring-offset-2 ring-red-500'
                    : 'bg-gray-50 border-gray-200 hover:bg-red-50'
                }`}
              >
                <div className="text-5xl mb-3">😔</div>
                <div className="text-xl font-bold text-gray-900">喝了</div>
                <div className="text-sm text-gray-600 mt-1">没关系，明天继续</div>
              </button>
            </div>

            <div>
              <label htmlFor="note" className="block text-lg font-semibold text-gray-900 mb-4">
                想说点什么？（可选）
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="分享今天的感受、遇到的挑战..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={500}
              />
            </div>

            <button
              type="submit"
              disabled={loading || didDrink === null}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>提交中...</span>
                </>
              ) : (
                <span>✅ 完成打卡</span>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
