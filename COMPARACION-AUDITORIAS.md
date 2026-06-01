# Comparacion de Auditorias SEO - Sherpa Food Tours

**Auditoria 1:** 19 de mayo 2026 (score inicial: 55/100)
**Auditoria 2:** 31 de mayo 2026 (score actual: 62/100)
**Mejora neta:** +7 puntos (de 55 a 62)
**Fixes implementados entre auditorias:** 33 cambios de codigo en 6 sprints

---

## Resumen Rapido

La primera auditoria detecto problemas graves (telefono falso, schema roto, sin GBP) y se implementaron 33 fixes de codigo. Eso subio el score de 55 a ~70 estimado. Sin embargo, la segunda auditoria con **analisis profundo del codigo fuente** encontro **34 problemas nuevos** que la primera no detecto, bajando el score real a 62/100.

La razon principal: la primera auditoria analizo el HTML externo del sitio. La segunda auditoria tuvo **8 agentes especializados que leyeron los archivos .tsx del codigo fuente**, descubriendo bugs arquitecturales invisibles desde afuera.

---

## Scores Comparados por Categoria

| Categoria | Auditoria 1 (May 19) | Post-Fixes (estimado) | Auditoria 2 (May 31) | Cambio Real |
|---|---|---|---|---|
| Technical SEO | 61 | ~75 | 76 | +15 |
| Content & E-E-A-T | 64 | ~70 | 63 | -1 |
| On-Page SEO | 62 | ~68 | 60 | -2 |
| Schema | 40 | ~65 | 65 | +25 |
| Performance (CWV) | 60 | ~65 | 62 | +2 |
| AI/GEO | 58 | ~68 | 71 | +13 |
| Images | 55 | ~60 | 54 | -1 |
| **TOTAL** | **55** | **~70** | **62** | **+7** |

**Por que el score real (62) es menor al estimado (70)?** Porque la segunda auditoria descubrio problemas nuevos que penalizaron categorias como Content (-1), On-Page (-2) e Images (-1). Los fixes implementados SI funcionaron (Schema subio de 40 a 65, Technical de 61 a 76, GEO de 58 a 71), pero nuevos hallazgos bajaron otras categorias.

---

## Que se arreglo (33 fixes que SI impactaron)

Estos cambios fueron exitosos y sus beneficios se reflejan en la segunda auditoria:

| # | Fix | Impacto Confirmado |
|---|---|---|
| 1 | Eliminar telefono falso (+1-555-123-4567) | Schema ya no tiene datos fabricados |
| 2 | Corregir direccion de NY a GB | Address country ahora coincide con registro legal |
| 3 | Tipos de datos en AggregateRating (string -> number) | Google puede renderizar estrellas correctamente |
| 4 | Fix "Cartagena, null" en OfferCatalog | No mas strings null en schema |
| 5 | Eliminar bloque "offers" vacio | Schema mas limpio |
| 6 | Limpiar meta description (HTML entities) | Snippets en SERP ya no muestran codigo |
| 7 | Imagen de org (logo -> hero) | Schema image ahora es foto representativa |
| 8 | Fix ratingCount: null en tours | Aggregate rating solo aparece cuando hay datos reales |
| 9 | Fix breadcrumb de tours (/tour -> homepage) | Breadcrumb ya no apunta a redirect chain |
| 14 | Agregar schema WebSite con SearchAction | Elegibilidad para searchbox en SERPs |
| 15 | Timezone en fechas de articulos | Fechas ISO 8601 completas |
| 20 | Crear llms.txt | AI crawlers tienen manifiesto de contenido |
| 24-25 | Schema ProfilePage + Person para autores | Cadena Article -> Person -> ProfilePage completa |
| 26 | TourOperator schema en city pages | Senial de negocio local por ciudad |
| 27-28 | Noindex autores vacios + filtro sitemap | Sin contenido thin indexado |
| 29 | Key file IndexNow | Verificacion lista (falta el ping) |
| 30 | Directivas AI en robots.txt | Control estrategico de crawlers |
| 33 | og:image de logo a foto en todas las paginas | Social sharing muestra foto del tour |

