import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const user = await requireAuth();

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { resolved } = body;

    if (typeof resolved !== 'boolean') {
      return NextResponse.json({ error: '参数错误' }, { status: 400 });
    }

    // 更新最新的未解决的危机记录
    const crisis = await prisma.crisis.findFirst({
      where: {
        userId: user.id,
        resolved: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (crisis) {
      await prisma.crisis.update({
        where: { id: crisis.id },
        data: {
          resolved,
        },
      });
    }

    // 如果成功顶住诱惑，增加拒绝次数
    if (resolved) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          totalRejections: {
            increment: 1,
          },
        },
      });

      // 创建成功消息
      await prisma.message.create({
        data: {
          userId: user.id,
          content: '成功顶住了诱惑！太棒了！🎉',
          messageType: 'encouragement',
          aiGenerated: true,
        },
      });
    } else {
      // 创建鼓励消息
      await prisma.message.create({
        data: {
          userId: user.id,
          content: '没关系，不要放弃。每一次尝试都让你更接近成功。💪',
          messageType: 'encouragement',
          aiGenerated: true,
        },
      });

      // 重置戒酒天数（如果需要）
      await prisma.user.update({
        where: { id: user.id },
        data: {
          soberDays: 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      resolved,
    });
  } catch (error) {
    console.error('记录危机结果失败:', error);
    return NextResponse.json({ error: '记录失败，请重试' }, { status: 500 });
  }
}
