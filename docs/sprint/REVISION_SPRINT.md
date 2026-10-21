# Revisión de Sprint · Código Mate

| | |
| --- | --- |
| **Proyecto** | Landing de Código Mate, agencia argentina que instala agentes de IA en webs de negocios |
| **Sitio en producción** | https://codigo-mate-landing.vercel.app/ |
| **Repositorio** | https://github.com/frannook/codigo-mate-landing |
| **Período** | 2026-10-06 a 2026-10-16 |
| **Equipo** | frannook (responsable del repositorio), Cristian-create277, matiasortizsd, lucianodeimundo |
| **Herramienta de apoyo** | Claude Code (asistente de programación) |

## 1. Objetivo del sprint

Tener una landing publicada que **explique el servicio, lo demuestre con un agente real y convierta visitas en llamadas agendadas**, con identidad visual propia, buena experiencia en celular y todo gratis.

## 2. Resultado: incremento entregado

| # | Historia | Criterio de aceptación | Estado | Evidencia |
| --- | --- | --- | --- | --- |
| 1 | Como visitante, quiero entender qué hace la agencia en segundos | Hero con propuesta clara, demostración animada de 6 rubros y llamadas a la acción visibles | Hecho | `evidencias/despues-home-desktop-fold.png`, commit `8d3c3e0` |
| 2 | Como dueño de un negocio, quiero **probar un agente real** | Chat funcional (Yuyo) que responde dudas de cualquier rubro y no inventa precios ni plazos | Hecho | Prueba en producción: `/api/chat` responde; commits `3d4b4cb`, `165bc0f` |
| 3 | Como visitante, quiero que el chat no se cuelgue | Respuesta en pocos segundos aun con la API saturada | Hecho | Consultas escalonadas entre modelos, reintento silencioso y respaldo (commit `165bc0f`) |
| 4 | Como interesado, quiero **agendar una llamada** | Formulario validado que avisa al equipo y confirma al cliente por correo | Hecho | Correo recibido en pruebas; commits `3d4b4cb`, `049b6e0` |
| 5 | Como interesado, quiero estimar el costo | Cotizador por rubro, volumen y funciones, con resumen de precio | Hecho | `evidencias/despues-home-mobile-cotizador.png`, commit `08f0da5` |
| 6 | Como visitante, quiero ver resultados de otros clientes | Testimonios en cinta continua | Hecho (texto de ejemplo) | `evidencias/despues-home-desktop-testimonios.png` |
| 7 | Como visitante, quiero **conocer al equipo** | Página `/nosotros` con foto y descripción | Hecho | `evidencias/despues-nosotros-desktop-completa.png`, commit `b5cca4e` |
| 8 | Como marca, quiero una identidad cálida y coherente | Acento ámbar, logo en color, avatares de chat con tonos cálidos | Hecho | Commits `626419f`, `c78731b` |
| 9 | Como usuario de celular, quiero leer sin esfuerzo | Texto mínimo 13 px, botones de al menos 40 px, sin desborde horizontal | Hecho | Mediciones de la sección 4 |
| 10 | Como equipo, queremos que Google y las redes muestren bien el sitio | `robots.txt`, `sitemap.xml`, imagen para compartir, datos estructurados | Hecho | Commit `3685736` |
| 11 | Como equipo, queremos medir el uso | Analítica con eventos de chat y de pedido de llamada | Hecho en código; falta activarla en el panel de Vercel | Commit `3685736` |

## 3. Línea de tiempo

| Fecha | Commit | Qué se hizo |
| --- | --- | --- |
| 2026-10-06 | `3d4b4cb` | Landing inicial: hero, bot con Gemini, testimonios, agendar por correo y movimiento |
| 2026-10-06 | `35686ce` | Chat con `gemini-3.1-flash-lite` y reintento ante saturación |
| 2026-10-06 | `b4d4b15` | README detallado y bitácora del equipo |
| 2026-10-07 | `049b6e0` | Variables de entorno vinculadas al proyecto en Vercel |
| 2026-10-07 | `08f0da5` | Rediseño: menú de vidrio, "Mientras dormís", cotizador, testimonios en cinta, formulario y footer |
| 2026-10-07 | `02d6c2c` | Revisión de dirección de arte y coherencia |
| 2026-10-07 | `8d3c3e0` | Vitrina del hero con 6 conversaciones animadas |
| 2026-10-07 | `b9eff3c` | Movimiento siempre activo |
| 2026-10-07 | `165bc0f` | Chat estable: consultas escalonadas, reintento silencioso y respaldo en Groq |
| 2026-10-07 | `3d89ca3` | Bot renombrado a Yuyo, identidad de movimiento Premium, README ampliado |
| 2026-10-16 | `626419f` | Acento ámbar, página Nosotros, legibilidad móvil y evidencia del sprint |
| 2026-10-16 | `c78731b` | Logo en color, avatares rotativos y último pulido visual |
| 2026-10-16 | `b5cca4e` | Foto del equipo y plan de conexiones |
| 2026-10-16 | `3685736` | SEO básico y analítica |

