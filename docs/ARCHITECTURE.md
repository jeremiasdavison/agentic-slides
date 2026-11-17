# Architecture — Agentic Slides

## Goal

A presentation runtime that **listens** while you speak and **mutates** the deck (upcoming slides first; current slide only with confirmation) using generative AI, without flashing unfinished content to the audience.

## System diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ Authoring (pre-talk)                                            │
│  Cursor/Claude + frontend-slides skill                          │
│  → single-file HTML deck + style tokens + optional PPTX import  │
└───────────────────────────────┬─────────────────────────────────┘
                                │ load
                                ▼
┌──────────────────┐   WebRTC    ┌──────────────────────┐
│ Presenter View   │────────────▶│ OpenAI Realtime API  │
│ HUD + mic + keys │◀────────────│ VAD + Whisper + tools│
└────────┬─────────┘  events     └──────────┬───────────┘
         │                                  │ function calls
         │                                  ▼
         │                       ┌──────────────────────┐
         │                       │ Mutation Engine      │
         │                       │ validate → generate  │
         │                       │ dual-buffer preview  │
         │                       └──────────┬───────────┘
         │                                  │ DeckPatch
         ▼                                  ▼
┌────────────────────────────────────────────────────────┐
│ Deck Runtime (packages/deck-runtime)                   │
│  1920×1080 fixed stage · versioned slide model         │
│  patch / insert / goto · crossfade apply               │
└───────────────────────────┬────────────────────────────┘
                            │ sync (version + ops)
                            ▼
                 ┌──────────────────────┐
                 │ Audience View        │
                 │ fullscreen deck only │
                 └──────────────────────┘
```

## Packages

### `skills/frontend-slides`

Vendored copy or git submodule of [frontend-slides](https://github.com/zarazhangrui/frontend-slides). Used for:

- Authoring new decks (agent skill workflow)
- Style presets + bold template pack (style lock source of truth)
- `viewport-base.css` invariants
- Deploy/PDF scripts

### `packages/deck-runtime`

Framework-agnostic TypeScript:

- Parse deck HTML → `Deck` model (`slides[]`, tokens, version)
- `SlidePresentation` controller (nav, scale, visibility via `.active`/`.visible`)
- Mutation API: `applyPatch(patch)`, `previewPatch(patch)`, `rollback(version)`
- Density checks before apply (no overflow on 16:9 stage)

### `apps/web`

Next.js host:

| Route | Purpose |
|-------|---------|
| `/` | Library / create deck |
| `/p/[deckId]` | Audience view |
| `/present/[deckId]` | Presenter HUD + listening |
| `/api/session` | Realtime SDP / ephemeral session proxy |
| `/api/generate-slide` | Optional server-side HTML generation (style-locked) |

### Listening layer (`useAgenticPresenter`)

Port of Real-Time-Agent `useRealtimeAgent` with different tools and **silent-by-default** policy:

- Mic → WebRTC peer connection
- Server VAD tuned for talks (`threshold ≈ 0.85`, `silence_duration_ms ≈ 700–900`)
- Transcription → rolling context window + deck outline
- Function calls → Mutation Engine (never raw DOM from the model)

Reuse from Real-Time-Agent:

- Ephemeral session / SDP proxy (API key stays server-side)
- Arg validation guards
- Idle + hard session timeouts for cost control
- Secure-context checks (`localhost` / HTTPS)

## Mutation flow

1. Intent detected (`command` | `note_gap` | `audience_q`)
2. Tool returns a **proposal** (`DeckPatch` + optional `previewHtml`)
3. HUD shows thumbnail + confidence
4. Presenter `Y` → apply to runtime → bump `version` → sync audience
5. Presenter `N` → discard; keep listening

**v1 rule:** prefer `insert_slide` *after* current index over mutating the visible slide.

## Sync

- Source of truth: presenter runtime
- Audience receives `{ version, ops }` or full snapshot on reconnect
- Transport candidates: Supabase Realtime channel per `deckId`+`sessionId`, or PartyKit

## Security & cost

- OpenAI key only on server
- Validate every tool arg (IDs, enums, max bullets, max HTML size)
- Session hard cap + idle timeout (proven in Real-Time-Agent)
- Optional freeze mode disables tools mid-talk

## Non-goals (v1)

- Multi-presenter collaborative editing
- Replacing PowerPoint for corporate offline workflows
- Fully autonomous on-stage AI that speaks for the presenter
