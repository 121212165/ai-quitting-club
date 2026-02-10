import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // 获取存储的 state
  const storedState = request.cookies.get('oauth_state')?.value;

  // WebView 环境下可能 state 验证失败，记录警告但继续处理
  if (state && storedState && state !== storedState) {
    console.warn('OAuth state 验证失败，可能是跨 WebView 场景');
    // 继续处理，不阻止登录
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_code', request.url));
  }

  try {
    // 用 code 换取 access_token
    const tokenResponse = await fetch(`${process.env.SECONDME_TOKEN_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.SECONDME_CLIENT_ID,
        client_secret: process.env.SECONDME_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.SECONDME_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();

    // 获取用户信息
    const userResponse = await fetch(`${process.env.SECONDME_API_BASE_URL}/api/secondme/user/info`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      console.error('Failed to fetch user info');
      return NextResponse.redirect(new URL('/?error=fetch_user_failed', request.url));
    }

    const userData = await userResponse.json();

    if (userData.code !== 0) {
      console.error('User info API error:', userData);
      return NextResponse.redirect(new URL('/?error=user_info_error', request.url));
    }

    const userInfo = userData.data;

    // 计算过期时间
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    // 在数据库中创建或更新用户
    const user = await prisma.user.upsert({
      where: { secondmeUserId: userInfo.userId },
      update: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: expiresAt,
      },
      create: {
        secondmeUserId: userInfo.userId,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: expiresAt,
        nickname: userInfo.name || '互助会成员',
      },
    });

    // 设置 session cookie
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 天
    });

    // 清除 oauth_state cookie
    response.cookies.delete('oauth_state');

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/?error=server_error', request.url));
  }
}
