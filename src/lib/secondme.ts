/**
 * Second Me API — 仅保留实际使用的功能
 */

const API_BASE_URL = process.env.SECONDME_API_BASE_URL || 'https://app.mindos.com/gate/lab';
const CLIENT_ID = process.env.SECONDME_CLIENT_ID;
const CLIENT_SECRET = process.env.SECONDME_CLIENT_SECRET;

/**
 * 通用 API 调用函数
 */
export async function callSecondMeAPI<T = unknown>(
  token: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const result = await response.json();

    if (result.code === 0) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.message || 'API 调用失败' };
    }
  } catch (error) {
    console.error('Second Me API 调用错误:', error);
    return { success: false, error: error instanceof Error ? error.message : '未知错误' };
  }
}

/**
 * 刷新 access token
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<{ access_token: string; expires_in: number } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      console.error('刷新 token 失败:', await response.text());
      return null;
    }

    const data = await response.json();

    if (data.code !== 0) {
      console.error('刷新 token 返回错误:', data);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error('刷新 token 异常:', error);
    return null;
  }
}
