import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-handler';
import { prisma } from '@/lib/db';

export const GET = withAuth(async ({ user }) => {
  const messages = await prisma.message.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return NextResponse.json({ messages });
});
