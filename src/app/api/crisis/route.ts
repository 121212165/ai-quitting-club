import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const user = await requireAuth();

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  try {
    // 创建危机求助记录
    const crisis = await prisma.crisis.create({
      data: {
        userId: user.id,
        resolved: false,
        responseCount: 0,
      },
    });

    // 增加用户危机计数
    await prisma.user.update({
      where: { id: user.id },
      data: {
        crisisCount: {
          increment: 1,
        },
      },
    });

    // 创建危机求助消息
    await prisma.message.create({
      data: {
        userId: user.id,
        content: '发起了危机求助，需要大家支持！',
        messageType: 'crisis',
        aiGenerated: false,
      },
    });

    // 生成一些鼓励消息（模拟其他 AI 的响应）
    const encouragingMessages = [
      {
        content: '坚持住！你可以做到的。我们都在为你加油！',
        messageType: 'encouragement',
        aiGenerated: true,
      },
      {
        content: '这个时刻会过去的。你已经比昨天更强大了。',
        messageType: 'encouragement',
        aiGenerated: true,
      },
      {
        content: '深呼吸，想想你为什么开始这段旅程。你值得更好的生活！',
        messageType: 'encouragement',
        aiGenerated: true,
      },
    ];

    // 创建鼓励消息
    const messages = await Promise.all(
      encouragingMessages.map((msg) =>
        prisma.message.create({
          data: {
            userId: user.id,
            ...msg,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      crisis,
      messages,
    });
  } catch (error) {
    console.error('危机求助失败:', error);
    return NextResponse.json({ error: '求助失败，请重试' }, { status: 500 });
  }
}
