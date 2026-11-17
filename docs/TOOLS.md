# Tool surface — Agentic Presenter Agent

Function calling tools exposed to OpenAI Realtime during a talk.
All args must be validated before side effects (see Real-Time-Agent guard pattern).

## Tools

### `retrieve_brief`

RAG over the pretrain corpus (see `docs/PRETRAIN.md`). Prefer this before inventing facts.

| Arg | Type | Notes |
|-----|------|-------|
| `query` | string | What the speaker needs |
| `k` | number | default 5, max 10 |

Returns chunks with `sourceId`, locator, score. If top score is low → use `propose_only`.

### `get_deck_context`

Read-only snapshot for the model.

```json
{
  "deckId": "string",
  "version": 12,
  "currentIndex": 3,
  "currentSlideId": "s-04",
  "outline": [{ "id": "s-01", "title": "…", "kind": "title" }],
  "style": { "preset": "bold-signal", "tokens": { "accent": "#…" } },
  "listenMode": "confirm",
  "frozen": false
}
```

### `propose_only`

HUD suggestion without mutating the deck.

| Arg | Type | Notes |
|-----|------|-------|
| `brief` | string | What to show the presenter |
| `rationale` | string | Why (from transcript) |
| `confidence` | number | 0–1 |

### `goto_slide`

| Arg | Type |
|-----|------|
| `slideId` \| `index` | string \| number |

Blocked when `frozen`.

### `patch_slide`

Low-risk edits to an existing slide (prefer non-visible slides in v1).

| Arg | Type | Notes |
|-----|------|-------|
| `slideId` | string | Must exist |
| `ops` | PatchOp[] | `set_title`, `set_body`, `set_bullets`, `highlight` |
| `requireConfirm` | boolean | default true |

Density: max 6 bullets; reject overflow.

### `insert_slide`

| Arg | Type | Notes |
|-----|------|-------|
| `after` | string \| "current" | Insert after this slide |
| `kind` | enum | `content` \| `quote` \| `media` \| `section` |
| `brief` | string | Content brief for generator |
| `requireConfirm` | boolean | default true |

Generator must use deck style tokens. Output is HTML fragment for the 1920×1080 stage.

### `duplicate_and_edit`

Clone a slide then apply a brief edit — safer than inventing layout from scratch.

### `queue_media`

| Arg | Type |
|-----|------|
| `type` | `image` \| `video` \| `embed` |
| `prompt` \| `url` | string |
| `slideId` | optional target |

Creates placeholder immediately; swaps asset when ready.

### `set_listen_mode`

| Arg | Values |
|-----|--------|
| `mode` | `shadow` \| `confirm` \| `auto` \| `coach` |

## System prompt sketch (presenter)

```
You are a silent co-pilot for a live presentation.
You listen to the speaker and the deck outline.
You NEVER speak to the audience.
You have access to a pretrain brief corpus — call retrieve_brief before inventing facts.
You call tools only when:
  (a) the speaker gives an explicit command, or
  (b) you detect a high-confidence content gap they clearly intended to cover.
Prefer propose_only or insert_slide AFTER the current slide.
Cite sourceIds in speaker notes when grounded.
Respect style lock and density limits.
If unsure, propose_only.
```

## Intent heuristics

| Signal | Action |
|--------|--------|
| "agregá / mostrá / poné un slide…" | `insert_slide` / `queue_media` |
| "olvidé / me faltó / quería decir…" | `propose_only` or `insert_slide` after current |
| "volvé a / andá a la slide…" | `goto_slide` |
| Filler / storytelling / jokes | `noop` |
| Low confidence | `propose_only` |

## Validation rules

- Slide IDs: `/^[a-z0-9-]{1,64}$/`
- Max `brief` length: 2k chars
- Max HTML patch size: 50k chars
- Reject unknown tool names
- Reject mutations when `frozen === true` (except `set_listen_mode` / `propose_only`)
