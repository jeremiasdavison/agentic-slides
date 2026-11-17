# frontend-slides (vendor)

Upstream: https://github.com/zarazhangrui/frontend-slides

## Cómo venderlo

Opción A — submodule:

```bash
git submodule add https://github.com/zarazhangrui/frontend-slides.git skills/frontend-slides/upstream
```

Opción B — copy de archivos de skill (`SKILL.md`, `STYLE_PRESETS.md`, `viewport-base.css`, `html-template.md`, `animation-patterns.md`, `bold-template-pack/`, `scripts/`).

## Rol en Agentic Slides

| Fase | Uso |
|------|-----|
| Authoring | Agent skill para crear decks HTML distintivas |
| Runtime | `viewport-base.css` + stage rules son ley |
| Mutation | Presets / design.md → style lock para `insert_slide` |
| Export | `scripts/deploy.sh`, `scripts/export-pdf.sh` post-talk |

## Invariantes que el runtime debe respetar

- Stage fijo 1920×1080, scale uniforme
- Visibilidad via `.active` / `.visible` (no `display:none` para switch)
- Density limits del skill al generar slides en vivo
- Anti-slop: tipografía + paleta del preset, no defaults genéricos
