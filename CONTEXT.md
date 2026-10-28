# Código Mate · Bitácora y decisiones

Este archivo explica **por qué** el proyecto es como es. El cómo correrlo y la estructura están en el [README](README.md).
Se actualiza al cerrar cada etapa. Última actualización: 2026-10-06.

## Qué estamos construyendo

La landing de una agencia que instala agentes de IA en webs de negocios. La página tiene que hacer tres cosas: explicar el servicio,
**demostrarlo** con un agente real y convertir visitas en llamadas agendadas. Presupuesto actual: **cero costos** (todo en planes gratuitos).

## Bitácora

| Etapa | Qué se hizo | Estado |
| --- | --- | --- |
| 1. Maqueta | Diseño en Claude Design (`project/`, `chats/`) e implementación base en Next.js | Hecho |
| 2. Bot | Chat conectado a Gemini con límite por IP y errores controlados | Hecho |
| 3. Pulido visual | Hero, cinta, bento, testimonios, footer; se quitaron los eyebrows numerados; paleta y fuentes intactas | Hecho |
| 4. Motion | GSAP + Lenis (scroll suave, titulares por palabra, paralaje, cinta por velocidad, botones magnéticos), siempre activo | Hecho |
| 5. Bot como FAQ | Se eliminó la sección de preguntas; Yuyo responde dudas de todos los rubros (`lib/chat/store.ts`) | Hecho |
| 6. Agendar por correo | `/api/booking` con Gmail SMTP: aviso al equipo + confirmación al cliente | Hecho y probado |
| 7. Repositorio | Repo propio (antes el git colgaba de la carpeta de usuario), público en GitHub | Hecho |
| 8. Despliegue | Vercel + variables de entorno | Pendiente |
| 9. Calendario y Meet | Evento en Google Calendar con link de Meet y horarios libres | Pendiente |

## Decisiones y por qué

- **Correo en vez de Telegram para avisos.** En Argentina Telegram no es de uso común entre dueños de negocio; el correo sí.
- **Gmail SMTP en vez de Resend.** Resend (plan gratuito) solo envía a clientes externos si se verifica un dominio propio, y eso tiene costo.
  Con Gmail y una contraseña de aplicación se envía a cualquier destinatario sin dominio. Se puede cambiar después cambiando solo variables de entorno.
- **Cuenta Gmail propia del proyecto** (`codigomatebot@gmail.com`) en vez de una personal: es el remitente que ven los clientes y evita
  atar el servicio a una persona del equipo.
- **El bot reemplaza a la FAQ.** Una FAQ estática no cubre todos los rubros; el agente es además la mejor demostración del producto.
- **El bot no inventa.** Precios, plazos, métricas, clientes e integraciones concretas se derivan a la llamada. Es una decisión de negocio, no técnica.
- **Modelo `gemini-3.1-flash-lite`.** Los modelos Flash más nuevos estaban saturados (503) y `gemini-2.5-flash` ya no está para cuentas nuevas.
- **Movimiento siempre activo.** Primero dependía de `prefers-reduced-motion` y quien lo tenía activo veía la web quieta; después hubo un interruptor on/off. El equipo decidió sacarlo y dejar el movimiento siempre encendido. Contra: ignora la preferencia de accesibilidad de quien pidió menos movimiento. Se revierte en `app/layout.tsx`.
- **Estilos propios, sin Tailwind.** El diseño vino del handoff en CSS; no se justificó agregar una dependencia.
- **Fuentes y paleta.** Instrument Serif + Geist y la paleta navy/steel/bone vienen de la identidad del handoff y se mantienen.

## Auditoría de movimiento (2026-10-07)

Identidad en [MOTION.md](MOTION.md): Premium, curva `cubic-bezier(0.16, 1, 0.3, 1)`, duraciones .15/.35/.7s (-20% en móvil), todo entra desde abajo.

| Elemento | Antes | Regla que rompía | Gravedad | Ahora |
| --- | --- | --- | --- | --- |
| Botones (CTA, nav, chips, envío, opciones) | El scale de `:active` saltaba sin transición; 0.94–0.985 según el botón | Toque sin respuesta suave, inconsistente | CRITICAL | `scale: 0.97` en 150ms, vuelve en 350ms, una sola regla |
| Errores del formulario | Solo cambiaba el borde | Error sin feedback de movimiento | CRITICAL | Sacudida de 3 oscilaciones decrecientes, 380ms, en cada campo inválido |
| Éxito del formulario | Secuencia de ~1.1s, check sin pop | Celebración larga | HIGH | ~550ms: check con pop a 1.06, texto escalonado 60ms |
| Enviando | Brillo que cruzaba el botón en loop | Indicador ambiguo | HIGH | Spinner lineal de 0.9s por vuelta |
| Reveals de scroll | 0.9–1.2s, desde izquierda, derecha o abajo | Direcciones mezcladas, lento | HIGH | 700ms, todos desde abajo (24px) |
| Hero (texto y demo) | Desde los costados (56px), 0.9–1.1s | Direcciones mezcladas | HIGH | Sube 24px con desenfoque de 6px, 700ms |
| Tipeo del código en "Cómo trabajamos" | Anima `width` | Propiedad de layout | MEDIUM | Sin cambio (37 pasos, costo bajo) |
| Transiciones de color en hover | 200–350ms | Ideal <100ms | MEDIUM | Sin cambio: con Premium se ven bien |

