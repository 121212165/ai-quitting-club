import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.SECONDME_CLIENT_ID;
  const redirectUri = process.env.SECONDME_REDIRECT_URI;
  const oauthUrl = process.env.SECONDME_OAUTH_URL;

  if (!clientId || !redirectUri || !oauthUrl) {
    return NextResponse.json({ error: 'Missing OAuth configuration' }, { status: 500 });
  }

  // 生成随机 state
  const state = Math.random().toString(36).substring(2, 15);

  // 构建 OAuth 授权 URL
  // OAuth URL 格式: https://go.second.me + /oauth/authorize
  const baseUrl = oauthUrl.endsWith('/') ? oauthUrl.slice(0, -1) : oauthUrl;
  const authUrl = new URL(`${baseUrl}/oauth/authorize`);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'user.info user.info.shades user.info.softmemory chat note.add');
  authUrl.searchParams.set('state', state);

  // 设置 state 到 cookie
  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 分钟
  });

  return response;
}
