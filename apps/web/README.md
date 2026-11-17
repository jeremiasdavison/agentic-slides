# apps/web

Next.js host for Agentic Slides (pretrain brief + presenter HUD + audience).

## Planned routes

| Route | Role |
|-------|------|
| `/` | Project library |
| `/brief/[id]` | Pretrain: upload → research opt-in → outline → generate |
| `/present/[deckId]` | Presenter: HUD, mic, confirmations |
| `/p/[deckId]` | Audience: fullscreen deck only |
| `/api/session` | Realtime WebRTC SDP proxy (API key server-side) |
| `/api/brief/*` | Ingest, research, plan, generate, retrieve |

## Bootstrap (Fase 1+)

```bash
npx create-next-app@latest . --typescript --eslint --app --src-dir --no-tailwind --import-alias "@/*"
# or copy patterns from jeremiasdavison/Real-Time-Agent
```

Wire packages:

- `@agentic-slides/brief-corpus` for pretrain pipeline
- `@agentic-slides/deck-runtime` for live mutation

Port from Real-Time-Agent:

1. `hooks/useRealtimeAgent.ts` → `hooks/useAgenticPresenter.ts` (new tools + `retrieve_brief`, silent default)
2. Session/SDP route pattern (`/api/session`)
3. Idle + hard session timers + context prune

## Env

See `.env.example`. Mic requires `localhost` or HTTPS.
