/**
 * Second Me API 工具函数
 */

const API_BASE_URL = process.env.SECONDME_API_BASE_URL || 'https://app.mindos.com/gate/lab';
const CLIENT_ID = process.env.SECONDME_CLIENT_ID;
const CLIENT_SECRET = process.env.SECONDME_CLIENT_SECRET;

/**
 * 通用 API 调用函数
 * @param token Access token
 * @param endpoint API 端点
 * @param options Fetch 选项
 * @returns API 响应数据
 */
export async function callSecondMeAPI<T = any>(
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
 * @param refreshToken Refresh token
 * @returns 新的 token 信息或 null
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

/**
 * 获取用户信息
 * @param token Access token
 * @returns 用户信息或 null
 */
export async function getUserInfo(token: string) {
  return callSecondMeAPI(token, '/api/secondme/user/info');
}

/**
 * 调用 AI 聊天
 * @param token Access token
 * @param message 用户消息
 * @returns AI 响应
 */
export async function callAI(token: string, message: string) {
  return callSecondMeAPI(token, '/api/secondme/chat/completions', {
    method: 'POST',
    body: JSON.stringify({
      message,
    }),
  });
}

/**
 * 调用 AI 动作判断
 * 用于判断用户是否需要帮助
 * @param token Access token
 * @param actionControl 动作控制参数
 * @returns AI 判断结果
 */
export async function callAIAct(token: string, actionControl: string) {
  return callSecondMeAPI(token, '/api/secondme/act', {
    method: 'POST',
    body: JSON.stringify({
      actionControl,
    }),
  });
}

/**
 * 添加笔记
 * @param token Access token
 * @param content 笔记内容
 * @returns 结果
 */
export async function addNote(token: string, content: string) {
  return callSecondMeAPI(token, '/api/secondme/note/add', {
    method: 'POST',
    body: JSON.stringify({
      content,
    }),
  });
}

/**
 * 获取用户的 Shades 数据（情感数据）
 * @param token Access token
 * @returns Shades 数据
 */
export async function getShades(token: string) {
  return callSecondMeAPI(token, '/api/secondme/user/info/shades');
}

/**
 * 获取用户的 SoftMemory 数据（记忆数据）
 * @param token Access token
 * @returns SoftMemory 数据
 */
export async function getSoftMemory(token: string) {
  return callSecondMeAPI(token, '/api/secondme/user/info/softmemory');
}
