# Quality Assurance: Code Review Prompt

Detects unintended breakage after code changes. Follows a two-phase model: developer documents → reviewer audits.

## Decision Tree

```
Need to review changes?
│
├─→ I made the changes (developer)
│   └─→ Use Part 1: Session Documentation
│
├─→ Someone else made them (reviewer)
│   ├─→ Single session → Part 2: Critical Breakage Detection
│   └─→ Multi-session → Part 2B: Multi-Session Review
│
├─→ Quick self-check (<5 files)
│   └─→ Use Part 2: Quick Single-Agent Review
│
└─→ Verifying fixes after review
    └─→ Use Part 3: Post-Fix Verification
```

---

## Part 1: Session Documentation (for the developer)

> Document every change made in this session:
>
> | File | Lines Changed | Type | Risk | Reasoning |
> |------|---------------|------|------|-----------|
> | src/auth.ts | +45/-12 | Refactor | Medium | Replaced deprecated library |
>
> Also document:
> - Patterns used
> - Testing recommendations
> - Verification steps for reviewer
>
> Save to `code_review_findings.md`.

---

## Part 2: Critical Breakage Detection (for the reviewer)

> Review changes for breakage, not enhancements. Run:
>
> ```
> git diff --stat [baseline] HEAD
> git diff [baseline] HEAD <filename>
> ```
>
> Check for:
>
> 1. **Truncation**: files with >50 deletions or >30% size reduction
> 2. **Deletion impact**: config/core → HIGH, UI → LOW
> 3. **Structural breaks**: missing imports, dangling exports
>
> For each issue, output:
> "Verify this issue exists and fix it: [problem]. [impact]. [solution]. @[file] ([lines])"
>
> Priority: config > core services > UI > new features
>
> Append findings to `code_review_findings.md`.

---

## Part 3: Post-Fix Verification (after fixes applied)

> Verify fixes resolved the issues:
>
> 1. Fix applied correctly?
> 2. No new issues introduced?
> 3. Related functionality still works?
> 4. Tests pass?
>
> Output:
> ```
> ✓ Issue #1: RESOLVED
> ✗ Issue #2: PARTIALLY RESOLVED - ...
> ⚠ New issue found: ...
> ```
>
> If all resolved → mark as ready for production.
> If new issues found → generate new "Verify and fix" prompts.

---

## Success Criteria

- [ ] All modified files documented
- [ ] Truncation check passed (no files with >50 deletions without justification)
- [ ] Import integrity verified
- [ ] Critical issues resolved
- [ ] Post-fix verification passed
