/** Pretrain / brief corpus types for Agentic Slides. */

export type SourceKind = 'pdf' | 'docx' | 'md' | 'txt' | 'pptx' | 'note' | 'web' | 'image'

export type SourceLocator = {
  page?: number
  section?: string
  charStart?: number
  charEnd?: number
}

export type SourceDoc = {
  id: string
  kind: SourceKind
  title: string
  /** Original filename or URL */
  origin: string
  mimeType?: string
  /** Normalized plain text (may be truncated in UI) */
  text: string
  bytes?: number
  createdAt: string
  meta?: Record<string, string>
}

export type Chunk = {
  id: string
  sourceId: string
  text: string
  locator: SourceLocator
  /** Optional embedding vector id / hash */
  embeddingId?: string
}

export type WebHit = {
  id: string
  query: string
  url: string
  title: string
  snippet: string
  summary: string
  retrievedAt: string
  approved: boolean
}

export type AssetItem = {
  id: string
  filename: string
  mimeType: string
  caption: string
  urlOrPath: string
}

export type TalkIntent = {
  title: string
  audience: string
  durationMin: number
  goals: string[]
  density: 'low' | 'high'
  language: string
}

export type Citation = {
  sourceId: string
  chunkId?: string
  locator?: SourceLocator
  quote?: string
}

export type OutlineSlide = {
  id: string
  kind: 'title' | 'content' | 'quote' | 'media' | 'section'
  title: string
  bullets?: string[]
  speakerNotes?: string
  citations: Citation[]
  /** True when goals need a source the corpus lacks */
  needsSource?: boolean
  assetIds?: string[]
}

export type Outline = {
  id: string
  projectId: string
  slides: OutlineSlide[]
  version: number
  createdAt: string
}

export type BriefCheckpoint =
  | 'empty'
  | 'ingest'
  | 'index'
  | 'plan'
  | 'deck'

export type BriefProject = {
  id: string
  intent: TalkIntent
  sources: SourceDoc[]
  chunks: Chunk[]
  webHits: WebHit[]
  assets: AssetItem[]
  outline?: Outline
  /** Linked generated deck id once Create finishes */
  deckId?: string
  checkpoint: BriefCheckpoint
  webResearchEnabled: boolean
  updatedAt: string
}

export type ResearchSuggestion = {
  query: string
  reason: string
  relatedGoal?: string
}

export type RetrieveResult = {
  chunk: Chunk
  score: number
  source?: SourceDoc
}
