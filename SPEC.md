# SPEC · AI 视频/图像生成聚合站

> 产品开发文档 — 严格可落地
> 版本: v1.0 · 2026-05-12

---

## 目录

1. [产品概述](#1-产品概述)
2. [页面规格](#2-页面规格)
3. [API 路由](#3-api-路由)
4. [数据流](#4-数据流)
5. [组件树](#5-组件树)
6. [状态管理](#6-状态管理)
7. [错误处理](#7-错误处理)
8. [边界情况](#8-边界情况)
9. [SEO/GEO](#9-seogeo)
10. [i18n](#10-i18n)

---

## 1. 产品概述

### 1.1 一句话定位

一个 AI 视频/图像生成聚合平台 — 用户一次订阅，使用多个顶尖 AI 模型。

### 1.2 核心用户旅程

```
访问首页 → 浏览模型/模板 → 注册 (Google OAuth) → 获得免费 Credits → 选择模型 →
输入 Prompt → 生成视频 → 查看结果 → 下载/分享 → Credits 用完 → 查看定价 →
订阅 → 继续生成
```

### 1.3 关键页面

| 页面 | 路由 | 类型 | 目的 |
|------|------|------|------|
| 首页 | `/` | 营销落地 (SSG) | SEO 流量 + 产品介绍 |
| 模型详情 | `/models/[id]` | 营销落地 (SSG) | 单个模型 SEO |
| 模板列表 | `/templates` | 营销/工具 (SSG) | 模板 SEO |
| 模板详情 | `/templates/[id]` | 营销/工具 (SSG) | 模板 SEO + 快捷生成 |
| 生成工作台 | `/generate` | 产品核心 (CSR) | 视频生成 |
| 生成结果 | `/generate/[id]` | 产品核心 (CSR) | 查看/下载 |
| 定价 | `/pricing` | 转化 (ISR) | 订阅购买 |
| 历史 | `/history` | 产品功能 (CSR) | 历史管理 |
| 账户 | `/account` | 产品功能 (CSR) | 设置/订阅管理 |
| 常见问题 | `/faq` | 营销 (SSG) | SEO + 信任度 |
| 隐私/条款 | `/privacy`, `/terms` | 法律 (SSG) | 过审合规 |

### 1.4 用户角色

| 角色 | 权限 |
|------|------|
| 未登录访客 | 浏览首页/模型/模板/定价/FAQ，不能生成 |
| 已登录 Free | 有限 Credits (赠送)，1 个并行任务 |
| 已登录 Lite | 月付，更多 Credits，2 个并行 |
| 已登录 Pro | 月付/年付，大量 Credits，3 个并行 |
| 已登录 Premium | 年付，无限 Credits（软限制），5 个并行 |

---

## 2. 页面规格

### 2.1 首页 `/`

**布局 (从上到下 7 屏):**

```
┌─────────────────────────────────┐
│  导航栏 (sticky, 透明→solid)     │
│  Logo | 模型 | 模板 | 定价 | 登录/头像 │
├─────────────────────────────────┤
│  第 1 屏: Hero                   │
│  - h1: "One Subscription, All AI" │
│  - 副标题: 产品定位一句话           │
│  - CTA: "Start Creating →"       │
│  - 背景: 自动播放的 AI 生成视频合集 │
├─────────────────────────────────┤
│  第 2 屏: 生成面板预览            │
│  - 左侧输入区截图/动画             │
│  - 右侧预览区截图                 │
│  - "左侧 prompt, 右侧预览" 布局说明 │
├─────────────────────────────────┤
│  第 3 屏: 模型列表                │
│  - 每个模型卡片: icon + 名称 + 简介 │
│  - 点击跳转 /models/[id]         │
├─────────────────────────────────┤
│  第 4 屏: 功能亮点 (2-3 个)       │
│  - 多模型聚合 / 高质量输出 / 快速生成 │
├─────────────────────────────────┤
│  第 5 屏: 使用场景                │
│  - 广告 / 短剧 / 社交媒体 / 电商  │
├─────────────────────────────────┤
│  第 6 屏: 使用步骤 (3 步)         │
│  ① 选模型 → ② 写 Prompt → ③ 生成 │
├─────────────────────────────────┤
│  第 7 屏: FAQ 折叠面板            │
│  - 5-8 个常见问题                 │
├─────────────────────────────────┤
│  底部                            │
│  Logo + 模型链接 + 隐私/条款 + 社媒 │
└─────────────────────────────────┘
```

**状态:**
- **正常**: 所有内容渲染，Hero 背景视频自动播放
- **加载**: Skeleton (首页内容区)
- **错误**: 不展示（SSG 页面，构建时生成）
- **空**: 不存在（内容由构建决定）

### 2.2 模型详情 `/models/[id]`

```
┌─────────────────────────────────┐
│  导航栏 (sticky)                 │
├─────────────────────────────────┤
│  Hero: 模型名 + Provider 标签 + 介绍 │
│  示例视频/图片轮播                │
├─────────────────────────────────┤
│  Prompt 输入区                   │
│  - textarea + 参数面板           │
│  - "开始生成" CTA (→ 登录检查)   │
├─────────────────────────────────┤
│  本模型支持的参数                 │
│  分辨率 / 时长 / 风格 等          │
├─────────────────────────────────┤
│  底部 / FAQ / 相关模型            │
└─────────────────────────────────┘
```

**状态:**
- **加载**: 页面 skeleton
- **正常**: 内容渲染
- **错误**: "模型不存在" 404 页
- **模型下线**: badge "暂时不可用" + 推荐替代模型

### 2.3 生成工作台 `/generate`

**这是最复杂的页面，需要详细展开：**

```
┌──────────────────────────────────────────────────┐
│  导航栏 (紧凑模式)                                  │
├──────────────────────┬───────────────────────────┤
│  左侧面板 (360px)    │  右侧预览区 (flex-1)       │
│                      │                           │
│  模型选择 ↓           │  ┌─────────────────────┐  │
│  [Kling 2.5 ▼]      │  │                     │  │
│                      │  │  预览区域            │  │
│  Prompt 输入          │  │  - 空状态: 模型 Logo  │  │
│  ┌────────────────┐  │  │  - 生成中: Spinner   │  │
│  │                │  │  │  + 进度条 + 预估时间  │  │
│  │                │  │  │  - 完成: 视频播放器  │  │
│  └────────────────┘  │  │                     │  │
│                      │  └─────────────────────┘  │
│  参数面板             │                           │
│  比例: [16:9][1:1][9:16]│                        │
│  时长: [5s][10s][15s] │                           │
│  风格: [超现实][电影][动画]│                       │
│                      │                           │
│  Credits: 1,234 💎   │                           │
│                      │                           │
│  [✨ 生成视频]         │                           │
│  按钮状态: 余额不足时禁用 │                         │
└──────────────────────┴───────────────────────────┘
```

**三种关键状态:**

**空状态:**
- 预览区: 居中的模型 logo 或 icon + "输入 prompt 开始创作"
- 左侧面板默认选第一个模型
- Prompt 输入框 placeholder: "Describe the video you want to create..."
- 按钮: 禁用 (无输入)

**生成中:**
```
左侧面板:
  - 按钮: loading spinner + "Generating..."
  - 所有输入 disabled
  - 进度条显示百分比
  - "预计 15-30 秒"
  
右侧预览:
  - 全屏暗色背景
  - 居中 pulsating spinner
  - 底部: 进度条 + 当前阶段
    "Analyzing prompt..."
    "Generating frames..."
    "Finalizing..."
```

**完成:**
```
左侧面板:
  - 按钮: "再生" (re-generate)
  - 输入恢复可编辑
  - 原本的 prompt 保留
  - "重新生成" 会创建新的 generation
  
右侧预览:
  - 视频播放器
  - 控件: 播放/暂停 | 进度条 | 音量 | 全屏
  - 下方操作栏:
    [下载] [分享链接] [复制 Prompt] [删除]
```

**错误状态:**
- API 错误: toast "生成失败，已退还 Credits" + 按钮恢复
- 余额不足: 按钮禁用 + "Credits 不足" + "去充值" 链接
- 内容违规: toast "请修改你的 Prompt" + 不扣 Credits

### 2.4 定价页 `/pricing`

```
┌─────────────────────────────────┐
│  导航栏                          │
├─────────────────────────────────┤
│  h1: "Simple Pricing"           │
│  切换: [每月] [每年] (年省 20%)  │
├─────────────────────────────────┤
│  卡片网格 (3-4 列)              │
│                                 │
│  Free        Lite       Pro     │
│  $0         $9.99/mo   $29.99/mo│
│  50 Credits  500 Cr     2000 Cr │
│  1 并行      2 并行      3 并行    │
│  7天保留     长期保留     长期保留  │
│  [开始]      [订阅]       [订阅]   │
│  最受欢迎 ⭐                    │
│                                 │
│  Premium: $79.99/mo, 无限 Credits │
├─────────────────────────────────┤
│  FAQ: 付款/退款/取消 相关问题      │
│  底部                            │
└─────────────────────────────────┘
```

**状态:**
- **加载**: 卡片 skeleton
- **正常**: 卡片网格
- **已登录+已订阅**: 按钮显示 "当前方案" / "升级" / "降级"
- **错误**: toast "加载定价失败，请刷新"

### 2.5 历史记录 `/history`

```
┌─────────────────────────────────┐
│  导航栏                          │
├─────────────────────────────────┤
│  h1: "My Generations"           │
│  筛选: [全部] [视频] [图片] [星标] │
├─────────────────────────────────┤
│  网格/列表切换                    │
│                                 │
│  ┌────┐ ┌────┐ ┌────┐          │
│  │vid1│ │vid2│ │vid3│          │
│  │     │ │     │ │     │        │
│  └────┘ └────┘ └────┘          │
│  下方: 模型 + 时间 + 状态 + 下载  │
│                                 │
│  分页 / 加载更多                  │
└─────────────────────────────────┘
```

**状态:**

| 状态 | 展示 |
|------|------|
| **加载** | 卡片网格 skeleton (6 个) |
| **空** | 居中插图 + "还没有生成作品" + "开始创作 →" CTA |
| **正常** | 卡片网格，每卡带缩略图/模型标签/时间 |
| **分页加载** | 底部 spinner + "加载更多" |
| **全部加载** | "已显示全部 N 条" |
| **错误** | toast "加载失败" + 重试按钮 |

### 2.6 账户页 `/account`

```
┌─────────────────────────────────┐
│  导航栏                          │
├─────────────────────────────────┤
│  个人资料: 头像 + 名称 + 邮箱    │
├─────────────────────────────────┤
│  Credits: 1,234 💎              │
│  [充值 Credits]                 │
├─────────────────────────────────┤
│  当前方案: Pro · 每月续费         │
│  下次续费: 2026-06-12            │
│  [管理订阅] [取消订阅]            │
├─────────────────────────────────┤
│  设置: 语言 / 通知 / 深色模式     │
│  危险操作: [删除账号]            │
└─────────────────────────────────┘
```

---

## 3. API 路由

### 3.1 路由总表

| Method | Path | Auth | 描述 |
|--------|------|------|------|
| POST | `/api/auth/login` | — | Google OAuth 登录 |
| POST | `/api/auth/logout` | — | 登出 |
| GET | `/api/auth/me` | ✅ | 获取当前用户 |
| POST | `/api/generate` | ✅ | 创建生成任务 |
| GET | `/api/generations` | ✅ | 历史记录列表 |
| GET | `/api/generations/[id]` | ✅ | 单条生成状态 |
| DELETE | `/api/generations/[id]` | ✅ | 删除生成记录 |
| GET | `/api/models` | — | 模型列表 (公开) |
| GET | `/api/models/[id]` | — | 模型详情 (公开) |
| GET | `/api/templates` | — | 模板列表 (公开) |
| GET | `/api/templates/[id]` | — | 模板详情 (公开) |
| POST | `/api/webhook/fal` | 密钥 | fal.ai 完成回调 |
| POST | `/api/webhook/creem` | 密钥 | Creem.io 支付回调 |
| GET | `/api/user/credits` | ✅ | 查余额 |
| POST | `/api/user/credits/topup` | ✅ | 充值 (内部) |
| GET | `/api/pricing` | — | 定价方案 (公开) |
| POST | `/api/subscriptions/manage` | ✅ | 跳转 Creem 管理 |

### 3.2 核心 API 规格

#### POST `/api/generate`

**请求:**
```json
{
  "modelId": "kling-2.5",
  "prompt": "A cinematic shot of...",
  "params": {
    "aspectRatio": "16:9",
    "duration": 10
  }
}
```

**成功响应 (201):**
```json
{
  "id": "gen_xxx",
  "status": "pending",
  "creditsCost": 150,
  "estimatedSeconds": 30
}
```

**错误响应:**
```json
{ "error": "insufficient_credits", "code": 402 }
{ "error": "invalid_model", "code": 400 }
{ "error": "content_policy_violation", "code": 422 }
{ "error": "rate_limited", "code": 429, "retryAfter": 5 }
```

#### GET `/api/generations/[id]`

```json
// 处理中
{ "id": "gen_xxx", "status": "processing", "progress": 45 }

// 完成
{ "id": "gen_xxx", "status": "completed", "resultUrl": "https://...", "durationMs": 28400 }

// 失败
{ "id": "gen_xxx", "status": "failed", "error": "上游 API 超时", "refunded": true }
```

#### POST `/api/webhook/fal`

**需验证:** `x-webhook-signature` header

```json
{
  "jobId": "fal_job_xxx",
  "status": "completed",
  "videoUrl": "https://fal.cdn/...",
  "durationMs": 28400
}
```

**处理后:**
- 更新 `generations` 状态
- 将视频下载到 R2
- 更新用户 R2 URL 字段

### 3.3 Auth 流程图

```
未登录用户点击"生成"
  → 弹窗提示 "请先登录"
  → 点击 "Google 登录"
  → 跳转 Supabase Auth URL
  → Google OAuth 授权
  → 回调 /api/auth/callback
  → Supabase session 写入 cookie
  → 重定向回 /generate
  → 用户已登录，可生成
```

---

## 4. 数据流

### 4.1 生成流程数据流

```
User                  Frontend              API Route            Supabase          fal.ai / Provider
 │                       │                      │                    │                   │
 │ 点击生成              │                      │                    │                   │
 │──────────────────────►│                      │                    │                   │
 │                       │  POST /api/generate  │                    │                   │
 │                       │─────────────────────►│                    │                   │
 │                       │                      │ RPC: create_generation_atomic             │
 │                       │                      │───────────────────►│                   │
 │                       │                      │◄───────────────────│                   │
 │                       │                      │                    │                   │
 │                       │                      │ POST /fal/generate │                   │
 │                       │                      │───────────────────────────────────────►│
 │                       │                      │◄───────────────────────────────────────│
 │                       │                      │      { jobId: "xxx" }                  │
 │                       │◄─────────────────────│                    │                   │
 │                       │  { id, status, cost }│                    │                   │
 │                       │                      │                    │                   │
 │  每 2s 轮询           │                      │                    │                   │
 │──────────────────────►│ GET /generations/:id │                    │                   │
 │                       │─────────────────────►│                    │                   │
 │                       │                      │ SELECT status      │                   │
 │                       │                      │───────────────────►│                   │
 │                       │                      │◄───────────────────│                   │
 │◄──────────────────────│                      │                    │                   │
 │                       │                      │                    │                   │
 │  ...直到              │                      │                    │                   │
 │  某次轮询返回 completed │                     │                    │                   │
 │                       │                      │                    │                   │
 │  显示视频              │                      │                    │                   │
 │                       │                      │                    │                   │
 │  (或) Webhook 回调     │                      │ POST /webhook/fal  │                   │
 │                       │                      │◄───────────────────────────────────────│
 │                       │                      │ 更新 status        │                   │
 │                       │                      │───────────────────►│                   │
 │  下次轮询立即拿到      │                      │                    │                   │
 │  视频 URL              │                      │                    │                   │
```

### 4.2 订阅支付流程

```
User                  Frontend            API Route           Creem.io         Supabase
 │                       │                    │                   │                │
 │ 点击订阅 Pro          │                    │                   │                │
 │──────────────────────►│                    │                   │                │
 │                       │ POST /api/checkout │                   │                │
 │                       │───────────────────►│                   │                │
 │                       │                    │ POST /checkout    │                │
 │                       │                    │──────────────────►│                │
 │                       │                    │◄──────────────────│                │
 │                       │◄───────────────────│  { url }          │                │
 │                       │                    │                   │                │
 │ 跳转 Creem 结账       │                    │                   │                │
 │◄──────────────────────│                    │                   │                │
 │                       │                    │                   │                │
 │ Creem 支付完成         │                    │                   │                │
 │ (Creem 页面)           │                    │                   │                │
 │                       │                    │                   │                │
 │                       │                    │ POST /webhook     │                │
 │                       │                    │◄──────────────────│                │
 │                       │                    │ 验证签名 + 更新 DB  │               │
 │                       │                    │──────────────────────────────►    │
 │                       │                    │ 给用户加 Credits   │                │
 │                       │                    │──────────────────────────────►    │
 │                       │                    │                   │                │
 │ 回到 /account         │                    │                   │                │
 │──────────────────────►│ GET /user/credits  │                   │                │
 │◄──────────────────────│◄───────────────────│◄───────────────────────────────────│
 │ 看到 Credits 已到账   │                    │                   │                │
```

---

## 5. 组件树

```
<App>
  <Providers>
    <ThemeProvider />       // 深色/浅色
    <AuthProvider />        // Supabase session
    <PostHogProvider />
    <Toaster />             // Toast 通知

    <Navbar>
      <Logo />
      <NavLinks />          // 模型 / 模板 / 定价
      <AuthButtons>         // 登录 / 用户下拉
        <UserAvatar />
        <DropdownMenu />
      </AuthButtons>
    </Navbar>

    <main>
      {children}  // 页面路由内容
    </main>

    <Footer />
  </Providers>
</App>
```

### 5.1 首页组件结构

```
<HomePage>
  <HeroSection>
    <BackgroundVideo />
    <Headline />           // h1 + 副标题
    <CtaButton />          // "Start Creating"
    <ModelCarousel />      // 底部模型滚动条
  </HeroSection>

  <GeneratorPreview />
    // 左输入右预览截图

  <ModelGrid>
    <ModelCard />          // 8-10 个模型
  </ModelGrid>

  <FeatureSection>
    <FeatureCard />        // 3 个
  </FeatureSection>

  <UseCasesSection>
    <UseCaseCard />        // 4 个场景
  </UseCasesSection>

  <HowItWorks>
    <Step />               // 3 步
  </HowItWorks>

  <FaqSection>
    <FaqItem />            // 可折叠
  </FaqSection>
</HomePage>
```

### 5.2 生成页组件结构

```
<GeneratePage>               // "use client"
  <GenerationPanel>
    <ModelSelector />        // 下拉选择模型
    <PromptInput />          // textarea, auto-grow
    <ParameterControls>      // 比例/时长/风格
      <SegmentedControl />   // 比例
      <Slider />             // 时长
      <ChipGroup />          // 风格
    </ParameterControls>
    <CreditsDisplay />       // 当前余额 + 本次消耗
    <GenerateButton />       // 主要 CTA
  </GenerationPanel>

  <PreviewPanel>
    <EmptyState />           // 默认
    // 或
    <GeneratingState>        // 生成中
      <ProgressSpinner />
      <ProgressBar />
      <StageIndicator />     // "正在生成帧..."
    </GeneratingState>
    // 或
    <ResultState>            // 完成
      <VideoPlayer />
      <ResultActions>
        <DownloadButton />
        <ShareButton />
        <CopyPromptButton />
        <DeleteButton />
      </ResultActions>
    </ResultState>
    // 或
    <ErrorState />           // 失败
  </PreviewPanel>
</GeneratePage>
```

### 5.3 共享 UI 组件 (shadcn 定制)

| 组件 | 基于 | 定制内容 |
|------|------|---------|
| Button | shadcn Button | 新增尺寸 + loading + glow variant |
| Card | shadcn Card | hover 效果 + 强调 variant |
| Input | shadcn Input | 新增 input-group (前缀/后缀 icon) |
| Dialog | shadcn Dialog | 暗色背景优化 |
| Toast | shadcn Toast | 生成进度 toast variant |
| Tabs | shadcn Tabs | Segmented control variant |
| Select | shadcn Select | 模型选择器主题化 |
| Skeleton | shadcn Skeleton | 自定义动画速度 |
| Tooltip | shadcn Tooltip | 300ms 延迟配置 |
| Badge | shadcn Badge | 新增 brand variant |
| Avatar | shadcn Avatar | 登录状态指示器 |
| DropdownMenu | shadcn Dropdown | 用户菜单 |

---

## 6. 状态管理

### 6.1 策略

| 数据类型 | 管理方式 | 理由 |
|---------|---------|------|
| 用户 session | Supabase SSR cookie | Next.js Server Components 可直接读 |
| 用户资料/余额 | React Query (TanStack Query) | 缓存 + 自动刷新 |
| 生成状态 | React Query + Polling | 轮询自动管理 |
| 模型列表 | React Query (stale time: 5min) | 不常变 |
| 定价方案 | React Query (stale time: 1min) | 可缓存 |
| UI 状态 (选中的模型等) | React `useState` / URL params | 本地临时 |
| 主题 (深色/浅色) | `next-themes` + localStorage | 持久化偏好 |

### 6.2 React Query Key 约定

```typescript
const queryKeys = {
  user: {
    me:        ['user', 'me'],
    credits:   ['user', 'credits'],
    history:   (page: number) => ['user', 'history', page],
  },
  models: {
    all:       ['models'],
    detail:    (id: string) => ['models', id],
  },
  generations: {
    list:      (page: number, filter: string) => ['generations', 'list', page, filter],
    detail:    (id: string) => ['generations', 'detail', id],
  },
  templates: {
    all:       ['templates'],
    detail:    (id: string) => ['templates', id],
  },
  pricing: {
    all:       ['pricing'],
  },
}
```

### 6.3 生成轮询 Hook

```typescript
function useGenerationPoll(id: string | null) {
  return useQuery({
    queryKey: ['generations', 'detail', id],
    queryFn: () => fetch(`/api/generations/${id}`).then(r => r.json()),
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return 2000
      if (data.status === 'completed' || data.status === 'failed') return false
      return 2000
    },
  })
}
```

---

## 7. 错误处理

### 7.1 错误层级

| 层级 | 处理方式 | 示例 |
|------|---------|------|
| API | 返回结构化 JSON `{ error, code }` | 402: 余额不足 |
| React Query | `onError` → toast | "生成失败，已退还 Credits" |
| 组件 | ErrorBoundary → 优雅降级 | 页面局部崩溃不影响全局 |
| 全局 | Sentry 上报 | 开发期知晓所有异常 |

### 7.2 API 错误码

| Code | HTTP | 含义 | 用户展示 |
|------|------|------|---------|
| `unauthorized` | 401 | 未登录 | "请先登录" |
| `insufficient_credits` | 402 | 余额不足 | "Credits 不足，去充值" |
| `invalid_model` | 400 | 模型不存在 | "模型不可用" |
| `rate_limited` | 429 | 频率限制 | "操作太快，请稍后再试" |
| `content_policy` | 422 | 内容违规 | "请修改 prompt 后重试" |
| `generation_failed` | 500 | 生成失败 | "生成失败，已退还 Credits" |
| `provider_error` | 502 | 上游异常 | "模型暂时不可用，请稍后重试" |

### 7.3 Toast 规则

| 场景 | 类型 | 内容 | 时长 |
|------|------|------|------|
| 生成成功 | success | "视频已生成！" | 4s auto |
| 生成失败 | error | "生成失败，已退还 Credits" | 手动关闭 |
| Credits 不足 | warning | "Credits 不足以完成生成" + 充值链接 | 5s |
| 内容违规 | error | "请修改 prompt" | 手动关闭 |
| 登录成功 | success | "欢迎回来！" | 3s auto |
| 订阅成功 | success | "升级成功！N Credits 已到账" | 5s |
| 下载开始 | info | "正在准备下载..." | 3s auto |
| 网络错误 | error | "网络连接失败，请检查" | 手动关闭 |

### 7.4 空状态/边界情况

| 页面/组件 | 空状态 | 加载态 |
|-----------|--------|--------|
| 生成页预览 | icon + "输入 prompt 开始创作" | spinner + 进度条 |
| 历史记录 | "还没有作品" + CTA | 6-card skeleton grid |
| 模型列表 | 不可为空 (静态配置) | card skeleton |
| 模板列表 | "暂无模板" | card skeleton |
| 定价列表 | 不可为空 | 3-card skeleton |
| 账户 Credits | "0 Credits" | skeleton text |
| 搜索结果 | "未找到结果" | — |

---

## 8. 边界情况

### 8.1 并发生成

- 用户快速点击两次"生成" → 第一个请求立即 disable 按钮
- 生成中再次点击 → 按钮 disabled + tooltip "已有任务进行中"
- 超并行限制 (第 4 个任务排队) → toast "已达到并行上限"

### 8.2 浏览器兼容

| 场景 | 处理 |
|------|------|
| 无 WebGL | 降级为静态图片轮播 (Hero 区域) |
| 禁用 JavaScript | 显示静态内容 (SSG) + "启用 JS 以获得完整体验" |
| 移动端生成页 | 左侧面板 → 顶部, 预览区 → 底部 (stacked layout) |
| Safari 视频播放 | 使用 `<video>` 原生, 确保 H.264 编码 |
| 深色模式 | 尊重 `prefers-color-scheme`, 可手动切换 |

### 8.3 网络异常

| 场景 | 处理 |
|------|------|
| 生成中网络断开 | 下次访问 `/generate/[id]` 自动恢复轮询 |
| 轮询超时 (3 次) | 提示 "连接超时, 点此手动刷新" |
| 图片加载失败 | fallback placeholder image |
| 视频加载失败 | 显示 "无法加载" + 下载链接 (直接 URL) |

### 8.4 Credits 边界

| 场景 | 处理 |
|------|------|
| Credits = 0 点生成 | 弹窗 "去充值" + 跳转定价页 |
| 生成途中 Credits 变更 | 以调用 RPC 时余额为准 |
| 订阅升级 | 按比例补差价 Credits |
| 订阅降级 | 不扣已有 Credits, 但下月减少 |
| 取消订阅 | 本期 Credits 保留至周期结束 |
| 退款 | 手动操作, 扣除已消耗 Credits |

### 8.5 视频存储边界

| 场景 | 处理 |
|------|------|
| 免费用户 7 天后 | 自动删除, 发邮件通知可提前下载 |
| 付费用户取消 | 保留 30 天后删除 |
| 删除账号 | 立即标记删除, 异步清理 R2 |
| 文件超过 500MB | 限制上传/生成参数 |
| R2 签名 URL 过期 | 前端捕获 403 → 自动刷新签名 |

---

## 9. SEO/GEO

### 9.1 技术实现

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const models = await getModels()  // 从数据库
  const templates = await getTemplates()
  
  return [
    { url: '/', lastModified: new Date() },
    { url: '/pricing', lastModified: new Date() },
    { url: '/faq', lastModified: new Date() },
    ...models.map(m => ({
      url: `/models/${m.id}`,
      lastModified: m.updatedAt,
    })),
    ...templates.map(t => ({
      url: `/templates/${t.id}`,
      lastModified: t.updatedAt,
    })),
  ]
}

// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
```

### 9.2 结构化数据 (LD+JSON)

每个页面输出对应的 Schema.org 结构化数据：

- **首页**: `WebSite` + `SoftwareApplication`
- **模型页**: `Product` + 聚合评分/价格
- **定价页**: `OfferCatalog`
- **FAQ 页**: `FAQPage`
- **博客**: `Article` / `BlogPosting`

### 9.3 GEO (AI 搜索引擎)

```markdown
<!-- public/llms.txt -->
# AI Video Generator
## About
AI-powered video generation platform with multiple models.
## Models
- Kling 2.5: Text-to-video, high quality
- Veo 3.1: Cinematic video generation
...
```

```markdown
<!-- public/ai.txt -->
This site uses AI to generate videos. 
Key features: multi-model support, one subscription, credits system.
```

---

## 10. i18n

### 10.1 架构

使用 next-intl 9.x，JSON 翻译文件 + 强类型 key。

**目录结构:**
```
messages/
  en.json      // 默认英文
  ja.json      // 日文
  zh.json      // 中文
```

**路由结构:**
```
/en/models/kling-2.5
/ja/models/kling-2.5
/zh/models/kling-2.5
```

### 10.2 翻译 key 约定

```typescript
// messages/en.json
{
  "nav": {
    "models": "Models",
    "templates": "Templates",
    "pricing": "Pricing",
    "login": "Login",
    "signup": "Sign Up"
  },
  "hero": {
    "title": "One Subscription, All AI",
    "subtitle": "Access the best AI video models...",
    "cta": "Start Creating"
  },
  "generate": {
    "prompt_placeholder": "Describe the video you want to create...",
    "button_generate": "Generate Video",
    "button_generating": "Generating...",
    "button_regenerate": "Re-generate",
    "insufficient_credits": "Insufficient credits"
  },
  ...
}
```

### 10.3 MVP 语言策略

MVP 只做 `en.json`（英语）。但 i18n 框架提前搭好，后续加语言不重构。

---

## 11. 开发优先级

### Phase 1 — 基础设施 (Day 1-2)

```
P0: 项目初始化 + Tailwind + shadcn + design-tokens
P0: Supabase 项目 + 数据库 schema + RLS
P0: Vercel 部署 + 自定义域名
P0: Cloudflare R2 bucket
```

### Phase 2 — 核心功能 (Day 3-8)

```
P0: Google OAuth 登录/登出
P0: 模型列表 (配置表) + API
P0: Provider Adapter + fal.ai 集成
P0: 生成 API + 原子扣减 RPC
P0: 生成页 UI + 轮询
```

### Phase 3 — 页面完善 (Day 9-14)

```
P1: 首页 (SSG)
P1: 模型详情页 (SSG)
P1: 历史记录页
P1: 定价页
P1: 订阅 + Credits 充值流
P1: 账户页 + FQA 页
```

### Phase 4 — 上线准备 (Day 15-21)

```
P1: SEO (sitemap/robots/结构化数据)
P1: GEO (llms.txt/ai.txt)
P2: Sentry + PostHog
P2: 性能优化 + Lighthouse
P2: 错误边界 + 兜底文案
P0: Google Console 提交 + 上线
```

---

> 本文档共计约 6000 字，覆盖 11 个章节，所有 API 规格、组件结构、状态管理均为可执行规格。
> 下一阶段：开发落地。
