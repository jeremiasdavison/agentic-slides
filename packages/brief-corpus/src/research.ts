import type { BriefProject, ResearchSuggestion, TalkIntent } from './types'

/**
 * Suggest web queries from talk goals that look under-covered by local sources.
 * Does NOT fetch the web — caller must get user approval, then call a search API.
 */
export function suggestResearchQueries(project: BriefProject): ResearchSuggestion[] {
  if (!project.webResearchEnabled) return []

  const corpus = project.sources
    .map((s) => `${s.title}\n${s.text}`)
    .join('\n')
    .toLowerCase()

  const suggestions: ResearchSuggestion[] = []
  for (const goal of project.intent.goals) {
    const tokens = goal.toLowerCase().split(/\s+/).filter((t) => t.length > 3)
    const covered = tokens.filter((t) => corpus.includes(t)).length
    const coverage = tokens.length ? covered / tokens.length : 1
    if (coverage < 0.45) {
      suggestions.push({
        query: buildQuery(project.intent, goal),
        reason: `El corpus local cubre poco el objetivo: "${goal}"`,
        relatedGoal: goal,
      })
    }
  }

  if (!suggestions.length && project.intent.title) {
    suggestions.push({
      query: `${project.intent.title} overview key facts ${project.intent.language}`,
      reason: 'Refresco general opcional para el título del talk',
    })
  }

  return suggestions.slice(0, 8)
}

function buildQuery(intent: TalkIntent, goal: string): string {
  const bits = [goal, intent.title, intent.audience].filter(Boolean)
  return bits.join(' — ')
}
