import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const user = await requireAuth();

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  try {
    // 获取用户统计信息
    const stats = {
      nickname: user.nickname,
      soberDays: user.soberDays,
      totalRejections: user.totalRejections,
      crisisCount: user.crisisCount,
      lastCheckIn: user.lastCheckIn,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 });
  }
}
