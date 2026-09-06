# Cambios de slug de tours pendientes (Trello: "Redireccionar URLs")

Origen: la hoja **Create OP Recs** de [KW Research for Existing Pages][sheet], que es lo
único que linkea la tarjeta. La columna `Recommended URL` propone renombrar 9 tours para
alinear el slug con la keyword principal de cada página.

[sheet]: https://docs.google.com/spreadsheets/d/1WbOo391GiH_jqZyEagzUTglpiZ_YUFCmIHgD2d7KUWI/edit?gid=1368446379

**HECHO el 6/9/2026:** los 8 slugs se renombraron en WordPress y los redirects están en `next.config.ts`. Queda como registro del orden y del bloque.

## El orden importa

Los slugs de los tours viven en WordPress: `/tour/[slug]/` se arma con lo que devuelve
`wp.getTourBySlug()`. El código no puede cambiar un slug, sólo redirigir el viejo.

Entonces la secuencia obligada es:

1. **Primero** cambiar el slug en WordPress. La URL nueva empieza a responder 200 y la
   vieja pasa a 404.
2. **Después** deployar el redirect viejo → nuevo en el `redirects()` de `next.config.ts`,
   con `permanent: true` (308).

Si se hace al revés, se mandan 8 páginas indexadas y con tráfico a URLs que no existen.

Verificado el 2026-08-30: las 8 URLs actuales responden 200 y ninguna de las 8 propuestas
existe todavía.

## Los 9 pares

| # | Slug actual | Slug propuesto | Estado |
|---|-------------|----------------|--------|
| 1 | `amsterdam-local-foodie-adventure` | `amsterdam-walking-food-tour` | ✅ hecho |
| 2 | `buenos-aires-local-foodie-experience` | `palermo-buenos-aires-food-tour` | ✅ hecho |
| 3 | `buenos-aires-private-tour` | `buenos-aires-private-food-tour` | ✅ hecho |
| 4 | `gourmet-taco-tour` | `taco-tour-mexico-city` | ✅ hecho |
| 5 | `london-food-tour` | `soho-london-food-tour` | ✅ hecho |
| 6 | `mexico-city-private-experience` | `mexico-city-private-food-tour` | ✅ hecho |
| 7 | `mexico-local-foodie-adventure` | `roma-norte-mexico-food-tour` | ✅ hecho |
| 8 | `paris-private-experience` | `paris-private-food-tour` | ✅ hecho |
| 9 | `san-telmo-tour-2` | `san-telmo-food-tour` | **ya resuelto** |

El 9 es ruido de la planilla: `san-telmo-tour-2` ya redirige a `/tour/san-telmo-tour/`, así
que la fila describe un estado anterior del sitio. No hay nada que hacer con esa.

## El bloque a agregar, cuando los slugs ya estén cambiados

Va dentro del `redirects()` que ya existe en `next.config.ts`, con el mismo formato que las
entradas de ahí. `trailingSlash: true`, así que el `source` lleva la barra final.

```js
// Renombre de slugs de tours para alinearlos con la keyword principal.
// Sólo tiene sentido con el slug ya cambiado en WordPress: ver
// TOUR-SLUG-REDIRECTS-PENDIENTES.md.
{ source: '/tour/amsterdam-local-foodie-adventure/',     destination: '/tour/amsterdam-walking-food-tour/',    permanent: true },
{ source: '/tour/buenos-aires-local-foodie-experience/', destination: '/tour/palermo-buenos-aires-food-tour/', permanent: true },
{ source: '/tour/buenos-aires-private-tour/',            destination: '/tour/buenos-aires-private-food-tour/', permanent: true },
{ source: '/tour/gourmet-taco-tour/',                    destination: '/tour/taco-tour-mexico-city/',          permanent: true },
{ source: '/tour/london-food-tour/',                     destination: '/tour/soho-london-food-tour/',          permanent: true },
{ source: '/tour/mexico-city-private-experience/',       destination: '/tour/mexico-city-private-food-tour/',  permanent: true },
{ source: '/tour/mexico-local-foodie-adventure/',        destination: '/tour/roma-norte-mexico-food-tour/',    permanent: true },
{ source: '/tour/paris-private-experience/',             destination: '/tour/paris-private-food-tour/',        permanent: true },
```

## Qué hay que tocar además del redirect

Los slugs viejos están escritos a mano en varios lugares. Al cambiarlos en WP hay que
revisarlos, porque no salen de WordPress:

- `scripts/verify-merge.js` — `ROUTES.tour` apunta a `buenos-aires-local-foodie-experience`.
- `src/app/tour/[slug]/page.tsx` — hay un `notFound()` temprano con slugs literales
  (`"london"`, `"amsterdam"`).
- Cualquier link interno cargado a mano en el contenido de WordPress. El
  `rewriteInternalLinks()` de `src/lib/wp-links.ts` normaliza el host y la barra final,
  pero no sabe de slugs renombrados: un link viejo va a pasar por el redirect, que
  funciona, pero suma un salto.

## Lo que la planilla pide y no es una redirección

La misma hoja marca 6 páginas a **crear** (`Create New Page`), que no tienen URL actual y
por lo tanto no llevan redirect: lucha libre, museo Frida Kahlo, tour de mezcal, wine tour
en Buenos Aires, cata de jamón en Barcelona y cata de cava en Barcelona. Es trabajo de
contenido.

También aparece la acción `9. Add to XML Sitemap` en 7 filas. Eso ya está cubierto: el
sitemap las genera. Lo que sí había que arreglar era que se publicaba sin los artículos
cuando WordPress fallaba, y eso se resolvió aparte.
