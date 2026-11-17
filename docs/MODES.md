# Modos de producto — Serio vs Pitch

Dos perfiles encima del mismo motor (Pretrain + Live). Cambian defaults de densidad, tools, risk y HUD — no hace falta otro producto.

## Shared (siempre)

- Style lock (frontend-slides)
- Dual buffer + confirm default
- Corpus grounded (`retrieve_brief`) antes de inventar
- Freeze (`F`) en beats críticos
- Audience view limpia (sin HUD)

---

## Modo Serio (talks formales, demos técnicas, clases, municipal/enterprise)

### Objetivo

Credibilidad > espectáculo. Una idea por slide. Citas visibles. Cero improvisación factual.

### Defaults

| Knob | Valor |
|------|--------|
| Density | `low` (speaker-led) |
| Listen mode | `confirm` (o `shadow` en ensayos) |
| Mutate current slide | off |
| Web research | off salvo gaps marcados |
| Auto patches | off |
| Citations | obligatorias en content slides |
| Coach voice | off (o auricular en ensayo) |

### Pretrain

- Fuentes: papers, PDFs internos, reports, políticas, datos aprobados
- Outline: secciones claras (contexto → evidencia → implicancia → Q&A)
- `needsSource=true` **bloquea** generate hasta resolver o override explícito
- Speaker notes = guion corto + citations, no párrafos
- Asset library: diagramas/screenshots reales, no stock genérico

### Live

- Tools permitidos: `retrieve_brief`, `propose_only`, `goto_slide`, `insert_slide` (solo after current), `patch_slide` (próximas)
- Tools restringidos: `queue_media` solo con URL/asset ya en brief; no image-gen libre
- Si surge una pregunta de audiencia → slide “Parking / Q&A” al final, no reescritura del argumento central
- Post-talk: export PDF + appendix de fuentes

### HUD serio

- Proposal cards muestran **source chips** primero, preview después
- Confidence alta requerida para `insert_slide`
- Indicador “frozen” muy visible en secciones legales/numéricas

### Anti-patrones

- No animaciones ruidosas mid-argument
- No inventar métricas
- No mutar la slide que está en pantalla salvo typo confirmado

---

## Modo Pitch (fundraising, venta, partnership)

### Objetivo

Narrativa + prueba social + cierre. Velocidad y claridad. Improvisar **objeciones** y **proof** con confirmación.

### Defaults

| Knob | Valor |
|------|--------|
| Density | `low` visual, beats cortos |
| Listen mode | `confirm` en sala; `auto` solo para typos en rehearsal |
| Timed beats | on (timer por sección) |
| Objection bank | on |
| Web research | opt-in pre-pitch (mercado/competidores) |
| Ask / CTA slide | siempre al final |

### Pretrain — arc canónico

1. Problema / dolor  
2. Por qué ahora  
3. Solución / producto  
4. Demo / how it works  
5. Mercado  
6. Tracción / métricas (validadas)  
7. Modelo de negocio  
8. Competencia / diferenciación  
9. Equipo  
10. Ask / próximos pasos  

Cada beat del outline mapea a ese arc. Si falta tracción → `needsSource` o slide “honest gap” (mejor que inventar).

### Pretrain — pitch-specific

- **Metrics ledger**: números solo desde CSV/fuente del brief; si el modelo inventa → reject (patrón Presentia charts)
- **Objection bank**: 5–10 objeciones típicas (“¿por qué no X?”, precio, timing) pre-generadas como slides ocultas
- **Competitor one-pagers** opcionales vía web research aprobado
- Duración target (5 / 8 / 12 min) → recorta bullets automáticamente

### Live — pitch

- Hotkeys: `O` = insertar próxima objeción relevante (desde bank + retrieve)
- `M` = flash métrica clave (solo del ledger)
- `A` = saltar a Ask
- Si el inversor pregunta algo no preparado → `propose_only` con draft; `Y` inserta **después** del beat actual
- Timer HUD: beat actual vs tiempo restante (no en audience screen)
- Rehearsal mode: graba transcript + marca slides flojas (“hablaste 90s en un slide de 20s”)

### Anti-patrones

- No 15 bullets por slide
- No generar imagen decorativa mid-pitch
- No auto-aplicar claims de mercado sin cite
- No dejar que el agente hable por el founder

---

## Matriz rápida

| Dimensión | Serio | Pitch |
|-----------|-------|-------|
| Riesgo factual | Mínimo | Mínimo en métricas; creativo en framing |
| Mutación live | Conservadora | Ágil en objeciones/proof |
| Web | Casi nunca | Pre-pitch research de mercado |
| Timer | Opcional | Central |
| Cierre | Q&A / appendix | Ask explícito |
| Estética | Editorial / institutional presets | Bold / high-contrast presets |

## Implementación sugerida

```ts
type PresentationProfile = 'serious' | 'pitch'

type ProfileConfig = {
  density: 'low' | 'high'
  listenMode: 'shadow' | 'confirm' | 'auto' | 'coach'
  allowImageGenLive: boolean
  requireCitations: boolean
  blockNeedsSource: boolean
  enableObjectionBank: boolean
  enableMetricsLedger: boolean
  enableSectionTimer: boolean
  allowedTools: string[]
}
```

Elegir perfil en create project (`/brief` step 0). El mismo `BriefProject` + `Deck` cargan `profile` y filtran tools/prompts.

## UX copy (ES)

- Serio: “Priorizá evidencia y citas. Las mutaciones live son conservadoras.”
- Pitch: “Arc de fundraising + banco de objeciones. Las métricas solo salen del ledger.”
