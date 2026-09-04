import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-handler';
import { prisma } from '@/lib/db';

export const POST = withAuth(async ({ request, user }) => {
  const body = await request.json();
  const { mood, note } = body;

  if (!mood) {
    return NextResponse.json({ error: '请选择心情' }, { status: 400 });
  }

  const checkIn = await prisma.checkIn.create({
    data: { userId: user.id, mood, note },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastCheckIn: new Date(),
      soberDays: { increment: 1 },
    },
  });

  await prisma.message.create({
    data: {
      userId: user.id,
      content: `完成今日打卡，心情：${mood}${note ? `，备注：${note}` : ''}`,
      messageType: 'check_in',
      aiGenerated: false,
    },
  });

  return NextResponse.json({ success: true, checkIn });
});
