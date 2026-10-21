# Plan de conexiones y automatización

Estado al 2026-10-16. Sitio: https://codigo-mate-landing.vercel.app/ · Repo: https://github.com/frannook/codigo-mate-landing

Cómo leerlo: cada paso dice **qué hacés vos** (cuentas, claves, clics) y **qué hago yo** (código). Las claves nunca se pegan en el chat ni se suben al repo: se cargan en Vercel (Settings → Environment Variables) y en `.env.local`.

## 1. Qué ya funciona

| Pieza | Estado | Cómo se comprobó |
| --- | --- | --- |
| Despliegue automático (GitHub → Vercel) | Funciona | Cada push a `main` publica solo |
| Chat con Yuyo (Gemini) | Funciona en producción | Se probó `/api/chat` en el sitio publicado y respondió |
| Formulario de agendar (correo por Gmail) | Funciona | Llegó el correo en las pruebas; conviene repetir una prueba en producción |
| Respaldo del chat en Groq | **Código listo, falta la clave** | Se activa solo al cargar `GROQ_API_KEY` en Vercel (paso 3) |
| SEO básico (`robots.txt`, `sitemap.xml`, imagen al compartir, datos estructurados) | Hecho y publicado | Verificado en el sitio publicado (paso 6) |
| Analítica | Código listo; **falta activarla** en Vercel | Panel de Vercel → Analytics → Enable (paso 5) |

## 2. Qué falta, en orden

| # | Tarea | Para qué sirve | Costo | Tiempo |
| --- | --- | --- | --- | --- |
| 1 | Google Calendar + Meet | Que cada pedido cree el evento con link de Meet y no haya dos pedidos a la misma hora | Gratis | 1 h |
| 2 | Límite de uso compartido (Upstash Redis) | Que el límite del chat y del formulario funcione de verdad en Vercel | Gratis | 30 min |
| 3 | Respaldo en Groq | Que el chat siga andando si Gemini se satura | Gratis | 10 min |
| 4 | Número de WhatsApp real | Que el pase a WhatsApp abra una charla de verdad | Gratis | 10 min |
| 5 | Analítica | Ver visitas, uso del chat y pedidos de llamada | Gratis | 15 min |
| 6 | SEO básico | Que Google indexe bien la web y se vea bien al compartir el link | Gratis | 30 min |
| 7 | Dominio propio | `codigomate.com.ar` en vez de `vercel.app` | ~US$ 10/año (.com) o gratis el primer año según el registro (.com.ar) | 1 h |
| 8 | Reglas del repo y accesos | Que nadie rompa `main` y todos puedan aportar | Gratis | 15 min |
| 9 | Avisos si algo se cae | Enterarse antes que el cliente | Gratis | 15 min |
| 10 | Contenido real | Testimonios verdaderos y nombres del equipo | — | — |

### Aviso importante sobre Vercel

El plan gratuito (Hobby) de Vercel es **solo para uso personal y no comercial**. Para un proyecto de la facultad alcanza. Si la agencia empieza a cobrar a clientes con esta web, hay que pasar a Vercel Pro (US$ 20 por mes por usuario) o mover el sitio a otro hosting. Conviene decidirlo antes de promocionar la web.

---

## Paso 1 · Google Calendar + Meet

**Vos (cuenta `codigomatebot@gmail.com`):**
1. Entrá a https://console.cloud.google.com y creá un proyecto llamado `codigo-mate`.
2. Menú "APIs y servicios" → "Biblioteca" → buscá **Google Calendar API** → "Habilitar".
3. "Pantalla de consentimiento de OAuth" → tipo **Externo** → completá nombre de la app y correo → en "Usuarios de prueba" agregá `codigomatebot@gmail.com`.
4. "Credenciales" → "Crear credenciales" → **ID de cliente de OAuth** → tipo "Aplicación web". En "URI de redireccionamiento autorizados" poné `http://localhost:3000/api/calendar/callback` y, cuando haya, la dirección pública del sitio con `/api/calendar/callback`.
5. Guardá el **Client ID** y el **Client Secret** en tu gestor de contraseñas y cargalos en `.env.local` como `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`. No los pegues en el chat.

