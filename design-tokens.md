# design-tokens.md

> AI 视频/图像生成聚合站 — 设计令牌系统
> 精度: Apple 工业级 · 版本: v1.0

---

## 0. 设计哲学

这套设计是为「AI 创作聚合平台」而生。它不是 Pollo.ai 的复刻，也不是 Viddo.ai 的翻版。

Pollo 像是一个功能目录——每个模型是一张卡片，用户浏览、选、用。Viddo 更像一个视频工具——强调编辑时间线。我们的定位介于两者之间：**一个让创作者觉得「这是我的工作站」而非「这是一个工具站」的产品。**

核心洞察：聚合站最大的敌人不是竞品，而是「工具感」。当用户感觉自己在操作一堆 API 的壳，他们就不会回来。当用户感觉走进了一个专业创作空间，他们就会订阅。

所以设计语言选择 **「暗色沉浸 + 精确工程美学」**——

- 暗色不是为了酷，是为了让 AI 生成的视频/图片像电影银幕一样凸显
- 精确不是为了极简，是为了让用户在 200ms 内理解每一个操作区域
- 适度的玻璃质感（backdrop-blur + 半透明表面）暗示「AI 的不可触摸感」
- 留白不是浪费空间，是给生成结果让路

这套设计会吸引：认真做内容的创作者、愿意为效率付费的专业用户。会劝退：想免费白嫖的 casual 用户、期待花哨特效的 TikTok 一族。

---

## 1. 设计原则

### 1.1 内容优先
- **定义**: 界面永远是内容的容器，不是主角
- ✓ 生成预览占据 >60% 的屏幕面积
- ✗ UI 控件比生成结果更抢眼

### 1.2 确定而非惊讶
- **定义**: 每个操作在发生前就可预见结果
- ✓ 按钮 hover 时明确表示「可点击」
- ✗ 鼠标挪到某处才发现是个控件

### 1.3 沉浸但不迷失
- **定义**: 深色背景让视觉聚焦，但导航和上下文从不丢失
- ✓ 顶部导航始终可见，当前页面指示清晰
- ✗ 暗色到分不清页面边界

### 1.4 减少认知负荷
- **定义**: 一屏只做一件事，一个页面只有一个主要操作
- ✓ 生成页左输入右预览，一目了然
- ✗ 卡片上同时有 5 个操作按钮

### 1.5 状态可见
- **定义**: 系统状态永远即时反馈，没有「静默失败」
- ✓ 视频生成中显示进度 + 预计时间
- ✗ 点了生成按钮后没有任何反应

### 1.6 信任即转化
- **定义**: 每个设计决策都要增强用户对产品的信任感
- ✓ 订阅页明确列出所有模型 + 价格
- ✗ 隐藏费用或含糊的「无限生成」

### 1.7 跨模型一致性
- **定义**: 不同 AI 模型的参数 UI 保持统一交互模式
- ✓ 所有模型使用相同的 prompt 输入框和参数面板
- ✗ 每个模型各自一套控件布局

---

## 2. 色彩系统

### 2.1 主色 (Primary)

| Token | Hex | HSL | OKLCH |
|-------|-----|-----|-------|
| primary-50 | #eef2ff | 225°, 100%, 97% | 0.76 0.06 264 |
| primary-100 | #e0e7ff | 225°, 100%, 94% | 0.72 0.08 264 |
| primary-200 | #c7d2fe | 225°, 97%, 89% | 0.67 0.11 264 |
| primary-300 | #a5b4fc | 225°, 94%, 82% | 0.60 0.15 264 |
| primary-400 | #818cf8 | 225°, 89%, 74% | 0.53 0.19 264 |
| primary-500 | #6366f1 | 225°, 84%, 65% | 0.46 0.22 264 |
| primary-600 | #4f46e5 | 225°, 76%, 56% | 0.39 0.23 264 |
| primary-700 | #4338ca | 225°, 72%, 47% | 0.32 0.21 264 |
| primary-800 | #3730a3 | 225°, 68%, 38% | 0.25 0.18 264 |
| primary-900 | #312e81 | 225°, 64%, 29% | 0.19 0.14 264 |
| primary-950 | #1e1b4b | 225°, 58%, 15% | 0.11 0.09 264 |

### 2.2 辅色 (Accent — 靛蓝紫到品红渐变)

| Token | Hex | HSL | OKLCH |
|-------|-----|-----|-------|
| accent-400 | #a78bfa | 252°, 92%, 76% | 0.60 0.19 282 |
| accent-500 | #8b5cf6 | 252°, 89%, 66% | 0.52 0.22 282 |
| accent-600 | #7c3aed | 252°, 83%, 56% | 0.44 0.24 282 |

