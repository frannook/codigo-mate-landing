# Plan: hero premium (pendiente, último paso del sprint 2)

Estado: **no implementado**. Se ejecuta con Opus cuando el equipo apruebe este plan.
Va al final del sprint, después de cerrar la optimización de contenido (PR #13).

## Objetivo

Una entrada en secuencia, con movimiento 3D suave, que en menos de 3,5 s muestre qué hace Código Mate y lo demuestre:

1. El titular entra desde lejos, palabra por palabra, en el centro de la pantalla.
2. El titular se acomoda a la izquierda y aparece el subtítulo debajo.
3. Entran los dos botones: "Agendar una llamada" y "Probar el agente".
4. Desde la derecha entra el panel de demo: primero el de **turnos**, después rota por los rubros (tienda online, inmobiliaria, gastronomía, servicios).

Yuyo camina por el borde inferior como hoy; no se toca.

## Secuencia (línea de tiempo)

| Tiempo | Qué pasa | Movimiento |
| --- | --- | --- |
| 0,0 s | Titular aparece en el centro | Palabras desde `translateZ(-420px)` y `rotateX(-18deg)`, con `opacity` 0 → 1 y `filter: blur(10px)` → 0. Stagger de 0,06 s. Duración 1,1 s, `expo.out`. |
| ~1,2 s | Titular se acomoda a la izquierda | Cambio de posición con FLIP (plugin Flip de GSAP). Duración 0,8 s, `expo.inOut`. |
| ~1,6 s | Aparece el subtítulo | Fade + `y: 16 → 0`, 0,6 s. |
| ~1,9 s | Entran los botones | Stagger de 0,08 s, `y: 12 → 0`, `opacity`. |
| ~1,4 s | Entra el panel de demo desde la derecha | `x: 140 → 0`, `rotateY: -14deg → -7deg` (el giro que ya tiene), `opacity`. Duración 1,1 s, `expo.out`. Sincronizado con el acomodo del titular. |
| ~2,6 s | Empieza el ciclo de rubros | Turnos → tienda → inmobiliaria → gastronomía → servicios, cada uno con transición corta (ya existe en `HeroShowcase`). |

Todo está en una sola `gsap.timeline` con etiquetas: `intro`, `shift`, `ui`, `cycle`.

## Qué ya existe (no rehacer)

- Titular palabra por palabra (`HEADLINE` en `app/page.tsx`, animación `cmWord`). Se reutiliza el split, cambia la animación.
- Marco 3D con inclinación (`.hero__stage`, `data-tilt`, `Tilt.tsx`).
- `HeroShowcase.tsx`: panel con tabs de rubros (Logística, Turnos, Tienda online, Inmobiliaria, Gastronomía, Servicios) y rotación. El panel de turnos es el primero de la secuencia.
- `Motion.tsx`: Lenis, GSAP y ScrollTrigger ya cargados. Hay parallax en `.hero__visual`: se **pausa durante la intro**.

## Ajuste de copy antes de implementar

El subtítulo real dice "Sumamos **un agente** a tu sitio…". En el pedido aparece "agenda". Se mantiene "agente" (es el producto). Confirmar.

## Criterios de aceptación

- El primer cuadro muestra el titular: nunca una pantalla vacía (el titular empieza con opacidad 0,25, como hoy).
- Sin JS o con movimiento reducido (`prefers-reduced-motion`): todo queda en su estado final, sin animación.
- Celular (menos de 900 px): sin 3D ni FLIP. Orden de una columna: titular, subtítulo, botones, panel. Entra con un fade corto.
- Sin desborde horizontal en 360 px. CLS ≈ 0 (el panel tiene tamaño reservado).
- Tema claro y oscuro revisados con captura.
- Build de producción sin errores. Peso de JS nuevo: solo el plugin Flip (verificar tamaño).

## Riesgos

- **Duración:** si la secuencia pasa de 3,5 s se siente lenta. Medir en escritorio y ajustar tiempos antes de aprobar.
- **LCP:** el titular es el elemento más grande; no puede esperar al panel ni al video.
- **Conflicto con parallax:** pausar `.hero__visual` en ScrollTrigger hasta que termine la intro.
- **Doble animación en el panel:** la rotación de rubros de `HeroShowcase` arranca solo cuando termina la entrada.

## Qué pedir a Opus

1. Escribir la `gsap.timeline` con los tiempos de la tabla y las etiquetas.
2. Implementar el FLIP del titular (medir posición final en el layout y animar la diferencia).
3. Separar la entrada (`intro`) de la rotación de rubros (`HeroShowcase`) sin que se pisen.
4. Ajustar la maquetación en dos columnas sin romper el header ni la cinta.
