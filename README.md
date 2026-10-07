# Código Mate · Landing

Landing de una agencia argentina que instala agentes de IA (chatbots) en webs de negocios. La página demuestra el servicio: **Yuyo**, un agente real conectado a Google Gemini, responde dudas de visitantes; un formulario captura pedidos de llamada vía correo.

**Objetivo pedagógico:** sitio premium con Next.js moderno, IA en producción, manejo de APIs, autenticación segura y UX pulida.

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
| **Google Gemini** | LLM para el chat del bot | API Key (gratuita) |
| **Gmail SMTP** | Envío de correos | Contraseña de aplicación |
| **Google Calendar API** | Reservas de llamadas | OAuth 2.0 (pendiente) |
| **Vercel** | Hosting + CI/CD | Git integration |

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
    ├─ Lanza consulta a Gemini (con AbortSignal timeout 9s)
    ├─ Si primer modelo tarda >3.5s, lanza Groq en paralelo (fallback)
    ├─ Reintenta silencioso si error 503 o network
    ├─ Parsea etiquetas [[PEDIDO:n]], [[AGENDAR]], [[OPCIONES:...]]
    └─ Devuelve { text, actions[], error? }
    ↓
ChatWidget.tsx
    ├─ Renderiza mensaje + chips/tarjetas según etiquetas
    ├─ Si [[AGENDAR]], dispara evento cm:quote hacia Booking
    └─ Mantiene scroll al pie, recibe y muestra escritura
```

**Timeout y fallback:**
- Primer modelo (`gemini-3.1-flash-lite`) tiene 9 segundos total.
- A los 3.5 segundos, si no respondió, lanza `gemini-3.5-flash-lite` en paralelo.
- Usa la respuesta del primero que llega; si ambos fallan, reintenta una vez.
- Si sigue fallando, devuelve error al usuario.

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
    ├─ Límite: 5 pedidos cada 10 min por IP (en memoria, volverá a Redis)
    ├─ Descarta si honeypot tiene valor
    ├─ Crea evento en Google Calendar (pendiente)
    ├─ Manda 2 correos:
    │  1. Aviso al equipo (BOOKING_TO)
    │  2. Confirmación al cliente
    └─ Devuelve { success, message }
    ↓
Booking.tsx (éxito)
    ├─ Muestra check con pop (scale 1.06, 550ms total)
    ├─ Texto escalonado con fade-in
    └─ Botón "Cambiar fecha" para volver al formulario
```

**Rate limiting:**
- Hoy: memoria por instancia. En Vercel con múltiples instancias, necesita Upstash Redis.
- Bloquea la misma IP por 10 minutos si envía 6+ pedidos.

**Correos:**
- **Al equipo:** remitente bot, Reply-To cliente, para responder directo desde Gmail.
- **Al cliente:** confirmación de recepción con día/hora solicitados.

### 3. Página Principal

```
page.tsx (componentes principales)
├─ Hero: título animado palabra por palabra, CTA, mockup del chat
├─ Showcase: 6 rubros en carrusel (logística, turnos, tienda, inmobiliaria, gastronomía, servicios)
│           cada uno muestra conversación simulada + tarjetas de productos
├─ NightStory: "Mientras dormís" — 4 escenas de un reloj avanzando, pin en desktop
├─ Testimonios: marquee de 8 cards (scroll infinito en ambas direcciones)
├─ Cotizador: selector de rubro + volumen → calcula precio y manda chip de "Presupuesto"
├─ Steps: línea de tiempo "Cómo trabajamos" (3 pasos)
└─ Booking: formulario de agendar
```

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
│   ├── layout.tsx                  # Root layout, fuentes, script de movimiento
│   ├── globals.css                 # Paleta (navy/bone/slate/mist), tipografía, keyframes
│   ├── api/
│   │   ├── chat/route.ts           # POST /api/chat — Gemini + Groq fallback
│   │   └── booking/route.ts        # POST /api/booking — Gmail SMTP, validación
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
│   └── Footer.tsx                  # Footer con logo animado
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
# Google Gemini API
GEMINI_API_KEY=tu_clave_de_aistudio_google_com
GEMINI_MODEL=gemini-3.1-flash-lite           # Opcional

# Gmail SMTP
GMAIL_USER=codigomatebot@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx       # 16 caracteres de myaccount.google.com/apppasswords

# Booking (opcional)
BOOKING_TO=contacto@codigomate.com           # Por defecto es GMAIL_USER

# Google Calendar (pendiente)
# GOOGLE_CALENDAR_CLIENT_ID=...
# GOOGLE_CALENDAR_CLIENT_SECRET=...
# GOOGLE_CALENDAR_REFRESH_TOKEN=...
```

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
Para:        codigomatebot@gmail.com (o BOOKING_TO)
De:          codigomatebot@gmail.com
Reply-To:    cliente@example.com
Asunto:      Nuevo pedido: Franco Perez (2026-10-10 14:00)
Cuerpo:      Datos del formulario + rubro + mensaje
```

**Correo al cliente:**
```
Para:        cliente@example.com
De:          codigomatebot@gmail.com
Asunto:      Confirmamos tu llamada | Código Mate
Cuerpo:      Agradecimiento + resumen de día/hora + próximos pasos
```

### Google Calendar API (Pendiente)

**OAuth 2.0:** será necesario autorizar una sola vez.

**Flujo:**
1. Ruta `/api/calendar/auth` abre navegador → Google consent screen.
2. Usuario autoriza → code → se cambia por access_token + refresh_token.
3. Refresh token se guarda en `.env` (seguro, nunca se expone).
4. `/api/booking` usa refresh token → crea evento con Meet link → invita al cliente.

**Archivos que se crearán:**
- `app/api/calendar/auth.ts` — OAuth callback
- `app/api/slots.ts` — GET los horarios libres
- `lib/calendar.ts` — cliente de Google Calendar API

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

## Pendiente

| Tarea | Impacto | Esfuerzo | Estado |
|-------|---------|----------|--------|
| **Google Calendar API** | Evita pedidos duplicados, genera Meet link | Medio | En progreso |
| **Límite de consultas en Redis** | Escalable a múltiples instancias | Bajo | Pendiente |
| **WhatsApp real** | Integración con número del negocio | Bajo | Demostrativo |
| **Testimonios reales** | Credibilidad | Bajo | Placeholder |
| **Analítica** | Medir conversiones | Muy bajo | Vercel Analytics suficiente |
| **Favicon + dominio** | Marca completa | Muy bajo | No urgente |

---

## Notas para el profesor

1. **Stack moderno:** Next.js 16 (App Router), React 19, TypeScript. Sin Tailwind: CSS handoff implementado 1:1.
2. **IA en producción:** Gemini API con fallback a Groq, timeouts, manejo de saturación.
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

**Última actualización:** 2026-10-07 · Movimiento Premium, auditoría de animaciones completada.
