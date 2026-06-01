# SEO Action Plan: sherpafoodtours.com
## Prioritized Recommendations (Critical > High > Medium > Low)

**Current Score: 55/100 | Target Score: 75+ within 90 days**

---

## CRITICAL -- Fix Immediately (Week 1)

### 1. Fix homepage meta description
**Impact:** Every SERP snippet for homepage is garbled
**Current:** `\nSherpa isn&#8217;t just a food tour...` (HTML entities, line breaks)
**Action:** Rewrite to clean 140-155 character sentence, update og:description and twitter:description
**Effort:** 30 minutes

### 2. Fix fabricated phone number in schema
**Impact:** Corrupts all scraped citation records; direct trustworthiness failure
**Current:** `"telephone": "+1-555-123-4567"` (placeholder 555 number)
**Action:** Replace with real E.164 phone number or remove the field entirely
**Effort:** 15 minutes

### 3. Fix null/invalid values in tour page schemas
**Impact:** Breaks star rating rich results on all tour pages
**Current:** `ratingCount: null`, `ratingValue: 5` (placeholder), `"Cartagena, null"`
**Action:** Set ratingCount to actual review integer; fix Cartagena country template rendering
**Effort:** 30 minutes

### 4. Fix schema data types
**Impact:** AggregateRating won't render as stars in SERPs
**Current:** `"ratingValue": "4.8"` and `"reviewCount": "4649"` (strings)
**Action:** Convert to numeric: `"ratingValue": 4.8` and `"reviewCount": 4649`
**Effort:** 15 minutes

### 5. Add timezone offsets to article dates
**Impact:** Date freshness signals are ambiguous to Google
**Current:** `"datePublished": "2026-05-11T14:23:51"` (no timezone)
**Action:** Append offset: `"datePublished": "2026-05-11T14:23:51-03:00"`
**Effort:** 1 hour

### 6. Migrate images from staging to production
**Impact:** Single point of failure for ALL visual content site-wide
**Current:** All images load from `staging.sherpafoodtours.com/wp-content/uploads/`
**Action:** Move assets to production CDN; update all image refs in schema, content, and CSS
**Effort:** 1-2 days

### 7. Resolve NAP conflicts
**Impact:** Three different countries in schema vs footer vs About Us
**Action:** Decide on primary business address (UK registered or operational); make consistent across schema, footer, contact page
**Effort:** 2-3 hours

---

## HIGH -- Fix Within 2 Weeks

### 8. Create GBP listings for top 3 cities
**Impact:** Unlocks local pack presence -- #1 local ranking factor
**Action:** Create verified GBP for Buenos Aires, London, Barcelona; category "Tour Operator"; activate FareHarbor "Reserve with Google"
**Effort:** 2-3 days per city

### 9. Fix Buenos Aires URL slug
**Impact:** Flagship city has unprofessional `-2` suffix
**Action:** Create `/city/buenos-aires/`, 301 redirect from `-2`, update sitemap + internal links
**Effort:** 2-3 hours

### 10. Implement hreflang
**Impact:** Google can't determine which page to serve which locale
**Action:** Add hreflang to `/contact/` and `/contacto/` pair as immediate fix; design full strategy for all locales
**Effort:** 2-4 hours (initial pair), 1-2 weeks (full strategy)

### 11. Create llms.txt
**Impact:** AI systems must guess what to cite vs being directed to best content
**Action:** Create `/llms.txt` with company description, 8 city tour pages, top 10 articles, permission language
**Effort:** 2-4 hours

### 12. Add entity linking via @id across schema
**Impact:** Google can't resolve TravelAgency + Organization + publisher as same entity
**Action:** Add `"@id": "https://www.sherpafoodtours.com/#organization"` to both blocks; reference in Article/TouristTrip publisher
**Effort:** 3-4 hours

### 13. Add WebSite schema with SearchAction
**Impact:** Missing sitelinks searchbox eligibility
**Action:** Add WebSite JSON-LD block to homepage
**Effort:** 30 minutes

