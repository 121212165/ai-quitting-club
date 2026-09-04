import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-handler';
import { prisma } from '@/lib/db';

export const GET = withAuth(async () => {
  const leaderboard = await prisma.user.findMany({
    select: { nickname: true, soberDays: true },
    orderBy: { soberDays: 'desc' },
    take: 10,
  });

  return NextResponse.json({ leaderboard });
});
