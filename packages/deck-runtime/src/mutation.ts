import type { ApplyResult, Deck, DeckPatch, Slide } from './types'

const SLIDE_ID_RE = /^[a-z0-9-]{1,64}$/
const MAX_BULLETS = 6

function newSlideId(deck: Deck): string {
  return `s-${String(deck.slides.length + 1).padStart(2, '0')}-${Math.random().toString(36).slice(2, 6)}`
}

/** Apply a confirmed patch. Caller must enforce listen-mode / freeze. */
export function applyPatch(deck: Deck, patch: DeckPatch): ApplyResult {
  if (patch.baseVersion !== deck.version) {
    return { ok: false, reason: `version mismatch: deck=${deck.version} patch=${patch.baseVersion}` }
  }

  const next: Deck = {
    ...deck,
    slides: deck.slides.map((s) => ({ ...s })),
    version: deck.version + 1,
  }

  for (const op of patch.ops) {
    switch (op.type) {
      case 'goto':
        // Navigation is handled by the controller; no model change.
        break

      case 'patch': {
        const idx = next.slides.findIndex((s) => s.id === op.slideId)
        if (idx < 0) return { ok: false, reason: `unknown slide ${op.slideId}` }
        const slide = { ...next.slides[idx] }
        for (const edit of op.ops) {
          if (edit.op === 'set_title') slide.title = edit.value
          if (edit.op === 'set_body') {
            // Body HTML updates are caller-supplied; keep opaque in v0.
            slide.html = edit.value
          }
          if (edit.op === 'set_bullets') {
            if (edit.value.length > MAX_BULLETS) {
              return { ok: false, reason: `max ${MAX_BULLETS} bullets` }
            }
          }
        }
        next.slides[idx] = slide
        break
      }

      case 'insert': {
        const slide: Slide = {
          id: op.slide.id && SLIDE_ID_RE.test(op.slide.id) ? op.slide.id : newSlideId(next),
          kind: op.slide.kind,
          title: op.slide.title,
          html: op.slide.html,
          notes: op.slide.notes,
          density: op.slide.density,
        }
        let at = next.slides.length
        if (op.after === 'current') {
          // Caller should resolve "current" before apply; treat as append if unresolved.
          at = next.slides.length
        } else {
          const afterIdx = next.slides.findIndex((s) => s.id === op.after)
          at = afterIdx < 0 ? next.slides.length : afterIdx + 1
        }
        next.slides.splice(at, 0, slide)
        break
      }

      case 'queue_media':
        // Placeholder insertion is a higher-level concern (generator).
        break
    }
  }

  return { ok: true, deck: next, applied: patch }
}
