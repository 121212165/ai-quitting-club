import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-handler';
import { prisma } from '@/lib/db';

export const POST = withAuth(async ({ request, user }) => {
  const body = await request.json();
  const { resolved } = body;

  if (typeof resolved !== 'boolean') {
    return NextResponse.json({ error: '参数错误' }, { status: 400 });
  }

  const crisis = await prisma.crisis.findFirst({
    where: { userId: user.id, resolved: false },
    orderBy: { createdAt: 'desc' },
  });

  if (crisis) {
    await prisma.crisis.update({
      where: { id: crisis.id },
      data: { resolved },
    });
  }

  if (resolved) {
    await prisma.user.update({
      where: { id: user.id },
      data: { totalRejections: { increment: 1 } },
    });

    await prisma.message.create({
      data: {
        userId: user.id,
        content: '成功顶住了诱惑！太棒了！🎉',
        messageType: 'encouragement',
        aiGenerated: true,
      },
    });
  } else {
    await prisma.message.create({
      data: {
        userId: user.id,
        content: '没关系，不要放弃。每一次尝试都让你更接近成功。💪',
        messageType: 'encouragement',
        aiGenerated: true,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { soberDays: 0 },
    });
  }

  return NextResponse.json({ success: true, resolved });
});