## 4. Calidad: mediciones

### Lighthouse sobre el sitio publicado

| Categoría | Móvil 16/10 | Móvil 21/10 | Escritorio 16/10 | Escritorio 21/10 | Objetivo |
| --- | --- | --- | --- | --- | --- |
| Accesibilidad | 98 | **100** | 98 | **100** | ≥ 95 → cumple |
| Buenas prácticas | 100 | **100** | 100 | **100** | ≥ 95 → cumple |
| SEO | 100 | **100** | 100 | **100** | — → cumple |
| Rendimiento (mediana de 5 corridas) | 53 | **81** (rango 67–88) | 70 | **96** (rango 74–98) | ≥ 90 → escritorio cumple; móvil, parcial |
| Rendimiento (mejor corrida) | — | 93 | — | 100 | |

Contenido principal (LCP): móvil 4,0 s → 2,9 s (mediana; hasta 1,8 s en las mejores corridas); escritorio 0,8 s → 0,7 s. Bloqueo total: móvil 2.520 ms → 776 ms; escritorio 800 ms → 128 ms. Saltos de diseño casi nulos (CLS 0,017 en móvil, 0,001 en escritorio). La dispersión entre corridas es grande porque Lighthouse corre en una PC común; por eso se informa la mediana y el rango.

Detalle del rendimiento (primera medición): en móvil el contenido principal tarda 4,0 s en aparecer (LCP) y el tiempo de bloqueo total es de 2,5 s; en escritorio, 0,8 s y 0,8 s. No hay saltos de diseño (CLS 0 en los dos). La causa era el peso del movimiento (GSAP, scroll suave y efectos de vidrio) y la carga de las fuentes.

### Optimización de rendimiento (2026-10-20)

Primero se midió con Lighthouse sobre un build de producción local, **mediana de 3 corridas**; después se confirmó en el sitio publicado (tabla de arriba).

| Métrica | Móvil antes | Móvil después | Escritorio antes | Escritorio después |
| --- | --- | --- | --- | --- |
| Rendimiento | 56–64 | **88** | 78–85 | **99** |
| Tiempo de bloqueo total | 2.510 ms | 240 ms | 360 ms | 28 ms |
| Índice de velocidad | 2,8 s | 1,9 s | 0,9 s | 0,9 s |
| Contenido principal (LCP) | 3,4 s | 3,3 s | 0,9 s | 0,7 s |

Qué se hizo: fuentes sin precarga (competían con el CSS y retrasaban el primer pintado de 0,8 a 2,7 s con red lenta), movimiento que se arma bajo demanda, modo liviano en celulares (sin desenfoque, scroll suave, paralaje ni botones magnéticos), textos del hero visibles desde el primer cuadro, CSS en línea y logos con tamaño real. Se probó y se descartó precargar solo la tipografía del titular (empeoró el móvil). Pendiente: en móvil la mediana (81) todavía queda por debajo de 90.

### Pruebas en pantalla (Chrome automatizado, 390 px de ancho)

| Chequeo | Resultado |
| --- | --- |
| Compilación de producción (`npm run build`) | Sin errores, 11 rutas generadas |
| Revisión de tipos (`npm run typecheck`) | Sin errores |
| Desborde horizontal en `/` y `/nosotros` (360, 390 y 430 px) | 0 px |
| Textos de menos de 13 px en celular | 0 (salvo el código de ejemplo del teléfono de "Mientras dormís") |
| Botones y enlaces de menos de 40 px de alto en celular | 0 |
| Errores en la consola del navegador | 0 |
| Contraste del ámbar sobre el navy | 8,0 a 1 (supera AA y AAA) |
| Revisión independiente | Dos agentes revisaron móvil (360/390/430 px) y escritorio (1440 px); se aplicaron los hallazgos de prioridad alta y media |

