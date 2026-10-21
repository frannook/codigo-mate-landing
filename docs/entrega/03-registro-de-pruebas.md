# Registro de pruebas

Sitio: https://codigo-mate-landing.vercel.app · Evidencia previa: `docs/sprint/REVISION_SPRINT.md` y `docs/sprint/evidencias/`.

## Pruebas hechas

| Fecha | Qué se probó | Resultado |
| --- | --- | --- |
| 2026-10-16 | `npm run typecheck` | Sin errores |
| 2026-10-16 | Desborde horizontal en `/` y `/nosotros` a 390 px | 0 px |
| 2026-10-16 | Textos menores a 13 px y botones menores a 40 px en móvil | 0 |
| 2026-10-16 | Errores de consola | 0 |
| 2026-10-06 | Formulario de agendar: correo al equipo y confirmación al cliente | Recibidos |
| 2026-10-06 | `/api/chat` en producción | Responde; respaldo ante 503 |
| 2026-10-21 | `npm run typecheck` y `npm run build` con las páginas nuevas | Sin errores; se generan `/servicios` y `/proyectos` |

## Pruebas pendientes de hacer a mano (completar fecha, quién y resultado)

| Qué probar | Cómo | Resultado |
| --- | --- | --- |
| Menú de escritorio: los 5 links y "Agendar llamada" llevan al lugar correcto desde `/`, `/servicios`, `/proyectos`, `/nosotros` | Clic en cada uno | |
| Menú móvil (390 px): panel abre, cierra con Escape y muestra las 5 entradas | Herramientas del navegador | |
| Pie de página: los 6 links y el `mailto` | Clic en cada uno | |
| `/servicios` y `/proyectos` en teléfono real y en computadora | Abrir la URL publicada | |
| Formulario de contacto en producción tras el despliegue | Enviar un pedido real y confirmar los dos correos | |
| Lighthouse de `/servicios` y `/proyectos` | Chrome DevTools | |

## Problemas pendientes

- Foto y nombres reales del equipo en `/nosotros`.
- Testimonios de la home son de ejemplo.
- Analítica: falta activarla en el panel de Vercel.
- Google Calendar/Meet y WhatsApp real: fuera de este sprint.