### 14. Add Person/ProfilePage schema to author pages
**Impact:** E-E-A-T entity graph is incomplete
**Action:** Add ProfilePage + Person schema with name, jobTitle, worksFor, sameAs to each author page
**Effort:** 2-3 hours

### 15. Add Google Maps embeds to city + tour pages
**Impact:** Zero Maps integrations site-wide; missing local relevance signal
**Action:** Embed Google Map showing tour neighborhood/meeting point on each page
**Effort:** 1-2 days

### 16. Register on Viator and GetYourGuide
**Impact:** Dominate "food tour [city]" SERPs; critical distribution channels for tours
**Action:** Create operator listings on both platforms for all 8 cities
**Effort:** 1-2 weeks

---

## MEDIUM -- Fix Within 1 Month

### 17. Publish Barcelona and Cartagena editorial content
**Impact:** Active tour cities with zero supporting articles
**Action:** Minimum 3 articles each: city food guide overview, 1 dish-specific, 1 neighborhood article
**Effort:** 2-3 weeks of content creation

### 18. Expand Lima content
**Impact:** Only 1 article for a city being actively promoted with 30% discount
**Action:** Target 5+ articles within 60 days
**Effort:** 2-3 weeks

### 19. Fix alt text on 22 homepage images
**Effort:** 1-2 hours

### 20. Geo-target Lima promotional marquee
**Action:** Show Lima promo only on Lima page and homepage, not other city pages
**Effort:** 1-2 hours

### 21. Add FAQ blocks structured for AI extraction
**Action:** Convert implicit questions in articles to explicit H3 + 134-167 word direct answers; add FAQPage schema
**Effort:** 1-2 weeks across top articles

### 22. Rewrite section openers as direct answers
**Action:** First sentence under every H2/H3 states the core claim; narrative follows
**Effort:** Ongoing editorial standard

### 23. Add sourced statistics to articles
**Action:** Replace unattributed superlatives with specific sourced claims + external links
**Effort:** 1-2 weeks research + editorial

### 24. Embed FareHarbor booking inline
**Action:** Replace external redirect with embedded widget or full-page transition
**Effort:** 1-2 days

### 25. Add "Why Sherpa" differentiation section to city pages
**Action:** 2-3 concrete differentiators (max group size, all-inclusive pricing, vetted local guides)
**Effort:** 1-2 days

### 26. Fix og:image
**Action:** Create dedicated 1200x630px hero image for social sharing (food tour photography)
**Effort:** 2-3 hours

### 27. Implement IndexNow
**Action:** Generate key, host key file, trigger pings on content publish
**Effort:** 2-3 hours

### 28. Update author bios
**Action:** Add verifiable credentials to Sofia Gonzalez; populate or noindex Gaston Balatti page
**Effort:** 1-2 hours

---

## LOW -- Backlog

### 29. Pursue Wikipedia entity page
**Effort:** High (notability research + editorial)

### 30. Add AI crawler directives to robots.txt
**Effort:** 30 minutes

### 31. Implement nonce-based CSP
**Effort:** High (requires Next.js middleware changes)

### 32. Add Event schema for scheduled tours
**Effort:** Medium

### 33. Create tour walkthrough video (60-90s)
**Effort:** High (production)

### 34. Add email capture for non-converting visitors
**Effort:** Medium

### 35. Create "Best food tours in [city]" editorial articles
**Effort:** High (content creation)

---

## Expected Score Impact

| Milestone | Estimated Score | Timeline |
|---|---|---|
| After Sprint 1 (emergency fixes) | 62/100 | Week 1 |
| After Sprint 2 (structural fixes) | 68/100 | Week 3 |
| After Sprint 3 (local SEO foundation) | 72/100 | Week 5 |
| After Sprint 4 (content + E-E-A-T) | 76/100 | Week 8 |
| After Sprint 5 (GEO + AI) | 80/100 | Week 10 |
| After Sprint 6 (conversion + SXO) | 83/100 | Week 12 |

