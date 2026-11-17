# Escucha activa — diseño

## Objetivo

Entender lo que el presentador está diciendo **mientras** presenta, detectar gaps/comandos, y proponer mutaciones sin interrumpir el flow.

## Por qué Realtime API

Ya validado en [Real-Time-Agent](https://github.com/jeremiasdavison/Real-Time-Agent):

- WebRTC de baja latencia en browser
- VAD server-side
- Function calling en el mismo canal
- Transcripción de entrada

Diferencia clave vs Lucía (restaurante): **el agente no habla al público**. Audio out deshabilitado o ruteado solo a auricular en modo Coach.

## Pipeline

```
Mic
 │
 ▼
WebRTC ──▶ Realtime session
              │
              ├─▶ input transcription (Whisper)
              │         │
              │         ▼
              │   Rolling context (last N min + deck outline)
              │
              └─▶ tool calls (intents)
                        │
                        ▼
                  Mutation Engine → HUD → apply/discard
```

## VAD para talks

Talks tienen pausas largas y ruido de sala. Partir de Real-Time-Agent y ajustar:

| Param | Real-Time-Agent | Agentic Slides (propuesto) |
|-------|-----------------|-------------------------|
| `threshold` | 0.85 | 0.85–0.9 |
| `silence_duration_ms` | 700 | 800–1000 |
| `prefix_padding_ms` | 180 | 200–300 |

Si el presentador hace pausas dramáticas, preferir **Semantic VAD** (`eagerness: low`) para no cortar frases.

## Modos

| Mode | Mic → tools | Mutates deck | AI voice |
|------|-------------|--------------|----------|
| Shadow | yes | no (HUD only) | no |
| Confirm | yes | on `Y` | no |
| Auto | yes | low-risk patches | no |
| Coach | yes | no | earpiece only |

## Qué escucha (y qué no)

**Sí**

- Comandos explícitos ("agregá un slide…")
- Confesiones de gap ("olvidé poner…")
- Preguntas de audiencia (si hay canal secundario)

**No (noop)**

- Storytelling / chistes / filler
- Lectura literal de bullets ya en pantalla
- Ruido de aplausos / tos (VAD + confidence)

## Presenter HUD (mínimo)

1. Punto de estado: listening / thinking / proposal ready
2. Últimas líneas de transcript (colapsable)
3. Proposal card: preview thumbnail + brief + confidence
4. Hotkeys: `Y` apply · `N` discard · `F` freeze · `E` inline edit

## Dual buffer

Nunca pintar HTML incompleto en audience:

1. Generar en buffer oculto (`opacity: 0` / off-DOM)
2. Verificar layout (no overflow stage)
3. Crossfade 200–400ms al aplicar
4. Si falla verificación → degradar a `propose_only`

## Costos

Reusar caps de Real-Time-Agent:

- Idle timeout (ej. 90s sin speech → disconnect)
- Hard session cap por talk segment
- Presenter reconnect = nueva sesión

## Open questions

1. ¿Segundo mic / chat para audiencia, o solo presentador en v1?
2. ¿Coach earpiece en misma sesión Realtime (audio out filtrado) o canal separado?
3. ¿Persistir transcript post-talk como speaker notes enriquecidas?
