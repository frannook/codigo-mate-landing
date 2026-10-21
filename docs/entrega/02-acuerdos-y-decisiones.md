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
| 2026-10-06 | Estilos propios, sin Tailwind | El diseño vino en CSS; no justificaba otra dependencia |
| 2026-10-07 | Movimiento siempre activo | Decisión del equipo; contra: ignora la preferencia de menos movimiento. Se revierte en `app/layout.tsx` |
| 2026-10-16 | Acento ámbar `#E9A23B` | Contraste 8,0:1 sobre el navy y remite al mate |
| 2026-10-16 | Página aparte `/nosotros` | Pedida por el brief; mantiene la home enfocada |
| 2026-10-21 | Sumar `/servicios` y `/proyectos` y reordenar el menú (Probalo, Cotizador, Servicios, Proyectos, Nosotros, Agendar) | El producto mínimo del brief los exige; se quitaron "Cómo funciona" y "Clientes" del menú para no saturarlo (siguen en la home) |
| 2026-10-21 | Proyectos identificados como simulados | Lo pide el brief; los dos negocios son ficticios |
