# Contexto para el agente que arma la presentación

Última actualización: 2026-10-28. Este archivo resume dónde quedó el trabajo y qué falta para armar la presentación final de Código Mate. Leelo junto con el repositorio: es la misma historia, no una distinta.

## 1. Qué es el proyecto

Trabajo práctico de **Práctica Profesional I**: website publicada de una consultora IT. Equipo de cinco, con Scrum y Trello.

- Consultora: **Código Mate**. Instala agentes de IA en webs de negocios argentinos (responden 24 h, no inventan datos, pasan a WhatsApp con contexto).
- Sitio: https://codigo-mate-landing.vercel.app
- Repo: https://github.com/frannook/codigo-mate-landing
- Equipo: Cristian Maciel, Matías Ortiz, Luciano Deimundo, Elías Gomez, Franco Romero.
- Roles propuestos: Product Owner Matías Ortiz · Scrum Master Elías Gomez · Developers todos. Confirmar con el equipo.
- Franco Romero armó casi todo el código y la documentación; los demás necesitan un panorama para explicar su parte.
- El trabajo se hizo con ayuda de Claude Code. Las decisiones las tomó el equipo. Decirlo con honestidad si preguntan.

## 2. Qué pide la consigna

- **Entrega final:** informe único (PDF o DOCX) subido a Moodle por los cinco, con: portada, brief y objetivo, Sprint Goal, enlaces (sitio, Trello, repo), capturas con explicación, decisiones/pruebas/pendientes, síntesis de Sprint Review y retrospectiva, y aporte individual de cada uno.
- **Presentación:** demo en vivo del sitio publicado, también en vista móvil; explicar una decisión importante; responder preguntas; **todos participan**. Después: Sprint Review (devoluciones y qué harían) y retrospectiva (mejora concreta para un próximo proyecto).
- **Lo que le interesa al profesor** (pedido de Franco): la **historia** del desarrollo, más que lo técnico. Qué problema había, qué problemas aparecieron, cómo se resolvieron, qué alternativas se vieron, cuáles eran viables, cómo se evaluaron los costos y qué convenía. Contar con lenguaje simple y criollo.

## 3. Dónde está cada cosa en el repo

| Qué | Archivo |
| --- | --- |
| **Historia en capítulos, costos y reparto de la presentación (fuente principal)** | `docs/entrega/Historia-del-proyecto-Codigo-Mate.docx` |
| Brief, Sprint Goal, roles, Product Backlog (17 historias) | `docs/entrega/01-brief-y-backlog.md` |
| Acuerdos de trabajo y registro de decisiones con fecha y motivo | `docs/entrega/02-acuerdos-y-decisiones.md` |
| Registro de pruebas (hechas y pendientes) | `docs/entrega/03-registro-de-pruebas.md` |
| Informe final para Moodle (esqueleto con aportes individuales en borrador) | `docs/entrega/04-informe-final.md` |
| Sprint Review y Retrospectiva (guion de demo, Mad/Sad/Glad, Start/Stop/Continue) | `docs/entrega/05-sprint-review-y-retrospectiva.md` |
| Guía para armar Trello (columnas, 19 tarjetas, fechas) | `docs/entrega/Guia-Trello-y-pendientes.docx` |
| Por qué el proyecto es como es (bitácora técnica) | `CONTEXT.md` |
| Plan de mejoras y plan de conexiones | `docs/PLAN_MEJORAS.md`, `docs/PLAN_CONEXIONES.md` |
| Sprint del 16/10 con capturas y mediciones | `docs/sprint/SPRINT.md`, `docs/sprint/REVISION_SPRINT.md`, `docs/sprint/evidencias/` |
| README con equipo, URL, cómo ejecutar y publicar | `README.md` |

`docs/GUIA_CHATBOT_ECOMMERCE.md` es privada y está en `.gitignore`: no usarla ni citarla.

## 4. Línea de tiempo (de `git log`)

| Fecha | Qué pasó |
| --- | --- |
| 6/10 | Landing inicial con bot en Gemini, formulario por correo, motion. Problema: errores 503 de Gemini. Se eligió Gmail sobre Telegram y Resend (costos y público). |
| 7/10 | Rediseño v2, vitrina de 6 rubros, movimiento siempre activo (decisión del equipo), bot renombrado Yuyo, consultas escalonadas. |
| 16/10 | Acento ámbar `#E9A23B` (se comparó con terracota, cobre y durazno), logo en color, página Nosotros con foto, SEO y analítica. |
| 20-21/10 | Rendimiento: móvil 56-64 a 88 y escritorio 78-85 a 99 en pruebas locales. Servicios y Proyectos. WhatsApp real, Google Calendar con Meet, límite compartido, aviso de caídas. |
| 27/10 | Seguridad (0 vulnerabilidades), páginas legales (borrador), 404, íconos, mini conversaciones en Servicios y Proyectos. |
| 28/10 | **Groq pasa a ser el proveedor principal del chat** y Gemini queda de respaldo (1,3 a 2 s por respuesta). **Mascota Yuyo** (hoja de yerba con remera y mate torpedo) camina por la web y abre el chat en burbuja; en celular queda fija en la esquina. Rediseño 3D sutil. Correo de bienvenida con día, hora y Meet. |

