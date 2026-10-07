# Código Mate Landing · Contexto de Desarrollo

**Última actualización:** 2025-10-06  
**Estado:** MVP funcional con integración de Gemini API + formulario de booking  
**Equipo:** Trabajar en conjunto con compañeros

---

## 📋 Resumen del Proyecto

**Código Mate** es una landing page para una startup que vende un chatbot IA que atiende consultas de clientes automáticamente y escala a WhatsApp.

- **Stack:** Next.js 16 (App Router) + TypeScript + TailwindCSS
- **Base de datos:** Ninguna (aún)
- **APIs actuales:** Gemini 2.5-flash (chat), Resend (email), Telegram (notificaciones), Google Calendar (reservas)
- **Modelo de negocio:** SaaS B2B - vender agentes IA customizados para negocios

---

## 🏗 Arquitectura Actual

```
app/
├── page.tsx                    # Landing: navbar + hero + steps + booking + footer
├── globals.css                 # Paleta, tipografía, animaciones, responsive
├── api/
│   └── chat/route.ts          # Endpoint Gemini (POST) + rate limiting
└── icon.svg                    # Favicon

components/
├── ChatWidget.tsx             # Demo interactivo del chat
├── Steps.tsx                  # Timeline "Cómo trabajamos" (animada)
├── Booking.tsx                # Formulario agendar llamada
├── Reveal.tsx                 # Scroll reveals (entradas laterales)
└── icons.ts                   # SVG icons

lib/
├── chat/
│   ├── engine.ts              # State machine: historial, validación, errores
│   ├── provider.ts            # Fetch a /api/chat
│   └── store.ts               # Datos de demostración + system prompt
└── (future: db, auth, etc.)

.env.example                   # Variables de entorno
README.md                       # Setup rápido
package.json                   # Dependencies
```

---

## 🔑 Variables de Entorno

Crea `.env.local` en la raíz (NO subir a GitHub):

```bash
# Gemini API (Google)
GEMINI_API_KEY=tu_key_aqui
GEMINI_MODEL=gemini-2.5-flash  # opcional

# Telegram Bot (opcional, para notificaciones)
TELEGRAM_BOT_TOKEN=tu_token_aqui
TELEGRAM_CHAT_ID=tu_id_aqui

# Resend (opcional, para emails)
RESEND_API_KEY=tu_key_aqui

# Google Calendar (opcional, para reservas)
GOOGLE_CALENDAR_ID=tu_calendar_id@calendar.google.com
GOOGLE_SERVICE_ACCOUNT={"type":"service_account",...}  # JSON stringificado
```

**Dónde obtener las keys:**
- **Gemini:** https://aistudio.google.com/apikey (gratis, 10 RPM / 250k TPM)
- **Telegram:** https://t.me/BotFather (gratis, envía `/newbot`)
- **Resend:** https://resend.com (gratis hasta 3000 emails/mes)
- **Google Calendar:** Google Cloud Console (service account con scope calendar)

---

## 📝 Cambios Realizados (v391d4df)

### Gemini API Integration
**Archivo:** `app/api/chat/route.ts`

- Migración de Claude → Gemini
- Modelo: `gemini-2.5-flash` (configurable vía `GEMINI_MODEL`)
- Rate limit: 20 req/60s por IP (in-memory)
- Validación: max 16 mensajes, 2000 chars/msg
- Error handling: 429 (limit), 503 (missing key), 502 (upstream)

```typescript
const response = await client.models.generateContent({
  model: MODEL,
  contents: messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  })),
  config: {
    systemInstruction: SYSTEM,
    maxOutputTokens: 400,
    temperature: 0.6,
    thinkingConfig: { thinkingBudget: 0 }
  }
});
```

### Visual Polish (3 agentes)
**Archivos:** `app/globals.css`, `components/*.tsx`

- **Navbar:** Links con underline on-hover, tap targets 44px
- **Hero:** CTA sin animación infinita (hover + press effect)
- **Steps:** Números 64-88px, timeline staggered (0.2s, 1.25s, 1.85s)
- **Booking:** Per-field errors, focus management, async submit seam
- **Chat:** Hair-line borders, status indicators, suggestions 32px
- **Favicon:** `app/icon.svg` (navy + "cm")
- **Accessibility:** 44px tap targets WCAG AA, reduced-motion support

