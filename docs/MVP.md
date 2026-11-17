# MVP — Agentic Slides

## Vertical slice (demo en ~1 sprint técnico)

> Decir en voz alta: *"agregá un slide con tres bullets sobre X"* → HUD propone preview → `Y` → la audiencia ve la slide nueva con crossfade, en el mismo estilo de la deck.

## Fases

### Fase 0 — Spec & scaffold ✅

- [x] Principios de producto
- [x] Architecture + tool surface
- [x] Docs en repo / Notion

### Fase 1 — Deck runtime (sin IA)

**Done when:** podés cargar un HTML frontend-slides, navegar, y desde consola/HUD aplicar `insert_slide` / `patch_slide` locales.

- [ ] Parser HTML → `Deck` model
- [ ] Controller 1920×1080 (viewport-base rules)
- [ ] `applyPatch` + version bump
- [ ] Presenter route + Audience route
- [ ] Sync mínimo (Supabase channel o polling local)

### Fase 2 — Escucha activa

**Done when:** el mic transcribe, detecta un comando explícito, y propone un patch en el HUD (sin auto-apply).

- [ ] `/api/session` SDP proxy (patrón Real-Time-Agent)
- [ ] `useAgenticPresenter` (WebRTC + VAD + transcript)
- [ ] Tools: `get_deck_context`, `propose_only`, `insert_slide` (stub HTML)
- [ ] HUD: transcript + proposal card + `Y`/`N`/`F`
- [ ] Listen modes: Shadow | Confirm

### Fase 3 — Generación style-locked

**Done when:** `insert_slide` produce HTML que respeta tokens del preset (tipografía, colores, spacing) y pasa density check.

- [ ] Style token extraction from deck
- [ ] Generator prompt + template fragments
- [ ] Dual buffer + crossfade
- [ ] Reject/overflow → auto-split or propose_only

### Fase 4 — Media creativa

**Done when:** comando *"mostrá un diagrama de X"* encola placeholder → asset → reemplazo en slide.

- [ ] `queue_media` tool
- [ ] Placeholder slide states
- [ ] Image gen / URL embed path
- [ ] Video stub (URL o upload)

### Fase 5 — Product polish

- [ ] Freeze mode mid-talk
- [ ] Audience Q&A channel (text)
- [ ] Cost caps + session metrics
- [ ] Post-talk export (HTML + PDF scripts)
- [ ] Public demo + LinkedIn clip

## Acceptance criteria (Fase 2 demo)

| # | Criterio |
|---|----------|
| 1 | Deck de 5+ slides carga en `/present/[id]` y `/p/[id]` |
| 2 | Mic en localhost; transcript visible en HUD |
| 3 | Frase comando → proposal card &lt; 3s |
| 4 | `Y` aplica; audience refleja en &lt; 500ms |
| 5 | `N` descarta; deck intacta |
| 6 | API key nunca en el browser |

## Out of scope MVP

- Auto-mutation of the current visible slide
- Agent speaking aloud to the room
- Full PPT round-trip editing
- Multi-language audience captions (nice-to-have later)
