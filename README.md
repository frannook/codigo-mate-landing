# Código Mate · Landing

Landing de **Código Mate**, una agencia argentina que instala agentes de IA (chatbots) en las webs de negocios. La página
vende el servicio y lo demuestra: tiene un agente real, **Mati**, conectado a Gemini, que responde las dudas de quien evalúa
contratarnos, y un formulario para agendar una llamada que llega por correo.

- **Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · CSS propio (sin Tailwind)
- **IA:** Google Gemini (`@google/genai`), modelo `gemini-3.1-flash-lite`
- **Correo:** Gmail SMTP con `nodemailer` (gratis, sin dominio propio)
- **Movimiento:** GSAP (ScrollTrigger + SplitText) y Lenis para el scroll suave
- **Hosting previsto:** Vercel (plan gratuito)
- **Diseño de origen:** handoff de Claude Design en `project/` (ver `project/HANDOFF.md` y `chats/`)

## Correr en local

```bash
git clone https://github.com/frannook/codigo-mate-landing.git
cd codigo-mate-landing
npm install
cp .env.example .env.local     # completar las claves (ver abajo)
npm run dev                    # http://localhost:3000
```

Otros comandos: `npm run build && npm start` (producción), `npm run typecheck` (TypeScript sin compilar).

### Variables de entorno

Van en `.env.local` (git las ignora) y, en producción, en el panel de Vercel. **Nunca** se suben al repo ni se pegan en chats.

| Variable | Para qué | Dónde se obtiene |
| --- | --- | --- |
| `GEMINI_API_KEY` | Chat de Mati | https://aistudio.google.com/apikey (capa gratuita) |
| `GEMINI_MODEL` | Opcional. Cambia el modelo sin tocar código | Lista de modelos de tu key |
| `GMAIL_USER` | Cuenta que envía los correos (`codigomatebot@gmail.com`) | Cuenta Gmail del proyecto |
| `GMAIL_APP_PASSWORD` | Contraseña de aplicación de 16 letras | https://myaccount.google.com/apppasswords (requiere verificación en 2 pasos) |
| `BOOKING_TO` | Opcional. A dónde llegan los pedidos de llamada; por defecto `GMAIL_USER` | Cualquier correo que el equipo revise a diario |

## Cómo funciona

```
app/page.tsx                     Hero, cinta, bot, bento, cómo trabajamos, testimonios, agendar, footer
app/globals.css                  Paleta navy/bone, tipografía, animaciones, responsive
app/layout.tsx                   Fuentes y script que decide si el movimiento está activo
app/api/chat/route.ts            Llama a Gemini (system prompt en el servidor, límite por IP, reintento ante 503)
app/api/booking/route.ts         Valida el formulario y manda 2 correos (aviso al equipo + confirmación al cliente)
components/ChatWidget.tsx        Chat: modo vitrina (hero, en loop) y modo real (sección del bot)
components/Booking.tsx           Formulario de agendar con validación accesible y campo trampa anti-bots
components/Motion.tsx            GSAP + Lenis: scroll suave, titulares, paralaje, cinta, botones magnéticos
components/Testimonials.tsx      Carrusel (scroll-snap, flechas, puntos, avance automático)
components/Steps.tsx             Línea de tiempo animada de "Cómo trabajamos"
lib/chat/store.ts                System prompt de Mati: base de conocimiento por rubros y dudas de dueños de negocio
lib/chat/engine.ts               Estado del chat: historial, validación, errores, reintento y etiquetas [[...]]
lib/chat/provider.ts             Cliente HTTP hacia /api/chat
lib/motion.ts                    Lee si el movimiento está encendido
```

### El bot (Mati)

Reemplaza a una sección de preguntas frecuentes. Su prompt (`lib/chat/store.ts`) le da:

- los **hechos firmes** de la agencia (qué hacemos, proceso en 3 pasos, llamada de 30 min sin costo) y la orden de **no inventar**
  precios, plazos, clientes, métricas ni integraciones: eso se deriva a la llamada;
- cómo ayudaría un agente en cada rubro (ecommerce, logística, webs institucionales, salud, inmobiliarias, gastronomía y turismo,
  educación, servicios profesionales, B2B, SaaS, oficios);
- respuestas a las dudas típicas de quien quiere instalar un chatbot (errores, seguridad, idiomas, integraciones, actualización de
  información, reemplazo del equipo, costo y plazos);
- una demo como tienda de ejemplo con tres pedidos de prueba (4821, 4790, 4833).

