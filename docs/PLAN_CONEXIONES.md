# Plan de conexiones y automatización

Estado al 2026-10-16. Sitio: https://codigo-mate-landing.vercel.app/ · Repo: https://github.com/frannook/codigo-mate-landing

Cómo leerlo: cada paso dice **qué hacés vos** (cuentas, claves, clics) y **qué hago yo** (código). Las claves nunca se pegan en el chat ni se suben al repo: se cargan en Vercel (Settings → Environment Variables) y en `.env.local`.

## 1. Qué ya funciona

| Pieza | Estado | Cómo se comprobó |
| --- | --- | --- |
| Despliegue automático (GitHub → Vercel) | Funciona | Cada push a `main` publica solo |
| Chat con Yuyo (Gemini) | Funciona en producción | Se probó `/api/chat` en el sitio publicado y respondió |
| Formulario de agendar (correo por Gmail) | Funciona | Llegó el correo en las pruebas; conviene repetir una prueba en producción |
| Horarios libres y reserva con Meet | Probado con un Google simulado | Falta conectar tu cuenta real (paso 1) |
| WhatsApp real en el chat y el footer | Hecho | Paso 4 |
| Aviso si el sitio se cae | Hecho | Workflow `uptime.yml` (paso 9) |
| Respaldo del chat en Groq | **Código listo, falta la clave** | Se activa solo al cargar `GROQ_API_KEY` en Vercel (paso 3) |
| SEO básico (`robots.txt`, `sitemap.xml`, imagen al compartir, datos estructurados) | Hecho y publicado | Verificado en el sitio publicado (paso 6) |
| Analítica | Código listo; **falta activarla** en Vercel | Panel de Vercel → Analytics → Enable (paso 5) |

## 2. Estado de cada tarea (2026-10-21)

| # | Tarea | Código | Lo que falta de tu lado | Tiempo |
| --- | --- | --- | --- | --- |
| 1 | Google Calendar + Meet | Hecho y probado | Crear credenciales en Google Cloud, sacar el token y cargarlo en Vercel | 20 min |
| 2 | Límite de uso compartido (Redis) | Hecho y probado | Conectar Upstash desde el Marketplace de Vercel | 5 min |
| 3 | Respaldo del chat (Groq u otro) | Hecho | Generar la clave y cargarla en Vercel | 10 min |
| 4 | WhatsApp real | **Hecho** (+54 9 379 453-0578) | Probar los enlaces desde el celular | 2 min |
| 5 | Analítica | Hecho (eventos `chat_message`, `booking_submit`, `whatsapp_click`) | Activarla en Vercel (1 clic) | 1 min |
| 6 | SEO básico | **Hecho** | Dar de alta el sitio en Search Console | 5 min |
| 7 | Dominio propio | Preparado (`NEXT_PUBLIC_SITE_URL`) | Registrarlo y agregarlo en Vercel | 1 h |
| 8 | Reglas del repo | — | Revisar y, si querés, exigir Pull Request en `main` | 5 min |
| 9 | Aviso si algo se cae | **Hecho** (workflow `uptime.yml`) | Dejar activadas las notificaciones por correo de Actions | 2 min |
| 10 | Contenido real | — | Testimonios verdaderos y nombres del equipo | — |
| + | Planilla de contactos | Hecho | Crear la planilla y el Apps Script | 10 min |

### Cambio de cuenta de correo (2026-10-28)

La cuenta del proyecto ahora es **botcodigomate@gmail.com** (reemplaza a la anterior). El código y los textos del sitio ya la usan. Para que los correos y el calendario funcionen hay que actualizar las variables y las credenciales, **todo con la cuenta nueva**:

