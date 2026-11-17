import { chunkAll } from './chunk'
import { suggestResearchQueries } from './research'
import type {
  BriefProject,
  Outline,
  OutlineSlide,
  SourceDoc,
  TalkIntent,
  WebHit,
} from './types'
import { retrieve } from './retrieve'

function now(): string {
  return new Date().toISOString()
}

function id(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function createBriefProject(
  intent: TalkIntent,
  opts?: { webResearchEnabled?: boolean }
): BriefProject {
  return {
    id: id('brief'),
    intent,
    sources: [],
    chunks: [],
    webHits: [],
    assets: [],
    checkpoint: 'empty',
    webResearchEnabled: opts?.webResearchEnabled ?? false,
    updatedAt: now(),
  }
}

export function addSources(project: BriefProject, docs: SourceDoc[]): BriefProject {
  const sources = [...project.sources, ...docs]
  return {
    ...project,
    sources,
    updatedAt: now(),
  }
}

/** Stage 1–2: ingest + index (chunk). Embedding step is a later swap-in. */
export function runIngestAndIndex(project: BriefProject): BriefProject {
  const chunks = chunkAll(project.sources)
  return {
    ...project,
    chunks,
    checkpoint: 'index',
    updatedAt: now(),
  }
}

export function attachWebHits(project: BriefProject, hits: WebHit[]): BriefProject {
  const approved = hits.filter((h) => h.approved)
  const asDocs: SourceDoc[] = approved.map((h) => ({
    id: h.id,
    kind: 'web',
    title: h.title,
    origin: h.url,
    text: `${h.title}\n\n${h.summary}\n\n${h.snippet}`,
    createdAt: h.retrievedAt,
    meta: { query: h.query },
  }))
  const withDocs = addSources(project, asDocs)
  return runIngestAndIndex({
    ...withDocs,
    webHits: [...project.webHits, ...hits],
  })
}

/**
 * Stage 3: heuristic outline from goals + retrieval.
 * Production path should call an LLM with the same shape + user confirm.
 */
export function draftOutline(project: BriefProject): BriefProject {
  const slides: OutlineSlide[] = []

  slides.push({
    id: id('os'),
    kind: 'title',
    title: project.intent.title,
    speakerNotes: `Audiencia: ${project.intent.audience}. Duración ~${project.intent.durationMin} min.`,
    citations: [],
  })

  for (const goal of project.intent.goals) {
    const hits = retrieve(project, goal, 3)
    const citations = hits.map((h) => ({
      sourceId: h.chunk.sourceId,
      chunkId: h.chunk.id,
      locator: h.chunk.locator,
      quote: h.chunk.text.slice(0, 180),
    }))
    const bullets = hits.length
      ? hits.map((h) => summarizeBullet(h.chunk.text))
      : [`Punto clave sobre: ${goal}`]

    slides.push({
      id: id('os'),
      kind: 'content',
      title: goal,
      bullets: bullets.slice(0, project.intent.density === 'low' ? 3 : 5),
      citations,
      needsSource: hits.length === 0,
      speakerNotes: hits.length
        ? `Fuentes: ${citations.map((c) => c.sourceId).join(', ')}`
        : 'Sin cobertura en corpus — agregar archivo, habilitar web, o marcar como framing.',
    })
  }

  slides.push({
    id: id('os'),
    kind: 'section',
    title: 'Cierre / próximos pasos',
    bullets: ['Resumen', 'CTA o pregunta abierta'],
    citations: [],
  })

  const outline: Outline = {
    id: id('outline'),
    projectId: project.id,
    slides,
    version: (project.outline?.version ?? 0) + 1,
    createdAt: now(),
  }

  return {
    ...project,
    outline,
    checkpoint: 'plan',
    updatedAt: now(),
  }
}

function summarizeBullet(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= 140) return clean
  return `${clean.slice(0, 137)}…`
}

export function listResearchGaps(project: BriefProject) {
  return suggestResearchQueries(project)
}

/** Validate outline before Create — returns blocking issues. */
export function validateOutlineForGenerate(project: BriefProject): string[] {
  const issues: string[] = []
  if (!project.outline?.slides.length) issues.push('Falta outline')
  const needy = project.outline?.slides.filter((s) => s.needsSource) ?? []
  if (needy.length) {
    issues.push(
      `${needy.length} slide(s) sin fuente: ${needy.map((s) => s.title).join('; ')}`
    )
  }
  if (project.checkpoint !== 'plan' && project.checkpoint !== 'deck') {
    issues.push(`Checkpoint actual: ${project.checkpoint} (se espera plan)`)
  }
  return issues
}

export function markDeckGenerated(project: BriefProject, deckId: string): BriefProject {
  return {
    ...project,
    deckId,
    checkpoint: 'deck',
    updatedAt: now(),
  }
}
