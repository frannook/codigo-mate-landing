# Plan de mejoras · Código Mate

Origen: relevamiento del 2026-10-27 (rendimiento, conexiones, diseño e infraestructura del sitio publicado). Cada etapa tiene un proceso fijo: **cambiar → probar en local → verificar con una medición → publicar → comprobar en producción**. Una etapa no se da por cerrada sin su verificación.

| Etapa | Qué | Por qué | Verificación | Estado |
| --- | --- | --- | --- | --- |
| 1 | **Seguridad**: actualizar `next`, `nodemailer`, `react`, `react-dom`, `@google/genai` y cabeceras de seguridad | `npm audit` marcaba 1 vulnerabilidad crítica y 1 moderada | `npm audit --omit=dev` sin críticas ni altas; build y typecheck sin errores; chat y formulario responden | **Hecha**: 0 vulnerabilidades (`next` 16.4.3, `nodemailer` 10.2.1, `react` 19.3.1), 4 cabeceras de seguridad, chat y formulario probados |
| 2 | **Confianza y legales**: páginas de Privacidad y Términos, enlaces en el pie y el sitemap, testimonios rotulados como ejemplos | El sitio recoge emails y conversaciones y no tenía política; los testimonios de ejemplo contradecían la página de Proyectos | Las páginas responden 200, figuran en el sitemap y el pie; los testimonios dicen que son ejemplos | **Hecha**: /privacidad y /terminos (200, en el sitemap y el pie), nota de ejemplos bajo los testimonios. Los textos legales son un borrador razonable: conviene que los revise un abogado o contador |
| 3 | **Compartir y descubrir**: imagen de vista previa en Nosotros, página 404 propia, `favicon.ico`, ícono para iPhone y manifest | Faltaban en la auditoría | Cada recurso responde 200; una URL inexistente muestra la 404 propia con código 404 | **Hecha**: favicon.ico, apple-icon.png, manifest, íconos 192/512, imagen propia de /nosotros y 404 propia (estado 404) |
| 4 | **Diseño de Servicios y Proyectos**: mini conversaciones de ejemplo en cada tarjeta, enlaces a la demo y espaciado más ajustado | Eran solo texto y con mucho aire vacío | Revisión en 1440 y 390 px sin desbordes; accesibilidad 100 | Pendiente |
| 5 | **Rendimiento de la home en móvil**: cargar bajo demanda las secciones de más abajo | Mediana de 80–84 con bloqueo de 561 ms; objetivo 90 | Lighthouse, mediana de 3 corridas | Pendiente |
| 6 | **Cierre**: documentación, evidencia y publicación | Dejar todo registrado | Producción medida y documentada | Pendiente |

## Lo que queda del lado del responsable del proyecto

Redis (límite compartido), clave de respaldo del chat, Google Calendar con Meet, planilla de contactos, Trello, Search Console y dominio propio. Los pasos están en [PLAN_CONEXIONES.md](PLAN_CONEXIONES.md).
