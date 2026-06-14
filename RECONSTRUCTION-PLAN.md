# Reconstruction Plan

## Diagnosis
- Crisis responses: 3 hardcoded strings. No LLM call despite SecondMe integration existing.
- Check-in: 5-level mood system. Spec says binary.
- Duplicate: `Dashboard.tsx` component duplicates `dashboard/page.tsx`.
- Dead code: Achievement models, StatsCard, unused SecondMe functions.
- False claims: "AI 互相鼓励" when no AI is called.

## Plan

### Delete
1. `src/components/Dashboard.tsx` — duplicate of dashboard/page.tsx
2. `src/components/StatsCard.tsx` — never imported
3. `src/components/LoginButton.tsx` — never imported (page.tsx has inline login)

### Simplify Prisma
- Remove Achievement and UserAchievement models (no route uses them)
- Remove `achievements` relation from User

### Rebuild Crisis Button (P0)
- Call SecondMe `callAI()` for real AI response
- Remove hardcoded strings
- Honest messaging: "supportive messages" not "AI 伙伴"

### Rebuild Check-in (P0)
- Binary: "Did you drink today?" Yes/No
- Remove 5-level mood system
- Keep optional note

### Fix Branding
- Remove false AI claims from homepage
- Rename to honest description: peer support group with SecondMe integration
- Dashboard: "互助会消息" not "AI 伙伴的鼓励"

### Clean SecondMe Utils
- Remove unused: `callAIAct`, `getShades`, `getSoftMemory`
- Keep: `callSecondMeAPI`, `refreshAccessToken`, `getUserInfo`, `callAI`, `addNote`

## Verification
- `npm run build` must pass
