# CODEMAP

## Directory Responsibilities

| Path | Responsibility |
|------|---------------|
| `src/app/dashboard/page.tsx` | Main dashboard view |
| `src/app/checkin/page.tsx` | Daily check-in form |
| `src/app/crisis/page.tsx` | Crisis support page |
| `src/app/api/auth/` | SecondMe auth (login/logout/callback/me) |
| `src/app/api/checkin/route.ts` | Check-in CRUD |
| `src/app/api/crisis/route.ts` | Crisis request handler |
| `src/app/api/dashboard/stats/route.ts` | User statistics |
| `src/app/api/dashboard/leaderboard/route.ts` | Sobriety leaderboard |
| `src/app/api/dashboard/messages/route.ts` | Chat messages |
| `src/components/Dashboard.tsx` | Dashboard layout |
| `src/components/LoginButton.tsx` | Auth button |
| `src/components/StatsCard.tsx` | Stat display card |
| `src/lib/auth.ts` | Auth configuration |
| `src/lib/db.ts` | Prisma client singleton |
| `src/lib/secondme.ts` | SecondMe API client |

## Data Flow

```
User → /
     → Login (SecondMe OAuth)
     → Dashboard (stats + leaderboard)
     → Daily CheckIn → POST /api/checkin → Prisma → SQLite
     → Crisis Support → POST /api/crisis → Notify + track
     → Messages → GET/POST /api/dashboard/messages
```