accent 是 gradient 用色，不和 primary 同时出现在同一个平面元素上。

### 2.3 语义色

| Token | 50 | 100 | 200 | 400 | 500 (main) | 600 | 800 |
|-------|----|-----|-----|-----|-----------|-----|-----|
| success | #f0fdf4 | #dcfce7 | #bbf7d0 | #4ade80 | #22c55e | #16a34a | #166534 |
| warning | #fffbeb | #fef3c7 | #fde68a | #fbbf24 | #f59e0b | #d97706 | #92400e |
| error | #fef2f2 | #fee2e2 | #fecaca | #f87171 | #ef4444 | #dc2626 | #991b1b |
| info | #eff6ff | #dbeafe | #bfdbfe | #60a5fa | #3b82f6 | #2563eb | #1e40af |

### 2.4 中性色 (Neutral)

| Token | Hex | HSL |
|-------|-----|-----|
| neutral-50 | #fafafa | 0°, 0%, 98% |
| neutral-100 | #f5f5f5 | 0°, 0%, 96% |
| neutral-200 | #e5e5e5 | 0°, 0%, 90% |
| neutral-300 | #d4d4d4 | 0°, 0%, 83% |
| neutral-400 | #a3a3a3 | 0°, 0%, 64% |
| neutral-500 | #737373 | 0°, 0%, 45% |
| neutral-600 | #525252 | 0°, 0%, 32% |
| neutral-700 | #404040 | 0°, 0%, 25% |
| neutral-800 | #262626 | 0°, 0%, 15% |
| neutral-900 | #171717 | 0°, 0%, 9% |
| neutral-950 | #0a0a0a | 0°, 0%, 4% |

### 2.5 表面色 (Surface)

| Token | Light | Dark |
|-------|-------|------|
| surface | #ffffff | #0a0a0a |
| surface-elevated | #fafafa | #171717 |
| surface-overlay | rgba(0,0,0,0.6) | rgba(0,0,0,0.8) |

### 2.6 文本色