El modelo agrega etiquetas al final de la respuesta y `engine.ts` las convierte en elementos de la UI:
`[[PEDIDO:n]]` tarjeta de pedido, `[[WHATSAPP]]` pase a WhatsApp, `[[AGENDAR]]` botón de agendar, `[[OPCIONES:a|b|c]]` sugerencias.

### Formulario de agendar

`Booking.tsx` valida en el navegador y envía a `/api/booking`, que vuelve a validar en el servidor, aplica un límite de 5 pedidos
cada 10 minutos por IP, descarta bots con un campo oculto y manda:

1. **Aviso al equipo** a `BOOKING_TO` (o `GMAIL_USER`), con *Reply-To* al cliente: se responde directo desde Gmail.
2. **Confirmación de recepción** al cliente. Si este segundo envío falla no se rechaza el pedido, porque el equipo ya lo recibió.

El horario es una **solicitud**, no una reserva: todavía no hay calendario que impida dos pedidos para la misma hora (ver Pendiente).

### Movimiento

El movimiento está **siempre activo**, también para quien tiene "reducir movimiento" en el sistema (decisión del equipo).
`app/layout.tsx` pone `data-motion="on"` en `<html>`; para apagarlo en todo el sitio, cambiarlo a `off` ahí. Con `off` no se arma
nada de GSAP/Lenis y la página se ve completa y quieta. El marquee de testimonios tiene botón de pausa.

## Cómo venimos trabajando

El proyecto avanza en iteraciones cortas entre el equipo y Claude Code. El orden y las decisiones están en [CONTEXT.md](CONTEXT.md).
Resumen de las etapas:

1. **Diseño:** maqueta en Claude Design → handoff en `project/` → implementación en Next.js.
2. **Pulido visual:** revisión con las skills de diseño (impeccable, taste), paleta navy/bone intacta, sin estilos de plantilla.
3. **Estructura de la página:** hero, bot funcional, bento de capacidades, proceso, testimonios, agendar, footer. Se eliminó la FAQ: el bot la reemplaza.
4. **Motion:** GSAP + Lenis, siempre activo.
5. **Infraestructura:** chat con Gemini, formulario por correo (Gmail), repositorio y despliegue.

### Flujo de trabajo del equipo

```bash
git checkout -b feature/nombre-corto       # una rama por cambio
# ...cambios...
npm run typecheck && npm run build         # antes de subir
git add -A && git commit -m "Qué cambió y por qué"
git push -u origin feature/nombre-corto    # abrir Pull Request en GitHub
```

- No se sube directo a `main`: todo entra por Pull Request con al menos una revisión.
- Vercel genera una vista previa por cada Pull Request; al hacer merge a `main` se publica solo.
- Los textos de la web y el prompt de Mati son contenido de negocio: cualquier cambio de precios, plazos o promesas lo valida el equipo.
- Las claves se comparten por un gestor de contraseñas (Bitwarden o similar), no por chat ni por el repo.

## Pendiente

- [ ] **Publicar en Vercel** y cargar las variables de entorno.
- [ ] **Calendario real:** crear el evento en Google Calendar con link de Meet y mostrar solo horarios libres (evita pedidos duplicados).
- [ ] **Correo al cliente con los datos de la llamada** (día, hora y link de Meet).
- [ ] **WhatsApp:** link `wa.me` con el número del negocio (hoy el pase a WhatsApp es solo demostrativo).
- [ ] **Testimonios reales:** los de `components/Testimonials.tsx` son texto de ejemplo y deben reemplazarse antes de promocionar la web.
- [ ] **Límite de consultas compartido:** el de `/api/chat` y `/api/booking` vive en memoria por instancia; en Vercel con varias instancias conviene Upstash o Vercel KV.
- [ ] **Analítica** de conversiones (visitas → chat → pedido de llamada).
- [ ] Favicon propio con la marca definitiva y dominio.

## Notas y problemas conocidos

- Los modelos de Gemini cambian seguido: `gemini-2.5-flash` ya no está disponible para cuentas nuevas. Si el chat devuelve 404, listá los modelos de la key y ajustá `GEMINI_MODEL`.
- Los modelos nuevos pueden devolver 503 por saturación; el servidor reintenta una vez con `gemini-3.5-flash-lite`.
- Gmail limita el envío diario (cientos de correos), suficiente para este volumen. Si crece, pasar a un servicio de correo con dominio propio.
- Si Next avisa de dos `package-lock.json`, `next.config.ts` ya fija `turbopack.root` en este proyecto.
