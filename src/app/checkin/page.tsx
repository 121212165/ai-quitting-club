'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

type MoodType = 'great' | 'good' | 'okay' | 'bad' | 'terrible';

interface MoodOption {
  value: MoodType;
  label: string;
  emoji: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  { value: 'great', label: '很好', emoji: '😊', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
  { value: 'good', label: '还好', emoji: '🙂', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
  { value: 'okay', label: '一般', emoji: '😐', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
  { value: 'bad', label: '不好', emoji: '😔', color: 'bg-orange-100 hover:bg-orange-200 border-orange-300' },
  { value: 'terrible', label: '很难', emoji: '😢', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
];

export default function CheckInPage() {
  const router = useRouter();
  const [mood, setMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mood) {
      setError('请选择今天的心情');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood,
          note: note.trim() || null,
          didDrink: false, // 默认为没有喝酒
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '打卡失败');
      }

      setSuccess(true);

      // 3秒后跳转到仪表盘
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
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
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">打卡成功！</h2>
          <p className="text-gray-600">继续加油，你做得很好！</p>
          <p className="text-sm text-gray-500 mt-4">正在返回仪表盘...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">记录今天的状态</h2>
            <p className="text-gray-600">诚实地面对自己，这是迈向改变的第一步</p>
          </div>

          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} onDismiss={() => setError(null)} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 心情选择 */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                今天的心情如何？
              </label>
              <div className="grid grid-cols-5 gap-3">
                {moodOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMood(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      mood === option.value
                        ? option.color + ' ring-2 ring-offset-2 ring-blue-500'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-3xl mb-2">{option.emoji}</div>
                    <div className="text-sm font-medium text-gray-900">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 备注输入 */}
            <div>
              <label htmlFor="note" className="block text-lg font-semibold text-gray-900 mb-4">
                想说点什么？（可选）
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="分享今天的感受、遇到的挑战，或者任何你想说的..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={500}
              />
              <p className="text-sm text-gray-500 mt-2 text-right">{note.length}/500</p>
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading || !mood}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>提交中...</span>
                </>
              ) : (
                <>
                  <span>✅ 完成打卡</span>
                </>
              )}
            </button>
          </form>

          {/* 提示信息 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-800">
              💡 <strong>提示：</strong>每天打卡可以帮助你更好地了解自己的状态和进步。即使今天不完美，诚实地记录下来也是重要的。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
