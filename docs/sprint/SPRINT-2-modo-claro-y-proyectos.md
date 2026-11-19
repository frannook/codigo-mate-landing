# Nuevo sprint · Modo claro y proyectos con capturas

Fechas de trabajo: 17 y 18 de noviembre de 2026
Sitio publicado: https://codigo-mate-landing.vercel.app
Repositorio: https://github.com/frannook/codigo-mate-landing
Tablero: https://trello.com/b/NS81AId4/proyecto-codigo-mate (lista "Nuevo Sprint")

## En una frase

La web ahora se puede ver con **fondo claro** además del oscuro de siempre, con un botón en la barra superior, y la página de **Proyectos** muestra tres casos reales de ejemplo con captura de pantalla y su "antes y ahora".

## Objetivo del sprint (Sprint Goal)

Que quien visite la web pueda elegir cómo verla, claro u oscuro, sin perder la identidad de Código Mate, y que los ejemplos de la página de Proyectos se entiendan de un vistazo con imágenes.

## Qué se hizo

### 1. Botón para cambiar entre fondo oscuro y claro

- Hay un botón nuevo en la barra superior, al lado de "Agendar llamada". Tiene un sol cuando la web está oscura y una luna cuando está clara.
- Funciona en computadora y en celular, y en todas las páginas del sitio (inicio, servicios, proyectos, nosotros, términos y privacidad).
- La web recuerda lo que elegiste: si volvés otro día, la ves como la dejaste. Y no hay un destello oscuro al abrirla.
- El fondo oscuro sigue siendo el de siempre; el claro es opcional.

### 2. Colores del modo claro, con la paleta de la marca

- **Fondo crema** en lugar de blanco puro, para que se sienta cálido y combine con el mate.
- **Textos en azul oscuro** (el mismo azul de la marca) para que se lean bien.
- **Ámbar** como color de acento, igual que en la versión oscura, pero un poco más oscuro para que se vea sobre el crema.
- Las tarjetas, la barra de navegación y los paneles pasaron a tonos claros con bordes suaves y sombras discretas.

### 3. Pulido de detalles que se veían raros en el modo claro

Después de una primera versión revisamos pantalla por pantalla y corregimos lo que no cerraba:

- **Logo de Código Mate:** el logo original está pensado para fondo oscuro, y sobre el crema se perdía. Se creó una versión con el texto en azul oscuro (el mate y el recuadro siguen en ámbar). Se usa en la barra superior, en el pie de página y en Nosotros, solo cuando la web está clara.
- **Sección "Probalo en vivo":** tenía un bloque blanco muy fuerte que no combinaba. Ahora usa el mismo fondo que el resto de la web. Los tres datos (24/7, Segundos, 1 línea) pasaron de gris a tarjetas claras.
- **Chat de Yuyo y chats de ejemplo:** se veían demasiado oscuros y con mucho contraste, y los mensajes sugeridos casi no se leían. Ahora usan un azul más claro y los textos se leen bien.
- **Celular:** al sumar el botón nuevo, la barra superior se pasaba del ancho. Se ajustó el tamaño del logo y del botón para que todo entre.

### 4. Página de Proyectos con capturas

La página ahora muestra **tres proyectos de ejemplo**, cada uno con una captura de pantalla del sitio y una explicación del antes y el ahora:

| Proyecto | Rubro | Antes | Ahora |
| --- | --- | --- | --- |
| **Almacén Natural "El Ceibo"** | Tienda online (mates y yerba) | Las mismas preguntas de envíos todos los días, contestadas a mano, y fuera de horario se perdían ventas. | El agente responde envíos y plazos por localidad al instante y pasa a WhatsApp cuando el cliente quiere comprar. |
| **Distribución Federal** | Logística de envíos | El equipo atendía llamadas de "¿dónde está mi envío?" y no le quedaba tiempo para coordinar repartos. | El cliente escribe su número de envío y el agente le dice dónde está y cuándo llega. Si pide cambiar el horario, lo deriva a una persona por WhatsApp. |
| **Consultorios Médicos San Lucas** | Turnos online | Los turnos se coordinaban por teléfono, con idas y vueltas hasta encontrar un horario libre. | El agente propone un horario, reserva el turno y envía la confirmación con el enlace de la videoconsulta. Las dudas pasan a WhatsApp. |

- Reemplazan a los dos ejemplos anteriores ("Nube" y "Ríos y Asociados").
- Las capturas se inclinan un poco al pasar el mouse, como el resto del sitio.
- Se siguen viendo bien en el celular y en ambos fondos.
- La página sigue aclarando que son proyectos simulados, creados para la materia.

## Cómo se publicó

El trabajo se subió en tres tandas, y cada una quedó publicada en el sitio:

1. Botón de modo claro y colores de marca.
2. Pulido del modo claro (Probalo, chat, logo en el pie y en Nosotros).
3. Página de Proyectos con las tres capturas.

En cada tanda se verificó que el sitio compilara sin errores y que la versión publicada mostrara los cambios.

## Cómo lo comprobamos

- Se revisó en computadora y en celular, con fondo oscuro y claro.
- El sitio compila sin errores antes de cada publicación.
- Luego de publicar, se confirmó que el sitio en línea ya incluía los cambios.

## Pendientes y cosas a tener en cuenta

