import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, getValidAccessToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { callAI } from '@/lib/secondme';

const FALLBACK_MESSAGES = [
  '坚持住！你可以做到的。我们都在为你加油！',
  '这个时刻会过去的。你已经比昨天更强大了。',
  '深呼吸，想想你为什么开始这段旅程。你值得更好的生活！',
];

export async function POST(request: NextRequest) {
  const user = await requireAuth();

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  try {
    const crisis = await prisma.crisis.create({
      data: {
        userId: user.id,
        resolved: false,
        responseCount: 0,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        crisisCount: { increment: 1 },
      },
    });

    await prisma.message.create({
      data: {
        userId: user.id,
        content: '发起了危机求助，需要大家支持！',
        messageType: 'crisis',
        aiGenerated: false,
      },
    });

    // Try real AI via SecondMe
    let aiContent: string | null = null;
    const token = await getValidAccessToken(user.id);
    if (token) {
      try {
        const aiResult = await callAI(
          token,
          '我现在很想喝酒，正在经历一次 cravings 危机。请给我一些鼓励和支持，帮我度过这个时刻。'
        );
        if (aiResult.success && aiResult.data) {
          aiContent = aiResult.data as string;
        }
      } catch {
        // Fall through to hardcoded fallback
      }
    }

    // Build response messages
    const messagesToCreate = aiContent
      ? [{ content: aiContent, messageType: 'encouragement' as const, aiGenerated: true }]
      : FALLBACK_MESSAGES.map((content) => ({
          content,
          messageType: 'encouragement' as const,
          aiGenerated: true,
        }));

    const messages = await Promise.all(
      messagesToCreate.map((msg) =>
        prisma.message.create({
          data: { userId: user.id, ...msg },
        })
      )
    );

    return NextResponse.json({ success: true, crisis, messages });
  } catch (error) {
    console.error('危机求助失败:', error);
    return NextResponse.json({ error: '求助失败，请重试' }, { status: 500 });
  }
}
