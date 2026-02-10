'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  nickname: string;
  soberDays: number;
  totalRejections: number;
  crisisCount: number;
  lastCheckIn: string | null;
}

interface Message {
  id: string;
  user: {
    nickname: string;
  };
  content: string;
  createdAt: string;
}

interface LeaderboardUser {
  nickname: string;
  soberDays: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 并行获取所有数据
      const [statsRes, leaderboardRes, messagesRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/leaderboard'),
        fetch('/api/dashboard/messages?limit=20'),
      ]);

      const [statsData, leaderboardData, messagesData] = await Promise.all([
        statsRes.json(),
        leaderboardRes.json(),
        messagesRes.json(),
      ]);

      if (statsData.user) setUser(statsData.user);
      if (leaderboardData.users) setLeaderboard(leaderboardData.users);
      if (messagesData.messages) setMessages(messagesData.messages);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">请先登录</p>
          <Link href="/" className="text-primary-500 hover:text-primary-600">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🍃</span>
            <h1 className="text-2xl font-bold text-gray-900">AI 戒酒互助会</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user.nickname}</span>
            <Link href="/api/auth/logout" className="text-sm text-gray-500 hover:text-gray-700">
              登出
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* 用户统计卡片 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-500 mb-2">{user.soberDays}</div>
              <div className="text-gray-600">已戒天数</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-500 mb-2">{user.totalRejections}</div>
              <div className="text-gray-600">累计拒绝诱惑</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">{user.crisisCount}</div>
              <div className="text-gray-600">求助次数</div>
            </div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/checkin"
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-center">
              <div className="text-5xl mb-3">👍</div>
              <div className="text-xl font-semibold text-gray-900 mb-2">每日打卡</div>
              <div className="text-gray-600 text-sm">记录今天的戒酒情况</div>
            </div>
          </Link>

          <Link
            href="/crisis"
            className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow border-2 border-red-200"
          >
            <div className="text-center">
              <div className="text-5xl mb-3">😰</div>
              <div className="text-xl font-semibold text-gray-900 mb-2">危机求助</div>
              <div className="text-gray-600 text-sm">你现在很想喝酒？</div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 排行榜 */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🏆 戒酒排行榜</h2>
            <div className="space-y-3">
              {leaderboard.map((u, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    u.nickname === user.nickname ? 'bg-primary-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl font-bold text-gray-500 w-8">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </span>
                    <span className={u.nickname === user.nickname ? 'font-semibold' : ''}>
                      {u.nickname}
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-primary-500">{u.soberDays} 天</span>
                </div>
              ))}
            </div>
          </div>

          {/* 互助会消息 */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">💬 互助会消息</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">暂无消息</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{msg.user.nickname}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleString('zh-CN')}
                      </span>
                    </div>
                    <p className="text-gray-700">{msg.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