---

*Action plan generated from full SEO audit, May 19, 2026*

---
---

# SEGUNDA AUDITORIA - Pendientes Manuales (31 de mayo 2026)

Los siguientes items fueron detectados en la segunda auditoria (analisis profundo del codigo fuente con 8 subagentes especializados). Los fixes de codigo ya fueron implementados. Estos son los pendientes que requieren accion manual, CMS, o decisiones de negocio.

**Nota:** Los slugs de Buenos Aires (`/city/buenos-aires-2/`) y San Telmo (`/tour/san-telmo-tour-2/`) ya fueron corregidos.

---

## YA IMPLEMENTADO (codigo) - Segunda Auditoria

| # | Fix | Archivo |
|---|---|---|
| 1 | Desbloquear FacebookBot en robots.txt (estaba agrupado con training crawlers) | `robots.ts` |
| 2 | Agregar ClaudeBot explicitamente a robots.txt | `robots.ts` |
| 3 | Fix typo footer logo "Shera" -> "Sherpa Food Tours logo" + agregar width/height | `footer.tsx` |
| 4 | Agregar H1 a contact page (era H2) | `contact/page.tsx` |
| 5 | Agregar schema ContactPage + BreadcrumbList a contact page | `contact/page.tsx` |
| 6 | Mostrar email info@sherpafoodtours.com en contact page | `contact/page.tsx` |
| 7 | Eliminar console.log de produccion en tour page | `tour/[slug]/page.tsx` |
| 8 | Fix "Por:" -> "By:" en articulos en ingles | `travel-guide/[city]/[slug]/page.tsx` |
| 9 | Eliminar Microdata duplicada de articulos (itemScope/itemProp) | `travel-guide/[city]/[slug]/page.tsx` |
| 10 | Fix H1 de About Us - cambiar `<div>` a `<span>` dentro del heading | `about-us/page.tsx` |
| 11 | Fix URL relativa del logo en CollectionPage schema | `travel-guide/page.tsx` |
| 12 | Agregar @id de org al publisher de CollectionPage | `travel-guide/page.tsx` |
| 13 | Cambiar TravelAgency -> TourOperator en homepage schema | `page.tsx` |
| 14 | Agregar LinkedIn a sameAs del Organization schema | `page.tsx` |
| 15 | Fix offers.price NaN risk (guardia condicional) | `tour/[slug]/page.tsx` |
| 16 | Cambiar ratingCount -> reviewCount en tour schema | `tour/[slug]/page.tsx` |
| 17 | Fix og:type de "article" a "website" en tour pages | `tour/[slug]/page.tsx` |
| 18 | Fix tourUrl trailing slash | `tour/[slug]/page.tsx` |
| 19 | Fix fetchPriority en As Featured In logos (de "high" a lazy) | `as-featured-in.tsx` |
| 20 | Fix URLs absolutas hardcodeadas en footer -> relativas | `footer.tsx` |
| 21 | Fix llms.txt URL stale (buenos-aires-2 -> buenos-aires) | `public/llms.txt` |
| 22 | Sitemap: eliminar priority/changefreq, usar lastModified real | `sitemap.ts` |

---

## PENDIENTES MANUALES - Segunda Auditoria

### INFRAESTRUCTURA (Vercel / CMS)

#### ~~P1. Cambiar variable de entorno NEXT_PUBLIC_WP_URL en produccion~~ DESCARTADO
- **Nota:** `staging.sherpafoodtours.com` es en realidad el CMS WordPress de produccion (nombre legacy, no es un servidor de staging). Las imagenes se sirven correctamente desde el CMS real. No hay riesgo de caida ni de dominio temporal. El unico impacto menor es estetico (la palabra "staging" en las URLs de imagenes) y un DNS lookup adicional al subdominio, pero no es critico.
- **Accion:** No requiere cambio. Considerar renombrar el subdominio a `cms.sherpafoodtours.com` o `wp.sherpafoodtours.com` en el futuro para mayor claridad, pero no es urgente.

