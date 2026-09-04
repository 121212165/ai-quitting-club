# Prompt Strategy Templates

> Fork of [Advanced Context Engineering for AI Agents](https://github.com/marcaurelsecond/Advanced-Context-Engineering-for-AI-Agents)
> Adapted for Next.js / TypeScript projects

These templates standardize how AI agents handle complex tasks, manage context, and ensure code quality. Each file below is a standalone strategy you can reference from any agent session.

## Quick Reference

| Strategy | File | When to Use |
|----------|------|-------------|
| **Structured Workflow** | [structured-workflow.md](structured-workflow.md) | Complex features, multi-file changes, brownfield projects |
| **Context Management** | [context-management.md](context-management.md) | Context window >35% full, session handoff, progress archiving |
| **Quality Assurance** | [quality-assurance.md](quality-assurance.md) | After code changes, before commit, multi-agent review |
| **Quick Reference** | [quick-reference.md](quick-reference.md) | Corrective, Looping, Sub-agent — condensed |

## Workflow Decision Tree

```
任务来了
│
├─→ 复杂 / 多文件 / 遗留代码
│   └─→ Structured Workflow (调研→计划→实施)
│
├─→ 上下文快满了 / 需要接力
│   └─→ Context Management (写 progress_summary.md)
│
├─→ 刚改完代码
│   └─→ Quality Assurance (审计改动)
│
└─→ Agent 跑偏 / 简单循环 / 派子任务
    └─→ Quick Reference (纠错 / Looping / Sub-agent)
```

## Integration

These templates are referenced from `CLAUDE.md` via:

```
See docs/prompts/ for AI agent interaction strategies.
```

Agents entering this project should check this directory when the task matches any of the triggers above.
