'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

interface UserStats {
  nickname: string;
  soberDays: number;
  totalRejections: number;
  crisisCount: number;
  lastCheckIn: string | null;
}

interface LeaderboardUser {
  nickname: string;
  soberDays: number;
}

interface Message {
  id: string;
  content: string;
  messageType: string;
  createdAt: string;
  aiGenerated: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // 检查用户是否登录
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('检查登录状态失败:', error);
        router.push('/');
        return;
      }
    };

    // 获取仪表盘数据
    const fetchData = async () => {
      try {
        // 并行请求所有数据
        const [statsRes, leaderboardRes, messagesRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/leaderboard'),
          fetch('/api/dashboard/messages')
        ]);

        if (!statsRes.ok || !leaderboardRes.ok || !messagesRes.ok) {
          throw new Error('获取数据失败');
        }

        const [statsData, leaderboardData, messagesData] = await Promise.all([
          statsRes.json(),
          leaderboardRes.json(),
          messagesRes.json()
        ]);

        setUserStats(statsData.stats);
        setLeaderboard(leaderboardData.leaderboard);
        setMessages(messagesData.messages);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据失败');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchData();
  }, [router]);

  const handleCheckIn = () => {
    router.push('/checkin');
  };

  const handleCrisis = () => {
    router.push('/crisis');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">戒酒互助会</h1>
              <p className="text-sm text-gray-600 mt-1">
                欢迎回来，{userStats?.nickname}
              </p>
            </div>
            <button
              onClick={() => router.push('/api/auth/logout')}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              登出
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 用户统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">已戒天数</p>
                <p className="text-3xl font-bold text-blue-600">{userStats?.soberDays || 0}</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">拒绝诱惑</p>
                <p className="text-3xl font-bold text-green-600">{userStats?.totalRejections || 0}</p>
              </div>
              <div className="text-4xl">💪</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">危机次数</p>
                <p className="text-3xl font-bold text-orange-600">{userStats?.crisisCount || 0}</p>
              </div>
              <div className="text-4xl">🆘</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">最后打卡</p>
                <p className="text-sm font-medium text-gray-900">
                  {userStats?.lastCheckIn
                    ? new Date(userStats.lastCheckIn).toLocaleDateString('zh-CN')
                    : '尚未打卡'}
                </p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={handleCheckIn}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all hover:from-blue-600 hover:to-blue-700"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-2xl font-bold mb-2">每日打卡</h3>
              <p className="text-blue-100">记录今天的心情和状态</p>
            </div>
          </button>

          <button
            onClick={handleCrisis}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all hover:from-red-600 hover:to-pink-700"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">🆘</div>
              <h3 className="text-2xl font-bold mb-2">危机求助</h3>
              <p className="text-red-100">当我们在这里支持你</p>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 排行榜 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🏆 戒酒排行榜</h2>
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                    </span>
                    <span className="font-medium text-gray-900">{user.nickname}</span>
                  </div>
                  <span className="text-blue-600 font-bold">{user.soberDays} 天</span>
                </div>
              ))}
            </div>
          </div>

          {/* 互助会消息 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">💬 互助会消息</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg ${
                    message.aiGenerated
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : 'bg-green-50 border-l-4 border-green-500'
                  }`}
                >
                  <p className="text-gray-900 mb-2">{message.content}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(message.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
