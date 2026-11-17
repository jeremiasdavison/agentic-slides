# Crear el repo en GitHub

El scaffold vive en este directorio. La creación remota falló desde el agent
(`gh` rate-limit / integración) y Composio GitHub necesita tu OAuth.

## Opción A — Composio (desde el chat Cursor)

1. Abrí el link de conexión que te pasó el agent
2. Autorizá GitHub
3. Pedile al agent: "creá el repo agentic-slides y subí el scaffold"

## Opción B — Manual

```bash
# desde esta carpeta (o descomprimí agentic-slides-scaffold.tar.gz)
gh repo create jeremiasdavison/agentic-slides --private \
  --description "Live AI presentations: frontend-slides + realtime listening + on-the-fly mutation" \
  --source=. --remote=origin --push
```

## Opción C — GitHub UI

1. New repository → `agentic-slides` (private)
2. `git remote add origin git@github.com:jeremiasdavison/agentic-slides.git`
3. `git push -u origin main`

## Después

1. Vendor `frontend-slides` (submodule o copy) en `skills/frontend-slides/upstream`
2. Scaffold Next.js en `apps/web` (o clonar patrones de Real-Time-Agent)
3. Arrancar Fase 1 del MVP (`docs/MVP.md`)
