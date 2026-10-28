# Código Mate · Landing

Landing de una agencia argentina que instala agentes de IA (chatbots) en webs de negocios. La página demuestra el servicio:

- **Yuyo**, un agente real (Groq + Google Gemini de respaldo), responde dudas de visitantes en la sección *Probalo* y desde una **mascota animada** (una hoja de yerba con remera y mate) que camina por el borde inferior de todas las páginas y abre el chat en una burbuja.
- **Cotizador** con estimación orientativa que se adjunta al formulario.
- **Formulario de agendar** conectado a **Google Calendar**: muestra horarios libres reales, crea el evento con **link de Meet** e invita al cliente, y avisa por **Gmail** al equipo y al cliente.

**Objetivo pedagógico:** sitio premium con Next.js moderno, IA en producción, manejo de APIs, autenticación segura y UX pulida.

**Sitio publicado:** https://codigo-mate-landing.vercel.app · **Páginas:** Inicio, `/servicios`, `/proyectos`, `/nosotros`, contacto (`/#agendar`).
**Documentación de la materia (brief, backlog, decisiones, pruebas, informe):** [docs/entrega/](docs/entrega/)

## Proyecto de la materia · Práctica Profesional I

Website de la consultora IT **Código Mate**, desarrollada y publicada por un equipo de cinco personas con Scrum y Trello.

| | |
| --- | --- |
| **Equipo** | Cristian Maciel, Matías Ortiz, Luciano Deimundo, Elías Gomez, Franco Romero |
| **Roles** | Product Owner: Matías Ortiz · Scrum Master: Elías Gomez · Developers: todos |
| **Sprint Goal** | Publicar una primera versión utilizable que permita a un cliente conocer la consultora, entender los servicios, ver ejemplos y encontrar un contacto que funcione |
| **URL publicada** | https://codigo-mate-landing.vercel.app |
| **Tablero Trello** | COMPLETAR |
| **Repositorio** | https://github.com/frannook/codigo-mate-landing |

**Secciones del sitio:** Inicio, [Servicios](app/servicios/page.tsx), [Proyectos](app/proyectos/page.tsx) (2 proyectos simulados), [Nosotros](app/nosotros/page.tsx) y Contacto (formulario en `/#agendar` y correo en el pie).

