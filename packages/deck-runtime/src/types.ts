/** Core deck types for Agentic Slides runtime. */

export type ListenMode = 'shadow' | 'confirm' | 'auto' | 'coach'

export type SlideKind = 'title' | 'content' | 'quote' | 'media' | 'section'

export type StyleTokens = {
  preset: string
  vars: Record<string, string>
}

export type Slide = {
  id: string
  kind: SlideKind
  title?: string
  html: string
  notes?: string
  density: 'low' | 'high'
}

export type Deck = {
  id: string
  title: string
  style: StyleTokens
  slides: Slide[]
  version: number
  /** Optional link back to pretrain brief project */
  briefProjectId?: string
}

export type PatchOp =
  | { op: 'set_title'; value: string }
  | { op: 'set_body'; value: string }
  | { op: 'set_bullets'; value: string[] }
  | { op: 'highlight'; selector: string }

export type DeckPatch = {
  id: string
  baseVersion: number
  ops: Array<
    | { type: 'goto'; slideId?: string; index?: number }
    | { type: 'patch'; slideId: string; ops: PatchOp[] }
    | {
        type: 'insert'
        after: string | 'current'
        slide: Omit<Slide, 'id'> & { id?: string }
      }
    | { type: 'queue_media'; slideId?: string; mediaType: 'image' | 'video' | 'embed'; prompt?: string; url?: string }
  >
  previewHtml?: string
  confidence: number
  source: 'voice' | 'command' | 'audience' | 'manual'
  brief?: string
}

export type ApplyResult =
  | { ok: true; deck: Deck; applied: DeckPatch }
  | { ok: false; reason: string }
