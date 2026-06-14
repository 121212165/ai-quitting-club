export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">🍃</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            戒酒互助会
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            记录每一天，度过危机时刻，和其他人一起坚持
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">每日打卡</h3>
            <p className="text-gray-600">
              每天记录是否喝酒，追踪你的戒酒天数
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="text-4xl mb-4">🆘</div>
            <h3 className="text-xl font-semibold mb-2">危机求助</h3>
            <p className="text-gray-600">
              当你想喝酒时，立即获取鼓励和支持
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">排行榜</h3>
            <p className="text-gray-600">
              看看谁坚持得最久，互相激励
            </p>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/api/auth/login"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-md"
          >
            加入互助会
          </a>
          <p className="mt-4 text-sm text-gray-500">
            使用 Second Me 账号登录
          </p>
        </div>
      </div>
    </main>
  );
}
