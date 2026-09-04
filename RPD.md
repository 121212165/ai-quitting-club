# AI 戒酒互助会 — 产品需求文档 (RPD)

## 1. 产品概述

基于 Second Me OAuth 身份认证的戒酒互助社区。用户通过每日打卡记录状态、浏览排行榜获得动力、在危机时刻一键求助。平台通过群体鼓励和进度追踪帮助用户保持戒酒决心。

## 2. 用户角色

| 角色 | 说明 |
|------|------|
| 普通用户 | 拥有 Second Me 账号的用户，登录后可打卡、查看仪表盘、发起危机求助 |

认证方式：Second Me OAuth2 授权码流程。无管理员角色。

## 3. 当前功能

| 功能 | 状态 | 说明 |
|------|------|------|
| OAuth 登录/登出 | ✅ 完成 | Second Me 授权码流程，30 天 cookie 会话 |
| 每日打卡 | ✅ 完成 | 5 级心情选择 + 可选备注，打卡即增加戒酒天数 |
| 用户仪表盘 | ✅ 完成 | 统计卡片（天数/拒绝次数/危机次数）+ 排行榜 Top 10 + 消息流 |
| 危机求助 | ✅ 完成 | 一键求助，记录危机，结果反馈（顶住/放弃） |
| 成就系统 | ❌ 未实现 | 数据库模型已删除，待重新设计 |
| AI 互动 | ❌ 未实现 | 原硬编码模拟已清除，待真实 AI 接 |

## 4. 数据模型

```
User
  - id, secondmeUserId (unique)
  - nickname, soberDays, startDate
  - lastCheckIn, totalRejections, crisisCount
  - accessToken, refreshToken, tokenExpiresAt

CheckIn
  - id, userId → User
  - mood, note
  - date (auto)

Crisis
  - id, userId → User
  - resolved (bool), responseCount
  - aiResponseSummary?

Message
  - id, userId → User
  - content, messageType (check_in/encouragement/crisis/share)
  - aiGenerated (bool)
```

## 5. API 路由

```
POST /api/auth/login          → OAuth 重定向
GET  /api/auth/callback       → OAuth 回调，创建用户
POST /api/auth/logout         → 清除会话
GET  /api/auth/me             → 当前用户信息

POST /api/checkin             → 创建打卡
POST /api/crisis              → 发起危机求助
POST /api/crisis/resolve      → 反馈危机结果

GET  /api/dashboard/stats     → 用户统计
GET  /api/dashboard/leaderboard → 排行榜 Top 10
GET  /api/dashboard/messages  → 消息流
```

## 6. 前端页面

```
/               → 着陆页 + 登录入口
/dashboard      → 仪表盘（统计 + 排行榜 + 消息）
/checkin        → 每日打卡表单
/crisis         → 危机求助
```

## 7. 技术栈

- **框架**: Next.js 15 (App Router) + React 19 + TypeScript 5
- **数据库**: SQLite via Prisma 6
- **认证**: Second Me OAuth2
- **样式**: Tailwind CSS 3
- **部署**: Vercel

## 8. 待规划功能（未实现，不保证优先级）

- 成就系统 — 基于戒酒天数和打卡次数的成就徽章
- 打卡历史 — 查看历史打卡记录和趋势
- AI 鼓励消息 — 接入真实 AI 生成个性化鼓励
- 多人互助 — 用户之间可见和互动
- 连续打卡统计 — 最长连续天数追踪
- 数据导出 — 用户可导出自己的打卡数据
