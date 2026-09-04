# 技术方案 · AI 视频/图像生成聚合站

> 基于 PRD 黄金参考方案，针对独立开发者 21 天 MVP 定制
> 版本: v1.0 · 2026-05-12

---

## 1. 架构总览（文字版）

```
┌─────────────────────────────────────────────────────┐
│                    用户浏览器                          │
│  Next.js 15 App (Vercel Edge Network)               │
│  ├─ 首页 (SEO 落地页, SSG)                           │
│  ├─ 模型详情页 (SEO 落地页, SSG)                     │
│  ├─ 生成页 (客户端渲染, 需登录)                      │
│  ├─ Pricing 页 (ISR, 60s)                            │
│  ├─ 历史记录页 (客户端渲染, 需登录)                   │
│  └─ 模板页 (SSG)                                     │
└──────────┬────────────────────────────────┬──────────┘
           │ API Routes                     │ WebSocket
           ▼                                ▼
┌──────────────────────┐    ┌──────────────────────────┐
│   Next.js API Routes │    │  前端轮询 (Polling fallback)│
│   ┌──────────────┐   │    │  每 2s GET /api/generations │
│   │ requireAuth  │   │    │  /:id 直到完成或超时       │
│   │ Credits RPC  │   │    └──────────────────────────┘
│   │ Provider     │   │
│   │ Adapter      │   │
│   └──────┬───────┘   │
└──────────┼────────────┘
           │
           ▼
┌────────────────────────────────────────────────────┐
│                   服务层                             │
│                                                     │
│  Supabase (Postgres + Auth + RLS)                   │
│  ├─ users / subscriptions / credit_transactions     │
│  ├─ generations / models / templates                │
│  └─ RLS: 用户只能读写自己的数据                      │
│                                                     │
│  Cloudflare R2 (视频/图片存储)                       │
│  ├─ 24h 签名 URL 临时下载                           │
│  ├─ Lifecycle: 免费用户 7d 删除                     │
│  └─ 付费用户长期保存                                │
│                                                     │
│  fal.ai (AI 视频/图像生成)                           │
│  ├─ Webhook 回调写入完成状态                        │
│  └─ 多模型通过 Provider Adapter 抽象                │
└────────────────────────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────────────────┐
│                外部服务                              │
│                                                     │
│  Creem.io ← 订阅支付 + Webhook                     │
│  Resend  ← 事务邮件                                 │
│  Sentry  ← 错误监控                                 │
│  PostHog ← 用户分析                                 │
│  Google Console / Bing Console ← SEO 收录           │
└────────────────────────────────────────────────────┘
```

---

## 2. 技术栈一览

| 层次 | 首选方案 | 替代方案 | MVP 月成本 | 1000 DAU 月成本 |
|------|---------|---------|-----------|----------------|
| 前端框架 | Next.js 15 + React 19 | — | $0 (Vercel Hobby) | $20 (Vercel Pro) |
| UI 组件 | Tailwind CSS 3 + shadcn/ui + Radix | — | $0 | $0 |
| 设计系统 | `design-tokens.md` → `tailwind.config.ts` + `brand.config.ts` | — | $0 | $0 |
| i18n | next-intl 9.x + JSON + 强类型 key | — | $0 | $0 |
| Auth | Supabase Auth + Google OAuth | Clerk | $0 (50K MAU) | $0 |
| 数据库 | Supabase Postgres + RLS | Neon | $0 (500MB) | $25 (8GB) |
| Credits | Postgres RPC `create_generation_atomic` | — | $0 | $0 |
| 媒体存储 | Cloudflare R2 + 24h 签名 URL | AWS S3 (不推荐) | $0 (10GB) | $0.75 (50GB) |
| 生成管线 | Webhook 主推 + 前端轮询兜底 | Inngest/Trigger.dev | $0 | $0 |
| 失败兜底 | 轮询 5min 超时 → 主动查上游 | — | $0 | $0 |
| 内容 | next-mdx-remote + gray-matter | — | $0 | $0 |
| SEO | sitemap.ts + robots.ts + hreflang + 结构化数据 | — | $0 | $0 |
| GEO | llms.txt + ai.txt | — | $0 | $0 |
| 收款 | Creem.io + Wise | Stripe | 0 月费 + 3.9%+$0.40 | 同上 |
| 邮件 | Resend | SendGrid | $0 (3K/月) | $0 |
| 监控 | Sentry + PostHog | — | $0 | $0 |
| DNS/CDN | Cloudflare | — | $0 | $0 |
| 部署 | GitHub + Vercel | — | $0 | $0 |
| 收录 | Google Console + Bing Console | — | $0 | $0 |

**月固定成本: $0-30** (含域名摊销)
**1000 DAU 月成本: $50-150** (API 调用费是大头)