**Yo:**
- Ruta temporal para autorizar la cuenta una sola vez y guardar el *refresh token* (`GOOGLE_REFRESH_TOKEN`).
- `/api/slots`: devuelve los horarios libres del calendario.
- `/api/booking`: crea el evento con link de Meet y Google le manda la invitación al cliente.
- `Booking.tsx`: muestra solo horarios libres.

**Cierre:** cargar las tres variables en Vercel y probar una reserva real. Ojo: con la app en modo "Prueba" el refresh token vence a los 7 días; para que no venza, en la pantalla de consentimiento pasá la app a "En producción" (no hace falta verificación para uso propio con un solo usuario).

## Paso 2 · Límite de uso compartido (Upstash Redis)

Hoy el límite vive en la memoria de cada instancia de Vercel y se reinicia solo: no frena a un abusador.

**Vos:** en Vercel → "Storage" (o "Marketplace") → **Upstash Redis** → crear base gratuita en la región más cercana (São Paulo o Virginia) → conectarla al proyecto. Vercel carga solo `KV_REST_API_URL` y `KV_REST_API_TOKEN` (o `UPSTASH_REDIS_REST_*`).

**Yo:** cambio el límite de `/api/chat` y `/api/booking` para que use Redis (ventana de 10 minutos por IP).

## Paso 3 · Respaldo del chat (Groq u otro proveedor)

Sirve para que el chat siga andando si Gemini se satura. Es opcional: sin esto el chat funciona igual, solo que sin red de seguridad.

**Opción A · Groq (gratis, sin tarjeta)**
1. Entrá a https://console.groq.com y creá la cuenta (GitHub, Google o correo).
2. Menú "API Keys" → "Create API Key" → copiá la clave (se muestra una sola vez).
3. En Vercel → proyecto → Settings → Environment Variables: `GROQ_API_KEY` = la clave, en Production y Preview.
4. Deployments → los tres puntos del último deploy → **Redeploy**.

**Si no te deja iniciar sesión con GitHub** (probá en este orden):
1. Abrí una **ventana privada** y probá de nuevo: descarta extensiones, bloqueadores de anuncios y cookies viejas.
2. Permití las cookies de terceros para `console.groq.com` y `github.com` (Chrome: candado de la barra → Configuración del sitio). El inicio con GitHub se cuelga si el navegador las bloquea.
3. Probá otro navegador (Edge o Firefox) o el celular.
4. Entrá con **otro método** en la misma pantalla: Google o correo. No necesitás GitHub para tener la cuenta.
5. Revisá que tu GitHub tenga el correo verificado (github.com → Settings → Emails).
6. Mirá https://groqstatus.com por si la plataforma está caída.
7. Si GitHub pide algo y la ventana se cierra, entrá a github.com → Settings → Applications → **Authorized OAuth Apps**, borrá Groq si aparece y repetí el inicio.
8. Esperá unos minutos si hiciste muchos intentos seguidos: puede bloquear temporalmente.

**Opción B · otro proveedor gratuito (si Groq no anda)**

El código ya acepta cualquier proveedor con API compatible con OpenAI. Cargá estas tres variables en Vercel (Production y Preview) y hacé Redeploy:

| Proveedor | `FALLBACK_BASE_URL` | `FALLBACK_MODEL` (ejemplo) | Inicio de sesión |
| --- | --- | --- | --- |
| OpenRouter | `https://openrouter.ai/api/v1/chat/completions` | `meta-llama/llama-3.3-70b-instruct:free` | GitHub, Google o correo |
| Cerebras | `https://api.cerebras.ai/v1/chat/completions` | el que figure en su panel (familia Llama) | Google o correo |
| Mistral | `https://api.mistral.ai/v1/chat/completions` | `mistral-small-latest` | Correo (pide verificar el teléfono) |

`FALLBACK_API_KEY` = la clave de ese proveedor. Los nombres de modelos gratuitos cambian seguido: copialos de la lista del panel de cada servicio. Con `FALLBACK_API_KEY` cargada, `GROQ_API_KEY` ya no hace falta.

**Cómo comprobar que funciona:** en Vercel → Logs, si Gemini falla aparece una línea con `respaldo/…` y el chat sigue respondiendo.

## Paso 4 · WhatsApp real

**Vos:** pasame el número del negocio con código de país, sin signos (ejemplo `5493794000000`), y el mensaje inicial que querés que aparezca escrito.

