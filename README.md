# Agentic Slides

Presentaciones HTML que **escuchan** al orador y **mutan en vivo** — próximas slides y, con confirmación, la slide actual — usando IA generativa sin romper el ritmo del talk.

Basado en:

- [zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides) — decks HTML 16:9, presets anti-slop, PPT→web
- [jeremiasdavison/Real-Time-Agent](https://github.com/jeremiasdavison/Real-Time-Agent) — OpenAI Realtime + WebRTC + function calling

## ¿Para qué?

Durante un talk olvidás un punto, surge una idea, o querés mostrar un video/diagrama que no estaba en la deck. Agentic Slides escucha (mic) y propone patches: insertar slide, editar bullets, encolar media. Vos confirmás con `Y`/`N` (modo default) y la audiencia ve un crossfade limpio — nunca un slide a medio generar.

## Principios

1. **Dual buffer** — generar off-stage → aplicar con crossfade
2. **Style lock** — mutaciones respetan el design system de la deck
3. **Confirm por default** — Shadow / Confirm / Auto / Coach
4. **Escucha pasiva** — el agente sugiere; no habla por vos (coach en auricular es opcional)
5. **Fixed 16:9** — invariante frontend-slides; sin reflow responsive en slides

## Monorepo

```
apps/web/                 # Next.js — authoring, presenter HUD, audience view
packages/deck-runtime/    # Slide controller + mutation API
skills/frontend-slides/   # Vendor / submodule del skill
docs/                     # Architecture, MVP, tool surface
vendor/                   # Notas de reuso desde Real-Time-Agent
```

## Roadmap (resumen)

| Fase | Entrega |
|------|---------|
| 0 | Spec + scaffold (este repo) |
| 1 | Deck runtime + sync presenter/audience |
| 2 | Escucha activa + HUD confirm |
| 3 | `insert_slide` / `patch_slide` con style lock |
| 4 | Media queue (image/video) |
| 5 | Freeze, Q&A, costos, demo pública |

Detalle: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) · [`docs/MVP.md`](docs/MVP.md) · [`docs/TOOLS.md`](docs/TOOLS.md)

## Stack

| Capa | Tech |
|------|------|
| Frontend | Next.js + TypeScript |
| Decks | HTML single-file (frontend-slides) |
| Voz | OpenAI Realtime via WebRTC |
| Sync | Supabase Realtime (o PartyKit) |
| Deploy | Vercel |

## Quick start (cuando esté cableado)

```bash
# apps/web
cp apps/web/.env.example apps/web/.env.local
npm install
npm run dev
```

Requiere `OPENAI_API_KEY` con acceso Realtime. Micrófono solo en `https` o `localhost`.

## Licencia

MIT — TBD al publicar.
