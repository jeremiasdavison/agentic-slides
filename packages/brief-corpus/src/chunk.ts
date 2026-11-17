import type { Chunk, SourceDoc } from './types'

const DEFAULT_MAX_CHARS = 1200
const DEFAULT_OVERLAP = 150

/** Naive text chunker — replace with token-aware splitter in production. */
export function chunkSource(
  source: SourceDoc,
  opts?: { maxChars?: number; overlap?: number }
): Chunk[] {
  const maxChars = opts?.maxChars ?? DEFAULT_MAX_CHARS
  const overlap = opts?.overlap ?? DEFAULT_OVERLAP
  const text = source.text.replace(/\r\n/g, '\n').trim()
  if (!text) return []

  const chunks: Chunk[] = []
  let start = 0
  let i = 0
  while (start < text.length) {
    const end = Math.min(start + maxChars, text.length)
    const slice = text.slice(start, end).trim()
    if (slice) {
      chunks.push({
        id: `${source.id}-c${String(i).padStart(3, '0')}`,
        sourceId: source.id,
        text: slice,
        locator: { charStart: start, charEnd: end },
      })
      i += 1
    }
    if (end >= text.length) break
    start = Math.max(end - overlap, start + 1)
  }
  return chunks
}

export function chunkAll(sources: SourceDoc[]): Chunk[] {
  return sources.flatMap((s) => chunkSource(s))
}
