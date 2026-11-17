# Competitive landscape — Agentic Slides

Research date: 2026-11-17 (America/Buenos_Aires).

## Positioning wedge

Most tools do **either** “docs → slides” **or** “voice → live visuals”.  
Agentic Slides does **both**: **pre-train** a grounded deck from PDFs/research (optional web), then **live-mutate** it while presenting with confirm + style lock (frontend-slides).

## Live / voice co-presenter

| Project | Stars / status | What they do | Steal / avoid |
|---------|----------------|--------------|---------------|
| [zeroprep](https://github.com/ramsrigouthamg/zeroprep) | Live AI scenes from speech | WebRTC Realtime → visual tool calls; async images only if scene still current; PDF/PPTX export | **Steal:** stale-image guard, mic picker, model mini switch, rate limits on public deploy. **Avoid:** zero prep only — we want a prepared, style-locked deck first. |
| [dont-panic-deck-web](https://github.com/frahlg/dont-panic-deck-web) | Alpha cockpit | Titles via tools; audience SSE; **context prune** (90s / last 8 items); silence nudge at 25s | **Steal:** conversation pruning, echo current slide into model context, SSE audience sync, long-talk silence nudge. |
| [realtime-ai-presenter](https://github.com/anneincontext/realtime-ai-presenter) | Starter kit | Voice nav + Q&A; **PDF → deck**; tools `next/prev/goto` | **Steal:** PDF→deck path, deterministic nav tools. **Avoid:** agent speaking to the room as default. |
| [VoicePresentationEditor](https://github.com/TheDThompsonDev/VoicePresentationEditor) | Google Slides control | Realtime tools + Whisper dictation mode | **Steal:** Open/Closed tool registry; separate dictation vs agent modes. |
| [autopresentation](https://github.com/NewTurn2017/autopresentation) | Excalidraw live | Speech → whiteboard edits | Adjacent (whiteboard, not slides). |
| Present Presentations (talk) | Reveal.js live | Talking points + speech → bullets/images | Inspiration for “be present, not slide-bound”. |

## Docs → slides (pre-authoring)

| Project | Stars | What they do | Steal / avoid |
|---------|-------|--------------|---------------|
| [Paper2Slides](https://github.com/HKUDS/Paper2Slides) | ~3.8k | PDF/docs → RAG → analysis → plan → create; checkpoints; source-linked | **Steal:** 4-stage pipeline + checkpoints + citation/source links. |
| [presentation-ai](https://github.com/allweonedev/presentation-ai) | ~3k | Gamma-like OSS themes | Themes UX reference; we use frontend-slides instead. |
| [Presentia](https://github.com/diegoparras/presentia) | — | Prompt/docs/md → outline confirm → live stream generation | **Steal:** outline approval before render; Gamma-style progressive cards. |
| [SlidesAI](https://github.com/leehomyc/SlidesAI) | small | PDF extract (text/tables/figs) → themed PDF | Extract pipeline ideas. |
| [ChillDeck](https://github.com/Isha-upadhyay/ChillDeck) | small | Topic **or** doc **or** research query → multi-agent | **Steal:** optional web research as a first-class input mode. |
| [AIPPT](https://github.com/LRriver/AIPPT) | small | Controllable outline → per-slide edit → PPTX | Outline + edit loop. |
| [ppt-agent-skill](https://github.com/Akxan/ppt-agent-skill) / [frontend-slides](https://github.com/zarazhangrui/frontend-slides) | skills | Agent-authored HTML decks | Our visual backbone. |

## Gaps we fill

1. **Grounded prep + live agility** — corpus briefing *and* mid-talk mutation (competitors usually pick one).
2. **Confirm + dual buffer** — no half-baked slides on the audience screen.
3. **Style lock** — frontend-slides presets, not generic Gamma purple.
4. **Silent co-pilot** — listen/suggest; don’t compete with the speaker (unlike AI-presenter demos).
5. **Source-aware live inserts** — when mutating live, prefer retrieving from the pre-trained corpus before inventing.

## Concrete improvements adopted into Agentic Slides

| # | Improvement | Source |
|---|-------------|--------|
| 1 | **Pretrain / Brief corpus** pipeline (ingest → index → outline → generate) | Paper2Slides, Presentia, ChillDeck |
| 2 | Optional **web research** toggle | ChillDeck |
| 3 | **Outline confirm** before HTML generation | Presentia |
| 4 | **Source citations** on slides / speaker notes | Paper2Slides |
| 5 | Live **context prune** + echo current slide | Don’t Panic Deck |
| 6 | **Stale generation discard** (dual buffer already; extend to media) | ZeroPrep |
| 7 | Tool **registry** pattern | VoicePresentationEditor |
| 8 | Audience sync via SSE/Realtime | Don’t Panic Deck |
| 9 | Public deploy **rate limits** on session/generate | ZeroPrep |
| 10 | Pre-upload **asset library** with captions for live use | ZeroPrep |
