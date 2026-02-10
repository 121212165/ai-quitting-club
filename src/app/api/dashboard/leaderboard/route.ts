import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const user = await requireAuth();

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  try {
    // 获取排行榜（按戒酒天数排序，取前 10 名）
    const leaderboard = await prisma.user.findMany({
      select: {
        nickname: true,
        soberDays: true,
      },
      orderBy: {
        soberDays: 'desc',
      },
      take: 10,
    });

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('获取排行榜失败:', error);
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 });
  }
}