### Form Validation
**Archivo:** `components/Booking.tsx`

```typescript
// Estado:
- [x] Valida: nombre, email, fecha, hora
- [x] Muestra errores inline (aria-describedby)
- [x] Focus management al primer inválido
- [x] Botón submit: "Enviando…" durante processing
- [ ] Envía datos a backend (placeholder await)
- [ ] Conectar: email (Resend), Telegram, Calendar
```

---

## ✅ Lo Que Funciona Ahora

| Feature | Status | Detalles |
|---------|--------|----------|
| **Navbar + Hero** | ✅ | Responsive, animaciones suavizadas |
| **Chat Demo** | ✅ | Interactivo, fallback con error handling |
| **Timeline "Cómo trabajamos"** | ✅ | Animaciones staggered, scroll reveal |
| **Formulario Booking** | ✅ | Validación, UX accesible, confir visual |
| **Favicon** | ✅ | SVG navy con "cm" |
| **Gemini API** | ⚠️ | Código listo, falta tu GEMINI_API_KEY |
| **Rate Limiting** | ✅ | 20 req/60s por IP |

---

## 🚀 Próximas Tareas (Backend Integration)

### 1️⃣ Telegram Bot (Notificaciones)
**Por hacer:** `app/api/booking/route.ts` → Telegram

Cuando alguien agenda, notifica al owner:
```
✅ Nueva reserva: Juan
📅 Lun 20 ene, 14:00 h
📧 juan@empresa.com
🌐 www.empresa.com
```

**Setup:**
1. Talk to @BotFather on Telegram
2. Create bot, get token
3. Add `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` a `.env.local`
4. Usar `node-telegram-bot-api` o fetch a `https://api.telegram.org/bot{token}/sendMessage`

---

### 2️⃣ Resend Email (Confirmación)
**Por hacer:** `app/api/booking/route.ts` → Resend

Confirmar reserva al cliente:
```
Asunto: Tu llamada con Código Mate está agendada ✅

Hola Juan,
Confirmamos tu reserva para el lun 20 de enero a las 14:00 h.
Te enviaremos el link de Meet 10 minutos antes.
```

**Setup:**
1. https://resend.com → crea account
2. Verify domain o usa `onboarding@resend.dev` (testing)
3. Add `RESEND_API_KEY` a `.env.local`
4. Usar `npm install resend` → `emails.send()`

---

### 3️⃣ Google Calendar (Evento + Meet)
**Por hacer:** `app/api/booking/route.ts` → Google Calendar

Crear evento en tu calendar + generar link de Meet:
- Event: "Llamada Código Mate - Juan"
- Invitados: client email, tu email
- Meet link auto-generado
- Reminder: 10 min antes

**Setup:**
1. Google Cloud Console → new service account
2. Grant Calendar API scope
3. Descargar JSON key → stringify en `.env.local`
4. Usar `npm install googleapis` → `calendar.events.insert()`

---

### 4️⃣ WhatsApp (Pasar Cliente)
**Por hacer:** `components/Booking.tsx` → WhatsApp link O `app/api/whatsapp/route.ts` → WhatsApp API

Dos opciones:

**Opción A: Link (Gratis, simple)**
```html
<a href="https://wa.me/5491155551234?text=Hola%20quiero%20saber%20más">
  Contactar por WhatsApp
</a>
```

**Opción B: API (Requiere verificación, pago)**
- WhatsApp Business Cloud API
- Número de prueba disponible 24h sin verificar
- Después: pago por mensajes + verificación de negocio

**Recomendación:** Empezar con Opción A (gratis, cero fricción).

---

## 🛠 Configuración Local (para cuando clones)

```bash
# 1. Clonar
git clone https://github.com/tu-usuario/codigo-mate-landing
cd codigo-mate-landing

# 2. Install
npm install

# 3. Env (crear .env.local con keys)
cp .env.example .env.local
# Editar con tus claves

# 4. Dev server
npm run dev
# http://localhost:3000

# 5. Build + start (producción)
npm run build
npm start
```

