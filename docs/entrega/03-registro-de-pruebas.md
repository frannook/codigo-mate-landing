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
| 2026-10-28 | Reserva de punta a punta en producción (cotizador, formulario, horario libre) | `{"ok":true,"confirmed":true}`; evento creado con Meet; el horario ocupado desaparece de `/api/slots` |
| 2026-10-28 | Correos de una reserva real | Aviso al equipo y confirmación al cliente enviados; invitación de Calendar recibida |
| 2026-10-28 | `/api/slots` en días hábiles y en fin de semana | 5 horarios libres de lunes a viernes; vacío sábado y domingo |
| 2026-10-28 | Páginas, `sitemap.xml` y `robots.txt` en producción | Todas con 200 |
| 2026-10-28 | Velocidad del chat con Groq (6 pruebas) | 1,3 a 2,0 s, sin picos |
| 2026-10-28 | Encabezados de seguridad (HSTS, nosniff, X-Frame) | Activos |
| 2026-10-28 | Celular a 320, 360 y 390 px en las 6 páginas | Sin scroll horizontal; 0 textos menores a 12 px; sin errores propios en consola |
| 2026-10-28 | Mascota Yuyo en celular (390 px) | Fija en la esquina (52x60 px), no tapa contenido, sube sobre la barra del cotizador, abre el chat a casi todo el ancho y se cierra con la X |
| 2026-10-28 | Lighthouse móvil en producción (mediana de 3 corridas) | Inicio: rendimiento 85, accesibilidad 100, buenas prácticas 100, SEO 100 (LCP 2,6 s, CLS 0,016). Nosotros: 96. Proyectos: 99 |
| 2026-10-28 | Mascota Yuyo en escritorio | Camina, se frena con el mouse cerca, ofrece el mate y rota 10 frases |

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

- Testimonios de la home son de ejemplo (la web lo avisa).
- Google Calendar en modo Prueba: el permiso vence a los 7 días. Se renueva con `node scripts/google-auth.mjs` y se actualiza `GOOGLE_REFRESH_TOKEN` en Vercel. Publicar la app exige un dominio propio.
- Enlace del tablero de Trello en el informe final.
- Revisión legal de las páginas de Privacidad y Términos (son un borrador).
- Las reservas de prueba quedan en el calendario de `botcodigomate@gmail.com` a propósito, como evidencia.