| Token | Light | Dark |
|-------|-------|------|
| text-primary | neutral-950 (#0a0a0a) | neutral-50 (#fafafa) |
| text-secondary | neutral-600 (#525252) | neutral-400 (#a3a3a3) |
| text-tertiary | neutral-400 (#a3a3a3) | neutral-600 (#525252) |
| text-disabled | neutral-300 (#d4d4d4) | neutral-700 (#404040) |
| text-on-color | #ffffff | #ffffff |

### 2.7 边框色

| Token | Light | Dark |
|-------|-------|------|
| border-default | neutral-200 (#e5e5e5) | neutral-800 (#262626) |
| border-subtle | neutral-100 (#f5f5f5) | neutral-900 (#171717) |
| border-strong | neutral-400 (#a3a3a3) | neutral-600 (#525252) |
| border-focus | primary-500 (#6366f1) | primary-400 (#818cf8) |

### 2.8 暗色模式映射

Light → Dark 映射规则：
- surface: #fff → #0a0a0a
- surface-elevated: #fafafa → #171717
- 文本色降低对比度 1 级（primary→primary 保持不变，secondary→tertiary 可降级）
- 边框统一加深到 neutral-800

### 2.9 色彩使用规则

- **Primary 色只用于**：主要 CTA 按钮、活动 tab、链接、焦点环
- **Accent 色只用于**：渐变色标题、品牌装饰元素、AI 生成的加载动画
- **Semantic 色只用于**：对应的语义场景（error 不用于装饰）
- **不要在暗色背景上使用 primary-700 以下的色值**（对比度不足）
- **不要在浅色背景上使用 primary-300 以上的色值**（对比度不足）
- 成功 toast 用 success-500，不用 primary
- 卡片默认为 surface-elevated，hover 时变为 surface（在暗色模式下轻微提亮）

### 2.10 Tailwind Config 片段

```js
// tailwind.config.ts — 颜色部分
colors: {
  primary: {
    50: '#eef2ff',  100: '#e0e7ff',  200: '#c7d2fe',
    300: '#a5b4fc',  400: '#818cf8',  500: '#6366f1',
    600: '#4f46e5',  700: '#4338ca',  800: '#3730a3',
    900: '#312e81',  950: '#1e1b4b',
  },
  accent: {
    400: '#a78bfa',  500: '#8b5cf6',  600: '#7c3aed',
  },
}
// neutral + semantic 使用 Tailwind 内置 gray/green/yellow/red/blue
```

---

## 3. 字体系统

### 3.1 字体族

| 用途 | Font Stack | 理由 |
|------|-----------|------|
| Display (标题/大字) | `Geist, 'Inter', system-ui, sans-serif` | Geist 是 Vercel 设计的几何无衬线，数字展示优秀，适合科技产品 |
| Body (正文/UI) | `'Inter', system-ui, -apple-system, sans-serif` | Inter 在屏幕阅读上经过专门优化，大字距和小字都清晰 |
| Mono (代码/数据) | `'Geist Mono', 'JetBrains Mono', 'Fira Code', monospace` | Geist Mono 和 Geist 视觉对齐，用于 prompt 输入框和金额数字 |

### 3.2 字号梯度

| Token | Size (px) | Size (rem) | Line Height | Letter Spacing | 用途 |
|-------|-----------|-----------|-------------|----------------|------|
| caption | 12px | 0.75rem | 1.4 | 0.02em | 辅助文字、标签 |
| body-sm | 13px | 0.8125rem | 1.5 | 0.01em | 小号 UI 文字 |
| body | 14px | 0.875rem | 1.5 | 0.01em | 正文、段落 |
| body-lg | 16px | 1rem | 1.6 | 0 | 大号正文 |
| h5 | 18px | 1.125rem | 1.4 | -0.01em | 小标题 |
| h4 | 20px | 1.25rem | 1.3 | -0.02em | 卡片标题 |
| h3 | 24px | 1.5rem | 1.3 | -0.02em | 区块标题 |
| h2 | 30px | 1.875rem | 1.25 | -0.03em | 页面标题 |
| h1 | 36px | 2.25rem | 1.2 | -0.03em | 大标题 |
| display | 48px | 3rem | 1.1 | -0.04em | Hero 主标题 |
| display-xl | 64px | 4rem | 1.05 | -0.05em | Hero 加粗标题 |

### 3.3 字重规范

| Weight | CSS | 使用场景 |
|--------|-----|---------|
| Regular | 400 | 正文、段落、输入框文字 |
| Medium | 500 | 导航链接、按钮文字、卡片标题 |
| Semibold | 600 | 页面 H2-H4 标题、强调文字 |
| Bold | 700 | H1、Display 标题、价格数字 |

### 3.4 标题层级

| Level | Size | Weight | Line Height | Margin Bottom |
|-------|------|--------|-------------|---------------|
| H1 | 36px / 2.25rem | Bold 700 | 1.2 | 16px |
| H2 | 30px / 1.875rem | Semibold 600 | 1.25 | 12px |
| H3 | 24px / 1.5rem | Semibold 600 | 1.3 | 10px |
| H4 | 20px / 1.25rem | Medium 500 | 1.3 | 8px |
| H5 | 18px / 1.125rem | Medium 500 | 1.4 | 8px |
| H6 | 16px / 1rem | Medium 500 | 1.5 | 6px |

### 3.5 段落规范

- 最大行宽: 720px (45em) 阅读体验最佳
- 段间距: 20px (1.25rem)
- 列表缩进: 24px (1.5rem)

### 3.6 数字/金额规则

- 金额、价格、倒计时使用 `Geist Mono` + `tabular-nums`（等宽数字对齐）
- 用户积分（credits）数字使用 body 字重，不用 bold（避免视觉焦虑）
- 千位分隔：$12,345 / 12,345 Credits

### 3.7 Tailwind Config 片段

```js
// tailwind.config.ts — 字体部分
fontFamily: {
  display: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
  body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  mono: ['Geist Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
},
fontSize: {
  'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
  'body-sm': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
  'body': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
  'body-lg': ['1rem', { lineHeight: '1.6' }],
  'h5': ['1.125rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
  'h4': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
  'h3': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
  'h2': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.03em' }],
  'h1': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
  'display': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
  'display-xl': ['4rem', { lineHeight: '1.05', letterSpacing: '-0.05em' }],
},
```

---

## 4. 间距系统

### 4.1 基础单位

**4px 网格**。理由：AI 聚合站的 UI 元素密度中等，4px 粒度足够精细且空间利用率比 8px 网格高。在需要呼吸感的地方使用 4 的倍数，在紧凑区域使用 2px 半步（偶尔）。

### 4.2 间距梯度

| Token | px | rem | 用途 |
|-------|----|-----|------|
| 0 | 0px | 0 | — |
| 1 | 4px | 0.25rem | 图标与文字间距 |
| 2 | 8px | 0.5rem | 标签内间距、小元素间距 |
| 3 | 12px | 0.75rem | 输入框内边距 |
| 4 | 16px | 1rem | 卡片内边距、按钮内边距 |
| 6 | 24px | 1.5rem | 卡片间距、区块间距 |
| 8 | 32px | 2rem | 大间距、表单分组 |
| 12 | 48px | 3rem | 页面段落间距 |
| 16 | 64px | 4rem | 大区块间隔 |
| 24 | 96px | 6rem | 页面头部/底部间距 |
| 32 | 128px | 8rem | 超大留白（Hero 区域） |

### 4.3 组件内间距

- 按钮: 水平 16px (md) / 12px (sm) / 24px (lg)，垂直 8px (md) / 6px (sm) / 12px (lg)
- 输入框: 水平 12px，垂直 8px
- 卡片: padding 24px (内部)，gap 16px (子元素)
- 列表项: padding 12px 16px
- Modal: padding 24px

### 4.4 组件间间距

- 导航项间距: 24px
- 同组按钮间距: 8px
- 表单标签与输入框间距: 6px
- 卡片网格 gap: 24px (桌面) / 16px (移动)

### 4.5 页面布局栅格

| 属性 | 值 |
|------|-----|
| 最大内容宽度 | 1280px |
| 页面 padding | 24px (移动) / 32px (桌面) |
| 侧边栏宽 | 320px (生成页左侧面板) |
| 预览区 | flex-1 (剩余空间) |

### 4.6 断点

| Breakpoint | Min Width | 目标设备 |
|-----------|-----------|---------|
| sm | 640px | 大屏手机 |
| md | 768px | 平板 |
| lg | 1024px | 小屏笔记本 |
| xl | 1280px | 桌面 |
| 2xl | 1536px | 大屏桌面 |

移动端优先，但核心体验在桌面（创作工具属性）。

---

## 5. 圆角系统

### 5.1 梯度

| Token | Value | 用途 |
|-------|-------|------|
| none | 0px | 面板直角、布局容器 |
| sm | 4px | 标签、badge |
| md | 6px | 输入框、普通按钮 |
| lg | 8px | 卡片、下拉菜单 |
| xl | 12px | 模态框、大卡片 |
| 2xl | 16px | 弹窗、视频容器 |
| full | 9999px | 头像、pill 按钮、tag |

### 5.2 使用规则

- 按钮: md (6px) / 小按钮 sm (4px)
- 卡片: lg (8px) — **所有卡片统一**
- 输入框: md (6px)
- 头像: full (圆形)
- 模态框: xl (12px)
- 视频生成预览框: 2xl (16px)
- Tooltip: md (6px)
- **不要混合使用不同圆角在同级元素上**

---

## 6. 阴影系统

### 6.1 梯度 (Light)

| Level | Shadow | 使用场景 |
|-------|--------|---------|
| sm | `0 1px 2px 0 rgba(0,0,0,0.05)` | 轻微悬浮 |
| md | `0 4px 6px -1px rgba(0,0,0,0.1)` | 默认卡片 |
| lg | `0 10px 15px -3px rgba(0,0,0,0.1)` | hover 卡片 |
| xl | `0 20px 25px -5px rgba(0,0,0,0.15)` | 模态框/下拉 |
| 2xl | `0 25px 50px -12px rgba(0,0,0,0.25)` | 抽屉/弹窗 |
| glow | `0 0 20px rgba(99,102,241,0.35)` | CTA 按钮焦点/活跃态 |

### 6.2 暗色模式策略

暗色模式下，阴影改用 overlay 半透明黑：
- 层级越低阴影越不明显（因为暗色背景自身已有深度感）
- 使用 `box-shadow` + `outline` 组合替代纯阴影
- glow 效果在暗色下增强到 `0 0 30px rgba(99,102,241,0.5)`

```css
/* 暗色模式阴影覆盖 */
.dark .shadow-card {
  box-shadow: 0 0 0 1px rgba(255,255,255,0.05), 0 4px 6px rgba(0,0,0,0.4);
}
```

---

## 7. 动效系统

### 7.1 缓动函数

| Name | Cubic-Bezier | 感受 |
|------|-------------|------|
| ease-out | `cubic-bezier(0.16, 1, 0.3, 1)` | 迅速开始，柔和结束（默认） |
| ease-in | `cubic-bezier(0.4, 0, 1, 1)` | 渐入（仅用于退出动画） |
| ease-in-out | `cubic-bezier(0.65, 0, 0.35, 1)` | 进入 + 退出组合 |
| spring | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 弹性感（仅用于 toast / badge 出现） |

### 7.2 动效时长

| Token | ms | 用途 |
|-------|----|------|
| instant | 0ms | 状态切换（无动效） |
| fast | 100ms | hover / active 微反馈 |
| normal | 200ms | 标准过渡（颜色/边框变化） |
| slow | 300ms | 面板展开/折叠 |
| slower | 500ms | 页面过渡、模态框出现 |

### 7.3 标准过渡组合

| 场景 | Property | Duration | Easing |
|------|----------|----------|--------|
| button hover | background-color, box-shadow | 100ms | ease-out |
| button active | transform: scale(0.97) | 100ms | ease-out |
| card hover | transform: translateY(-2px), box-shadow | 200ms | ease-out |
| modal appear | opacity + transform: scale(0.95→1) | 200ms | ease-out |
| modal disappear | opacity | 150ms | ease-in |
| slide-in (right) | transform: translateX(100%→0) | 300ms | ease-out |
| slide-out (right) | transform: translateX(0→100%) | 200ms | ease-in |
| skeleton pulse | opacity | 1.5s infinite | ease-in-out |
| toast in | transform + opacity | 300ms | spring |
| spinner | transform: rotate | 1s infinite | linear |

### 7.4 禁用动效

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. 关键组件规范

### 8.1 Button

| Property | Primary | Secondary | Ghost | Link |
|----------|---------|-----------|-------|------|
| 背景 (默认) | primary-500 | neutral-800 (dark) / neutral-100 (light) | transparent | transparent |
| 背景 (hover) | primary-600 | neutral-700 (dark) / neutral-200 (light) | neutral-800/10 | transparent |
| 背景 (active) | primary-700 | neutral-600 (dark) / neutral-300 (light) | neutral-800/20 | transparent |
| 文字色 | white | text-primary | text-primary | primary-500 |
| 边框 | none | border-default | none | none |
| 圆角 | md (6px) | md (6px) | md (6px) | — |
| 下划线 (hover) | — | — | — | underline |

**尺寸：**
- sm: h-8 px-3 text-body-sm
- md (默认): h-10 px-4 text-body
- lg: h-12 px-6 text-body-lg

**Link Button 特例：** 只有 inline link 才加下划线。作为独立操作的 link-style button（如"查看详情"）不加下划线，只用颜色区分。

### 8.2 Input

| Property | Value |
|----------|-------|
| 高度 | 40px (sm) / 44px (md, 默认) / 52px (textarea) |
| 内边距 | px-3 py-2 |
| 圆角 | md (6px) |
| 背景 | surface (暗色下默认) / neutral-50 (浅色下) |
| 边框 | border-default |
| 边框 (focus) | border-focus + ring-2 ring-primary-500/20 |
| 文字色 | text-primary |
| placeholder | text-tertiary |
| 禁用态 | opacity-50 cursor-not-allowed |

**Textarea:** 默认 3 行，最小 2 行，最大 12 行，auto-grow。

### 8.3 Select / Dropdown

- 触发按钮样式同 Input
- 下拉面板: surface-elevated + border-default + shadow-xl + border-radius xl
- 选项: h-10 px-3，hover 时 background primary-500/10
- 选中项: background primary-500/15 + text primary-500
- 分组标题: text-caption text-tertiary uppercase tracking-wider

### 8.4 Card

| Property | 标准 | 悬浮 (hover) | 强调 (highlighted) |
|----------|------|-------------|-------------------|
| 背景 | surface-elevated | surface-elevated | surface-elevated |
| 边框 | border-subtle | border-default | border-focus |
| 阴影 | none | shadow-lg + translateY(-2px) | shadow-lg |
| 圆角 | lg (8px) | lg (8px) | lg (8px) |
| padding | 24px | 24px | 24px |
| 过渡 | 200ms ease-out | 200ms ease-out | 200ms ease-out |

### 8.5 Modal / Dialog

| Property | Value |
|----------|-------|
| overlay | surface-overlay (rgba(0,0,0,0.6/0.8)) |
| 面板背景 | surface-elevated |
| 圆角 | xl (12px) |
| padding | 24px |
| 最大宽度 | 480px (sm) / 640px (md) / 800px (lg) |
| 关闭按钮 | top-right, ghost size-sm |

### 8.6 Tooltip

| Property | Value |
|----------|-------|
| 背景 | neutral-900 (dark) / neutral-800 (light) |
| 文字色 | neutral-50 |
| 字号 | caption (12px) |
| 圆角 | md (6px) |
| padding | 6px 10px |
| 箭头 | 8px 等边三角形 |
| 出现延迟 | 300ms (hover) / 0ms (focus) |
| 消失延迟 | 100ms |

### 8.7 Badge / Tag / Chip

| Property | Badge | Tag | Chip |
|----------|-------|-----|------|
| 圆角 | full | md (6px) | full |
| 高度 | 20px | 24px | 28px |
| padding | 6px 8px | 4px 8px | 6px 12px |
| 字号 | caption (12px) | caption (12px) | body-sm (13px) |
| 默认背景 | primary-500/15 | neutral-800 (dark) | neutral-800 (dark) |

Badge 颜色变体: success (绿色底) / warning (黄色底) / error (红色底) / info (蓝色底) / brand (primary 底)

### 8.8 Avatar

| Size | px | rem | 适用 |
|------|----|-----|------|
| sm | 24px | 1.5rem | 列表头像 |
| md | 32px | 2rem | 评论/用户卡片 |
| lg | 40px | 2.5rem | 用户菜单 |
| xl | 64px | 4rem | 用户主页 |

Fallback: 用户首字母，背景 primary-500，文字 white，字重 semibold。

### 8.9 Toast / Notification

| Position | top-right |
|----------|-----------|
| 出现动画 | slide-in-right + fade (300ms, spring) |
| 消失动画 | fade (200ms, ease-in) |
| 自动消失 | 4s (success/info) / 不自动消失 (error) |
| 最大宽度 | 400px |
| 背景 | surface-elevated |
| 边框 | border-default |
| 圆角 | lg (8px) |
| padding | 12px 16px |
| icon | 左侧 20px, 语义色 |
| 关闭按钮 | ghost size-sm |

### 8.10 Tabs / Segmented Control

| Property | Tabs | Segmented Control |
|----------|------|-------------------|
| 容器 | 下划线式 | 填充式 |
| 活动指示 | border-b-2 primary-500 | bg primary-500/15 |
| 活动文字 | primary-500 | text-primary |
| 非活动文字 | text-secondary | text-secondary |
| 高度 | 40px | 36px |
| 间距 | 16px (gap) | 2px (gap) |
| padding | 0 | 4px (容器) |

### 8.11 Progress / Loading

| 类型 | 规格 |
|------|------|
| Spinner | 20px (inline) / 32px (loading页) / 48px (首次加载) |
| 进度条 | 高度 4px, 圆角 full, 背景色 neutral-800, 填充色 primary-500 |
| Skeleton | 圆角按子元素继承, 背景渐变动画: `bg-neutral-800 → bg-neutral-700` 循环 |

**视频生成等待** 必须显示：
1. 进度条（百分比）
2. 预计剩余时间
3. 当前阶段名称（"正在生成帧..." / "正在合成..."）

### 8.12 模型卡片（聚合站专用）

| Property | Value |
|----------|-------|
| 布局 | 图标 + 模型名 + 简短描述 + Provider 标签 + 状态 badge |
| 图标 | 36x36px, 圆角 lg |
| CTA | "生成" 按钮 (ghost, 右对齐) |
| 选中态 | border-focus + ring |
| 高度 | 72px (紧凑) / 96px (详细) |

### 8.13 模板卡片（聚合站专用）

| Property | Value |
|----------|-------|
| 布局 | 封面图 (16:9 或 9:16), 标题, Tag, 使用次数 |
| 封面 | 圆角 lg, object-cover |
| 封面 hover | transform: scale(1.02) + overlay |
| 操作 | 点击 → 加载 prompt 到生成面板 |

### 8.14 视频生成框（聚合站专用）

| Property | Value |
|----------|-------|
| 背景 | neutral-950 |
| 圆角 | 2xl (16px) |
| 比例 | 16:9 (横屏) / 9:16 (竖屏) — 根据模型切换 |
| 占位 | 居中 icon + "输入 prompt 开始生成" |
| 加载态 | 居中 spinner + 底部进度条 |
| 完成态 | 视频播放器控件 (play/pause/进度/音量/全屏/下载) |
| 边框 | border-subtle, 完成时变为 border-default |

---

## 9. 图标规范

### 9.1 选型

**Lucide Icons**。理由：
- 一致 24px 网格 + 2px stroke-width
- 和 Geist/Inter 的几何干净风格匹配
- tree-shakeable (按需加载)
- MIT 许可
- 有 React 官方包 `lucide-react`

### 9.2 尺寸

| Size | px | rem | 使用场景 |
|------|----|-----|---------|
| xs | 12px | 0.75rem | 内联标记、badge 内 |
| sm | 16px | 1rem | 输入框前图标、导航栏 |
| md | 20px | 1.25rem | 按钮图标、列表项 |
| lg | 24px | 1.5rem | 空状态、卡片标题图标 |
| xl | 32px | 2rem | 功能入口图标 |
| 2xl | 48px | 3rem | Hero 区域、大空状态 |

### 9.3 颜色规则

- 按钮内图标: 继承按钮文字色
- 导航图标: 活动态 primary-500, 非活动态 text-secondary
- 语义图标: 对应 semantic color
- 装饰性图标: text-tertiary 或 primary-400/50

---

## 10. 排版细节

### 10.1 大小写规则

| 场景 | Case | 示例 |
|------|------|------|
| 按钮文字 | Sentence case | "Generate video" / "Subscribe now" |
| 导航链接 | Sentence case | "AI Video Generator" / "Pricing" |
| 页面 H1 | Title Case | "AI Video Generator for Creators" |
| 标签/Badge | UPPERCASE | "NEW" / "BETA" / "POPULAR" |
| 表单标签 | Sentence case | "Prompt" / "Aspect ratio" |

### 10.2 标点

- 全英文站点，不使用中文标点
- 列表项末尾不加句号
- 段落和完整句子末尾加句号
- 标题一律不加句号

### 10.3 数字格式

- 千位分隔: `new Intl.NumberFormat('en-US')` → 12,345
- 价格: `$19.99/mo`
- 积分: `1,234 credits`

### 10.4 时间格式

- 相对时间（< 24h）: "2 hours ago" / "Just now" / "Yesterday"
- 绝对时间（> 24h）: "Mar 15, 2026"
- 视频时长: "3:24" (mm:ss) / "1:23:45" (h:mm:ss)

### 10.5 复数处理

使用 `Intl.PluralRules` 或库（如 `react-intl`）：
- "1 credit" / "2 credits"
- "1 video" / "3 videos"

---

## 11. 信息密度与节奏

### 11.1 单屏信息量上限

- 首屏（above the fold）: 不超过 7 个可扫描元素
- 功能列表: 每行不超过 3 个功能卡片
- 模型网格: 每行不超过 4 个模型卡片 (2xl) / 3 个 (xl) / 2 个 (md) / 1 个 (sm)

### 11.2 视觉重音分布

- 每屏（~100vh）不超过 **2 个强视觉重音**
- 强重音定义: 大字号对比 (>2x body)、品牌色填充、动效吸引
- 重音之间保持至少 2 个单位间距

### 11.3 留白占比

- 首屏: 留白 ≥ 40%
- 内容区: 留白 ≥ 25%
- 移动端: 留白 ≥ 15%

---

## 12. 微交互细节

### 12.1 按钮反馈

| 操作 | 反馈 |
|------|------|
| hover | 背景色变化 (100ms) + cursor |
| mousedown | transform: scale(0.97) (100ms) |
| click 完成 | 恢复原始状态 (100ms) |
| disabled | 无 hover 效果, cursor: not-allowed |

### 12.2 视频生成等待

1. **0-2s**: 按钮变为 loading spinner + "Generating..."
2. **2-10s**: 进度条出现 + "Analyzing your prompt..."
3. **10s+**: 进度百分比 + 预估剩余时间
4. **完成**: 按钮变为 "再生" + toast 通知

禁止出现：超过 3 秒没有任何视觉反馈。

### 12.3 Toast 规则

| 类型 | 出现 | 停留 | 消失 |
|------|------|------|------|
| success | 立即 | 4s | 自动 |
| error | 立即 | 持续 | 手动关闭 |
| info | 立即 | 3s | 自动 |
| warning | 立即 | 5s | 手动关闭或自动 |

### 12.4 滚动行为

- 模型列表/历史记录: 虚拟滚动或 20 条分页
- 页面滚动: smooth scroll behavior
- 长列表: 滚动条自定义样式 (thin, 半透明)

### 12.5 Hover 延迟

- Tooltip: 300ms 延迟 (避免快速划过时闪烁)
- Dropdown: 150ms 延迟 (子菜单)
- 卡片悬浮效果: 无延迟 (即时反馈)

---

## 13. 可访问性

### 13.1 对比度

| 级别 | 标准 | 达标要求 |
|------|------|---------|
| AA (普通文字) | ≥ 4.5:1 | 所有 body 文字必须满足 |
| AA (大文字 ≥18px/14px bold) | ≥ 3:1 | H4 及以上必须满足 |
| AAA (增强) | ≥ 7:1 | 尽可能满足，非强制 |

### 13.2 焦点环

```css
/* 全局焦点环 */
:focus-visible {
  outline: 2px solid theme('colors.primary.500');
  outline-offset: 2px;
  border-radius: 6px; /* 匹配组件圆角 */
}
/* 鼠标操作时隐藏焦点环 */
:focus:not(:focus-visible) {
  outline: none;
}
```

### 13.3 键盘导航

- Tab 顺序 = 视觉阅读顺序 (左→右, 上→下)
- 所有交互元素必须可 Tab 到达
- 下拉菜单: Enter 展开, Escape 收起, Arrow 导航
- Modal: 焦点锁定, Escape 关闭, Tab 循环

### 13.4 ARIA 辅助

- 所有图标按钮: `aria-label`
- 动态内容区域: `aria-live="polite"` (toast) / `aria-live="assertive"` (error)
- 进度指示器: `role="progressbar"` + `aria-valuenow`
- 选项卡: `role="tablist"` + `role="tab"` + `aria-selected`

---

## 14. 禁忌清单

1. **不要使用纯 #000 或纯 #FFF** — 用 neutral-950 / neutral-50 替代
2. **不要在 CTA 按钮上使用 emoji** — 分散注意力
3. **不要让卡片同时有 shadow + border** — 卡片要么有边框（浅色模式），要么有阴影（暗色模式），不同时存在
4. **不要用 box-shadow 模拟 glow** — 用 outline + ring 替代
5. **不要在暗色背景上使用灰色文字** — 用 primary 蓝色调或白色调
6. **不要在浅色背景上使用 primary-300 以上作为文字色** — 对比度不足
7. **不要使用超过 3 种字体** — display / body / mono 足矣
8. **按钮不要同时有 icon 和 right-arrow** — 过于冗余
9. **不要使用随机圆角** — 所有圆角必须从 tokens 中选择
10. **避免「死亡卡片网格」** — 每张卡片要有视觉差异（不同封面图/不同标签色）
11. **不要在加载时使用静态占位** — 必须用 skeleton 动效
12. **不要隐藏重要操作** — 所有 primary action 必须在 fold 内可见
13. **不要在同一页面使用超过 2 种按钮样式** — 选 primary + (ghost 或 secondary)
14. **不要为 SEO 落地页使用和产品页完全不同的设计语言** — 保持一致品牌感
15. **不要使用 `!important`** — 用 Tailwind 的优先级机制

---

## 15. 实现 Cheatsheet

### Tailwind 完整 Config

```js
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'body': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'body-lg': ['1rem', { lineHeight: '1.6' }],
        'h5': ['1.125rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        'h4': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        'h3': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        'h2': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.03em' }],
        'h1': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        'display': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
        'display-xl': ['4rem', { lineHeight: '1.05', letterSpacing: '-0.05em' }],
      },
      colors: {
        primary: {
          50: '#eef2ff',  100: '#e0e7ff',  200: '#c7d2fe',
          300: '#a5b4fc',  400: '#818cf8',  500: '#6366f1',
          600: '#4f46e5',  700: '#4338ca',  800: '#3730a3',
          900: '#312e81',  950: '#1e1b4b',
        },
        accent: {
          400: '#a78bfa',  500: '#8b5cf6',  600: '#7c3aed',
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config
```

### 全局 CSS 变量

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --surface: #ffffff;
    --surface-elevated: #fafafa;
    --surface-overlay: rgba(0, 0, 0, 0.6);
    --text-primary: #0a0a0a;
    --text-secondary: #525252;
    --text-tertiary: #a3a3a3;
    --text-disabled: #d4d4d4;
    --text-on-color: #ffffff;
    --border-default: #e5e5e5;
    --border-subtle: #f5f5f5;
    --border-strong: #a3a3a3;
    --border-focus: #6366f1;
  }

  .dark {
    --surface: #0a0a0a;
    --surface-elevated: #171717;
    --surface-overlay: rgba(0, 0, 0, 0.8);
    --text-primary: #fafafa;
    --text-secondary: #a3a3a3;
    --text-tertiary: #525252;
    --text-disabled: #404040;
    --text-on-color: #ffffff;
    --border-default: #262626;
    --border-subtle: #171717;
    --border-strong: #525252;
    --border-focus: #818cf8;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 必须安装的依赖

```bash
# 字体
npm install geist @next/font
# 或手动加载 Inter + Geist Mono via Google Fonts / CDN

# 图标
npm install lucide-react

# 动效（按需）
npm install framer-motion  # 大部分 UI 动效
npm install @react-spring/web  # 生成进度弹簧动画

# 可访问性
npm install @radix-ui/react-tooltip  # Tooltip
npm install @radix-ui/react-dialog   # Modal
npm install @radix-ui/react-tabs     # Tabs
npm install @radix-ui/react-dropdown-menu  # Dropdown

# 表单
npm install react-hook-form @hookform/resolvers zod
```

---

> 本文档共计约 7500 字，所有值可量化、可粘贴、可执行。
> 下一阶段：使用 Pencil MCP 生成视觉稿。