El movimiento sigue siempre activo, también con `prefers-reduced-motion`. Lo decidió el equipo.

## Sprint 2026-10-16: acento cálido, Nosotros y móvil

- **Acento ámbar miel `#E9A23B`** (8:1 sobre navy), usado con parsimonia como token `--amber` en `app/globals.css`. Se eligió sobre terracota, cobre y durazno por contraste y por su relación con el mate. Cambiarlo es editar dos variables.
- **Página `/nosotros`** como ruta aparte (no una sección de la home). La foto va en `public/nosotros.jpg`; sin foto se muestra un panel de marca.
- **Legibilidad móvil:** mínimo 13 px en texto de interfaz, 14 px en cuerpo.
- **Logo en color** (`public/logo-color.png`): mate, cursor y recuadro en ámbar, a pedido del profe. El `logo-light.png` original sigue en el repo. Los avatares de los chats rotan 6 tonos durazno/miel.
- **Foto del equipo** en `public/nosotros.jpg` (recortada al grupo, nitidez y color retocados, borde izquierdo fundido al navy).
- **Plan de conexiones** para terminar la infraestructura: [docs/PLAN_CONEXIONES.md](docs/PLAN_CONEXIONES.md).
- Evidencia con capturas y mediciones en [docs/sprint/SPRINT.md](docs/sprint/SPRINT.md).

## Rendimiento (2026-10-20)

- Lighthouse local (build de producción, mediana de 3 corridas): móvil 56–64 → 88 y escritorio 78–85 → 99. Bloqueo total móvil: 2.500 ms → 240 ms.
- **Fuentes sin precarga** (`preload: false` en `app/layout.tsx`): precargar las cuatro (71 KB) competía con el CSS y retrasaba el primer pintado de 0,8 s a 2,7 s con red lenta. Contra: el texto sale un instante con la tipografía de respaldo y luego cambia.
- **CSS dentro del HTML** (`experimental.inlineCss`), logos con `sizes`, `content-visibility` en agendar y footer, y `<main>` en la home.
- Movimiento liviano en celulares y armado perezoso de las animaciones: ver [MOTION.md](MOTION.md).
- Se probó y se descartó precargar solo la tipografía del titular (empeoró el móvil).
- Lighthouse varía mucho entre corridas en esta máquina: comparar siempre con medianas.

## Conexiones y automatización (2026-10-21)

- **WhatsApp real** (+54 9 379 453-0578) en el chat (con la última consulta del visitante), el footer y los datos estructurados.
- **Calendario**: `/api/slots` y `/api/booking` reservan en Google Calendar con link de Meet cuando están las variables `GOOGLE_*`; si falta alguna, o si Google falla, el formulario sigue por correo. Se probó contra un Google simulado. El token se saca con `scripts/google-auth.mjs` (nunca se guarda en el repo).
- **Límite compartido** (`lib/ratelimit.ts`): usa Upstash Redis si está conectado y cae a memoria si no.
- **Aviso de caídas**: workflow `.github/workflows/uptime.yml` (cada 30 minutos). **Planilla de contactos**: `LEADS_WEBHOOK_URL`.
- Lo que falta de tu lado está en [docs/PLAN_CONEXIONES.md](docs/PLAN_CONEXIONES.md).

## Mejoras del 2026-10-28

- **Seguridad:** `next` 16.4.3 y `nodemailer` 10.2.1 (npm audit: 0 vulnerabilidades) y cabeceras de seguridad en `next.config.ts`. La Content-Security-Policy queda pendiente (hay scripts en línea).
- **Legales:** `/privacidad` y `/terminos` (borrador razonable; conviene revisión de un abogado), enlazados en el pie y el sitemap. Los testimonios de la home están rotulados como ejemplos.
- **Descubrimiento:** 404 propia, `favicon.ico`, `apple-icon.png`, manifest, íconos 192/512 e imagen de vista previa propia en `/nosotros`.
- **Diseño:** mini conversaciones de ejemplo (`components/ChatSample.tsx`) en Servicios y Proyectos.
- **Rendimiento móvil de la home:** se probó cargar las secciones de abajo con `next/dynamic` y no mejoró; se revirtió. Plan en [docs/PLAN_MEJORAS.md](docs/PLAN_MEJORAS.md).
- `docs/GUIA_CHATBOT_ECOMMERCE.md` es privada (está en `.gitignore`).

## Cosas a tener presentes

- Los testimonios de `components/Testimonials.tsx` son **texto de ejemplo**: reemplazar antes de promocionar la web.
- El horario del formulario es una solicitud; hasta tener calendario real, el equipo confirma por correo.
- El límite de consultas es por instancia (memoria). En Vercel con tráfico real hay que pasarlo a un almacén compartido.
- No usar el servidor de desarrollo mientras corre `next build`: comparten `.next` y se pisan.
- Carpeta `project/`: material de diseño de origen, no es código de la web. No editar para cambiar la página.

## Próximo paso recomendado

1. Publicar en Vercel (importar el repo, cargar variables, probar chat y formulario en producción).
2. Google Calendar con OAuth de la cuenta del proyecto: crea el evento, genera el link de Meet y Google le envía la invitación al cliente. Ver README → Pendiente.
