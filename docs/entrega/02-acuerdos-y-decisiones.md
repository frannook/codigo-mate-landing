# Acuerdos de trabajo y registro de decisiones

## Acuerdos de trabajo

| Tema | Acuerdo |
| --- | --- |
| Comunicación | COMPLETAR (canal del equipo, por ejemplo WhatsApp) y reuniones de seguimiento en clase (30/9, 7/10, 14/10) |
| Archivos | Código y documentos en el repositorio de GitHub; la documentación vive en `docs/` |
| Revisión | Todo cambio lo revisa otra persona antes de pasar a Terminado; los cambios van a producción desde `main` por Vercel |
| Impedimentos | Se anotan en la tarjeta de Trello (qué bloquea y próxima acción) y se cuentan en la reunión de seguimiento |
| Definición de terminado | Cumple criterios, está en el sitio publicado, la revisó otra persona, funciona en teléfono y computadora, sin errores bloqueantes y con documentación al día |

## Registro de decisiones

| Fecha | Decisión | Por qué |
| --- | --- | --- |
| 2026-10-06 | Correo (Gmail SMTP) en lugar de Telegram o Resend para avisos de contacto | En Argentina el correo es de uso común y Gmail envía a cualquier destinatario sin dominio propio ni costo |
| 2026-10-06 | Cuenta Gmail propia del proyecto como remitente | Evita atar el servicio a una persona del equipo |
| 2026-10-06 | El bot reemplaza la sección de preguntas frecuentes | Una FAQ fija no cubre todos los rubros y el agente demuestra el producto |
| 2026-10-06 | El bot no inventa precios, plazos ni clientes | Decisión de negocio: todo se deriva a la llamada |
| 2026-10-06 | Modelo `gemini-3.1-flash-lite` con respaldo Groq | Los modelos más nuevos estaban saturados (503) |
| 2026-10-28 | Groq pasa a ser el proveedor principal del chat y Gemini queda de respaldo | Responde en ~0,5 s y baja el tiempo total a 1,3 a 2 s; si la cuenta no tiene un modelo (404) prueba el siguiente |
| 2026-10-06 | Estilos propios, sin Tailwind | El diseño vino en CSS; no justificaba otra dependencia |
| 2026-10-07 | Movimiento siempre activo | Decisión del equipo; contra: ignora la preferencia de menos movimiento. Se revierte en `app/layout.tsx` |
| 2026-10-16 | Acento ámbar `#E9A23B` | Contraste 8,0:1 sobre el navy y remite al mate |
| 2026-10-16 | Página aparte `/nosotros` | Pedida por el brief; mantiene la home enfocada |
| 2026-10-21 | Sumar `/servicios` y `/proyectos` y reordenar el menú (Probalo, Cotizador, Servicios, Proyectos, Nosotros, Agendar) | El producto mínimo del brief los exige; se quitaron "Cómo funciona" y "Clientes" del menú para no saturarlo (siguen en la home) |
| 2026-10-21 | Proyectos identificados como simulados | Lo pide el brief; los dos negocios son ficticios |
| 2026-10-28 | La cuenta del proyecto pasa a `botcodigomate@gmail.com` (antes otra cuenta de Gmail) | Cuenta de Google propia del proyecto, sirve también para Calendar, Meet y Cloud |
| 2026-10-28 | Google Calendar con OAuth en modo Prueba | Publicar la app exige verificar un dominio propio (unos USD 12 al año). Para la entrega alcanza: el permiso dura 7 días y se renueva con `node scripts/google-auth.mjs`. Alternativa sin costo: cuenta de servicio (sin vencimiento, pero con un Meet fijo) |
| 2026-10-28 | Si Google falla, el pedido sigue por correo | El cliente nunca pierde su pedido; el equipo confirma a mano |
| 2026-10-28 | Límite de consultas en Redis (Upstash, integración de Vercel) | Es compartido entre las instancias de Vercel; sin Redis cae a memoria |
| 2026-10-28 | Mascota Yuyo con chat en burbuja; en celular queda fija en la esquina | Es el patrón de los sitios de empresas; caminando taparía texto y botones en pantallas chicas |
| 2026-10-28 | Rediseño 3D sutil solo en escritorio con mouse | Da presencia sin pesar: en celulares todo queda plano y liviano |
| 2026-10-28 | Testimonios siguen siendo ejemplos ilustrativos, avisado en la web | No tenemos casos reales con permiso; no inventamos clientes |