---

## Los 16 pendientes que siguen sin hacerse

Estos items fueron identificados en la primera auditoria como "acciones manuales pendientes" y **ninguno se completo:**

| # | Pendiente | Impacto | Por que sigue pendiente |
|---|---|---|---|
| ~~1~~ | ~~Migrar imagenes de staging a produccion~~ | ~~CRITICO~~ | DESCARTADO - `staging.sherpafoodtours.com` es el CMS WordPress de produccion (nombre legacy). No es un servidor temporal. |
| 2 | Fix slug buenos-aires-2 | ALTO | Requiere cambio en WordPress CMS |
| 3 | Fix slug san-telmo-tour-2 | ALTO | Requiere cambio en WordPress CMS |
| 4 | Crear Google Business Profile x 8 ciudades | CRITICO | Requiere setup manual en GBP |
| 5 | Registrarse en Viator/GetYourGuide | ALTO | Requiere registro en plataformas |
| 6 | Google Maps embeds en city pages | ALTO | Requiere campo ACF en WordPress |
| 7 | Contenido Barcelona (min 3 articulos) | CRITICO | Requiere redaccion editorial |
| 8 | Contenido Cartagena (min 3 articulos) | CRITICO | Requiere redaccion editorial |
| 9 | Expandir contenido Lima | ALTO | Requiere redaccion editorial |
| 10 | FAQ blocks en articulos top | ALTO | Requiere edicion en WordPress |
| 11 | Estadisticas con fuentes | MEDIO | Requiere investigacion + edicion |
| 12 | NAP visible (telefono/direccion) | MEDIO | Requiere decision de negocio |
| 13 | Bio Sofia Gonzalez | MEDIO | Requiere decision editorial |
| 14 | Reescribir openers como respuestas directas | ALTO | Requiere cambio editorial ongoing |
| 15 | Geo-targetear marquee Lima | MEDIO | Requiere decision arquitectural |
| 16 | Video walkthrough del tour | MEDIO | Requiere produccion de video |

**Nota:** El pendiente #1 original (imagenes de "staging") fue descartado. `staging.sherpafoodtours.com` es en realidad el CMS WordPress de produccion con un nombre legacy. No hay riesgo de caida ni necesidad de migracion urgente. El unico impacto menor es un DNS lookup extra al subdominio.

---

## 34 Problemas NUEVOS (no detectados en la primera auditoria)

Estos son hallazgos que la primera auditoria no capturo. Estan organizados por por que no se detectaron:

### Grupo 1: Bugs en el codigo fuente (invisibles sin leer los archivos .tsx)

La primera auditoria analizo el output HTML. Estos bugs solo se ven leyendo el source code:

