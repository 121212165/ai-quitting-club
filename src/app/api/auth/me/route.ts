import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-handler';

export const GET = withAuth(async ({ user }) => {
  return NextResponse.json({
    user: {
      id: user.id,
      nickname: user.nickname,
      soberDays: user.soberDays,
    },
  });
});
