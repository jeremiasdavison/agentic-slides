# MVP — Agentic Slides

## Vertical slices

### A — Pretrain demo

> Subir 1–2 PDFs + temas a hablar → (opcional) aprobar búsquedas web → confirmar outline → generar deck HTML style-locked con citas.

### B — Live mutate demo

> Decir: *"agregá un slide con tres bullets sobre X"* → `retrieve_brief` → HUD propone preview citado → `Y` → audiencia ve crossfade.

## Fases

### Fase 0 — Spec & scaffold ✅

- [x] Principios de producto
- [x] Architecture + tool surface
- [x] Competitive research + Pretrain design
- [x] `deck-runtime` + `brief-corpus` stubs

### Fase 1 — Pretrain / Brief corpus

**Done when:** upload PDF/MD + goals → ingest/index → outline con citas → usuario confirma → deck HTML stub generado (aunque sea template simple).

- [ ] Upload UI + storage (local/Vercel Blob/Supabase)
- [ ] PDF/text extractors
- [ ] `runIngestAndIndex` + embeddings (or lexical v1)
- [ ] Opt-in web research (suggest → approve → fetch → `attachWebHits`)
- [ ] `draftOutline` + edit UI + `needsSource` warnings
- [ ] Style pick (frontend-slides) + generate HTML
- [ ] Checkpoints resume

### Fase 2 — Deck runtime + sync

**Done when:** cargar deck generada, navegar, sync presenter/audience.

- [ ] Parser HTML → `Deck` model
- [ ] Controller 1920×1080 (viewport-base rules)
- [ ] `applyPatch` + version bump
- [ ] Presenter + Audience routes
- [ ] Sync (Supabase / SSE)

### Fase 3 — Escucha activa grounded

**Done when:** mic transcribe, comando explícito → retrieve_brief → proposal HUD (sin auto-apply).

- [ ] `/api/session` SDP proxy
- [ ] `useAgenticPresenter`
- [ ] Tools: `retrieve_brief`, `get_deck_context`, `propose_only`, `insert_slide`
- [ ] Context prune + echo current slide
- [ ] HUD: transcript + proposal + source chips + `Y`/`N`/`F`
- [ ] Listen modes: Shadow | Confirm

### Fase 4 — Style-locked live generation

**Done when:** `insert_slide` respeta tokens del preset + density check + stale-media discard.

- [ ] Style token extraction
- [ ] Dual buffer + crossfade
- [ ] Async media guard (generation token)
- [ ] Reject/overflow → split or propose_only

### Fase 5 — Media + polish

- [ ] Asset library with captions (pre-upload)
- [ ] `queue_media` + placeholders
- [ ] Freeze, audience Q&A
- [ ] Rate limits + cost panel
- [ ] Export HTML/PDF/PPTX
- [ ] Public demo

## Acceptance criteria

| # | Criterio |
|---|----------|
| P1 | PDF + 3 goals → outline con ≥1 citation en slides grounded |
| P2 | Web research off by default; queries require approval |
| P3 | `needsSource` blocks silent invent unless user overrides |
| L1 | Deck carga en `/present` y `/p` |
| L2 | Comando voz → proposal &lt; 3s con source chip si hay hit |
| L3 | `Y` sync audience &lt; 500ms; `N` no muta |
| L4 | API keys never in browser |

## Out of scope MVP

- Auto-mutation of the current visible slide
- Agent speaking aloud to the room
- Full PPT round-trip editing
- Fine-tuning / LoRA
- Unattended web crawl