**Deploy:** Vercel → push a GitHub, auto-deploy desde main

---

## 📊 Rate Limiting

**Chat API (`/api/chat`):**
- 20 requests per 60 segundos por IP
- In-memory (server-local)
- ⚠️ Con múltiples instancias serverless, usar Redis/Upstash

```typescript
const rateLimiter = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = rateLimiter.get(ip) || [];
  const recent = times.filter(t => now - t < 60000);
  if (recent.length >= 20) return true;
  recent.push(now);
  rateLimiter.set(ip, recent);
  return false;
}
```

---

## 🧪 Testing

**Manual:**
```bash
npm run dev
# Abre http://localhost:3000
# Prueba: chat, formulario, validación, animaciones
```

**Build check:**
```bash
npm run build
# Verifica que no haya errores de TypeScript
```

**Type check:**
```bash
npx tsc --noEmit
```

---

## 🔐 Seguridad & Buenas Prácticas

- ✅ **GEMINI_API_KEY**: server-only (no leaks al cliente)
- ✅ **Rate limiting**: contra abuse
- ✅ **Input validation**: email regex, max lengths
- ✅ **CORS**: no configurado (same-origin only)
- ⚠️ **TODO:** CSRF tokens en formulario
- ⚠️ **TODO:** Sanitize outputs (XSS prevention)
- ⚠️ **TODO:** Database encryption (cuando haya DB)

---

## 📱 Responsive Breakpoints

- **Mobile:** < 640px (390px test)
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px (1440px test)

Todas las animaciones respetan `prefers-reduced-motion: reduce`

---

## 💬 Estructura de Equipo

**Roles sugeridos:**
- **PM/Diseño:** Cambios visuales, copy, strategy
- **Backend:** Integración APIs, base de datos
- **Frontend:** Components, state management, forms
- **DevOps/Infra:** Deploy, CI/CD, monitoring

**Workflow:**
1. Crear rama: `git checkout -b feature/nombre`
2. Commit descriptivos: `git commit -m "Add Telegram notifications"`
3. Push: `git push -u origin feature/nombre`
4. Pull Request con descripción
5. Review + merge a `main`
6. Auto-deploy en Vercel

---

## 📞 Roadmap

**MVP (ahora):**
- [x] Landing page responsive
- [x] Chat demo con Gemini
- [x] Formulario booking básico
- [ ] Backend: email + Telegram + Calendar
- [ ] WhatsApp (link o API)

**V2 (próx. sprint):**
- [ ] Database (Supabase o similar) para guardar bookings
- [ ] Auth (admin panel para ver reservas)
- [ ] Customización: colores, logos por cliente
- [ ] Multiidioma (EN + ES)
- [ ] Analytics (conversiones, drop-off)

**V3 (largo plazo):**
- [ ] Integración real de WhatsApp Business
- [ ] Dashboard del agente (logs, analytics)
- [ ] Webhooks para sincronizar con CRM
- [ ] Mobile app (React Native)

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| `GEMINI_API_KEY undefined` | Verificar `.env.local`, reiniciar `npm run dev` |
| Chat no responde | Check API key permissions, rate limit? |
| Formulario no valida | Abrir DevTools → Console, revisar logs |
| Animaciones no andan | Revisar `prefers-reduced-motion`, cache CSS |
| Deploy falla en Vercel | Verificar env vars en Vercel project settings |

---

## 📚 Referencias

- **Next.js 16:** https://nextjs.org/docs (Turbopack)
- **Gemini API:** https://ai.google.dev/docs
- **Telegram Bot:** https://core.telegram.org/bots
- **Resend:** https://resend.com/docs
- **Google Calendar:** https://developers.google.com/calendar
- **WhatsApp Business API:** https://developers.facebook.com/docs/whatsapp

---

## 👥 Contributores

- **Claude Sonnet 5.5** · Gemini API, visual polish, accessibility
- **Tu equipo** · [Agregar nombres aquí]

---

**Happy coding! 🚀**
