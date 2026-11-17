/**
 * Lightweight smoke without a TS build step.
 * Mirrors create → ingest → outline → research-gaps happy path.
 */
import assert from 'node:assert/strict'

function chunkText(text, max = 1200, overlap = 150) {
  const chunks = []
  let start = 0
  let i = 0
  while (start < text.length) {
    const end = Math.min(start + max, text.length)
    const slice = text.slice(start, end).trim()
    if (slice) chunks.push({ id: `c${i++}`, text: slice })
    if (end >= text.length) break
    start = Math.max(end - overlap, start + 1)
  }
  return chunks
}

function score(query, text) {
  const q = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2)
  const hay = text.toLowerCase()
  return q.filter((t) => hay.includes(t)).length / (q.length || 1)
}

const sourceText =
  'Los agentes de voz en tiempo real usan WebRTC y function calling. ' +
  'El dual buffer evita mostrar slides incompletas a la audiencia. '.repeat(40)

const chunks = chunkText(sourceText)
assert.ok(chunks.length >= 2, 'should produce multiple chunks')

const top = chunks
  .map((c) => ({ ...c, score: score('dual buffer audiencia', c.text) }))
  .sort((a, b) => b.score - a.score)[0]

assert.ok(top.score > 0, 'retrieve should hit dual buffer')

const goals = ['dual buffer', 'criptomonedas en Marte']
const corpus = sourceText.toLowerCase()
const gaps = goals.filter((g) => {
  const tokens = g.toLowerCase().split(/\s+/).filter((t) => t.length > 3)
  const covered = tokens.filter((t) => corpus.includes(t)).length
  return tokens.length && covered / tokens.length < 0.45
})
assert.deepEqual(gaps, ['criptomonedas en Marte'])

console.log('brief-corpus smoke OK', {
  chunks: chunks.length,
  topScore: top.score,
  gaps,
})
