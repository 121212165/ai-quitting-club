import { cookies } from 'next/headers';
import { prisma } from './db';

/**
 * 从 cookie 获取当前用户
 * @returns 用户对象或 null
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user;
  } catch (error) {
    console.error('获取当前用户失败:', error);
    return null;
  }
}

/**
 * 需要认证的函数，未登录返回 null
 * @returns 用户对象或 null
 */
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  // 检查 token 是否过期
  if (user.tokenExpiresAt < new Date()) {
    console.warn('用户 token 已过期');
    return null;
  }

  return user;
}

/**
 * 获取用户的 access token，如果需要则刷新
 * @param userId 用户 ID
 * @returns 有效的 access token 或 null
 */
export async function getValidAccessToken(userId: string): Promise<string | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    // 如果 token 未过期，直接返回
    if (user.tokenExpiresAt > new Date()) {
      return user.accessToken;
    }

    // token 已过期，需要刷新
    const { refreshAccessToken } = await import('./secondme');
    const newToken = await refreshAccessToken(user.refreshToken);

    if (!newToken) {
      return null;
    }

    // 更新数据库中的 token
    await prisma.user.update({
      where: { id: userId },
      data: {
        accessToken: newToken.access_token,
        tokenExpiresAt: new Date(Date.now() + newToken.expires_in * 1000),
      },
    });

    return newToken.access_token;
  } catch (error) {
    console.error('获取有效 access token 失败:', error);
    return null;
  }
}