## 5. Decisiones y costos para contar

La regla fue **gastar cero**. Todo con plan gratuito: Vercel, Gmail, Google Calendar y Meet, Gemini, Groq, Upstash. La única compra pendiente es un dominio propio (unos USD 12 al año).

Antes de decir "cero costos" en voz alta, **confirmar en cada cuenta que siga en plan gratuito** (no está verificado).

Decisiones con alternativas descartadas: correo (Telegram, Resend, Gmail), IA del chat (Gemini solo, plan pago, Groq más Gemini), agenda (herramienta paga, solo correo, Google Calendar), estilos (Tailwind o CSS propio), movimiento (respetar preferencia, interruptor, siempre activo), color (4 opciones medidas por contraste), mascota (botón clásico, caminando siempre, caminando en compu y fija en celular). El detalle está en `Historia-del-proyecto-Codigo-Mate.docx` (secciones 3 y 4) y en `02-acuerdos-y-decisiones.md`.

## 6. Qué está inventado o sin confirmar

No presentar esto como hecho real sin que el equipo lo valide:

- **Aportes individuales** (`04-informe-final.md`, sección 7): son un borrador repartido de forma pareja. Cada integrante debe corregir su fila. En GitHub casi todos los commits figuran con la cuenta `frannook`, así que el historial no refleja el reparto.
- **Reparto de la presentación** (sección 5 del Word de historia): propuesta mía.
- **Roles de Product Owner y Scrum Master:** propuestos, no confirmados.
- **Devoluciones de la Sprint Review y cómo se sintió cada uno:** vacíos a propósito. Solo el equipo los sabe.
- **Notas de Mad/Sad/Glad:** borrador a partir de hechos del proyecto.
- **Testimonios de la home:** son ejemplos ilustrativos y la web lo avisa.
- **Textos legales:** borrador; conviene revisión de un abogado o contador.
- **Proyectos:** los dos (tienda "Nube", estudio "Ríos y Asociados") son simulados, y así están rotulados.

## 7. Estado de Trello

Franco ya actualizó el tablero y le dio acceso de administrador. Este archivo no tiene el estado real del tablero: **leer el tablero** (o el JSON exportado) y verificar que columnas, tarjetas y responsables coincidan con el backlog (`01-brief-y-backlog.md`) y con la sección 4. Lo hecho después del sprint (Groq, Yuyo, Calendar con Meet, WhatsApp, correos de bienvenida, rediseño 3D) debe estar en Terminado; testimonios reales y dominio propio, en el Product Backlog.

## 8. Qué falta para cerrar

1. **Armar la presentación** (diapositivas) con esta historia: problema, capítulos, decisiones y costos, demo, Sprint Review, retrospectiva. Un tramo por integrante.
2. Guion de **demo en vivo**: inicio, preguntarle a Yuyo una cosa que sabe y otra que no, Servicios y Proyectos, vista móvil, formulario de agendar con el correo y el evento de Meet, Trello y repo.
3. Completar el **informe final** y exportarlo a PDF o DOCX para Moodle: enlaces, capturas de `/servicios` y `/proyectos` y de Yuyo, y secciones de review y retro.
4. Poner el **enlace de Trello** en `README.md` y en el informe, con acceso para el docente. No usar el enlace de invitación: da acceso a cualquiera que lo abra.
5. **Pruebas a mano** pendientes (menú, pie, formulario en producción) en `03-registro-de-pruebas.md`.
6. **Antes de la demo:** renovar el permiso de Google Calendar si pasaron 7 días (`node scripts/google-auth.mjs`, y actualizar `GOOGLE_REFRESH_TOKEN` en Vercel). Está en modo prueba y vence a los 7 días.
7. Hacer la **retrospectiva** en equipo y escribir cómo se sintió cada integrante.

## 9. Reglas del proyecto para quien edite

- Seguir `AGENTS.md`: esta versión de Next.js tiene cambios respecto de lo conocido; consultar `node_modules/next/dist/docs/` antes de tocar código.
- El movimiento de la web **siempre está activo**: no agregar fallbacks de `prefers-reduced-motion` (decisión del equipo, registrada en `CONTEXT.md`).
- `project/` es material de diseño de origen: no editarlo para cambiar la web.
- No inventar clientes, métricas ni testimonios.
- Escribir para el profesor: simple, criollo, centrado en la historia.
