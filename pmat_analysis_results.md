# ai-support-group 代码质量分析报告

> 分析工具: drift v1.4.0 + TypeScript + Next.js build
> 分析日期: 2026-05-12

---

## 总体评分

| 维度 | 结果 |
|------|------|
| **drift 评分** | 38/100 MODERATE |
| **TypeScript 编译** | ✅ 零错误 |
| **Next.js Build** | ✅ 通过 |
| **实际健康度** | **B (良好)** — 扣除路由误报后 |

> drift 的 38/100 偏低是因为將 Next.js App Router 文件（`page.tsx`、`route.ts`、`layout.tsx`）报为 `dead-file`，
> 这些文件通过文件系统路由加载，不会被显式 import，属于误报。

---

## 关键发现

### 🔴 需要关注

| 问题 | 数量 | 说明 |
|------|------|------|
| **Large Function** | 5 | 页面组件函数超过 50 行，最大达 224 行 |
| **High Complexity** | 3 | 循环复杂度 > 10（Dashboard、Crisis、CheckIn 页面） |
| **Unused Export** | 8 | 导出但未引用的函数（如 `getCurrentUser`、`callSecondMeAPI`、`withAuth`） |
| **Debug Leftover** | 9 | `console.error`/`warn` 留在生产代码中 |
| **Hardcoded Config** | 20 | API 路径硬编码在组件中（`/api/crisis`、`/dashboard` 等） |

### 🟡 轻微问题

| 问题 | 数量 | 说明 |
|------|------|------|
| **Magic Number** | 11 | 硬编码数字（2000、3000、36、15 等） |
| **No Return Type** | 8 | 函数缺少显式返回类型 |
| **Unused Dependency** | 2 | `prisma`、`react-dom` 在 package.json 但未在源码中 import |

---

## 按文件评分

| 文件 | Score | 主要问题 |
|------|-------|---------|
| `src/app/crisis/page.tsx` | 100 | — |
| `src/app/dashboard/page.tsx` | 100 | — |
| `src/app/api/auth/callback/route.ts` | 100 | — |
| `src/app/checkin/page.tsx` | 96 | large-function, magic-number |
| `src/lib/secondme.ts` | 76 | console.error, unused-export |
| `src/lib/auth.ts` | 59 | console.error/warn, unused-export |
| `src/app/page.tsx` | 40 | large-function, hardcoded-config |
| `src/components/ErrorMessage.tsx` | 35 | hardcoded SVG xmlns URL |
| `src/lib/api-handler.ts` | 28 | console.error, unused-export |
| `src/components/LoadingSpinner.tsx` | 25 | hardcoded SVG xmlns URL |

---

## 与 PMAT 对比

| 特性 | PMAT (未装成功) | drift ✅ |
|------|----------------|----------|
| Windows 支持 | ❌ 缺 dlltool | ✅ npx 直接跑 |
| 评分系统 | A+~F (0-100) | ✅ 0-100 + MODERATE |
| 检测规则 | ~19 | ✅ 26 条 |
| 安装 | cargo install | ✅ npx |
| 误报率 | 低 | 中（App Router 路由文件） |

---

## 建议改进顺序

1. **提取 API 路径为常量** — 所有 `/api/*` 路径集中到配置文件
2. **清理未使用的导出** — 移除未引用的函数、或添加测试引用它们
3. **拆分大函数** — 将 >50 行的组件拆分为子组件
4. **替换 console.error 为日志工具** — 生产环境使用正式日志库
5. **提取 Magic Number 为命名常量**
6. **添加显式返回类型**