- **Aviso de seguridad:** la versión de Next.js (la herramienta con la que está hecho el sitio) tiene un aviso de vulnerabilidad conocida. No se actualizó para no cambiar nada sin consenso. Conviene revisarlo en el próximo sprint.
- **Términos y Privacidad en modo claro:** usan las mismas reglas, pero no se revisaron una por una a ojo. Falta una pasada rápida.
- **Capturas definitivas:** las tres capturas son ilustrativas (dicen "Proyecto de ejemplo ilustrativo"). Si más adelante hay un cliente real, se reemplazan.
- **Retrospectiva:** queda para el equipo completo; no la completamos sin su aporte.

## Resumen para pegar en el Word

> En este sprint sumamos a la web un botón para elegir entre fondo oscuro y fondo claro. El modo claro usa los colores de la marca (crema, azul oscuro y ámbar) y recuerda la elección del visitante. Pulimos los detalles que se veían mal sobre fondo claro: el logo, las tarjetas, la sección "Probalo en vivo" y el chat de Yuyo. Además, la página de Proyectos ahora muestra tres casos de ejemplo con captura de pantalla (una tienda de mates, una empresa de logística y un consultorio médico), cada uno con su situación de antes y cómo mejora con el agente. Todo está publicado en https://codigo-mate-landing.vercel.app.

## Actualización: videos en Proyectos y colores de Nosotros

Commits de este tramo:

1. **Proyectos: videos de 10 s en cada caso.** Cada caso de la página Proyectos ahora reproduce un video corto de la demo (en silencio, en bucle y sin pantalla completa). La captura queda como portada mientras carga, y se muestra si el navegador no reproduce video. Los videos viven en `public/proyectos/` junto a las capturas. Funcionan en celular (se reproducen en línea, sin abrir pantalla completa).
2. **Nosotros: tarjetas en papel claro.** En modo claro, las tarjetas del equipo y de "Cómo trabajamos" tenían fondo gris pizarra con texto apagado. Ahora usan el mismo papel translúcido del resto de la web, con borde y sombra suaves.
3. **Docs: este archivo.** Se actualiza el sprint con los cambios de este tramo.

Además se mergeó el PR #4: la lista "Probá con una de estas" de la portada ya no tiene fondo blanco en modo claro; usa el mismo crema del fondo.

Revisado en el navegador: Nosotros en modo claro (escritorio) y la página de Proyectos con videos.

## Tercer tramo: mejoras para una web más completa y "premium"

Después de los dos tramos anteriores, sumamos diez mejoras de solo frontend (sin integraciones nuevas), pensadas para que la web se sienta como un producto completo y no solo una landing.

| # | Mejora | Qué hace, en simple |
| --- | --- | --- |
| 1 | **Página de detalle por proyecto** | Cada caso (`/proyectos/el-ceibo`, `/proyectos/distribucion-federal`, `/proyectos/san-lucas`) tiene su página: video grande, el problema, lo que se hizo, resultados de ejemplo, una conversación de muestra y un enlace al siguiente proyecto. |
| 2 | **Panel del dueño** | En el inicio, un panel de ejemplo con conversaciones, porcentaje resuelto por el agente, derivaciones a WhatsApp, gráfico por hora y temas más preguntados. Tiene pestañas Hoy / Esta semana. |
| 3 | **Comparador "sin agente / con agente"** | Un control que se arrastra (o se mueve con el teclado) y muestra la misma consulta de las 23:47 con dos finales: sin respuesta o respondida en segundos. |
| 4 | **Contadores animados** | Los números de resultados suben desde cero al aparecer en pantalla. Si la persona tiene el movimiento reducido, se ven directo. |
| 5 | **Preguntas frecuentes** | Siete preguntas en acordeón (precio, qué pasa si no sabe, plataformas, tono, datos, ejemplos simulados). Funciona con teclado y suma datos estructurados para buscadores. |
| 6 | **Transiciones entre páginas** | Al navegar, la página cambia con un fundido suave. Se desactiva si la persona pidió menos movimiento. |
| 7 | **Cinta de plataformas** | Una cinta en movimiento con "Se instala donde ya estás": web a medida, Tiendanube, Shopify, WordPress, WooCommerce, Wix, Webflow y WhatsApp (nombres en texto). |
| 8 | **Aviso de privacidad y "Saltar al contenido"** | Un aviso corto que cuenta qué guarda el sitio y se cierra con "Entendido"; y un enlace oculto para saltar directo al contenido con el teclado. |
| 9 | **Modo claro según el sistema** | La primera vez, la web respeta si el dispositivo está en modo claro u oscuro; después recuerda lo que elija la persona con el botón. |
| 10 | **Brillo de carga en los videos** | Mientras llega el video de cada proyecto, el marco muestra un brillo suave en lugar de un recuadro vacío. |

### Detalles a tener en cuenta

- **Todas las cifras son de ejemplo.** Los resultados (por ejemplo "60 % menos consultas", "10 h de espera") son ilustrativos del proyecto simulado y lo dicen en pantalla. No son mediciones reales.
- **No se agregó ninguna integración.** Todo funciona con datos dentro de la propia web.
- **Sitemap:** las tres páginas nuevas de proyectos se agregaron al mapa del sitio para buscadores.
- **Verificación:** la web compila sin errores; se revisó en computadora y celular, con fondo oscuro y claro. El aviso de seguridad de la versión de Next.js sigue pendiente (no se actualizó).

### Commits de este tramo

1. Proyectos: página de detalle por caso (datos compartidos, contadores y sitemap).
2. Inicio: comparador sin agente / con agente, panel del dueño, cinta de plataformas y preguntas frecuentes.
3. Aviso de privacidad, "Saltar al contenido" y modo claro según el sistema.
4. Docs: sprint 2 actualizado y documento de nuevas modificaciones para la presentación.
