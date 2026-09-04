# Context Management & Compaction

Prevents context window overflow and enables seamless agent-to-agent handoff.

## When to Compact

- Context window exceeds **35%** utilization
- After completing **3-4 major tasks** in one session
- Before ending a session (handoff preparation)

## Compaction Prompt

Tell the agent when threshold is reached:

> Generate or update `progress_summary.md` with:
>
> - **Completed**: what's finished, with verification status
> - **Current state**: exact file modifications
> - **Key decisions**: why certain approaches were chosen
> - **Blockers resolved**: obstacles overcome
> - **Next 2-3 steps**: specific file paths
> - **Risk assessment**: known issues / watchpoints
> - **Testing status**: what's validated, what needs tests
>
> Keep it under 500 words. Be precise. This is the only context the next agent will read.

## Handoff Prompt

When a new agent continues from `progress_summary.md`:

> You are continuing from `progress_summary.md`. Read it thoroughly.
>
> - **Do not** re-read previous outputs or chat history
> - Your understanding comes **exclusively** from `progress_summary.md`
> - Execute the first "Next Step" immediately
> - If you make significant progress, update `progress_summary.md`

## Context Window Zones

| Zone | Usage | Action |
|------|-------|--------|
| Green | 0-25% | Normal operation |
| Yellow | 25-40% | Plan compaction, reduce verbosity |
| Red | >40% | **Immediate compaction required** |

## Standard Output Files

| File | Content | Used By |
|------|---------|---------|
| `progress_summary.md` | Current state + next steps | Next agent session |
| `research_summary.md` | System analysis | Planning phase |
| `implementation_plan.md` | Detailed change plan | Implementation phase |
| `iteration_log.md` | Loop progress tracking | Looping workflows |