---

## 3. 视频生成管线

### 3.1 同步 vs 异步

**MVP 选型：异步 + 前端轮询**（路径 A）

| 路径 | 复杂度 | 适合规模 | 实现成本 |
|------|--------|---------|---------|
| A. 前端轮询 | ⭐ | DAU < 500 | 30 分钟 |
| B. SSE | ⭐⭐⭐ | DAU 500-5000 | 2 天 |
| C. Queue + Webhook | ⭐⭐⭐⭐⭐ | DAU > 5000 | 1 周 |

**完整流程：**
```
① 用户点「生成」
   ↓
② POST /api/generate → requireAuth → Credits 检查
   ↓
③ Postgres RPC: create_generation_atomic()
   在一个事务里: 查余额 → 扣 credits → 创建 generation 记录 → 返回 job_id
   ↓
④ 调用 fal.ai (或对应 Provider)
   传参: { prompt, model_id, webhook_url: "/api/webhook/fal" }
   ↓
⑤ 立即返回 { job_id, status: "processing" }
   ↓
⑥ 前端跳转到结果页, 每 2 秒 GET /api/generations/:id
   ↓
⑦ fal.ai 完成 → POST /api/webhook/fal
   更新 generation 状态为 completed, 写入 R2 URL
   ↓
⑧ 前端下一次轮询拿到 completed → 显示视频
```

### 3.2 Provider Adapter Pattern

```typescript
// lib/providers/types.ts
interface GenerationParams {
  prompt: string
  modelId: string
  aspectRatio?: string
  duration?: number
  imageUrl?: string  // img2vid
}

interface GenerationResult {
  url: string
  duration: number
  costCredits: number
  metadata: Record<string, unknown>
}

interface VideoProvider {
  id: string
  name: string
  generate(params: GenerationParams, webhookUrl: string): Promise<{ jobId: string }>
  checkStatus(jobId: string): Promise<GenerationResult | null>
  costPerSecond: number  // USD
}

// lib/providers/registry.ts
const providers = new Map<string, VideoProvider>()
providers.set('kling', new KlingProvider())
providers.set('veo', new VeoProvider())
providers.set('seedance', new SeedanceProvider())

function getProvider(modelId: string): VideoProvider {
  const provider = providers.get(modelId)
  if (!provider) throw new Error(`Unknown model: ${modelId}`)
  return provider
}
```

### 3.3 模型路由表

| 用户档位 | Credits/s | 推荐模型 | API 成本/s | 毛利空间 |
|---------|----------|---------|-----------|---------|
| 快速 | 5 | Seedance 2 Fast | $0.022 | ~3x |
| 标准 | 15 | Kling 2.5 Turbo | $0.07 | ~2x |
| 电影 | 25 | Veo 3.1 Fast | $0.10 | ~2.5x |

### 3.4 失败兜底

| 场景 | 处理 |
|------|------|
| API 超时 (>60s) | 自动取消 + 退还 credits |
| API 5xx | 重试 1 次 → 失败则降级备用 provider |
| 内容审核失败 | 不扣 credits, 提示修改 prompt |
| Credits 已扣但生成失败 | **必须自动退还** (用户体验红线) |
| Webhook 未回调 | 前端轮询 5min 超时 → 后端主动查上游状态 |

### 3.5 并发控制

| 用户等级 | 最大并行任务 |
|---------|------------|
| Free | 1 |
| Lite | 2 |
| Pro | 3 |
| Premium | 5 |

---

## 4. 数据模型

### 4.1 核心表

```sql
-- users (Supabase Auth 自动管理, 扩展字段放 public.users)
create table public.users (
  id          uuid primary key references auth.users(id),
  email       text,
  credits     integer not null default 0,
  tier        text not null default 'free',  -- free | lite | pro | premium
  created_at  timestamptz default now()
);

-- subscriptions
create table public.subscriptions (
  id              text primary key,  -- Creem.io order_id
  user_id         uuid references public.users(id),
  tier            text not null,
  status          text not null,     -- active | canceled | expired
  credits_monthly integer not null,
  current_start   timestamptz,
  current_end     timestamptz,
  created_at      timestamptz default now()
);

-- credit_transactions (每笔明细，对账用)
create table public.credit_transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.users(id),
  amount      integer not null,          -- 正 = 充值, 负 = 消耗
  type        text not null,             -- purchase | generation | refund | bonus
  reference   text,                      -- generation_id / order_id
  created_at  timestamptz default now()
);

-- generations (核心产出表)
create table public.generations (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.users(id),
  model_id        text not null,
  prompt          text not null,
  status          text not null default 'pending',  -- pending | processing | completed | failed
  credits_cost    integer not null,
  cost_usd        numeric(10,6),          -- API 成本，做毛利分析
  result_url      text,                   -- R2 URL
  duration_ms     integer,                -- 实际生成耗时
  error_message   text,
  created_at      timestamptz default now(),
  completed_at    timestamptz
);

-- models (配置表，新增模型 INSERT 一行不改代码)
create table public.models (
  id              text primary key,       -- 'kling-2.5'
  provider        text not null,          -- 'kling'
  display_name    text not null,
  description     text,
  credits_per_second integer not null,
  is_active       boolean default true,
  sort_order      integer default 0
);

-- templates
create table public.templates (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  prompt      text not null,
  model_id    text references public.models(id),
  cover_url   text,
  usage_count integer default 0,
  tags        text[],                     -- 标签数组
  created_at  timestamptz default now()
);

-- Indexes
create index idx_generations_user_status on public.generations(user_id, status);
create index idx_credit_tx_user on public.credit_transactions(user_id, created_at desc);
```

