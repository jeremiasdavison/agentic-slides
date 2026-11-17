# apps/web

Next.js host for Agentic Slides (authoring + presenter HUD + audience).

## Planned routes

| Route | Role |
|-------|------|
| `/` | Deck library |
| `/present/[deckId]` | Presenter: HUD, mic, confirmations |
| `/p/[deckId]` | Audience: fullscreen deck only |
| `/api/session` | Realtime WebRTC SDP proxy (API key server-side) |

## Bootstrap (Fase 1+)

```bash
npx create-next-app@latest . --typescript --eslint --app --src-dir --no-tailwind --import-alias "@/*"
# or copy patterns from jeremiasdavison/Real-Time-Agent
```

Port from Real-Time-Agent:

1. `hooks/useRealtimeAgent.ts` → `hooks/useAgenticPresenter.ts` (new tools, silent default)
2. Session/SDP route pattern (`/api/session`)
3. Idle + hard session timers

## Env

See `.env.example`. Mic requires `localhost` or HTTPS.