**Yo:** armo el link `https://wa.me/<número>?text=...` en el botón de pase a WhatsApp del chat y en el footer. Si querés que el pase lleve un resumen de la charla, también lo agrego.

## Paso 5 · Analítica (código hecho)

**Vos:** en Vercel → tu proyecto → pestaña **Analytics** → "Enable". Sin ese clic no se registra nada.

**Ya hecho:** el sitio envía los eventos `chat_message` (cada mensaje al chat) y `booking_submit` (pedido de llamada enviado), además de las visitas.

## Paso 6 · SEO básico (hecho)

**Ya hecho:** `robots.txt`, `sitemap.xml` (con `/` y `/nosotros`), `metadataBase`, imagen de vista previa (Open Graph y Twitter) y datos estructurados de la organización. La dirección pública vive en `lib/site.ts`; con dominio propio se define `NEXT_PUBLIC_SITE_URL` en Vercel.

**Vos:** dar de alta el sitio en https://search.google.com/search-console y enviar `https://codigo-mate-landing.vercel.app/sitemap.xml`.

## Paso 7 · Dominio propio

**Vos:** registrá el dominio (`.com.ar` en https://nic.ar o `.com` en un registrador). En Vercel → proyecto → Settings → Domains → agregá el dominio y copiá los registros DNS que te indica al panel del registrador. Tarda de minutos a unas horas.

**Yo:** actualizo `metadataBase`, el sitemap y los redireccionamientos de OAuth del paso 1.

**Opcional, más adelante:** correo con el dominio (`hola@codigomate.com.ar`) y pasar los envíos a un servicio con dominio verificado, si el volumen supera lo que permite Gmail (unos 500 correos por día).

## Paso 8 · Reglas del repo y accesos

**Vos:**
1. Confirmá que Cristian-create277, matiasortizsd y lucianodeimundo aceptaron la invitación (Settings → Collaborators).
2. Settings → Branches → "Add rule" sobre `main`: exigir Pull Request y una aprobación. Así se cumple lo que dice el README.
3. Settings → Secrets: confirmá que no haya claves en el repo (hoy `.env.local` está ignorado).

## Paso 9 · Avisos si algo se cae

**Vos:**
- Cuenta gratuita en https://uptimerobot.com: monitor HTTP sobre `https://codigo-mate-landing.vercel.app/` cada 5 minutos, con aviso por correo.
- En https://aistudio.google.com revisá la cuota de tu clave de Gemini; si se agota, el chat responde error (por eso el respaldo del paso 3).
- Vercel → proyecto → "Logs": ahí se ven los errores del chat y del formulario.

## Paso 10 · Contenido real

- Reemplazar los 8 testimonios de ejemplo de `components/Testimonials.tsx` por reales (o sacarlos hasta tenerlos).
- Sumar nombres y roles del equipo en Nosotros, si querés mostrarlos.
- Revisar los precios del cotizador (`Quote.tsx`) y del prompt de Yuyo: son decisión de negocio.

---

## Automatizaciones opcionales (después de lo anterior)

| Idea | Qué hace | Cómo |
| --- | --- | --- |
| Planilla de contactos | Cada pedido de llamada se anota solo en una Google Sheet | Webhook de Google Apps Script llamado desde `/api/booking` (gratis) |
| Recordatorio al cliente | Correo 24 h antes de la llamada | Lo cubre Google Calendar al crear el evento (paso 1) |
| Resumen semanal | Correo al equipo con conversaciones y pedidos de la semana | Tarea programada de Vercel (cron) + el registro del paso 5 |

## Variables de entorno (resumen)

| Variable | Obligatoria | Dónde se consigue | Paso |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | Sí (ya está) | aistudio.google.com/apikey | — |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD` | Sí (ya están) | myaccount.google.com/apppasswords | — |
| `BOOKING_TO` | No | Correo que revisa el equipo | — |
| `GROQ_API_KEY` (o `FALLBACK_API_KEY`, `FALLBACK_BASE_URL`, `FALLBACK_MODEL`) | Recomendada | console.groq.com/keys u otro proveedor | 3 |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Recomendadas | Vercel → Storage → Upstash | 2 |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` | Para el calendario | Google Cloud Console | 1 |
| `WHATSAPP_NUMBER` | Para el pase a WhatsApp | El número del negocio | 4 |
