# Cierre del sprint: Sprint Review y Retrospectiva

Sprint 1 · 23/9 al 28/10 de 2026 · Sprint Goal: publicar una primera versión utilizable de la web que permita a un cliente conocer la consultora, entender los servicios, ver ejemplos y encontrar un contacto que funcione.

> Qué es real y qué hay que completar: el producto, los números y los hechos salen del repositorio. Las devoluciones recibidas y lo que sintió cada integrante solo lo saben ustedes. Las partes marcadas con **[EQUIPO]** son una propuesta para editar en conjunto antes de entregar.

---

## Parte 1 · Sprint Review

### 1. ¿Se cumplió el Sprint Goal?

Sí. Un cliente puede hoy, en https://codigo-mate-landing.vercel.app:

| Necesidad del Sprint Goal | Dónde se cubre | Estado |
| --- | --- | --- |
| Conocer la consultora y su propuesta de valor | Inicio y `/nosotros` | Terminado |
| Comprender los servicios | `/servicios` (4 servicios, a quién va dirigido cada uno) | Terminado |
| Ver ejemplos de trabajos | `/proyectos` (2 proyectos simulados, identificados como tales) | Terminado |
| Encontrar un contacto que funcione | Formulario de agendar (correo al equipo y confirmación al cliente; con Google Calendar y Meet), correo en el pie | Terminado |
| Usarlo en teléfono y computadora | Responsive, sin desborde, texto mínimo 13 px | Terminado |

### 2. Producto que se demuestra en vivo (guion de 5 a 7 minutos)

1. **Inicio** en computadora: propuesta de valor y botón de contacto.
2. **Yuyo**: hacerle una pregunta real (por ejemplo, "¿hacen envíos a Salta?") y una que no pueda responder para mostrar que no inventa y deriva.
3. **Servicios** y **Proyectos**: mostrar que el menú lleva a cada uno y que los proyectos dicen "simulado".
4. **Vista móvil** (F12, 390 px): menú desplegable, una página completa, formulario.
5. **Contacto**: completar el formulario y mostrar el correo recibido.
6. **Trello** y **repositorio**: tablero actualizado y README.
7. Cada integrante explica una decisión (ver sección 4).

### 3. Trabajo completado vs. tablero de Trello

| Columna del tablero | Tarjetas |
| --- | --- |
| Terminado | Hero, Yuyo, formulario de contacto, cotizador, identidad visual, Nosotros, Servicios, Proyectos, navegación y pie, publicación en Vercel |
| Pasadas a Terminado tras las pruebas | Pruebas de navegación y móvil · Prueba del formulario en producción **[EQUIPO: confirmar]** |
| Informe | Informe final **[EQUIPO: confirmar si queda terminado]** |
| No hecho, vuelve al Product Backlog | Foto y nombres reales en Nosotros (si no se completó), analítica activa, testimonios reales, WhatsApp real |

Mover las tarjetas del tablero para que coincidan con esta tabla antes de la presentación.

### 4. Decisiones para explicar en la demo

| Decisión | Quién la cuenta **[EQUIPO]** |
| --- | --- |
| El agente no inventa precios ni plazos y deriva a una persona | Matías Ortiz |
| Correo con Gmail en lugar de otros servicios | Franco Romero |
| Menú de cinco links más el botón de contacto | Luciano Deimundo |
| Proyectos identificados como simulados | Cristian Maciel |
| Definición de terminado y registro de impedimentos | Elías Gomez |

### 5. Devoluciones recibidas

Completar durante la presentación.

| Devolución | De quién | Qué haríamos |
| --- | --- | --- |
| | | |
| | | |
| | | |

### 6. Qué haríamos a continuación (propuesta, ordenada por valor)

1. Testimonios y proyectos reales, con permiso de los clientes.
2. WhatsApp real con el número del negocio.
3. Activar la analítica en Vercel para medir cuántas visitas piden una llamada.
4. Límite de consultas del chat en un servicio compartido (hoy es por instancia).
5. Dominio propio.

