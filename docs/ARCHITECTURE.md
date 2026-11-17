# Architecture — Agentic Slides

## Goal

Two-phase product:

1. **Pretrain (Brief)** — upload PDFs/research/topics (+ optional approved web search) → indexed corpus → outline confirm → style-locked HTML deck.
2. **Live runtime** — listen while you speak and **mutate** the deck (upcoming slides first; current only with confirmation) **grounded in the brief corpus**, without flashing unfinished content to the audience.

## System diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ Pretrain / Brief                                                │
│  uploads (PDF/MD/DOCX/PPTX/notes) + talk goals                  │
│  optional web research (user-approved queries)                  │
│  ingest → index → outline → generate (frontend-slides style)    │
│  checkpoints + source citations                                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │ deckId + briefProjectId
                                ▼
┌──────────────────┐   WebRTC    ┌──────────────────────┐
│ Presenter View   │────────────▶│ OpenAI Realtime API  │
│ HUD + mic + keys │◀────────────│ VAD + Whisper + tools│
└────────┬─────────┘  events     └──────────┬───────────┘
         │                                  │ function calls
         │                     retrieve_brief (RAG)
         │                                  ▼
         │                       ┌──────────────────────┐
         │                       │ Mutation Engine      │
         │                       │ validate → generate  │
         │                       │ dual-buffer preview  │
         │                       │ stale-media discard  │
         │                       └──────────┬───────────┘
         │                                  │ DeckPatch
         ▼                                  ▼
┌────────────────────────────────────────────────────────┐
│ Deck Runtime (packages/deck-runtime)                   │
│  1920×1080 fixed stage · versioned slide model         │
│  patch / insert / goto · crossfade apply               │
└───────────────────────────┬────────────────────────────┘
                            │ sync (version + ops / SSE)
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

### `packages/brief-corpus`

Pretrain pipeline (see `docs/PRETRAIN.md`):

- Types: `BriefProject`, `SourceDoc`, `Chunk`, `Outline`, `WebHit`
- `runIngestAndIndex` · `draftOutline` · `suggestResearchQueries` · `retrieve`
- Source-linked outline; live RAG for `retrieve_brief`

### `packages/deck-runtime`

Framework-agnostic TypeScript:

- Parse deck HTML → `Deck` model (`slides[]`, tokens, version, optional `briefProjectId`)
- `SlidePresentation` controller (nav, scale, visibility via `.active`/`.visible`)
- Mutation API: `applyPatch(patch)`, `previewPatch(patch)`, `rollback(version)`
- Density checks before apply (no overflow on 16:9 stage)

### `apps/web`

Next.js host:

| Route | Purpose |
|-------|---------|
| `/` | Library / create project |
| `/brief/[id]` | Pretrain UI: upload → research → outline → generate |
| `/p/[deckId]` | Audience view |
| `/present/[deckId]` | Presenter HUD + listening |
| `/api/session` | Realtime SDP / ephemeral session proxy |
| `/api/brief/*` | Ingest, research, plan, generate, retrieve |
| `/api/generate-slide` | Optional server-side HTML generation (style-locked) |

### Listening layer (`useAgenticPresenter`)

Port of Real-Time-Agent `useRealtimeAgent` with different tools and **silent-by-default** policy:

- Mic → WebRTC peer connection
- Server VAD tuned for talks (`threshold ≈ 0.85`, `silence_duration_ms ≈ 700–900`)
- Transcription → rolling context window + deck outline + **brief retrieval**
- Function calls → Mutation Engine (never raw DOM from the model)
- **Context prune** for long talks (Don’t Panic Deck): drop items older than ~90s, keep last N
- **Echo current slide** title/id into the model after every nav/mutation
- **Silence nudge** if continuous speech never trips end-of-turn VAD
- Tool **registry** (Open/Closed) instead of giant switch growth

Reuse from Real-Time-Agent:

- Ephemeral session / SDP proxy (API key stays server-side)
- Arg validation guards
- Idle + hard session timeouts for cost control
- Secure-context checks (`localhost` / HTTPS)

## Mutation flow

1. Intent detected (`command` | `note_gap` | `audience_q`)
2. Optional `retrieve_brief` → grounded draft
3. Tool returns a **proposal** (`DeckPatch` + optional `previewHtml`)
4. HUD shows thumbnail + confidence + source chips
5. Presenter `Y` → apply to runtime → bump `version` → sync audience
6. Presenter `N` → discard; keep listening
7. Async media: apply only if generation token still matches current proposal (ZeroPrep stale-guard)

**v1 rule:** prefer `insert_slide` *after* current index over mutating the visible slide.

## Sync

- Source of truth: presenter runtime
- Audience receives `{ version, ops }` or full snapshot on reconnect
- Transport candidates: Supabase Realtime channel per `deckId`+`sessionId`, PartyKit, or SSE rooms (Don’t Panic Deck)

## Security & cost

- OpenAI key only on server
- Validate every tool arg (IDs, enums, max bullets, max HTML size)
- Session hard cap + idle timeout (proven in Real-Time-Agent)
- Rate limits on `/api/session`, `/api/brief/*/generate`, research fetch (public deploy)
- Optional freeze mode disables tools mid-talk
- Web research never runs without explicit user approval

## Non-goals (v1)

- Multi-presenter collaborative editing
- Replacing PowerPoint for corporate offline workflows
- Fully autonomous on-stage AI that speaks for the presenter
- Silent automatic web crawling

## See also

- `docs/PRETRAIN.md` — brief corpus pipeline
- `docs/COMPETITIVE.md` — similar projects and adopted improvements
- `docs/LISTENING.md` · `docs/TOOLS.md` · `docs/MVP.md`
