import type { BriefProject, Chunk, RetrieveResult, SourceDoc } from './types'

/** Simple lexical score — swap for embeddings later. */
function scoreChunk(query: string, chunk: Chunk): number {
  const q = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2)
  if (!q.length) return 0
  const hay = chunk.text.toLowerCase()
  let hits = 0
  for (const term of q) {
    if (hay.includes(term)) hits += 1
  }
  return hits / q.length
}

export function retrieve(
  project: BriefProject,
  query: string,
  k = 5
): RetrieveResult[] {
  const byId = new Map<string, SourceDoc>(project.sources.map((s) => [s.id, s]))
  const scored = project.chunks
    .map((chunk) => ({
      chunk,
      score: scoreChunk(query, chunk),
      source: byId.get(chunk.sourceId),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
  return scored.slice(0, k)
}