---

## Parte 2 · Retrospectiva

Formato **Mad / Sad / Glad** (qué nos enojó o frustró, qué nos entristeció o nos faltó, qué nos alegró), seguido de un **Start / Stop / Continue** para convertirlo en acciones. Se hace en 30 a 40 minutos, con cada integrante escribiendo en notas antes de compartir.

### Cómo llevarla a cabo (Scrum Master: Elías Gomez)

1. **5 min, apertura:** cada uno dice con una palabra cómo se sintió durante el proyecto.
2. **10 min, notas en silencio:** cada integrante escribe al menos una nota por columna (Mad, Sad, Glad).
3. **10 min, agrupar y votar:** se juntan notas parecidas; cada uno vota 3 temas.
4. **10 min, acciones:** de los 2 temas más votados salen acciones concretas con responsable.
5. **Cierre:** se elige **una** mejora para el próximo proyecto y se anota en el informe.

Regla: se habla de lo que pasó en el equipo y en el proceso, no de personas.

### Borrador de notas **[EQUIPO: reemplazar o ajustar con lo que sintió cada uno]**

| Columna | Notas propuestas, a partir de lo que mostró el proyecto |
| --- | --- |
| **Glad** (nos alegró) | El sitio quedó publicado y funcionando, con un agente de IA real. Ver el chat respondiendo a gente desconocida. Que el contacto llegue de verdad por correo y con Meet. La identidad visual (ámbar y navy) quedó propia. |
| **Mad** (nos frustró) | La API de Gemini saturada (errores 503) en pleno desarrollo. Que el tablero se ordenó después de haber empezado a programar, así que Trello fue más un registro que una guía al principio. Los cambios de último momento (mascota, Calendar) que hicieron crecer el alcance. |
| **Sad** (nos faltó) | Foto y nombres definitivos del equipo, testimonios reales, WhatsApp real y analítica sin activar. Tiempo para probar en más celulares reales. |

### Hallazgo para discutir con honestidad

En el historial de GitHub los commits figuran casi todos con un solo usuario, aunque el trabajo se repartió entre cinco. El repositorio es parte de la evidencia que ve el docente. **[EQUIPO]** Hablar de cómo hacer visible el aporte de cada uno (cada persona sube sus cambios con su propia cuenta, o se usan ramas y pull requests) y acordar una práctica para el próximo proyecto.

### Start / Stop / Continue (propuesta)

| | Acción | Responsable **[EQUIPO]** |
| --- | --- | --- |
| **Start** (empezar) | Crear el tablero y los criterios de aceptación **antes** de escribir código | Elías Gomez |
| **Start** | Que cada integrante haga sus propios commits y pull requests, revisados por otra persona | Todos |
| **Start** | Probar en celulares reales desde la mitad del sprint, no al final | Cristian Maciel |
| **Stop** (dejar de) | Sumar funciones nuevas en los últimos días, antes de cerrar lo comprometido | Matías Ortiz |
| **Stop** | Dejar la documentación para el final | Franco Romero |
| **Continue** (seguir) | Reuniones cortas de seguimiento con impedimentos a la vista | Elías Gomez |
| **Continue** | Anotar decisiones con fecha y motivo (`CONTEXT.md` y `docs/entrega/02`) | Luciano Deimundo |

### Mejora concreta para un próximo proyecto

> Antes de escribir la primera línea de código, tener el tablero armado con tarjetas chicas, responsables y criterios de aceptación, y que cada integrante trabaje con su propia cuenta de GitHub mediante pull requests. **[EQUIPO: confirmar o cambiar]**

### Cómo nos sentimos (para el informe) **[EQUIPO: cada uno escribe 1 o 2 frases propias]**

| Integrante | Cómo se sintió con el proyecto |
| --- | --- |
| Cristian Maciel | |
| Matías Ortiz | |
| Luciano Deimundo | |
| Elías Gomez | |
| Franco Romero | |
