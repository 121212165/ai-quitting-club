# Structured Workflow: Research → Plan → Implement

The most reliable pattern for complex or multi-file changes. Splits work into three isolated phases, each producing a handoff document.

## Phase 1 — Research

**Goal:** Understand the system before changing anything.

**Output:** `research_summary.md`

Tell the agent:

> Research the codebase thoroughly. Your output must include:
>
> - **System map**: component relationships
> - **File inventory**: paths, primary functions, dependencies
> - **Integration points**: exact line numbers where changes go
> - **Data flow**: how information moves through the system
> - **Risk assessment**: potential breaking changes
> - **Existing patterns**: conventions to follow
>
> Save as `research_summary.md`. Be precise — file paths and line numbers must be accurate.

**Checklist:**
- [ ] All relevant files identified
- [ ] Line numbers for insertion points confirmed
- [ ] Dependencies mapped
- [ ] Risks documented
- [ ] Saved to `research_summary.md`

---

## Phase 2 — Plan

**Goal:** Design every change before writing code.

**Input:** `research_summary.md`
**Output:** `implementation_plan.md`

Tell the agent:

> Based on `research_summary.md`, create a detailed implementation plan:
>
> - Step-by-step breakdown of every single change
> - Exact file paths for each change
> - Code snippets for additions/modifications
> - Rollback strategy
> - Testing hierarchy: unit → integration → system
> - Security considerations
>
> Save as `implementation_plan.md`. The plan must be concise enough for human review.

**Checklist:**
- [ ] Every file change listed with path
- [ ] Code snippets provided
- [ ] Rollback instructions included
- [ ] Test plan defined
- [ ] Saved to `implementation_plan.md`

---

## Phase 3 — Implement

**Goal:** Execute the plan precisely.

**Input:** `implementation_plan.md`

Tell the agent:

> Execute `implementation_plan.md` precisely. Do not deviate.
>
> - Implement changes file by file
> - Write unit tests for each change
> - Monitor context usage — if >40%, update plan file and compact
> - After each completed step, mark it in the plan
>
> If you encounter an unexpected issue: STOP, report, wait for instructions.

**Checklist:**
- [ ] Changes match the plan exactly
- [ ] Tests written and passing
- [ ] Context kept under 40% throughout
- [ ] Plan updated with completion status
- [ ] Ready for QA review
