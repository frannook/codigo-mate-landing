# Plan: hero premium (pendiente, último paso del sprint 2)

Estado: **no implementado**. Se hace después de cerrar la optimización de contenido (PR #13) y de revisar el resto de la web.
Lo arma y revisa el equipo con Opus antes de tocar código, porque es el cambio de más impacto visual y el que más tokens consume.

## Objetivo

Que la primera pantalla comunique en dos segundos qué hace Código Mate y lo muestre a la vez:
- **Izquierda:** el titular y la bajada, con movimiento de entrada suave.
- **Derecha:** el chat de Yuyo en funcionamiento (captura real de la demo, sin navbar, dentro de un marco de vidrio) que entra deslizándose y se endereza con un giro suave.
- **Yuyo** camina por el borde inferior como hoy; no se toca.

## Qué ya existe (no rehacer)

- Titular palabra por palabra (`HEADLINE` en `app/page.tsx`, animación `cmWord`).
- Marco 3D con inclinación y brillo (`.hero__stage`, `data-tilt`, `Tilt.tsx`).
- Chat vivo `HeroShowcase.tsx` (conversación de rubros que rota). Es el que se ve hoy en la derecha.
- Motion global (`Motion.tsx`): Lenis, GSAP y ScrollTrigger ya cargados.

## Decisión de contenido (antes de diseñar)

Elegir **una** de estas dos opciones para la derecha:

| Opción | Qué es | Pro | Contra |
| --- | --- | --- | --- |
| A. Captura + movimiento en código (recomendada) | Imagen real del chat en un marco; GSAP anima el deslizamiento y el giro | Nítida, liviana, responsive, se puede editar sin regenerar nada | Menos "cinematográfica" |
| B. Video corto en bucle (10 s) | Video de la demo dentro del marco | Muestra el uso (escribir, responder) | Más pesado; el primer cuadro tiene que verse bien sin esperar la carga |

Recomendación: **A para la entrada** (una vez) y **B en bucle silencioso** dentro del mismo marco, con el primer cuadro como poster. Es lo que ya usamos en Proyectos.

Nota sobre generar el video con IA: no conviene. Los modelos deforman el texto de la UI en español. El video se graba desde la app real (Playwright) sin navbar.

## Pasos de implementación

1. **Captura sin navbar:** grabar la demo del chat a 1280 px y a 390 px, sin cabecera de navegación, con el mismo fondo oscuro y claro. Exportar poster (`.jpg`) y video (`.mp4`, 10 s, silencioso). Guardar en `public/hero/`.
2. **Estructura:** en `app/page.tsx`, el hero pasa a dos columnas en escritorio (texto izquierda, marco derecha) y una columna en celular (texto arriba, marco abajo).
3. **Entrada:** timeline de GSAP (`gsap.timeline`):
   - texto: desliza hacia la izquierda desde el centro, opacidad 0 → 1, ease expo.out, 0.9 s;
   - marco: entra desde la derecha con `x: 80 → 0`, `rotateY: -12 → -7` (el giro que ya tiene), 1.1 s, con 0.2 s de retraso;
   - se usa `gsap.matchMedia()` para desactivar el giro en celular y con `prefers-reduced-motion`.
4. **Video:** `preload="metadata"`, `poster` obligatorio, `muted loop playsInline`. Se pausa cuando el hero sale de pantalla (IntersectionObserver).
5. **Tema claro:** revisar contraste del marco y del titular (los tokens ya existen en `theme.css`).
6. **Yuyo:** no cambia; sigue en el borde inferior.

## Criterios de aceptación

- Primer cuadro visible sin esperar el video (poster cargado al instante).
- Sin desborde horizontal en 360 px. Sin saltos de diseño (CLS ≈ 0).
- Con movimiento reducido: todo aparece sin animación.
- Escritorio, celular, oscuro y claro revisados con captura.
- Build de producción sin errores.

## Riesgos

- Peso: el video no debe superar ~3 MB. Si pesa más, bajar resolución a 960 × 540.
- Animación de entrada que compite con el titular: la entrada del texto va primero; el marco espera 0.2 s.
- Duplicar el chat de la vitrina (`HeroShowcase`): si el hero tiene video, la vitrina debe quedar en otro lugar o salir del hero.

## Qué pedir a Opus (cuando llegue el momento)

1. Revisar la decisión A vs B y el orden de entrada.
2. Escribir el timeline de GSAP con sus tiempos y el plan de `matchMedia`.
3. Proponer la maquetación del hero en dos columnas sin romper el header ni la cinta.
