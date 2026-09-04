import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from './auth';

type HandlerContext = {
  request: NextRequest;
  user: NonNullable<Awaited<ReturnType<typeof requireAuth>>>;
};

type RouteHandler = (request: NextRequest) => Promise<NextResponse>;

/**
 * 包装需要认证的 API 路由，自动处理：
 * - 未登录 → 401
 * - 异常 → 500 + 日志
 */
export function withAuth(
  handler: (ctx: HandlerContext) => Promise<NextResponse>
): RouteHandler {
  return async (request) => {
    const user = await requireAuth();

    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    try {
      return await handler({ request, user });
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
    }
  };
}
