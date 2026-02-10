import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // 清除 session cookie
  response.cookies.delete('user_id');

  return response;
}