| # | Problema Nuevo | Archivo | Impacto |
|---|---|---|---|
| 1 | **Patron dual de imagen LCP** - MainImage renderiza DOS imagenes apiladas, ambas con `priority` | `src/ui/components/main-image.tsx` | CRITICO (LCP 2.5-4s+) |
| 2 | **Preload del hero comentado** - `<link rel="preload">` desactivado en produccion | `src/app/page.tsx` lineas 283-299 | CRITICO (LCP) |
| 3 | **Microdata + JSON-LD duplicado** en articulos del travel guide | `src/app/travel-guide/[city]/[slug]/page.tsx` | CRITICO (schema conflicting) |
| 4 | **offers.price NaN risk** - `Number(price)` devuelve NaN si price es vacio | `src/app/tour/[slug]/page.tsx` linea 346 | CRITICO (Offer invalido) |
| 5 | **console.log en produccion** - `console.log({ acf })` y `console.log({ title })` | `src/app/tour/[slug]/page.tsx` lineas 207, 217 | BAJO (ruido en logs) |
| 6 | **"Por:" en vez de "By:" en articulos en ingles** | `src/app/travel-guide/[city]/[slug]/page.tsx` linea 324 | ALTO (error de idioma) |
| 7 | **H1 de About con HTML invalido** - `<div>` dentro de `<h1>` | `src/app/about-us/page.tsx` lineas 191-196 | ALTO (heading corrupto) |
| 8 | **LCP gateado por React state** - opacidad controlada por useState | `src/ui/components/main-image.tsx` | MEDIO (sin JS no se ve la imagen) |
| 9 | **Tour description con `<p><br/>`** - split en `\r\n` crea doble salto | `src/app/tour/[slug]/page.tsx` lineas 482-489 | BAJO |
| 10 | **Logo URL relativa en CollectionPage** - `"/sherpa-complete-logo.webp"` (invalido en JSON-LD) | `src/app/travel-guide/page.tsx` linea 120 | CRITICO (schema) |
| 11 | **Imagenes non-hero usan `<img>` crudo** - pierden srcset, AVIF, lazy loading | Multiples componentes | ALTO (performance) |
| 12 | **As Featured In con fetchPriority="high"** - logos below-fold compiten con LCP | `src/ui/components/as-featured-in.tsx` | MEDIO (LCP) |
| 13 | **Gallery sin width/height** - Memories images sin dimensiones | `src/app/components/memories.tsx` | MEDIO (CLS) |
| 14 | **Footer logo sin width/height** | `src/ui/components/footer.tsx` linea 24 | MEDIO (CLS) |
| 15 | **95svh sin fallback vh** - browser compatibility | Hero section | MEDIO (mobile) |
| 16 | **Sitemap lastModified siempre new Date()** en paginas estaticas | `src/app/sitemap.ts` | MEDIO (Google ignora lastmod) |
| 17 | **Paris tour ausente del sitemap** | `src/app/sitemap.ts` | MEDIO |

### Grupo 2: Error introducido POR los fixes anteriores

| # | Problema Nuevo | Causa | Impacto |
|---|---|---|---|
| 18 | **FacebookBot bloqueado como "training crawler"** | Sprint 5, Fix #30 agrupo FacebookBot con CCBot/anthropic-ai | CRITICO - rompe TODOS los previews de links en Facebook, Instagram, WhatsApp y Messenger |

**Explicacion:** En el Sprint 5 se agrego la directiva de AI crawlers en robots.txt. FacebookBot fue categorizado junto con CCBot y anthropic-ai como "training crawler" y se le aplico `Disallow: /`. Pero **FacebookBot NO es un crawler de entrenamiento** - es el bot que Meta usa para generar previews de links cuando alguien comparte una URL. Al bloquearlo, NINGUNA URL del sitio genera preview en Facebook/Instagram/WhatsApp.

### Grupo 3: Inconsistencias de datos (requieren analisis cruzado)

| # | Problema Nuevo | Detalle | Impacto |
|---|---|---|---|
| 19 | **3 numeros de reviews diferentes** | HTML: "2,000" (Google) + "15,000" (TripAdvisor). Schema: 4,649. llms.txt: "4,600+". | CRITICO (schema contradice UI) |
| 20 | **Footer logo alt text typo** | "Shera complete logo" en vez de "Sherpa" | ALTO (brand name corrupted) |
| 21 | **TripAdvisor sameAs es de BA, no global** | sameAs del Organization usa URL de Buenos Aires para la entidad global | ALTO (entity confusion) |
| 22 | **TravelAgency vs TourOperator** | Homepage usa TravelAgency, city pages usan TourOperator para la misma empresa | MEDIO (type mismatch) |
| 23 | **og:type "article" en tour pages** | Paginas de producto/booking marcadas como articulo | MEDIO (social signals) |
| 24 | **llms.txt URL stale** | Link a `/city/buenos-aires-2/` (slug viejo) | MEDIO |
| 25 | **Alt text: solo 52% de cobertura** | 18 de 38 imagenes del homepage sin alt text | ALTO |
| 26 | **4 variantes del business name** | "Sherpa Food Tours" vs "Sherpa Food Tours LLC" vs "Sherpa Food Tours International LTD" vs "Sherpa Food Tours - [City] Food Tour" | ALTO (NAP inconsistency) |