### Seguridad y robustez

- Claves solo en variables de entorno de Vercel; ninguna en el repositorio.
- El formulario se valida dos veces (navegador y servidor), tiene campo trampa contra bots y límite de 5 pedidos cada 10 minutos por IP.
- El bot tiene instrucciones para no inventar precios, plazos ni clientes, y deriva esas preguntas a la llamada.

## 5. Evidencias

Todas en [`evidencias/`](evidencias/): capturas "antes" y "después" en escritorio (1440 px) y celular (390 px) de inicio, cotizador, testimonios, agendar y Nosotros. Las que empiezan con `produccion-` son del sitio ya publicado en Vercel (2026-10-16), incluida la imagen que se ve al compartir el link (`produccion-vista-previa-al-compartir.png`). Documentos de apoyo:

| Documento | Contenido |
| --- | --- |
| [`SPRINT.md`](SPRINT.md) | Detalle técnico de cada entrega, colores evaluados, antes y después |
| [`../PLAN_CONEXIONES.md`](../PLAN_CONEXIONES.md) | Plan para terminar la infraestructura |
| [`../../MOTION.md`](../../MOTION.md) | Identidad de movimiento y auditoría de animaciones |
| [`../../CONTEXT.md`](../../CONTEXT.md) | Bitácora y decisiones con su porqué |
| [`../../README.md`](../../README.md) | Tecnologías, APIs, flujos y comportamiento del bot |

## 6. Demostración sugerida (5 minutos)

1. Abrir https://codigo-mate-landing.vercel.app/ y mostrar el hero con la vitrina de rubros.
2. Bajar a "Mientras dormís" y al cotizador; activar funciones y ver el precio cambiar.
3. Ir a "Probalo" y preguntarle a Yuyo: "¿Cuánto cuesta?" (deriva a la llamada) y "Tengo una inmobiliaria" (adapta la respuesta).
4. Completar el formulario de agendar con datos propios y mostrar el correo recibido.
5. Abrir `/nosotros` y mostrar la versión en celular (F12, ancho de 390 px).

## 7. Impedimentos y cómo se resolvieron

| Problema | Solución |
| --- | --- |
| El modelo de Gemini elegido dejó de estar disponible para cuentas nuevas | Cambio de modelo y variable `GEMINI_MODEL` para no tocar código |
| La API respondía 503 por saturación y el chat se colgaba | Consultas escalonadas entre modelos, tiempo máximo por intento y respaldo opcional en Groq |
| Telegram no es de uso común en Argentina | Avisos por correo con Gmail, gratis y sin dominio propio |
| Alterar la preferencia de "reducir movimiento" | Decisión del equipo: movimiento siempre activo; queda documentado con su contra |

## 8. Retrospectiva

**Qué funcionó:** iterar en pasos cortos con verificación visual en celular y escritorio; documentar cada decisión con su porqué; medir en vez de suponer.

**Qué mejorar:** el rendimiento en celular (53 sobre 100); los testimonios siguen siendo de ejemplo; no hay pruebas automáticas más allá de tipos y compilación.

## 9. Próximo sprint (propuesta)

| Prioridad | Tarea | Detalle |
| --- | --- | --- |
| Alta | Rendimiento móvil: último tramo | Hoy 81 de mediana en el sitio publicado; llevar la mediana a ≥ 90 (LCP bajo 2,5 s y bloqueo bajo 300 ms) |
| Alta | Google Calendar y Meet | Evita pedidos duplicados y genera el link de la videollamada |
| Alta | Límite de uso compartido (Redis) y respaldo en Groq | Robustez en producción |
| Media | Número de WhatsApp real | El pase hoy es demostrativo |
| Media | Activar analítica en Vercel y definir metas | Visitas, chats y pedidos de llamada |
| Media | Dominio propio | Ver `PLAN_CONEXIONES.md` |
| Baja | Testimonios reales y nombres del equipo | Contenido |
| Baja | Pruebas automáticas | Formulario y etiquetas del bot |
