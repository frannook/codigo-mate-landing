# Brief del proyecto y Product Backlog · Código Mate

## Brief

| | |
| --- | --- |
| **Consultora** | Código Mate |
| **Materia** | Práctica Profesional I |
| **Integrantes** | Cristian Maciel, Matías Ortiz, Luciano Deimundo, Elías Gomez, Franco Romero |
| **Público destinatario** | Dueños y responsables de negocios argentinos con web propia (tiendas, logística, estudios, salud, gastronomía, educación) |
| **Necesidad que atiende** | Reciben muchas consultas repetidas y no pueden atender fuera de horario |
| **Propuesta de valor** | Un agente de IA instalado con una línea de código que responde 24 h con el tono del negocio, no inventa datos y pasa a WhatsApp con contexto cuando hace falta una persona |
| **Servicios** | Agente de atención 24 h · Seguimiento de pedidos y logística · Turnos, reservas y captura de contactos · Pase a WhatsApp |
| **Alcance del sitio** | Inicio, Servicios, Proyectos, Nosotros, Contacto (formulario y correo), navegación y pie coherentes. Fuera de alcance: Google Calendar con Meet, WhatsApp real, testimonios reales |
| **Sitio publicado** | https://codigo-mate-landing.vercel.app |
| **Repositorio** | https://github.com/frannook/codigo-mate-landing |

## Sprint Goal

Publicar una primera versión utilizable de la website que permita a un potencial cliente conocer la consultora y su propuesta de valor, comprender los servicios, ver ejemplos de trabajos y encontrar un medio de contacto que funcione.

## Roles

| Rol | Integrante |
| --- | --- |
| Product Owner | Matías Ortiz |
| Scrum Master | Elías Gomez |
| Developers | Todos (Cristian Maciel, Luciano Deimundo, Franco Romero, además de los dos anteriores) |

## Product Backlog (ordenado por prioridad)

| # | Historia | Criterios de aceptación | Estado |
| --- | --- | --- | --- |
| 1 | Como cliente, quiero entender qué hace la consultora en segundos | Hero con propuesta clara y llamadas a la acción | Terminado |
| 2 | Como cliente, quiero un contacto que funcione | Formulario valida y envía correo al equipo y confirmación al cliente; correo visible en el pie | Terminado |
| 3 | Como cliente, quiero conocer los servicios para decidir si pueden ayudarme | `/servicios` desde el menú; cada servicio dice qué ofrece y a quién; legible en teléfono | Terminado |
| 4 | Como cliente, quiero ver ejemplos de trabajos | `/proyectos` con al menos 2 ejemplos identificados como simulados | Terminado |
| 5 | Como cliente, quiero conocer al equipo | `/nosotros` con foto, especialidades y forma de trabajo | Terminado (falta sumar nombres y roles) |
| 6 | Como cliente, quiero probar un agente real | Chat Yuyo funcional sin inventar precios | Terminado |
| 7 | Como cliente, quiero estimar el costo | Cotizador por rubro, volumen y funciones | Terminado |
| 8 | Como cliente, quiero usar el sitio desde el teléfono | Sin desborde horizontal, texto mínimo 13 px, botones de 40 px | Terminado |
| 9 | Como equipo, queremos medir uso | Analítica con eventos de chat y de pedido de llamada | En revisión (activar en panel de Vercel) |
| 10 | Como equipo, queremos agendar con Google Calendar y Meet | Evento con link y horarios libres | Backlog |
| 11 | Como equipo, queremos WhatsApp real | Número del negocio conectado | Backlog |
| 12 | Como equipo, queremos testimonios reales | Con permiso de clientes | Backlog |