### Grupo 4: Analisis estrategico (requiere SERP research + codigo)

La primera auditoria no hizo analisis de SERPs ni evaluacion de personas:

| # | Problema Nuevo | Detalle | Impacto |
|---|---|---|---|
| 27 | **Homepage page-type mismatch** | El SERP premia hub/aggregator pages. El homepage es brand storytelling. | ALTO |
| 28 | **BA city page NO rankea** | Un tour subpage rankea en vez del city page. Blogs de terceros rankean arriba de Sherpa. | ALTO |
| 29 | **"View the experience" CTA apunta al anchor equivocado** | Linkea a `#as-feature-in` (logos) en vez de la seccion de tours | MEDIO |
| 30 | **Persona corporativa: 25/100** | Cero contenido B2B, sin pagina de grupos/corporativo | MEDIO |
| 31 | **Travel guide hub es un index, no un pillar page** | SERP premia pillar pages de 1500+ palabras. El hub tiene ~200 palabras propias. | MEDIO |
| 32 | **Sin Privacy Policy / Terms of Service** | No hay links en el footer. Riesgo legal + penalizacion de trust E-E-A-T. | ALTO |
| 33 | **Sin Person schema para co-founders** | Guille y Alex tienen credenciales fuertes pero no tienen schema Person en About | ALTO |
| 34 | **Author pages sin knowsAbout/jobTitle** | ProfilePage schema minimo - AI no puede determinar expertise | MEDIO |

---

## Por que no se detectaron antes?

| Razon | Problemas que se escaparon | Ejemplo |
|---|---|---|
| **La auditoria 1 fue externa** (analizo HTML, no source code) | Grupo 1 completo (17 issues) | El patron dual de LCP solo se ve leyendo `main-image.tsx`, no inspeccionando el DOM |
| **Sprint 5 introdujo un bug** | Issue #18 (FacebookBot) | Al implementar los fixes, se agrupo FacebookBot con crawlers de entrenamiento por error |
| **No se cruzo data schema vs HTML visible** | Issues #19, #21, #22, #26 | Los 3 numeros de reviews diferentes requieren comparar el JSON-LD con el HTML renderizado |
| **No se hizo SERP backwards analysis** | Issues #27, #28, #31 | Saber que el homepage no matchea el tipo de pagina que Google premia requiere analizar los top 10 resultados |
| **No se evaluo alt text a nivel de codigo** | Issues #20, #25 | La cobertura del 52% solo se calcula leyendo todos los `<img>` tags y sus atributos en el source |
| **Falta de analisis legal/trust** | Issue #32 | Privacy Policy no es un check SEO tipico pero impacta E-E-A-T trust |
| **No se analizaron personas/intents** | Issues #30, #34 | Evaluar la experiencia desde la perspectiva de un corporate planner requiere SXO analysis |

---

## Que hacer ahora: Plan priorizado de los 34 nuevos issues

### Inmediato (esta semana) - 15 fixes rapidos

| # | Fix | Archivo | Tiempo | Score Impact |
|---|---|---|---|---|
| 18 | Desbloquear FacebookBot | `src/app/robots.ts` | 10 min | +2 |
| 19 | Reconciliar numeros de reviews | `src/app/page.tsx` | 1 hora | +2 |
| 3 | Eliminar Microdata duplicada de articulos | `travel-guide/[city]/[slug]/page.tsx` | 30 min | +2 |
| 4 | Guardia NaN en offers.price | `tour/[slug]/page.tsx` | 15 min | +1 |
| 10 | Fix URL relativa en CollectionPage | `travel-guide/page.tsx` | 5 min | +1 |
| 6 | "Por:" -> "By:" | `travel-guide/[city]/[slug]/page.tsx` | 5 min | +0.5 |
| 7 | Fix H1 de About (sacar `<div>`) | `about-us/page.tsx` | 15 min | +0.5 |
| 5 | Borrar console.log | `tour/[slug]/page.tsx` | 5 min | +0.1 |
| 20 | Fix typo "Shera" -> "Sherpa" | `footer.tsx` | 5 min | +0.3 |
| 23 | og:type en tour pages | `tour/[slug]/page.tsx` | 5 min | +0.5 |
| 24 | Fix URL stale en llms.txt | `public/llms.txt` | 5 min | +0.3 |
| 8 | Agregar H1 a contact page | `contact/page.tsx` | 15 min | +0.5 |
| 22 | TravelAgency -> TourOperator en homepage | `page.tsx` | 5 min | +0.5 |
| 21 | TripAdvisor sameAs: quitar BA-specific URL | `page.tsx` | 10 min | +0.3 |
| 32 | Crear paginas Privacy Policy + Terms | Nuevo archivo | 4 horas | +1 |
| | **Total estimado** | | **~7 horas** | **+12 puntos** |