1. **Contraseña de aplicación** (para enviar correos): entrá a la cuenta nueva, activá la verificación en 2 pasos (https://myaccount.google.com/signinoptions/two-step-verification) y creá una contraseña de aplicación en https://myaccount.google.com/apppasswords. Se muestra una sola vez (16 letras).
2. **Variables en Vercel** (https://vercel.com/codigomate/codigo-mate-landing/settings/environment-variables), en Production y Preview: `GMAIL_USER` = `botcodigomate@gmail.com` y `GMAIL_APP_PASSWORD` = la nueva. Si existe `BOOKING_TO` y apunta a la cuenta anterior, cambiala también: ahí llegan los avisos de cada pedido de llamada.
3. **Redeploy** del último despliegue.
4. **Probar**: mandá un pedido de llamada con tu correo personal; tienen que llegar el aviso al equipo y la confirmación.
5. **Google Calendar** (paso 1): crear el proyecto de Google Cloud y las credenciales con **esta** cuenta; el evento y el link de Meet se crean en su calendario.
6. En `.env.local` ya cambié `GMAIL_USER`; falta que pongas la contraseña de aplicación nueva en `GMAIL_APP_PASSWORD` para probar en tu máquina.

Mientras no se actualicen las variables de Vercel, el formulario puede fallar al enviar los correos.

### Aviso importante sobre Vercel

El plan gratuito (Hobby) de Vercel es **solo para uso personal y no comercial**. Para un proyecto de la facultad alcanza. Si la agencia empieza a cobrar a clientes con esta web, hay que pasar a Vercel Pro (US$ 20 por mes por usuario) o mover el sitio a otro hosting. Conviene decidirlo antes de promocionar la web.

---

## Paso 1 · Google Calendar + Meet (código hecho; faltan tus credenciales)

Con esto, cada pedido reserva el horario en el calendario, crea el evento con link de Meet y Google le manda la invitación al cliente. Los horarios ocupados aparecen tachados en el formulario. Sin estas variables el formulario sigue andando solo por correo.

**Vos (con la cuenta `botcodigomate@gmail.com`), unos 20 minutos:**
1. Crear el proyecto: https://console.cloud.google.com/projectcreate → nombre `codigo-mate`.
2. Habilitar la API: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com → **Habilitar**.
3. Pantalla de consentimiento: https://console.cloud.google.com/apis/credentials/consent → tipo **Externo** → nombre `Código Mate`, tu correo de contacto → en "Usuarios de prueba" agregá `botcodigomate@gmail.com`. Al final, **Publicar la app** (pasarla a "En producción"): si queda en "Prueba", el permiso vence a los 7 días. No pide verificación porque la usa solo esta cuenta.
4. Credencial: https://console.cloud.google.com/apis/credentials → **Crear credenciales** → **ID de cliente de OAuth** → tipo **Aplicación de escritorio** → nombre `codigo-mate-web`. Copiá el **ID de cliente** y el **Secreto**.
5. Pegalos en `.env.local` (en la carpeta del proyecto):
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```
6. En la terminal, dentro de la carpeta del proyecto: `node scripts/google-auth.mjs`. Se abre el navegador; entrá con `botcodigomate@gmail.com` y aceptá. El **refresh token** aparece solo en la terminal (no se guarda en ningún archivo).
7. Cargá en Vercel (https://vercel.com/codigomate/codigo-mate-landing/settings/environment-variables), en Production y Preview: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` y `GOOGLE_REFRESH_TOKEN`. Después **Redeploy**.
8. Probá una reserva con tu correo personal: debe llegar la invitación de Google con el link de Meet, y el horario debe quedar tachado en el formulario.

**Ya hecho en el código:** `/api/slots` (horarios libres), `/api/booking` (reserva con Meet, aviso al equipo, confirmación al cliente), formulario con horarios ocupados tachados y aviso si alguien ocupa el horario mientras completás el formulario. Si Google falla, el pedido no se pierde: sigue por correo.

**Opcional:** `GOOGLE_CALENDAR_ID` si querés usar otro calendario en vez del principal de la cuenta.

## Paso 2 · Límite de uso compartido (Upstash Redis) (código hecho; falta conectar la base)

El chat (20 consultas por minuto por IP), el formulario (5 pedidos cada 10 minutos) y los horarios (60 por minuto) ya usan un límite compartido cuando hay Redis; sin Redis, o si Redis falla, usan memoria local y el sitio sigue andando.

**Vos, 5 minutos:**
1. Abrí https://vercel.com/marketplace/upstash → **Install** → elegí **Upstash for Redis** → plan **Free** → región `us-east-1` o `sa-east-1` → conectala al proyecto `codigo-mate-landing`.
2. Vercel carga solo las variables `KV_REST_API_URL` y `KV_REST_API_TOKEN` (el código acepta también `UPSTASH_REDIS_REST_*`).
3. **Redeploy** del último despliegue.

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

## Paso 4 · WhatsApp real (hecho)

El número del negocio es **+54 9 379 453-0578** (`5493794530578` en el link). Está en `lib/site.ts`; para cambiarlo sin tocar código, definí `NEXT_PUBLIC_WHATSAPP_NUMBER` en Vercel.

- En el chat, cuando Yuyo pasa la charla a una persona, aparece el botón **"Seguir por WhatsApp con una persona"** y abre WhatsApp con un mensaje ya escrito que incluye la última consulta del visitante.
- En el footer hay un enlace **"Escribinos por WhatsApp"**.
- El teléfono figura en los datos estructurados para Google.
- Cada clic en el botón del chat se mide en la analítica como `whatsapp_click`.

**Vos:** probá los dos enlaces desde tu celular; WhatsApp debería abrir la charla con +54 9 379 453-0578. Si querés otro mensaje inicial, decime el texto.

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

## Paso 9 · Avisos si algo se cae (hecho)

El repositorio tiene el workflow `.github/workflows/uptime.yml`: cada 30 minutos pide la home y `/nosotros` del sitio publicado. Si alguna no responde 200, la ejecución queda en rojo y **GitHub te manda un correo**. Ver las ejecuciones: https://github.com/frannook/codigo-mate-landing/actions

**Vos:** en https://github.com/settings/notifications dejá activadas las notificaciones por correo de **Actions** ("Failed workflows only" alcanza). Opcional: UptimeRobot (https://uptimerobot.com) como segundo aviso.

También conviene mirar de vez en cuando los registros de Vercel (https://vercel.com/codigomate/codigo-mate-landing/logs) y la cuota de la clave de Gemini en https://aistudio.google.com/apikey.

## Paso 10 · Contenido real

- Reemplazar los 8 testimonios de ejemplo de `components/Testimonials.tsx` por reales (o sacarlos hasta tenerlos).
- Sumar nombres y roles del equipo en Nosotros, si querés mostrarlos.
- Revisar los precios del cotizador (`Quote.tsx`) y del prompt de Yuyo: son decisión de negocio.

---

## Automatizaciones

| Idea | Estado | Cómo |
| --- | --- | --- |
| Recordatorio al cliente 24 h antes | Hecho (con el paso 1) | El evento de Google Calendar lo manda solo |
| Aviso al equipo de cada pedido | Hecho | Correo por Gmail |
| Planilla de contactos | Código hecho; falta crear la planilla | Ver abajo |
| Resumen semanal | Pendiente (opcional) | Tarea programada de Vercel + los eventos de analítica |

**Planilla de contactos (10 minutos):**
1. Creá una planilla en https://sheets.new con estos encabezados en la fila 1: `Fecha, Nombre, Email, Web, Rubro, Día, Hora, Meet, Mensaje`.
2. Menú **Extensiones → Apps Script**, borrá lo que haya y pegá:
   ```js
   function doPost(e) {{
     const d = JSON.parse(e.postData.contents);
     SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
       .appendRow([new Date(), d.name, d.email, d.web, d.rubro, d.date, d.time, d.meet, d.msg]);
     return ContentService.createTextOutput('ok');
   }}
   ```
3. **Implementar → Nueva implementación** → tipo **Aplicación web** → ejecutar como **yo** → acceso **Cualquier persona** → Implementar y autorizar. Copiá la URL que termina en `/exec`.
4. Cargala en Vercel como `LEADS_WEBHOOK_URL` y hacé Redeploy. No compartas esa URL: cualquiera que la tenga puede agregar filas.

## Variables de entorno (resumen)

| Variable | Obligatoria | Dónde se consigue | Paso |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | Sí (ya está) | aistudio.google.com/apikey | — |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD` | Sí (ya están) | myaccount.google.com/apppasswords | — |
| `BOOKING_TO` | No | Correo que revisa el equipo | — |
| `GROQ_API_KEY` (o `FALLBACK_API_KEY`, `FALLBACK_BASE_URL`, `FALLBACK_MODEL`) | Recomendada | console.groq.com/keys u otro proveedor | 3 |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Recomendadas | Vercel → Storage → Upstash | 2 |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` | Para el calendario | Google Cloud Console | 1 |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | No (ya está el número) | Solo para cambiarlo | 4 |
| `LEADS_WEBHOOK_URL` | No | Apps Script de la planilla | Automatizaciones |
| `GOOGLE_CALENDAR_ID` | No | Otro calendario distinto del principal | 1 |
| `NEXT_PUBLIC_SITE_URL` | Con dominio propio | La dirección del sitio, sin barra final | 7 |
