# Nuevas modificaciones de la web · Documento para la presentación

Proyecto: **Código Mate** · Práctica Profesional I
Sitio publicado: https://codigo-mate-landing.vercel.app
Repositorio: https://github.com/frannook/codigo-mate-landing
Tablero: https://trello.com/b/NS81AId4/proyecto-codigo-mate (lista "Nuevo Sprint")

## En una línea

En este nuevo sprint la web dejó de ser solo una página de presentación y pasó a mostrar **cómo se vería el producto completo**: se puede ver con fondo claro, los proyectos de ejemplo tienen su propia página con video, y el inicio muestra qué ve el dueño de un negocio y qué cambia cuando el agente responde.

## Por qué hicimos estos cambios

La web ya funcionaba y estaba completa. Lo que buscamos ahora fue:

- **Más veracidad:** que los proyectos de ejemplo se sientan como casos reales (con video, problema, solución y resultados).
- **Más confianza:** responder las dudas típicas de un cliente (precio, datos, qué pasa si el agente no sabe).
- **Más comodidad:** que cualquiera pueda usarla, sea de noche o de día, con mouse, con teclado o desde el celular.

Todo es **solo diseño y funciones de la propia página**: no se sumaron integraciones nuevas, porque la empresa es ficticia y se trata de un trabajo práctico.

## Qué cambió

### 1. Modo claro con botón de cambio de fondo

Un botón sol/luna en la barra superior permite elegir entre fondo oscuro y fondo claro. El modo claro usa los colores de la marca: crema, azul oscuro y ámbar. La web recuerda la elección, y la primera vez respeta si el dispositivo está en modo claro u oscuro. Se pulieron los detalles (logo, tarjetas, chat, secciones) para que se vea bien en los dos.

### 2. Proyectos con video y página propia

Los tres proyectos de ejemplo (una tienda de mates, una distribuidora de envíos y un consultorio médico) ahora muestran un video de 10 segundos con el agente en acción. Cada uno tiene además su **página de detalle**: el problema, lo que hicimos, resultados de ejemplo, una conversación de muestra y un enlace al siguiente caso.

### 3. Comparador "sin agente / con agente"

Dos tarjetas lado a lado muestran la misma consulta recibida a las 23:47. Al arrastrar el control, una crece y la otra se achica: sin agente queda sin respuesta hasta el día siguiente; con agente se responde en segundos y la charla sigue por WhatsApp. En celular las dos tarjetas se apilan. Es la forma más rápida de explicar el valor del producto.

### 4. Panel del dueño del negocio

Un panel de ejemplo que muestra lo que vería quien contrata el servicio: cuántas conversaciones hubo, cuántas resolvió el agente solo, cuántas pasaron a una persona, a qué hora preguntan más y cuáles son los temas más frecuentes. Tiene pestañas "Hoy" y "Esta semana".

### 5. Nosotros con el equipo en primer plano

La página de Nosotros dejó la foto grande y ahora presenta a cada integrante con su tarjeta: foto tipo currículum con el logo de Código Mate de fondo, nombre y título. Las fotos se cargan guardando un archivo por persona, sin tocar código (ver el detalle en el documento del sprint).

### 6. Números que cobran vida

Los resultados (tiempos de respuesta, porcentajes, horas ahorradas) suben desde cero cuando aparecen en pantalla. Si alguien prefiere menos movimiento, los ve directamente.

### 7. Preguntas frecuentes

Siete preguntas con respuesta en un acordeón: precio, qué pasa si no sabe, plataformas, tono de voz, datos de los clientes y aclaración de que los proyectos son simulados. Se puede usar con teclado.

### 8. Cinta de plataformas

Una cinta animada con "Se instala donde ya estás": web a medida, Tiendanube, Shopify, WordPress, WooCommerce, Wix, Webflow y WhatsApp. Refuerza el mensaje de que funciona en cualquier sitio.

### 9. Detalles que usan las webs profesionales

- Un **aviso de privacidad** breve que cuenta qué guarda el sitio.
- Un enlace oculto **"Saltar al contenido"** para quien navega con teclado.
- **Transiciones suaves** al pasar de una página a otra (se desactivan si la persona pidió menos movimiento).
- Un brillo de carga en los videos mientras llegan.

## Antes y después

| Tema | Antes | Ahora |
| --- | --- | --- |
| Fondo | Solo oscuro | Oscuro y claro, con botón y respeto por el sistema |
| Proyectos | Capturas fijas | Videos y una página de detalle por proyecto, sin bloques repetidos |
| Nosotros | Una foto grande del equipo | Una tarjeta por integrante, con foto tipo currículum |
| Valor del servicio | Se contaba con texto | Se muestra con un comparador y un panel de ejemplo |
| Dudas de clientes | Respondidas solo en el chat | Además, preguntas frecuentes |
| Accesibilidad | Foco visible y movimiento reducido | Además, "Saltar al contenido" y comparador usable con teclado |
| Plataformas | Mención en un texto | Cinta visual con las plataformas |

## Guion sugerido para mostrarlo en vivo

1. **Inicio:** apretar el botón sol/luna y mostrar el cambio de fondo. Volver al oscuro.
2. **"La diferencia":** arrastrar el control del comparador y contar la consulta de las 23:47 (las tarjetas crecen y se achican).
3. **"Vos ves todo lo que pasa":** cambiar entre "Hoy" y "Esta semana" en el panel.
4. **Proyectos:** mostrar los videos y entrar a un caso (por ejemplo, Distribución Federal).
5. **Preguntas frecuentes:** abrir una respuesta, por ejemplo "¿Los proyectos de ejemplo son reales?".
6. **Nosotros:** mostrar al equipo, una tarjeta por integrante.
7. **Celular:** mostrar que todo se ve y se usa bien en pantalla chica.

## Aclaraciones honestas

- Todos los **proyectos y cifras son simulados**: los negocios no existen y los resultados son ilustrativos. La web lo aclara en cada lugar.
- El **panel del dueño** y el **comparador** muestran datos de ejemplo, no mediciones reales.
- No se agregaron integraciones nuevas en este sprint: el foco fue la experiencia visual.
- Pendiente para el próximo sprint: revisar a ojo las páginas legales en modo claro y actualizar la versión de Next.js (la herramienta con la que está hecho el sitio), que tiene un aviso de seguridad.

## Dónde está todo documentado

- **Trello:** lista "Nuevo Sprint" (Sprint Goal, Sprint Backlog, Sprint Review) y tarjetas nuevas en "Hecho".
- **Repositorio:** `docs/sprint/SPRINT-2-modo-claro-y-proyectos.md` (detalle del sprint) y este documento.
- **Historial de cambios:** cada mejora quedó en un commit con su explicación.