#### P2. Fix patron dual de imagen LCP en MainImage
- **Impacto:** CRITICO (performance)
- **Que:** `main-image.tsx` renderiza DOS imagenes apiladas (placeholder + WordPress), ambas con `priority`. El preload del hero esta comentado en `page.tsx` lineas 283-299.
- **Accion:** Rediseñar el componente para usar una sola imagen con CSS background-color como placeholder. Descomentar y corregir el preload link.
- **Esfuerzo:** 3 horas (requiere testing cuidadoso)
- **Score impact:** +4 puntos de CWV

#### P3. Migrar imagenes de `<img>` crudo a Next.js `<Image>`
- **Impacto:** ALTO (performance)
- **Que:** Solo el hero usa `<Image>`. Todas las demas imagenes (city cards, gallery, logos, experience section) usan `<img>` crudo, perdiendo srcset, AVIF, y lazy loading automatico.
- **Accion:** Migrar progresivamente empezando por city cards en homepage.
- **Esfuerzo:** 4-6 horas
- **Score impact:** +2 puntos

### CONTENIDO (WordPress CMS)

#### P4. Agregar alt text a 18+ imagenes en WordPress
- **Impacto:** ALTO
- **Que:** 52% de las imagenes del homepage no tienen alt text. Incluye: 8 banderas de paises, 6 imagenes del gallery, 2 imagenes de "experience section", 2 logos de "featured in".
- **Accion:** Entrar a WordPress > Media Library y agregar alt text descriptivo a cada imagen.
- **Esfuerzo:** 1 hora
- **Score impact:** +2 puntos

#### ~~P5. Reconciliar numeros de reviews en homepage~~ COMPLETADO
- **Resuelto:** Schema actualizado a `reviewCount: 17000` (2,000 Google + 15,000 TripAdvisor). llms.txt actualizado a "17,000+ combined". Ahora los 3 valores (HTML, schema, llms.txt) son consistentes.

#### P6. Agregar width/height a imagenes del gallery (Memories)
- **Impacto:** MEDIO (CLS)
- **Que:** Las imagenes en `memories.tsx` no tienen atributos de dimension, causando layout shift.
- **Accion:** Agregar `width` y `height` en el componente Memories.
- **Esfuerzo:** 20 minutos

### SCHEMA Y E-E-A-T

#### P7. Agregar Person schema para co-founders en About page
- **Impacto:** ALTO
- **Que:** Guille Borthwick (ex-IBM) y Alex Pels (Michelin) tienen credenciales fuertes pero no tienen schema Person.
- **Accion:** Agregar JSON-LD Person con jobTitle, description, sameAs (LinkedIn) y worksFor en `about-us/page.tsx`.
- **Esfuerzo:** 1-2 horas
- **Requiere:** URLs de LinkedIn de ambos co-founders

#### P8. Mejorar Person schema en author pages
- **Impacto:** MEDIO
- **Que:** ProfilePage schema actual no tiene `knowsAbout`, `jobTitle`, ni `sameAs`. AI no puede determinar expertise.
- **Accion:** Agregar estas propiedades en `author/[user]/page.tsx`. Puede requerir nuevos campos ACF en WordPress.
- **Esfuerzo:** 1-2 horas

#### P9. Agregar geo coordinates a TourOperator schema en city pages
- **Impacto:** ALTO (local SEO)
- **Que:** Ningun city page tiene coordenadas geograficas en el schema. Para un SAB sin direccion, las coords son la señal principal.
- **Accion:** Agregar campo ACF para lat/lng por ciudad, o hardcodear coordenadas centrales. Agregar `geo: { @type: GeoCoordinates, latitude, longitude }` al TourOperator schema.
- **Esfuerzo:** 2 horas
- **Datos necesarios:** Coordenadas de meeting point o centro de cada ciudad