### 4.2 RLS 策略

```sql
-- users: 只能看自己
create policy "users_self" on public.users
  for all using (auth.uid() = id);

-- generations: 只能看自己
create policy "generations_self" on public.generations
  for all using (auth.uid() = user_id);

-- credit_transactions: 只能看自己
create policy "credit_tx_self" on public.credit_transactions
  for select using (auth.uid() = user_id);

-- models: 公开读
create policy "models_public_read" on public.models
  for select using (true);
```

### 4.3 原子扣减 RPC

```sql
create or replace function create_generation_atomic(
  p_user_id uuid,
  p_model_id text,
  p_prompt text,
  p_credits_cost integer
) returns uuid as $$
declare
  v_balance integer;
  v_gen_id uuid;
begin
  -- 查余额 (锁行防并发)
  select credits into v_balance
  from public.users
  where id = p_user_id
  for update;

  if v_balance < p_credits_cost then
    raise exception 'insufficient_credits';
  end if;

  -- 扣余额
  update public.users
  set credits = credits - p_credits_cost
  where id = p_user_id;

  -- 记流水
  insert into public.credit_transactions
    (user_id, amount, type, reference)
  values
    (p_user_id, -p_credits_cost, 'generation', p_model_id);

  -- 创建任务
  insert into public.generations
    (user_id, model_id, prompt, credits_cost, status)
  values
    (p_user_id, p_model_id, p_prompt, p_credits_cost, 'pending')
  returning id into v_gen_id;

  return v_gen_id;
end;
$$ language plpgsql security definer;
```

---

## 5. 视频存储

### 5.1 Cloudflare R2 配置

| 配置项 | 值 |
|-------|-----|
| Bucket 名称 | `ai-video-generations` |
| 公共访问 | 关闭 (私有 bucket) |
| 签名 URL 有效期 | 24 小时 |
| 生命周期 | 定期清理过期文件 |
| 区域 | auto (全球加速) |

### 5.2 存储成本估算

| 规模 | 月数据增量 | 总存储 | R2 月费 | S3 月费 (对比) |
|------|-----------|--------|---------|---------------|
| MVP | 5 GB | 35 GB (7天) | $0 | $0.70 + 流量 |
| 早期 | 50 GB | 350 GB | $0.75 | $7 + 流量 |
| 成长 | 500 GB | 3.5 TB | $7.50 | $70 + 流量 |
| 规模 | 5 TB | 35 TB | $75 | $700 + 天价流量费 |

### 5.3 生命周期策略

- **免费用户**: 生成后 7 天自动删除 (Lifecycle Rule)
- **付费用户**: 长期保存 (取消订阅后保留 30 天)
- 删除前发邮件通知可下载

---

## 6. 页面结构 & 路由

| 路由 | 类型 | 渲染 | Auth | SEO |
|------|------|------|------|-----|
| `/` | 首页 | SSG | 否 | ✅ |
| `/models/[id]` | 模型详情 | SSG | 否 | ✅ |
| `/generate` | 生成页 (工作台) | CSR | 是 | ❌ |
| `/generate/[id]` | 生成结果 | CSR | 是 | ❌ |
| `/gallery` | 社区作品 | ISR 60s | 否 | ✅ |
| `/templates` | 模板列表 | SSG | 否 | ✅ |
| `/templates/[id]` | 模板详情 | SSG | 否 | ✅ |
| `/pricing` | 定价页 | ISR 60s | 否 | ✅ |
| `/history` | 历史记录 | CSR | 是 | ❌ |
| `/account` | 账户设置 | CSR | 是 | ❌ |
| `/blog/*` | 博客文章 | SSG | 否 | ✅ |
| `/privacy` | 隐私政策 | SSG | 否 | ✅ |
| `/terms` | 用户协议 | SSG | 否 | ✅ |
| `/faq` | 常见问题 | SSG | 否 | ✅ |

