# Quick Reference: Corrective, Looping, Sub-agent

Condensed versions of less frequently used strategies.

---

## Corrective Prompt

When an agent goes off track and needs a clean restart.

> Discard all previous outputs. Start fresh.
>
> **Do NOT** attempt: [failed approach]
> **Instead**, use: [preferred approach]
> **Current state**: [file/config status]
> **Goal**: [clear objective]
>
> Previous session failed because: [specific issue].

---

## Looping Prompt

For iterative tasks where the agent works through a checklist autonomously.

> Your ongoing objective: [task description]
>
> Process each cycle:
> 1. Check context usage. If >35%, create checkpoint.
> 2. Analyze current state.
> 3. Make one small, isolated change.
> 4. Write/run tests.
> 5. Update `iteration_log.md`.
> 6. Loop back to step 1.
>
> **Safety**: Stop after [N] iterations. Stop after [N] consecutive failures.
> **Log**: Maintain `iteration_log.md` with timestamps.

---

## Sub-agent Orchestration

When the primary agent is over capacity and needs to delegate research.

> Launch a sub-agent to research: [specific question]
>
> Limit scope to: [files/directories]
> Exclude: [what to skip]
>
> **Return format** (strict, max 200 words):
> ```
> ## Key Files
> - path/file.py:function() — purpose
>
> ## Data Flow
> 1. Step → Step → Step
>
> ## Key Findings
> - Bullet points only
> ```
>
> No full code. No verbose descriptions. Only what's needed for the next decision.
