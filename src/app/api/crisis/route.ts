import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-handler';
import { prisma } from '@/lib/db';

export const POST = withAuth(async ({ user }) => {
  const crisis = await prisma.crisis.create({
    data: { userId: user.id, resolved: false },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { crisisCount: { increment: 1 } },
  });

  return NextResponse.json({ success: true, crisis });
});