#### P10. Agregar addressCountry al TourOperator schema en city pages
- **Impacto:** MEDIO
- **Que:** Solo tiene `addressLocality` sin `addressCountry`. Google necesita ambos.
- **Accion:** Agregar un mapping ciudad->pais ISO o un campo ACF.
- **Esfuerzo:** 30 minutos

### LEGAL Y TRUST

#### P11. Crear Privacy Policy y Terms of Service
- **Impacto:** ALTO (E-E-A-T trust)
- **Que:** No existen links a Privacy Policy ni Terms en ninguna parte del sitio. Requerimiento basico de trust.
- **Accion:** Crear las paginas con contenido legal y agregar links en el footer.
- **Esfuerzo:** 4-6 horas (contenido + implementacion)

### SXO Y CONVERSION

#### P12. Crear pagina /groups o /corporate
- **Impacto:** MEDIO
- **Que:** La persona "corporate planner" score 25/100. Cero contenido B2B. "Partner With Us" y "Careers" apuntan a la misma pagina de contacto.
- **Accion:** Crear pagina dedicada con formulario de grupo, pricing, y testimonios corporativos.
- **Esfuerzo:** 4-8 horas

#### P13. Transformar Travel Guide hub en pillar page
- **Impacto:** MEDIO
- **Que:** Actualmente es un index de tarjetas (SXO score: 40/100). SERP premia pillar pages de 1500+ palabras.
- **Accion:** Agregar 800-1200 palabras de copy editorial original como intro, antes del listado de articulos.
- **Esfuerzo:** 3-4 horas

#### P14. Fix CTA "View the experience" en city pages
- **Impacto:** MEDIO
- **Que:** El boton apunta al anchor `#as-feature-in` (seccion de logos), no a la seccion de tours.
- **Accion:** Cambiar el anchor target a la seccion correcta de tour listings.
- **Esfuerzo:** 15 minutos
- **Requiere:** Verificar el ID del anchor en el componente de city pages

### GEO Y AI

#### P15. Expandir llms.txt con inventario completo
- **Impacto:** MEDIO
- **Que:** Solo lista 3 de 72 articulos. AI systems que usan llms.txt solo descubren esas 3 guias.
- **Accion:** Crear `llms-full.txt` con todos los articulos, tours, y author pages. Agregar link desde llms.txt.
- **Esfuerzo:** 2-3 horas

#### P16. Crear canal de YouTube
- **Impacto:** ALTO (GEO)
- **Que:** YouTube tiene 0.737 de correlacion con frecuencia de citacion AI. Es la señal mas fuerte de brand para GEO. Sherpa no tiene presencia en YouTube.
- **Accion:** Crear canal, subir 10-20 videos (tour recaps, "que comer en X"), agregar URL a sameAs del schema.
- **Esfuerzo:** Alto (ongoing - produccion de video)

#### P17. Agregar `speakable` schema a city y tour pages
- **Impacto:** MEDIO
- **Que:** Señal directa a Google AI Overviews para identificar contenido quoteable.
- **Accion:** Identificar 2-3 oraciones factuales por pagina y marcarlas con speakable.
- **Esfuerzo:** 2-3 horas

---

## Proyeccion de Score Actualizada (Segunda Auditoria)

| Fase | Score | Cambio |
|---|---|---|
| Post primera auditoria (33 fixes) | 62/100 | - |
| + Fixes de codigo segunda auditoria (22 items) | 72/100 | +10 |
| + P1 (staging env var) + P5 (reviews) | 77/100 | +5 |
| + P2 (LCP image) + P4 (alt text) + P6 (gallery dims) | 82/100 | +5 |
| + P7-P10 (schema/E-E-A-T) + P11 (legal) | 87/100 | +5 |
| + Pendientes originales (GBP, contenido editorial, NAP) | 90+/100 | +3 |

---

*Pendientes agregados de la segunda auditoria, 31 de mayo 2026*
