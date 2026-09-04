import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-handler';

export const GET = withAuth(async ({ user }) => {
  return NextResponse.json({
    stats: {
      nickname: user.nickname,
      soberDays: user.soberDays,
      totalRejections: user.totalRejections,
      crisisCount: user.crisisCount,
      lastCheckIn: user.lastCheckIn,
    },
  });
});