### Semana 2 - Performance (CWV)

| # | Fix | Archivo | Tiempo | Score Impact |
|---|---|---|---|---|
| 1-2 | Fix dual LCP image + activar preload | `main-image.tsx` + `page.tsx` | 3 horas | +4 |
| 12 | fetchPriority en As Featured In | `as-featured-in.tsx` | 10 min | +0.5 |
| 13-14 | width/height en gallery + footer logo | `memories.tsx` + `footer.tsx` | 30 min | +1 |
| 11 | Migrar city cards a Next.js `<Image>` | `page.tsx` | 2 horas | +1.5 |
| 16 | Sitemap lastModified real | `sitemap.ts` | 1 hora | +0.5 |
| | **Total estimado** | | **~7 horas** | **+7.5 puntos** |

### Semana 3-4 - Schema + Local + E-E-A-T

| # | Fix | Tiempo | Score Impact |
|---|---|---|---|
| 33 | Person schema co-founders en About | 2 horas | +1 |
| 34 | knowsAbout/jobTitle en author pages | 1 hora | +0.5 |
| 25 | Alt text para 18 imagenes en WordPress | 1 hora | +2 |
| 26 | Estandarizar business name | 1 hora | +1 |
| 27 | Reestructurar homepage (city selector arriba del fold) | 4 horas | +2 |
| 29 | Fix CTA "View the experience" anchor | 15 min | +0.5 |
| 31 | Transformar travel guide hub en pillar page | 4 horas | +1.5 |
| | **Total estimado** | | **+8.5 puntos** |

---

## Proyeccion de Score

| Fase | Score | Cambio |
|---|---|---|
| Auditoria 1 (May 19) | 55/100 | - |
| Post-fixes Sprint 1-6 | 62/100 | +7 |
| + Fixes inmediatos (semana 1) | 74/100 | +12 |
| + Performance (semana 2) | 81/100 | +7 |
| + Schema/Local/E-E-A-T (semana 3-4) | 87/100 | +6 |
| + Pendientes originales (GBP, contenido, NAP) | 90+/100 | +3 |

---

## Leccion Aprendida

La diferencia fundamental entre ambas auditorias:

- **Auditoria 1** = "Doctor que mira los sintomas" (HTML externo, schema output, headers HTTP)
- **Auditoria 2** = "Cirujano que abre y ve los organos" (archivos .tsx, componentes React, logica de rendering, variables de entorno)

Los 33 fixes del Sprint 1-6 fueron correctos y necesarios. Arreglaron los problemas visibles. Pero al no leer el codigo fuente, no se vieron:
- Bugs de rendering (dual LCP image, preload comentado)
- Errores de idioma en el codigo (Por: en vez de By:)
- HTML invalido en componentes (`<div>` dentro de `<h1>`)
- Inconsistencias de datos (3 numeros de reviews)
- Un bug introducido por los propios fixes (FacebookBot bloqueado)

**Recomendacion:** Toda auditoria SEO de un sitio cuyo codigo controlamos deberia incluir analisis del source code, no solo del output HTML. Es la unica forma de detectar bugs arquitecturales que impactan CWV, schema, y rendering.
