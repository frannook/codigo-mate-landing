# Informe final · Código Mate

**Materia:** Práctica Profesional I · **Fecha:** 21 de octubre de 2026
**Integrantes:** Cristian Maciel, Matías Ortiz, Luciano Deimundo, Elías Gomez, Franco Romero

## Enlaces

- Sitio publicado: https://codigo-mate-landing.vercel.app
- Tablero Trello: COMPLETAR (dar acceso al docente)
- Repositorio: https://github.com/frannook/codigo-mate-landing

## 1. Brief y objetivo

Código Mate es una consultora argentina que instala agentes de IA en las webs de negocios. El sitio explica el servicio, lo demuestra con un agente real (Yuyo) y ofrece contacto. Detalle en `01-brief-y-backlog.md`.

## 2. Sprint Goal y trabajo planificado

Publicar una primera versión utilizable que permita a un cliente conocer la consultora, entender los servicios, ver ejemplos y contactarse. Se priorizaron las historias 1 a 8 del Product Backlog; las 9 a 12 quedaron para después.

## 3. El sitio desarrollado

Capturas en `docs/sprint/evidencias/` (agregar capturas de `/servicios` y `/proyectos` tomadas del sitio publicado).

| Sección | Qué muestra |
| --- | --- |
| Inicio | Propuesta de valor, agente Yuyo, cotizador, formulario de contacto |
| Servicios | Cuatro servicios con qué incluyen y a quién se dirigen |
| Proyectos | Dos proyectos simulados: tienda "Nube" y estudio "Ríos y Asociados" |
| Nosotros | Equipo, principios y forma de trabajo |
| Contacto | Formulario que envía correo al equipo y confirmación al cliente; correo en el pie |

## 4. Decisiones, pruebas y pendientes

Ver `02-acuerdos-y-decisiones.md` y `03-registro-de-pruebas.md`.

## 5. Sprint Review (completar tras la demo en vivo)

- Producto demostrado: sitio publicado en computadora y vista móvil.
- Devoluciones recibidas: COMPLETAR
- Qué haríamos después: Google Calendar con Meet, WhatsApp real, testimonios reales, analítica activa.

## 6. Retrospectiva (completar en equipo)

- Qué funcionó bien: COMPLETAR
- Dificultades: la API de Gemini saturada (503) obligó a sumar un modelo de respaldo; hubo trabajo hecho antes de ordenar el tablero.
- Mejora concreta para el próximo proyecto: COMPLETAR (propuesta: crear el tablero y los criterios de aceptación antes de escribir código)

## 7. Aporte individual

| Integrante | Qué hizo | Decisión en la que participó | Qué aprendió o mejoraría |
| --- | --- | --- | --- |
| Matías Ortiz (Product Owner) | Ordenó el Product Backlog, escribió el brief y los criterios de aceptación, y redactó los textos de Servicios | Priorizar Servicios y Proyectos antes que las funciones secundarias | Aprendió a escribir historias de usuario verificables; mejoraría validando el backlog con un cliente real |
| Elías Gomez (Scrum Master) | Organizó el tablero de Trello, coordinó las reuniones de seguimiento y registró impedimentos y decisiones | Definir los acuerdos de trabajo y la definición de terminado | Aprendió a hacer visibles los bloqueos; mejoraría actualizando el tablero a diario |
| Cristian Maciel | Armó la página Proyectos con los dos casos simulados y escribió la sección de pruebas en celular | Identificar los proyectos como simulados | Aprendió a probar en distintos tamaños de pantalla; mejoraría probando en más dispositivos reales |
| Luciano Deimundo | Desarrolló la página Servicios, el menú y el pie de página | Reducir el menú a cinco links más el botón de contacto | Aprendió a mantener la navegación coherente entre páginas; mejoraría con pruebas automáticas de enlaces |
| Franco Romero | Publicó el sitio en Vercel, configuró el repositorio y el formulario de contacto por correo, y redactó la documentación técnica | Elegir Gmail SMTP en lugar de otros servicios de correo | Aprendió a publicar y mantener variables de entorno; mejoraría configurando alertas de errores |

> Borrador: cada integrante debe revisar su fila y ajustarla a lo que realmente hizo antes de entregar.
