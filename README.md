# Agentic Slides

Presentaciones HTML **pre-entrenadas con tu material** (PDFs, research, temas) y **mutables en vivo** mientras presentás — con IA generativa, citas a fuentes, y confirmación para no romper el ritmo del talk.

Basado en:

- [zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides) — decks HTML 16:9, presets anti-slop, PPT→web
- [jeremiasdavison/Real-Time-Agent](https://github.com/jeremiasdavison/Real-Time-Agent) — OpenAI Realtime + WebRTC + function calling

Inspirado / diferenciado vs: [ZeroPrep](https://github.com/ramsrigouthamg/zeroprep), [Paper2Slides](https://github.com/HKUDS/Paper2Slides), [Don’t Panic Deck](https://github.com/frahlg/dont-panic-deck-web), [presentation-ai](https://github.com/allweonedev/presentation-ai) — ver [`docs/COMPETITIVE.md`](docs/COMPETITIVE.md).

## ¿Para qué?

1. **Antes del talk (Pretrain):** cargás PDFs, investigaciones, notas y “temas a hablar”. Si querés, aprobás búsquedas en internet. El sistema indexa el corpus, propone un outline con citas y genera la deck.
2. **Durante el talk:** olvidaste un punto o surgió una idea → el agente escucha, recupera del brief, propone un patch/slide → confirmás con `Y`/`N` → la audiencia ve un crossfade limpio.

## Principios

1. **Grounded first** — preferir corpus + citas antes de inventar
2. **Dual buffer** — generar off-stage → aplicar con crossfade (descartar media stale)
3. **Style lock** — presets frontend-slides, no slop genérico
4. **Confirm por default** — Shadow / Confirm / Auto / Coach
5. **Escucha pasiva** — sugiere; no habla por vos (coach en auricular opcional)
6. **Fixed 16:9** — invariante frontend-slides
7. **Web opt-in** — nunca crawlear sin aprobación

## Monorepo

```
apps/web/                    # Next.js — brief UI, presenter HUD, audience
packages/brief-corpus/       # Pretrain: ingest, index, outline, retrieve
packages/deck-runtime/       # Slide controller + mutation API
skills/frontend-slides/      # Vendor / submodule del skill
docs/                        # Architecture, Pretrain, Competitive, MVP…
vendor/                      # Notas de reuso Real-Time-Agent
```

## Roadmap (resumen)

| Fase | Entrega |
|------|---------|
| 0 | Spec + scaffold + competitive + pretrain design |
| 1 | Pretrain: upload → outline → generate |
| 2 | Deck runtime + sync presenter/audience |
| 3 | Escucha activa + `retrieve_brief` + HUD confirm |
| 4 | Live style-locked inserts + stale-media guard |
| 5 | Assets, Q&A, rate limits, export, demo |

Detalle: [`docs/PRETRAIN.md`](docs/PRETRAIN.md) · [`docs/MODES.md`](docs/MODES.md) (serio vs pitch) · [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) · [`docs/MVP.md`](docs/MVP.md) · [`docs/COMPETITIVE.md`](docs/COMPETITIVE.md)

## Stack

| Capa | Tech |
|------|------|
| Frontend | Next.js + TypeScript |
| Pretrain | `@agentic-slides/brief-corpus` + extractors + optional web search |
| Decks | HTML single-file (frontend-slides) |
| Voz | OpenAI Realtime via WebRTC |
| Sync | Supabase Realtime / SSE |
| Deploy | Vercel |

## Dev checks

```bash
node packages/brief-corpus/scripts/smoke.mjs
```

## Quick start (cuando esté cableado)

```bash
cp apps/web/.env.example apps/web/.env.local
npm install
npm run dev
```

Requiere `OPENAI_API_KEY` con acceso Realtime. Micrófono solo en `https` o `localhost`.

## Licencia

MIT