---

## 7. 容量规划

| 指标 | MVP (<50 DAU) | 早期 (50-500) | 成长 (500-5000) | 规模 (>5000) |
|------|-------------|--------------|----------------|-------------|
| 日生成数 | <100 | 200-2000 | 2K-20K | >20K |
| 高峰并发 | <5 | 5-20 | 20-100 | >100 |
| 月数据增量 | 5 GB | 50 GB | 500 GB | >5 TB |
| 月 API 成本 | <$50 | $100-500 | $1K-5K | >$10K |

**最先打架的组件:**
- **MVP → 早期**: Vercel Hobby 的 100GB 带宽 / 100 天构建 → 升 Pro ($20)
- **早期 → 成长**: 单实例轮询 + Webhook 处理 → 加 Inngest 队列
- **成长 → 规模**: Supabase 免费 tier Postgres 限制 → 升 Pro ($25)
- **规模以上**: 考虑自建 API 网关 + 多区域部署

---

## 8. 24 天开发计划

| 阶段 | 天数 | 内容 |
|------|------|------|
| **Day 1-2: 基建** | 2 | 项目初始化, Supabase 建表, R2 配置, Vercel 部署, 域名 DNS |
| **Day 3-5: Auth** | 3 | Google OAuth 集成, 用户表, RLS 策略, 登录/登出流程 |
| **Day 6-8: 核心生成** | 3 | Provider Adapter (fal.ai), 生成 API, 原子扣减 RPC, 轮询 |
| **Day 9-10: UI 框架** | 2 | 全局布局, 导航, 生成页工作台, design-tokens 落地 |
| **Day 11-12: 模型页** | 2 | 模型详情页 (SEO), 首页, 模板页 |
| **Day 13-14: 历史+账户** | 2 | 历史记录页, 账户设置, 素材管理 |
| **Day 15-16: 订阅支付** | 2 | Creem.io 集成, Pricing 页, Webhook 处理, Credits 充值 |
| **Day 17-18: SEO** | 2 | sitemap, robots, 结构化数据, llms.txt, ai.txt, hreflang |
| **Day 19-20: 优化** | 2 | 性能优化, 错误处理, Sentry, PostHog 埋点 |
| **Day 21: 上线** | 1 | 最终测试, Google Console 提交, 域名检查 |

---

## 9. 预估月成本 (1000 DAU)

| 项目 | 月费 |
|------|------|
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| Cloudflare R2 | $0.75 |
| Cloudflare DNS/CDN | $0 |
| Resend | $0 |
| Sentry | $0 |
| PostHog | $0 |
| Creem.io | $0 (抽成) |
| 域名 (年摊) | ~$1 |
| **基础设施合计** | **~$47** |
| fal.ai API (预估) | $50-300 (按用量) |
| **总计** | **$97-347** |

---

## 10. 主要风险与对策

| 风险 | 概率 | 影响 | 对策 |
|------|------|------|------|
| fal.ai API 延迟不稳定 | 中 | 高 | 多模型自动降级, 前端进度条安抚 |
| Credits 并发扣减 bug | 低 | 高 | Postgres RPC 事务保护, 测试覆盖 |
| R2 存储成本失控 | 低 | 中 | 生命周期策略 + 免费用户定期清理 |
| Vercel Serverless 超时 | 中 | 中 | API 路由同步调用控制在 10s 内, 长任务异步 |
| Creem.io Webhook 丢失 | 低 | 高 | 被动核对: 用户打开订阅页时主动查状态 |

---

## 11. 已做的假设 (需确认)

1. 目标市场为英语国家 (美国为主) — 首版只做英文
2. MVP 只接 fal.ai 一个 Provider，后续按 Adapter Pattern 扩展
3. 收款使用 Creem.io（非 Stripe）
4. 部署在 Vercel（非自建服务器）
5. 免费用户生成视频保留 7 天
6. 单价按 2-3x API 成本定价
7. 用户注册仅 Google OAuth（不提供邮箱密码注册）

---

## 12. 依赖安装

```bash
# 核心
npx create-next-app@latest . --typescript --tailwind --app --src-dir
npm install @supabase/supabase-js @supabase/ssr
npm install next-intl

# UI
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge
npx shadcn@latest init

# 组件 (shadcn)
npx shadcn@latest add button card input dialog toast tabs dropdown-menu
npx shadcn@latest add skeleton tooltip badge avatar

# 内容
npm install next-mdx-remote gray-matter

# 字体
npm install geist @next/font

# 工具
npm install zod react-hook-form @hookform/resolvers
npm install @sentry/nextjs
npm install posthog-js

# 开发工具
npm install -D prettier prettier-plugin-tailwindcss
```
