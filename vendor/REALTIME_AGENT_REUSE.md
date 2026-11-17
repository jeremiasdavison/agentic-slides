# Reuso desde Real-Time-Agent

Repo: https://github.com/jeremiasdavison/Real-Time-Agent  
Demo: https://real-time-agent-two.vercel.app

## Qué portar

| Pieza | Path origen | Uso en Agentic Slides |
|-------|-------------|--------------------|
| WebRTC + data channel | `hooks/useRealtimeAgent.ts` | Base de `useAgenticPresenter` |
| Validación de args | `validateFunctionArgs` | Guard de tools de deck |
| Session/SDP proxy | `app/api/session` (+ backend FastAPI si aplica) | Key efímera server-side |
| Idle + hard timers | mismos hooks | Control de costo en talks largos |
| Secure context messaging | errores de `getUserMedia` | Docs presenter |

## Qué NO portar

- Tools de menú/carrito/Mercado Pago
- Auto-speak al conectar (`response.create` de saludo)
- Audio out hacia speakers de sala (solo earpiece en modo Coach)

## Cambios de comportamiento

1. **Silent default** — no reproducir audio del agente en speakers
2. **Tools** — `get_deck_context`, `insert_slide`, `patch_slide`, `propose_only`, …
3. **Confirm gate** — tool results son propuestas hasta `Y`
4. **VAD** — umbral alto; pausas de talk más largas

## Prompt del sistema

Ver `docs/TOOLS.md` — co-piloto silencioso, no sommelier.
