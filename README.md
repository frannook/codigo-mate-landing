# Código Mate · Landing

Landing de Código Mate en Next.js (App Router) + TypeScript, implementada a partir del diseño
`project/Codigo Mate Landing v3.dc.html` (handoff de Claude Design: ver `project/HANDOFF.md` y `chats/`).

## Correr

```bash
npm install
cp .env.example .env.local   # completar GEMINI_API_KEY
npm run dev                  # http://localhost:3000
```

`npm run build && npm start` para producción. Se despliega en Vercel tal cual; cargá `GEMINI_API_KEY`
como variable de entorno del proyecto (sin el prefijo `NEXT_PUBLIC_`).

## Estructura

| Ruta | Qué hace |
| --- | --- |
| `app/page.tsx` | Navbar, hero, "Cómo trabajamos", agendar y footer |
| `app/globals.css` | Paleta, tipografía, animaciones y responsive |
| `components/ChatWidget.tsx` | UI del chat: demo en loop que se corta cuando alguien interactúa |
| `components/Steps.tsx` | Línea de tiempo animada de los tres pasos |
| `components/Booking.tsx` | Formulario para agendar la llamada |
| `components/Reveal.tsx` | Entradas laterales al hacer scroll |
| `lib/chat/engine.ts` | Lógica del chat: historial, estados, validación, errores, reintento |
| `lib/chat/provider.ts` | Comunicación con `/api/chat` |
| `lib/chat/store.ts` | Datos de la tienda demo y system prompt |
| `app/api/chat/route.ts` | Llama a Gemini (`gemini-2.5-flash`, capa gratuita) con la key del servidor |

## Pendiente

- **Formulario de agendar:** valida y muestra la confirmación, pero no envía nada todavía.
  Conectalo en `submit()` de `components/Booking.tsx` (email, calendario o CRM).
- **Límite de consultas del chat:** el de `app/api/chat/route.ts` vive en memoria (por instancia).
  Con varias instancias serverless, reemplazalo por uno compartido (Upstash, Vercel KV).
- **Favicon:** el diseño no incluye uno.
