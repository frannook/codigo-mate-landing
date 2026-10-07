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
| 5. Bot como FAQ | Se eliminó la sección de preguntas; Mati responde dudas de todos los rubros (`lib/chat/store.ts`) | Hecho |
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

## Cosas a tener presentes

- Los testimonios de `components/Testimonials.tsx` son **texto de ejemplo**: reemplazar antes de promocionar la web.
- El horario del formulario es una solicitud; hasta tener calendario real, el equipo confirma por correo.
- El límite de consultas es por instancia (memoria). En Vercel con tráfico real hay que pasarlo a un almacén compartido.
- No usar el servidor de desarrollo mientras corre `next build`: comparten `.next` y se pisan.
- Carpeta `project/`: material de diseño de origen, no es código de la web. No editar para cambiar la página.

## Próximo paso recomendado

1. Publicar en Vercel (importar el repo, cargar variables, probar chat y formulario en producción).
2. Google Calendar con OAuth de la cuenta del proyecto: crea el evento, genera el link de Meet y Google le envía la invitación al cliente. Ver README → Pendiente.
