# Sprint · Acento cálido, página Nosotros y legibilidad móvil

Fecha: 2026-10-16 · Repo: https://github.com/frannook/codigo-mate-landing

## Objetivo

1. Sumar un acento de color cálido a la paleta navy/bone sin perder la identidad.
2. Crear una página aparte, `/nosotros`, con foto y una descripción corta del equipo.
3. Pulido visual y mejor legibilidad en el celular.

## Qué se entregó

| Entrega | Detalle | Archivos |
| --- | --- | --- |
| Acento cálido **ámbar miel** `#E9A23B` | Se usa en la palabra destacada del titular, la línea del eyebrow, el hover de los botones principales, la barra de progreso, la selección de texto, el amanecer de "Mientras dormís" y la palabra "Mate" del footer. Es un token (`--amber`, `--amber-hi`): cambiarlo es editar dos líneas. | `app/globals.css`, `app/styles/nav-footer.css`, `app/styles/story.css` |
| Página **Nosotros** | Ruta `/nosotros` con foto (retrato), descripción y tres principios. Botón "Nosotros" en el menú (escritorio y móvil) y en el footer. Los links del menú y el footer funcionan desde cualquier página. | `app/nosotros/page.tsx`, `app/styles/about.css`, `components/Nav.tsx`, `components/Footer.tsx` |
| Legibilidad móvil | Todo texto de interfaz sube a 13 px como mínimo (cuerpo 14 px); botones del chat de 40 px de alto; eyebrow con menos tracking y más contraste; titular del hero ya no deja una "a" sola en una línea. | `app/globals.css` y archivos de `app/styles/` (bloque `@media (max-width: 640px)`) |
| Pulido | Foto de Nosotros en proporción 4:3 en móvil para que el texto entre en la primera pantalla; indicador de desarrollo de Next oculto. | `app/styles/about.css`, `next.config.ts`, `app/page.tsx` |

## Colores cálidos evaluados

Contraste calculado sobre el navy de la web (`#0D1B2A`). Mínimo exigido para texto normal: 4,5:1.

| Opción | Hex | Contraste | Lectura |
| --- | --- | --- | --- |
| **Ámbar miel (elegido)** | `#E9A23B` | 8,0:1 | Casi complementario del azul: es el que más se nota. Remite al mate y al dulce de leche. |
| Terracota | `#E07A5F` | 5,9:1 | Más suave y cercano; se parece más a una marca de comida. |
| Cobre | `#D08A5B` | 6,2:1 | Sobrio, pero se confunde con el azul grisáceo en tamaños chicos. |
| Durazno | `#F4A982` | 9,0:1 | Muy claro: compite con el bone de los botones. |

## Antes y después

Capturas en [`evidencias/`](evidencias/). Prefijo `antes-` es la versión anterior; `despues-` la nueva.

| Pantalla | Antes | Después |
| --- | --- | --- |
| Inicio, escritorio | `antes-home-desktop-fold.png` | `despues-home-desktop-fold.png` |
| Inicio, móvil (390 px) | `antes-home-mobile-fold.png` | `despues-home-mobile-fold.png` |
| Cotizador, móvil | `antes-home-mobile-cotizador.png` | `despues-home-mobile-cotizador.png` |
| Testimonios, móvil | `antes-home-mobile-testimonios.png` | `despues-home-mobile-testimonios.png` |
| Agendar, móvil | `antes-home-mobile-agendar.png` | `despues-home-mobile-agendar.png` |
| Nosotros, escritorio | no existía | `despues-nosotros-desktop-fold.png`, `despues-nosotros-desktop-completa.png` |
| Nosotros, móvil | no existía | `despues-nosotros-mobile-fold.png`, `despues-nosotros-mobile-completa.png` |

## Verificación

Medido con Chrome automatizado (Playwright) a 390 px de ancho, en `/` y `/nosotros`:

| Chequeo | Resultado |
| --- | --- |
| `npm run typecheck` | Sin errores |
| Desborde horizontal | 0 px en las dos páginas |
| Textos de menos de 13 px en móvil | 0 (queda solo el código de ejemplo dentro del celular de "Mientras dormís") |
| Botones y links de menos de 40 px de alto en móvil | 0 |
| Errores en consola del navegador | 0 |
| Contraste del ámbar sobre navy | 8,0:1 (cumple AA y AAA) |

Pendiente de revisar a mano: probar en un celular real y confirmar el aspecto de la foto cuando se cargue la definitiva.

## Para completar

- **Foto del equipo:** guardarla como `public/nosotros.jpg` (también acepta `.webp` o `.png`). Hasta entonces la página muestra el logo en un panel de marca. Recomendado: retrato vertical, al menos 1200×1500 px.
- **Texto de Nosotros:** es una descripción general armada con lo que ya dice la web (qué hacemos, cómo trabajamos). Falta sumar nombres y roles del equipo si se quieren mostrar.

## Cómo probarlo

```bash
npm install
npm run dev          # http://localhost:3000  y  http://localhost:3000/nosotros
```

En el celular: abrir las herramientas del navegador (F12) y elegir un tamaño de 390 px de ancho.
