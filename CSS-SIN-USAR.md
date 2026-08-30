# CSS sin usar — lo medido y lo que falta

Origen: Trello "Page speed review". Lighthouse pide, entre otras cosas, *remove unused CSS
and JavaScript*. Este documento deja la medición hecha y por qué la limpieza no se
completó en la misma pasada.

## El 68% que no es lo que parece

Medido en producción sobre la home, recorriendo `document.styleSheets` y probando cada
selector contra el DOM: **de 1221 reglas, 848 no matchean nada**, que son ~68% de los
bytes.

Ese número no se puede usar como objetivo. La enorme mayoría de esas reglas son el
*preflight* de Tailwind — `abbr:where([title])`, `::file-selector-button`, `sub`, `sup`,
`table`, `progress`, `::-webkit-datetime-edit` y demás. Es la capa de normalización, y
normaliza justamente elementos que sí aparecen en el HTML que manda WordPress: los
artículos tienen `<table>`, `<strong>`, `<sub>`. Borrarla rompería el contenido.

## Lo que sí se hizo

`src/app/home.css` — 23.6 KB, 33 clases — **borrado**. Estaba muerto de verdad:

- No lo importaba nadie. Ni un `.tsx`, ni un `.ts`, ni otro `.css`, ni un config.
- Las 33 clases que definía están todas también en `globals.css`.

Al no estar importado no entraba en el bundle, así que borrarlo no baja el peso servido:
lo que saca es una copia divergente de estilos que ya viven en otro lado.

## Lo que falta, y por qué no lo hice

Quedan 33 clases definidas en CSS que no aparecen ni en el HTML servido de las 9 rutas ni
en ningún `.tsx`. Casi todas están duplicadas entre `globals.css` y el CSS de su
componente, que es el mismo patrón que dejó `home.css` tirado.

**No las borré porque no puedo verificar el resultado.** Sin correr un build y mirar las
páginas, sacar 33 bloques de reglas es cambio no verificado sobre el aspecto de todo el
sitio. Dos riesgos concretos que la medición no cubre:

1. **Contenido de WordPress.** Muestreé un solo artículo de los ~72. Una clase puede estar
   escrita a mano en el cuerpo de otro. Las marcadas abajo como "contenido de WP" son las
   que más se parecen a eso.
2. **Clases que aparecen por estado.** Un menú abierto, un carrusel activo. El muestreo es
   del DOM en reposo. Ya salieron dos falsos positivos así: `element-0`, que se arma con
   `` `element-${i}` ``, y `swiper-slide-active`, que agrega Swiper en runtime. Los dos
   están excluidos de la lista.

Para completarlo hace falta un build y una pasada visual por plantilla.

| clase | definida en | origen probable |
|---|---|---|
| `about-us-page-second-section-desktop` | about-us.css, globals.css | componente |
| `category-container` | globals.css, travel-guide.css | contenido de WP |
| `category-title` | globals.css, travel-guide.css | contenido de WP |
| `cities-row-tours` | cities-dropdown.css | componente |
| `city-name` | globals.css, meet-local-guides.css | componente |
| `content-section` | globals.css, our-experiences.css | contenido de WP |
| `country-name` | globals.css, meet-local-guides.css | componente |
| `desktop-images` | globals.css, tour.css | componente |
| `embed-calendar-header` | globals.css | componente |
| `group-posts` | city.css, globals.css | componente |
| `images-container` | globals.css, our-experiences.css, tour.css | contenido de WP |
| `images-section` | globals.css, our-experiences.css | contenido de WP |
| `img-gallery` | globals.css, travel-guide.css | contenido de WP |
| `img-item` | globals.css, our-experiences.css | contenido de WP |
| `info-section` | globals.css, our-experiences.css | componente |
| `know-the-city` | city.css, globals.css | componente |
| `last-section-title` | globals.css, meet-local-guides.css | componente |
| `local-guide-title` | globals.css, meet-local-guides.css | componente |
| `our-experiences-section-desktop` | globals.css, our-experiences.css | componente |
| `posts-container` | city.css, globals.css | componente |
| `remainig-posts` | city.css, globals.css | componente |
| `right-side` | about-us.css, globals.css, tour.css | componente |
| `second-section-container` | globals.css, home.css | componente |
| `tour-data` | globals.css, home.css | componente |
| `tours-container` | globals.css, home.css | componente |
| `tours-section` | globals.css, home.css | componente |
| `value-card-description` | globals.css, meet-local-guides.css | componente |
| `value-card-last-section` | globals.css, meet-local-guides.css | componente |
| `value-card-name` | globals.css, meet-local-guides.css | componente |
| `value-card-personal-info` | globals.css, meet-local-guides.css | componente |
| `value-cards-container-desktop` | about-us.css, globals.css | componente |
| `value-cards-title-container` | about-us.css, globals.css | componente |
| `tour-data` | globals.css, home.css | componente |

*(las filas que dicen `home.css` se midieron antes de borrarlo; su copia en `globals.css`
sigue estando)*

## Sobre el JavaScript

No lo medí. La home baja 10 chunks, el más grande de 66 KB gzip. Saber cuánto de eso se
ejecuta requiere el *coverage* de DevTools, que no se puede pedir desde acá. El peso total
no parece el problema principal: el score mobile de 45 con un desktop de 94 apunta más a
imágenes y a trabajo en el hilo principal que a 17 KB de CSS comprimido.

## Contexto

Los otros ítems de la misma tarjeta:

- Preload del LCP, diferir recursos no críticos, dimensiones explícitas de imagen: ya
  estaban hechos y verificados contra producción por `verify-merge.js`.
- Contraste: corregido, cuatro colores llevados a 4.5:1.
- Roles ARIA: se corrieron cinco chequeos sobre home y tour, sin hallazgos.
