# Pretrain (Brief) — corpus → deck

## Qué es

**Pretrain** no es fine-tuning de un modelo. Es el **briefing del talk**: el usuario carga PDFs, notas, investigaciones, temas y archivos; opcionalmente pide búsquedas en internet; el sistema construye un **corpus indexado**, propone un **outline**, y genera la deck HTML (frontend-slides) **citando fuentes**.

Ese corpus queda disponible también **durante el talk**: cuando mutás en vivo, el agente prioriza recuperar del brief antes de inventar.

## User journey

```
1. Nuevo proyecto
2. Subir fuentes (PDF, MD, DOCX, TXT, PPTX, imágenes con caption)
3. Escribir “temas a hablar” / speaker intent
4. Toggle: ¿buscar en internet? → queries sugeridas → aprobar
5. Ingest + chunk + index (checkpoint)
6. Outline propuesto → editar / confirmar
7. Style discovery (frontend-slides presets)
8. Generate deck (style-locked HTML)
9. Present → live listen/mutate with corpus RAG
```

## Pipeline (4 stages + checkpoints)

Inspired by Paper2Slides, adapted to our stack:

| Stage | Input | Output | Checkpoint |
|-------|-------|--------|------------|
| **1. Ingest** | files + notes | normalized docs (text, figures meta) | `checkpoint_ingest.json` |
| **2. Index** | docs | chunk embeddings / keyword+vector store | `checkpoint_index.json` |
| **3. Plan** | corpus + talk goals + optional web hits | `Outline` with source refs | `checkpoint_plan.json` |
| **4. Create** | outline + style tokens | `Deck` HTML (frontend-slides) | `checkpoint_deck.json` |

Resume/pause at any checkpoint (Presentia/Paper2Slides pattern).

## Inputs

### Local sources

| Type | Extensions | Extract |
|------|------------|---------|
| Documents | `.pdf` `.docx` `.md` `.txt` | text + page anchors |
| Decks | `.pptx` | via frontend-slides `extract-pptx.py` |
| Notes | paste / textarea | as `source: note` |
| Assets | `.png` `.jpg` `.webp` `.svg` + caption | asset library for live + generate |

### Talk intent

```ts
type TalkIntent = {
  title: string
  audience: string
  durationMin: number
  goals: string[]          // "temas a hablar"
  density: 'low' | 'high'
  language: 'es' | 'en' | string
}
```

### Optional web research

Only if the user **opts in**:

1. Planner suggests 3–8 search queries from gaps in the corpus vs goals
2. User approves / edits queries
3. Search → fetch top pages → summarize → add as `source: web` with URL + retrieved_at
4. Never silently browse; always show what will be searched

## Data model (see `@agentic-slides/brief-corpus`)

- `BriefProject` — container
- `SourceDoc` — one uploaded/fetched document
- `Chunk` — retrievable unit with `sourceId` + locator (page/section)
- `WebHit` — approved search result summary
- `Outline` / `OutlineSlide` — plan with `citations[]`
- `AssetItem` — captioned media for generate + live

## Generation rules

1. Every content slide should carry ≥1 citation when grounded content exists
2. If a goal has no corpus support and web is off → mark outline item as `needs_source` (user must add file, enable web, or accept “opinion/framing”)
3. Density + 16:9 limits from frontend-slides apply at Create
4. Style lock: tokens from chosen preset; no ad-hoc purple defaults

## Live talk integration

During present mode, tools gain:

- `retrieve_brief(query, k)` — RAG over pretrain corpus
- Live `insert_slide` / `patch_slide` prompts: *prefer retrieved chunks; cite sourceIds*

If retrieval confidence is low → `propose_only` instead of inventing facts.

## API surface (planned `apps/web`)

| Route | Role |
|-------|------|
| `POST /api/brief` | create project |
| `POST /api/brief/[id]/sources` | upload files |
| `POST /api/brief/[id]/ingest` | run ingest+index |
| `POST /api/brief/[id]/research` | suggest/run web queries (opt-in) |
| `POST /api/brief/[id]/plan` | generate outline |
| `PATCH /api/brief/[id]/outline` | user edits |
| `POST /api/brief/[id]/generate` | create deck HTML |
| `GET /api/brief/[id]/retrieve?q=` | RAG for live tools |

## UX notes

- Progressive disclosure: upload first, research second, outline third
- Show source chips on outline cards (click → snippet)
- Cost estimate before web fetch / generate
- Keep corpus local-first when possible (privacy for client PDFs)

## Non-goals (v1)

- Fine-tuning / LoRA of foundation models
- Automatic web crawl without approval
- Perfect OCR for scanned books (good-enough PDF text first)
