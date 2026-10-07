# Código Mate · Identidad de movimiento

Personalidad: **Premium**. Entra rápido y frena largo, sin rebote. Calma y seguridad, nunca juguetón.

## Las tres constantes

### 1. Curva principal

| Uso | CSS | GSAP |
| --- | --- | --- |
| Entradas y respuestas (80% de los casos) | `var(--ease-out)` = `cubic-bezier(0.16, 1, 0.3, 1)` | `MOTION.ease` = `expo.out` |
| Salidas | `var(--ease-in)` = `cubic-bezier(0.7, 0, 0.84, 0)` | `MOTION.easeIn` = `expo.in` |
| Loops ambientales (orbes, brillos) | `var(--ease-io)` | `sine.inOut` |
| Marquees, barras de progreso, scrub | `linear` | `none` |

Sin overshoot. La única excepción es el check de éxito: escala hasta 1.06 y vuelve.

### 2. Duraciones

| Token | Desktop | Móvil (≤640px, -20%) | Uso |
| --- | --- | --- | --- |
| `--dur-quick` / `MOTION.quick` | 150ms | 120ms | Hover, press, foco, cambio de color |
| `--dur-std` / `MOTION.std` | 350ms | 280ms | Cards, chips, mensajes de error, paneles |
| `--dur-slow` / `MOTION.slow` | 700ms | 560ms | Titulares, reveals de sección, éxito del formulario |

Las salidas duran ~70% de la entrada. Los escalonados no pasan de 450ms en total (60–80ms entre elementos).

### 3. Patrón de entrada

Sube 16–24px desde abajo, pasa de `opacity: 0` a 1 y frena con `--ease-out`. En titulares y héroe se suma un desenfoque de 6px que se aclara al llegar.
Siempre la misma dirección: todo entra desde abajo.

## Reglas

- Solo se animan `transform`, `opacity` y `filter` (clip-path en reveals puntuales).
- Press: `scale(0.97)` en `--dur-quick`, vuelve en `--dur-std`.
- Error: sacudida horizontal de 3 oscilaciones que decrecen, 380ms.
- Movimiento siempre activo, también con `prefers-reduced-motion` (decisión del equipo, ver CONTEXT.md).

## Dónde viven

- CSS: `app/globals.css` (`:root`).
- GSAP: `lib/motion.ts` (`MOTION`).
