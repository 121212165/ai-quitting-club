import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const user = await requireAuth();

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  try {
    // 获取最近的 20 条消息
    const messages = await prisma.message.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('获取消息失败:', error);
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 });
  }
}