**Cómo ejecutarlo:** `npm install`, completar `.env.local` (ver [Setup & Ejecución](#setup--ejecución)) y `npm run dev` en http://localhost:3000. **Cómo publicarlo o actualizarlo:** un push a `main` despliega solo en Vercel (ver [Deployment](#deployment-vercel)).

| Documento | Contenido |
| --- | --- |
| [01 Brief y backlog](docs/entrega/01-brief-y-backlog.md) | Brief, Sprint Goal, roles, Product Backlog |
| [02 Acuerdos y decisiones](docs/entrega/02-acuerdos-y-decisiones.md) | Cómo trabaja el equipo y registro de decisiones |
| [03 Registro de pruebas](docs/entrega/03-registro-de-pruebas.md) | Qué se probó, resultado y pendientes |
| [04 Informe final](docs/entrega/04-informe-final.md) | Informe para Moodle |
| [05 Sprint Review y Retrospectiva](docs/entrega/05-sprint-review-y-retrospectiva.md) | Cierre del sprint |
| [Bitácora técnica](CONTEXT.md) | Por qué el proyecto es como es |

---

## Stack Tecnológico

### Frontend
| Tecnología | Versión | Para qué |
|------------|---------|----------|
| **Next.js** | 16 | App Router, SSR/SSG, Vercel deployment |
| **React** | 19 | Componentes funcionales, hooks |
| **TypeScript** | ~5.7 | Type-safety sin runtime overhead |
| **GSAP** | 3.x | Animaciones scroll-triggered (ScrollTrigger, SplitText) |
| **Lenis** | ~1.0 | Smooth scroll, integrado con ScrollTrigger |
| **CSS propio** | — | Sin Tailwind: diseño handoff implementado 1:1 |

### Backend & APIs
| Servicio | Función | Autenticación |
|----------|---------|----------------|
| **Groq** | LLM principal del chat (~1 s) | API Key `GROQ_API_KEY` (gratuita) |
| **Google Gemini** | LLM de respaldo del chat | API Key `GEMINI_API_KEY` (gratuita) |
| **Gmail SMTP** | Envío de correos | Contraseña de aplicación |
| **Google Calendar API** | Horarios libres, eventos con Meet | OAuth 2.0 (refresh token) |
| **Upstash Redis** (integración de Vercel) | Límite de consultas compartido entre instancias | `KV_REST_API_*` |
| **Vercel** | Hosting + CI/CD + Analytics | Git integration |

### Herramientas
- **npm 10+** · Dependency management
- **Turbopack** · Bundler rápido en dev/build
- **TypeScript compiler** · Type checking (sin emit)

---

## Arquitectura & Flujos

### 1. Chat (Bot Yuyo)

```
Cliente (navegador)
    ↓ POST /api/chat { message, context }
    ↓
/api/chat/route.ts
    ├─ Valida y limpia input
    ├─ Lee historial de la sesión
    ├─ Construye prompt del sistema (lib/chat/store.ts)
    ├─ Límite: 20 consultas por minuto por IP (Redis)
    ├─ Consulta primero a Groq (llama-3.3-70b; si la cuenta no tiene el modelo, prueba el siguiente)
    ├─ Si no respondió en 2 s (o falló), lanza Gemini en paralelo y gana el primero
    ├─ Plazo total 22 s; cancela las consultas que quedan en vuelo
    ├─ Parsea etiquetas [[PEDIDO:n]], [[AGENDAR]], [[OPCIONES:...]]
    └─ Devuelve { text, actions[], error? }
    ↓
ChatWidget.tsx
    ├─ Renderiza mensaje + chips/tarjetas según etiquetas
    ├─ Si [[AGENDAR]], dispara evento cm:quote hacia Booking
    └─ Mantiene scroll al pie, recibe y muestra escritura
```

**Velocidad y respaldo (medido en producción, 2026-10-28):** 1,3 a 2 s de punta a punta.
- Con `GROQ_API_KEY`: Groq primero; Gemini (`gemini-3.5-flash-lite` y siguientes) entra si Groq tarda más de 2 s o falla.
- Sin `GROQ_API_KEY`: solo Gemini, con consultas escalonadas cada 3,5 s.
- Si todo falla, el chat muestra un error con botón "Reintentar".

**Dónde aparece:** sección *Probalo* de la home y burbuja flotante que abre la mascota Yuyo (`components/YuyoLauncher.tsx`) en todas las páginas. El chat de la burbuja se descarga recién al abrirlo.

**Comportamiento del bot:**
- **Prompts firmes:** no inventa precios, plazos, clientes ni integraciones. Todo se deriva a la llamada.
- **Rubros:** ecommerce, logística, inmobiliarias, gastronomía, salud, servicios profesionales, B2B, SaaS, oficios.
- **Dudas típicas:** seguridad, idiomas, integraciones, actualización de datos, costo, plazos.
- **Demo:** tienda de ejemplo con 3 pedidos simulados (IDs: 4821, 4790, 4833).
- **Etiquetas** que genera:
  - `[[PEDIDO:4821]]` → muestra tarjeta de orden con detalles
  - `[[AGENDAR]]` → botón para abrir formulario
  - `[[WHATSAPP]]` → link a WhatsApp (hoy demostrativo)
  - `[[OPCIONES:Sí|No|Otro]]` → sugerencias como chips clickeables

### 2. Formulario de Agendar

```
Cliente (navegador)
    ↓ Form: nombre, email, rubro, día, hora, mensaje
    ↓
Booking.tsx (validación en cliente)
    ├─ Nombre: 3+ chars, sin números
    ├─ Email: RFC 5322
    ├─ Rubro: elegido del dropdown
    ├─ Día/Hora: obligatorios
    ├─ Honeypot (.hp): rechaza si está lleno
    └─ Si error → sacudida en campo inválido (shake 380ms)
    ↓ POST /api/booking { name, email, ... }
    ↓
/api/booking/route.ts
    ├─ Revalida en servidor
    ├─ Límite: 5 pedidos cada 10 min por IP (Redis)
    ├─ Descarta si honeypot tiene valor
    ├─ Vuelve a comprobar que el horario siga libre (si no: 409 slot_taken)
    ├─ Crea el evento en Google Calendar con link de Meet e invita al cliente
    ├─ Manda 2 correos por Gmail:
    │  1. Aviso al equipo (BOOKING_TO), con el link de Meet y el resumen del cotizador
    │  2. Confirmación al cliente
    ├─ (Opcional) agrega una fila en la planilla de contactos (LEADS_WEBHOOK_URL)
    └─ Devuelve { ok, confirmed }   // confirmed = true si se creó el evento con Meet

GET /api/slots?date=AAAA-MM-DD → { calendar, free[] }   // horarios libres reales del día
    ↓
Booking.tsx (éxito)
    ├─ Muestra check con pop (scale 1.06, 550ms total)
    ├─ Texto escalonado con fade-in
    └─ Botón "Cambiar fecha" para volver al formulario
```

**Horarios:** lunes a viernes, 10:00, 11:30, 14:00, 15:30 y 17:00 (hora Argentina), 30 minutos, hasta 21 días adelante y con 2 h de anticipación mínima (`lib/slots.ts`). Si Google Calendar no está configurado o falla, el pedido sigue por correo y el equipo confirma a mano.

**Rate limiting:** Upstash Redis (compartido entre instancias de Vercel); sin Redis, cae a memoria por instancia.

**Correos:**
- **Al equipo:** remitente bot, Reply-To cliente, para responder directo desde Gmail.
- **Al cliente:** confirmación de recepción con día/hora solicitados.

### 3. Página Principal

```
page.tsx (componentes principales)
├─ Hero: título palabra por palabra con subrayado ámbar, vitrina que entra en 3D y se inclina con el mouse
├─ Showcase: 6 rubros en carrusel (logística, turnos, tienda, inmobiliaria, gastronomía, servicios)
├─ Probalo: chat real con datos clave (24/7, segundos, 1 línea) y preguntas sugeridas
├─ NightStory: "Mientras dormís" — 4 escenas de un reloj avanzando, pin en desktop
├─ Steps: "De la primera charla a tu agente en línea" (3 pasos con tarjetas 3D y cierre con CTA)
├─ Testimonios: cinta de 2 filas; al pasar el mouse la tarjeta se inclina en 3D y las demás se apagan
├─ Cotizador: selector de volumen y funciones → estimación que se adjunta al formulario
└─ Booking: formulario de agendar con horarios reales de Google Calendar
```

**Otras páginas:** `/servicios`, `/proyectos` (casos simulados en filas editoriales con teléfono en 3D), `/nosotros` (foto, equipo, cómo trabajamos), `/privacidad`, `/terminos`.

**Profundidad 3D (desktop con mouse):** `components/Tilt.tsx` inclina hacia el cursor todo lo que tenga `data-tilt` (estilos en `app/styles/depth.css`), y `Motion.tsx` hace que cada sección entre apenas inclinada y se apoye plana al subir. En celulares todo queda plano para no pesar.

**Mascota Yuyo:** camina por el borde inferior; cuando el mouse se acerca se frena, ofrece el mate (con vapor) y dice una de 10 frases que van rotando. Un clic abre el chat.

---

## Movimiento (Motion Design)

**Identidad Premium:** elegancia sin rebotes, siempre activo.

| Acción | Duración | Easing | Comportamiento |
|--------|----------|--------|-----------------|
| Toque en botón | 150ms → 350ms | cubic-bezier(0.16, 1, 0.3, 1) | `scale: 0.97` al presionar, vuelve suave |
| Error en campo | 380ms | ease-out | Sacudida 3 oscilaciones decrecientes |
| Éxito (check) | ~550ms | ease-out + pop | Check sube con pop a 1.06, texto escalonado |
| Entrada al scroll | 700ms | ease-out | Desde abajo (24px) + desenfoque de 6px |
| Spinner (enviando) | 0.9s | linear | Rotación 360° infinita |

**Archivo de configuración:** [MOTION.md](MOTION.md) con constantes CSS y GSAP.

---

## Estructura de Archivos

```
.
├── app/
│   ├── page.tsx                    # Página principal (hero, secciones, componentes)
│   ├── nosotros/page.tsx           # Página Nosotros: foto (public/nosotros.jpg) + descripción + principios
│   ├── layout.tsx                  # Root layout, fuentes, script de movimiento
│   ├── globals.css                 # Paleta (navy/bone/slate/mist), tipografía, keyframes
│   ├── api/
│   │   ├── chat/route.ts           # POST /api/chat — Groq primero, Gemini de respaldo
│   │   ├── slots/route.ts          # GET /api/slots — horarios libres (Google Calendar)
│   │   └── booking/route.ts        # POST /api/booking — Calendar + Meet, Gmail SMTP, validación
│   └── styles/
│       ├── glass.css               # Formulario de agendar, botones, animaciones
│       ├── nav-footer.css          # Navegación flotante, footer
│       ├── testimonials.css        # Marquee de testimonios
│       ├── story.css               # NightStory pin y escenas
│       └── quote.css               # Cotizador
├── components/
│   ├── ChatWidget.tsx              # Chat: vitrina (hero loop) + modo real
│   ├── Booking.tsx                 # Formulario + validación + feedback
│   ├── HeroShowcase.tsx            # 6 rubros en carrusel con GSAP
│   ├── Testimonials.tsx            # Marquee infinito, pausa en hover
│   ├── Steps.tsx                   # Línea de tiempo animada
│   ├── NightStory.tsx              # 4 escenas con ScrollTrigger pin
│   ├── Quote.tsx                   # Cotizador de precios
│   ├── Motion.tsx                  # GSAP + Lenis init, scroll triggers
│   ├── Reveal.tsx                  # IntersectionObserver para data-reveal
│   ├── Nav.tsx                     # Navegación píldora flotante
│   ├── Footer.tsx                  # Footer con logo animado
│   ├── YuyoLauncher.tsx            # Mascota que camina y abre el chat en burbuja
│   ├── Tilt.tsx                    # Inclinación 3D hacia el cursor ([data-tilt])
│   └── ChatSample.tsx              # Mini conversaciones de ejemplo (Servicios, Proyectos)
├── lib/
│   ├── chat/
│   │   ├── store.ts                # System prompt de Yuyo (hechos, rubros, dudas)
│   │   ├── engine.ts               # Parser de etiquetas [[...]], errores
│   │   └── provider.ts             # Cliente HTTP hacia /api/chat
│   ├── motion.ts                   # Constantes GSAP (MOTION.ease, MOTION.std, etc.)
│   └── motion-constants.ts         # (nuevo, pendiente integración)
├── public/
│   └── [assets: SVG, favicon, etc.]
├── project/
│   ├── HANDOFF.md                  # Diseño original de Claude Design
│   └── chats/                      # Conversaciones de diseño
├── CONTEXT.md                      # Bitácora de decisiones y etapas completadas
├── MOTION.md                       # Identidad de movimiento (Premium)
├── README.md                       # Este archivo
├── .env.example                    # Template de variables de entorno
├── .env.local                      # (git-ignored) Claves locales
├── next.config.ts                  # Turbopack config, CORS headers
├── tsconfig.json                   # TypeScript strict mode
└── package.json                    # Dependencies, scripts
```

---

## Setup & Ejecución

### Requisitos
- Node.js 18+
- npm 10+
- Cuenta Google con Gmail y Gemini API habilitada

### 1. Clonar y instalar
```bash
git clone https://github.com/frannook/codigo-mate-landing.git
cd codigo-mate-landing
npm install
```

### 2. Variables de entorno
Crear `.env.local` (se ignora en git):

```env
# Chat
GROQ_API_KEY=gsk_...                         # console.groq.com (principal, recomendado)
GEMINI_API_KEY=tu_clave_de_aistudio_google_com
GEMINI_MODEL=                                # Opcional

# Gmail SMTP
GMAIL_USER=botcodigomate@gmail.com
GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx          # 16 caracteres de myaccount.google.com/apppasswords
BOOKING_TO=botcodigomate@gmail.com           # Opcional; por defecto es GMAIL_USER

# Google Calendar (cliente OAuth "Aplicación de escritorio")
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...                     # se obtiene con: node scripts/google-auth.mjs

# Redis (lo crea la integración Upstash de Vercel)
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

Todas las variables están documentadas en [.env.example](.env.example).

### 3. Ejecutar en desarrollo
```bash
npm run dev
# Abre http://localhost:3000
```

### 4. Build y producción
```bash
npm run typecheck                  # Verifica tipos
npm run build                      # Build estático + serverless functions
npm start                          # Servidor local en modo producción
```

---

## APIs Integradas

### Google Gemini (Chat)

**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/...`

**Modelo:** `gemini-3.1-flash-lite` (rápido, 400k tokens de contexto, gratis)

**Fallback:** `gemini-3.5-flash-lite` si el primero falla o demora >3.5s

**Headers:**
```javascript
{
  "Content-Type": "application/json",
  "x-goog-api-key": process.env.GEMINI_API_KEY
}
```

**Request:**
```javascript
{
  "contents": [
    { "role": "user", "parts": [{ "text": "¿Cuánto cuesta...?" }] }
  ],
  "system_instruction": {
    "parts": [{ "text": "Eres Yuyo, un agente..." }]
  },
  "generation_config": {
    "maxOutputTokens": 1024,
    "temperature": 0.7
  }
}
```

**Response:**
```javascript
{
  "candidates": [{
    "content": {
      "parts": [{ "text": "Respuesta... [[AGENDAR]]" }]
    }
  }]
}
```

**Errores comunes:**
- `404`: Modelo no disponible. Listá modelos en aistudio.google.com y ajustá `GEMINI_MODEL`.
- `503`: Saturación. Código reintenta automáticamente.

### Gmail SMTP (Correos)

**Librería:** `nodemailer`

**Servidor:** `smtp.gmail.com:587` (TLS)

**Autenticación:**
```javascript
transport: nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD  // NO contraseña de la cuenta
  }
})
```

**Correo al equipo:**
```
Para:        botcodigomate@gmail.com (o BOOKING_TO)
De:          botcodigomate@gmail.com
Reply-To:    cliente@example.com
Asunto:      Nuevo pedido: Franco Perez (2026-10-10 14:00)
Cuerpo:      Datos del formulario + rubro + mensaje
```

**Correo al cliente:**
```
Para:        cliente@example.com
De:          botcodigomate@gmail.com
Asunto:      Confirmamos tu llamada | Código Mate
Cuerpo:      Agradecimiento + resumen de día/hora + próximos pasos
```

### Google Calendar API (activo)

**OAuth 2.0:** se autoriza una sola vez con la cuenta `botcodigomate@gmail.com`.

**Flujo:**
1. `node scripts/google-auth.mjs` abre el navegador con la pantalla de consentimiento de Google (servidor local en `127.0.0.1:53682`).
2. Al aceptar, el script cambia el código por un refresh token y lo imprime en la terminal.
3. El refresh token se carga en Vercel como `GOOGLE_REFRESH_TOKEN` (nunca llega al navegador).
4. `lib/calendar.ts` pide un access token efímero, lee los eventos ocupados del día y crea el evento con Meet (`conferenceDataVersion=1`, `sendUpdates=all`).

**Archivos:** `lib/calendar.ts` (cliente REST sin dependencias), `lib/slots.ts` (horarios ofrecidos), `app/api/slots/route.ts`, `app/api/booking/route.ts`, `scripts/google-auth.mjs`.

**Importante:** la app de Google está en modo *Prueba*, así que el refresh token vence a los 7 días. Para renovarlo: correr de nuevo el script, actualizar `GOOGLE_REFRESH_TOKEN` en Vercel y redesplegar. Publicarla exige un dominio propio verificado.

---

## Validación & Seguridad

### Lado cliente (Booking.tsx)
- Nombre: 3+ caracteres, sin números consecutivos
- Email: RFC 5322 válido
- Rubro: no vacío
- Día/Hora: seleccionados

### Lado servidor (/api/booking)
- Revalidación completa (no confiar en cliente)
- **Honeypot** (.hp): campo oculto. Si tiene valor → rechaza.
- **Rate limiting:** 5 pedidos cada 10 min por IP.
- Sanitización de entrada antes de enviar correo.

### APIs
- Gemini API Key en env, nunca expuesta al cliente.
- Gmail credenciales (password de app) en env.
- Calendar OAuth: refresh token seguro, access token efímero.

---

## Deployment (Vercel)

### Pasos
1. **Conectar repo:** Vercel importa `main` automáticamente.
2. **Variables de entorno:** panel de Vercel → Settings → Environment Variables.
3. **Deploy:** automático en cada push a `main`.
4. **Previsualización:** cada PR genera preview URL.

### Preview URLs
- Automáticas en PRs (p.ej., `codigo-mate-landing-pr-3-frannook.vercel.app`).
- Útil para revisar cambios antes de merge.

### Monitoreo
- **Logs:** Vercel → Deployments → View Functions.
- **Errores:** edge cases en `/api/chat` se loguean con timestamp.

---

## Proceso de desarrollo

Cómo se fue construyendo la web, en orden y con las tecnologías de cada paso. La versión sin jerga, con el prototipo y las decisiones, está en el tablero de Trello; el detalle de cada decisión (fecha y motivo) en [docs/entrega/02-acuerdos-y-decisiones.md](docs/entrega/02-acuerdos-y-decisiones.md).

| Fecha | Qué se hizo | Tecnologías y detalle | Qué no se hizo y por qué |
| --- | --- | --- | --- |
| 6/10 | Landing inicial: inicio, bot, testimonios y formulario | Diseño de origen en `project/` pasado a Next.js (App Router), React y TypeScript. Chat en `/api/chat` con Gemini | Tailwind: el diseño vino en CSS y no justificaba otra dependencia |
| 6/10 | Reintentos silenciosos ante errores 503 de Gemini | Modelo `gemini-3.1-flash-lite`, reintento en el servidor | Plan pago de Google: se buscó una opción gratuita |
| 6/10 | Avisos por correo | Nodemailer con Gmail SMTP y contraseña de aplicación; cuenta propia del proyecto | Telegram (el público no lo usa) y Resend (pide dominio propio verificado) |
| 7/10 | Rediseño v2 y movimiento | GSAP con ScrollTrigger, Lenis para el scroll, CSS propio. Vitrina de 6 rubros con timeline de GSAP. Movimiento siempre activo | Respetar `prefers-reduced-motion` e interruptor on/off: el equipo eligió movimiento siempre activo |
| 16/10 | Acento ámbar, logo, `/nosotros`, SEO y analítica | Color `#E9A23B` elegido por contraste (8:1) entre 4 candidatos; metadatos y Vercel Analytics | Terracota, cobre y durazno |
| 20-21/10 | Rendimiento | Lighthouse en local y en producción; estilos en línea, carga diferida del movimiento, modo liviano en celulares. Se revirtió lo que no mejoraba (precarga de fuentes, carga bajo demanda de secciones) | Cambios a ciegas: se midió de a uno |
| 21/10 | `/servicios` y `/proyectos`, WhatsApp, Calendar y límites | Google Calendar API con OAuth y Meet; Upstash Redis para el límite compartido; tarea de GitHub cada 30 min para avisar caídas. Si Google falla, el pedido sigue por correo | Herramienta de agenda paga; monitoreo pago |
| 27/10 | Seguridad y confianza | Actualización de `next`, `nodemailer` y `react` (0 vulnerabilidades), cabeceras de seguridad, páginas legales, 404, íconos y manifest | Textos legales revisados por abogado: queda como borrador |
| 28/10 | Groq como proveedor principal | Groq primero y Gemini de reserva si Groq tarda más de 2 s o falla; 1,3 a 2 s por respuesta medidos en producción | Plan pago; seguir solo con Gemini |
| 28/10 | Mascota Yuyo y rediseño 3D | Chat cargado bajo demanda en una burbuja; mascota fija en la esquina en celular; 3D sutil solo en escritorio con mouse | Botón de chat clásico; mascota caminando también en celular (tapaba contenido) |
| 28/10 | Correos de bienvenida | Mail HTML con día, hora, Meet y qué vamos a ver, más invitación de Calendar | — |

**Lo que se usó, en una línea:** Next.js 16, React 19, TypeScript, GSAP, Lenis, CSS propio, Groq, Gemini, Gmail SMTP, Google Calendar y Meet, Upstash Redis, Vercel y Vercel Analytics. **Costo en servicios:** cero (planes gratuitos); la única compra pendiente es un dominio propio.

**Cómo se trabajó:** el código se construyó con ayuda de Claude Code (un asistente de IA para programar) y las decisiones las tomó el equipo. Casi todos los commits figuran con la cuenta `frannook`, así que el historial no refleja el reparto del trabajo; la mejora acordada para un próximo proyecto es que cada integrante suba sus cambios con su cuenta y por pull request.

---

## Pendiente

El paso a paso completo (qué hace cada integrante y qué hace el código) está en [docs/PLAN_CONEXIONES.md](docs/PLAN_CONEXIONES.md).

| Tarea | Impacto | Esfuerzo | Estado |
|-------|---------|----------|--------|
| **Google Calendar API** | Evita pedidos duplicados, genera Meet link | Medio | Hecho (token de prueba, vence a los 7 días) |
| **Límite de consultas en Redis** | Escalable a múltiples instancias | Bajo | Hecho |
| **Chat rápido con Groq** | Respuestas en 1 a 2 s | Bajo | Hecho |
| **WhatsApp real** | Pase a una persona con contexto | Bajo | Hecho |
| **Testimonios reales** | Credibilidad | Bajo | Ejemplos ilustrativos |
| **Analítica** | Medir conversiones | Muy bajo | Hecho (Vercel Analytics) |
| **Dominio propio** | Marca y publicar la app de Google | Bajo | Pendiente (costo) |
| **Cuenta de servicio de Google** | Calendar sin vencimiento y sin dominio | Medio | Propuesto |

---

## Notas para el profesor

1. **Stack moderno:** Next.js 16 (App Router), React 19, TypeScript. Sin Tailwind: CSS handoff implementado 1:1.
2. **IA en producción:** Groq como proveedor principal y Gemini de respaldo, con timeouts y manejo de saturación.
3. **Correo:** Gmail SMTP sin servicio externo (gratis), cuenta del proyecto separada.
4. **Seguridad:** validación dual (cliente + servidor), honeypot, rate limiting, env variables seguras.
5. **Motion:** identidad Premium documentada, animaciones que mejoran UX sin distraer.
6. **Proceso:** iteraciones con AI (Claude Code), PRs con preview, decisiones documentadas (CONTEXT.md).

---

## Problemas Conocidos & Soluciones

| Problema | Causa | Solución |
|----------|-------|----------|
| Chat devuelve 404 | Modelo Gemini no disponible | Listar modelos en aistudio.google.com, actualizar `GEMINI_MODEL` |
| Chat tarda >10s | Saturación de API o timeout | Reintento automático; si persiste, cambiar modelo |
| Formulario no envía correo | Credenciales Gmail incorrectas | Verificar `GMAIL_APP_PASSWORD` en myaccount.google.com/apppasswords |
| Vercel dice "two `package-lock.json`" | Turbopack config | Ya está fijado en `next.config.ts` |
| Rate limit se reinicia | En memoria por instancia | Migrar a Upstash Redis cuando escale |

---

## Cómo contribuir

1. **Rama nueva:** `git checkout -b feature/descripcion`
2. **Cambios:** editar código, probar en `npm run dev`
3. **Validación:** `npm run typecheck && npm run build`
4. **Commit:** mensaje claro (ej: "Auth: agregar verificación de email")
5. **Push:** `git push -u origin feature/descripcion`
6. **PR:** describir cambios, esperar revisión
7. **Merge:** solo a través de PR en main

---

## Links útiles

- [Gemini API Docs](https://ai.google.dev/docs)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Vercel Deployment](https://vercel.com/docs)
- [Google Calendar API](https://developers.google.com/calendar/api) (pendiente)

---

**Última actualización:** 2026-10-28 · Google Calendar con Meet, chat con Groq, mascota Yuyo, rediseño 3D (hero, Probalo, pasos, testimonios, Proyectos y Nosotros).
