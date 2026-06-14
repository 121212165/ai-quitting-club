'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

interface AIMessage {
  id: string;
  content: string;
  fromAI: boolean;
  timestamp: Date;
}

export default function CrisisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [helpRequested, setHelpRequested] = useState(false);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [crisisResolved, setCrisisResolved] = useState<boolean | null>(null);

  useEffect(() => {
    const initialMessages: AIMessage[] = [
      {
        id: '1',
        content: '记住，每一个不喝酒的时刻都是一次胜利。你已经迈出了最重要的一步——寻求帮助。',
        fromAI: true,
        timestamp: new Date(),
      },
    ];
    setAiMessages(initialMessages);
  }, []);

  const handleRequestHelp = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/crisis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '请求失败');
      }

      const data = await response.json();

      // 添加返回的消息
      if (data.messages && Array.isArray(data.messages)) {
        const newMessages: AIMessage[] = data.messages.map((msg: any, index: number) => ({
          id: `ai-${Date.now()}-${index}`,
          content: msg.content || '我们在这里支持你！',
          fromAI: true,
          timestamp: new Date(msg.createdAt || Date.now()),
        }));
        setAiMessages((prev) => [...prev, ...newMessages]);
      }

      setHelpRequested(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleResolved = async (resolved: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/crisis/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resolved,
        }),
      });

      if (!response.ok) {
        throw new Error('记录失败');
      }

      setCrisisResolved(resolved);

      // 2秒后跳转
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '记录失败，请重试');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
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
            <h1 className="text-2xl font-bold text-gray-900">危机求助</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 成功/失败提示 */}
        {crisisResolved !== null && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">
              {crisisResolved ? '🎉' : '💪'}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {crisisResolved ? '太棒了！你成功了！' : '没关系，明天是新的一天'}
            </h2>
            <p className="text-gray-600">
              {crisisResolved
                ? '每一次拒绝诱惑都是胜利，继续保持！'
                : '不要放弃，每一次尝试都让你更接近成功。'}
            </p>
            <p className="text-sm text-gray-500 mt-4">正在返回仪表盘...</p>
          </div>
        )}

        {/* 主要内容 */}
        {crisisResolved === null && (
          <>
            {/* 主求助区域 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-center mb-8">
                <div className="text-7xl mb-4">🤝</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">我们在这里支持你</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  你不孤单。无论遇到什么困难，我们都愿意帮助你。寻求帮助是勇敢的表现，
                  不是弱点。
                </p>
              </div>

              {error && (
                <div className="mb-6">
                  <ErrorMessage message={error} onDismiss={() => setError(null)} />
                </div>
              )}

              {!helpRequested ? (
                <button
                  onClick={handleRequestHelp}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-6 rounded-xl font-bold text-xl hover:from-red-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="md" color="white" />
                      <span>正在获取帮助...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl">🆘</span>
                      <span>立即求助</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-3">💚</div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">帮助正在路上</h3>
                  <p className="text-green-700">
                    鼓励和支持正在路上，你不是一个人在战斗。
                  </p>
                </div>
              )}
            </div>

            {/* AI 鼓励消息区域 */}
            {helpRequested && aiMessages.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span>💬</span>
                    <span>来自互助会的鼓励</span>
                  </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {aiMessages.map((message) => (
                    <div
                      key={message.id}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-4 rounded-r-lg"
                    >
                      <p className="text-gray-900 mb-2">{message.content}</p>
                      <p className="text-xs text-gray-500">
                        {message.timestamp.toLocaleString('zh-CN')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 结果反馈按钮 */}
            {helpRequested && crisisResolved === null && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  结果如何？
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => handleResolved(true)}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-3xl mb-2">🎉</div>
                    <div>我成功顶住了！</div>
                  </button>
                  <button
                    onClick={() => handleResolved(false)}
                    disabled={loading}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-3xl mb-2">😔</div>
                    <div>还是喝了...</div>
                  </button>
                </div>
                <p className="text-center text-sm text-gray-600 mt-6">
                  💡 无论结果如何，诚实面对自己都是进步。不要放弃！
                </p>
              </div>
            )}

            {/* 紧急资源 */}
            <div className="mt-8 bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                <span>📞</span>
                <span>需要更多帮助？</span>
              </h4>
              <ul className="space-y-2 text-sm text-red-800">
                <li>• 如果你感到绝望或有伤害自己的想法，请立即联系当地急救服务</li>
                <li>• 戒酒热线：12320（全国公共卫生热线）</li>
                <li>• 心理援助热线：400-161-9995</li>
              </ul>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
