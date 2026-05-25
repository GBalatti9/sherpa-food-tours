# SEO Audit & Improvements - Sherpa Food Tours

## Resumen Ejecutivo

Se realizó una auditoría SEO completa de sherpafoodtours.com analizando 98 páginas del sitio. El score inicial fue **55/100**. Se implementaron 33 mejoras de código que llevan el score estimado a **~70/100**.

Para llegar al objetivo de **83/100** quedan 16 acciones pendientes que requieren trabajo manual (contenido, plataformas externas, configuración CMS).

---

## Lo que se encontró

### Problemas principales detectados:

1. **Datos de contacto falsos en el sitio** - El schema del sitio tenía un teléfono placeholder (+1-555-123-4567) y una dirección de New York que no corresponde. Esto confunde a Google y a cualquier directorio que scrape la web.

2. **Todas las imágenes vienen de un servidor de staging** - Si ese server se cae, el sitio entero pierde las fotos. Además genera señales confusas para Google.

3. **Sin presencia en Google Business Profile** - Es el factor #1 para aparecer en el "local pack" de Google y no existe ningún perfil para las 8 ciudades.

4. **Sin hreflang** - Hay contenido en español (la página /contacto/) pero Google no sabe que es la versión en español de /contact/.

5. **Barcelona y Cartagena sin contenido editorial** - Son ciudades con tours activos pero cero artículos en el blog que las respalden.

6. **Schema markup con errores** - Datos que Google usa para mostrar estrellas, precios y ratings en los resultados de búsqueda tenían valores nulos o en formato incorrecto.

---

## Lo que ya se implementó (código)

### Sprint 1 - Fixes de emergencia
- Eliminado el teléfono falso del schema
- Corregida la dirección (ahora refleja UK, la jurisdicción real)
- Ratings y reviews ahora en formato numérico correcto (Google puede mostrar estrellas)
- Arreglado el "Cartagena, null" que aparecía en el markup
- Meta description del homepage ya no muestra código HTML roto
- Agregado schema WebSite (elegibilidad para searchbox en Google)
- Creado archivo llms.txt para que ChatGPT, Perplexity y Google AI puedan citar el sitio correctamente
- Implementado hreflang en /contact/ y /contacto/

### Sprint 2 - Fixes estructurales
- Agregado schema de autor (ProfilePage + Person) para fortalecer E-E-A-T
- Vinculación de entidades entre páginas (Google ahora entiende que TravelAgency, Organization y Publisher son la misma empresa)

### Sprint 3 - SEO Local
- Agregado schema TourOperator en cada página de ciudad (señal de negocio local para Google Maps)

### Sprint 4 - Contenido & E-E-A-T
- Páginas de autor sin posts ahora tienen "noindex" (no se indexa contenido vacío)
- Filtro en sitemap para excluir autores sin contenido

### Sprint 5 - AI & GEO
- Implementado IndexNow (indexación instantánea en Bing cuando se publica contenido nuevo)
- Directivas de AI crawlers en robots.txt (permite crawlers de búsqueda AI, bloquea los de solo entrenamiento)

### Sprint 6 - Conversión & Social
- Imagen de social sharing (og:image) cambiada de logo a foto del tour en todas las páginas

---

## Impacto esperado

| Métrica | Antes | Después (código) | Después (todo implementado) |
|---|---|---|---|
| SEO Health Score | 55/100 | ~70/100 | ~83/100 |
| Schema errors | 12 críticos | 0 | 0 |
| Rich results eligibility | Parcial | Completa | Completa |
| AI search readiness | 58/100 | ~68/100 | ~80/100 |
| Local SEO | 41/100 | ~50/100 | ~72/100 |

---

## Lo que falta (acciones manuales)

Ver lista de 16 items pendientes en el documento separado. Se organizan en:

- **Infraestructura** (migrar imágenes de staging, fix de slugs en WordPress)
- **Plataformas externas** (Google Business Profile, Viator, GetYourGuide)
- **Contenido editorial** (artículos para Barcelona, Cartagena, Lima)
- **Decisiones de negocio** (teléfono público, dirección visible, bio de autores)

---

## Archivos de referencia

- `FULL-AUDIT-REPORT.md` - Reporte técnico completo con todos los hallazgos
- `ACTION-PLAN.md` - Plan de acción técnico priorizado
- `progress.txt` - Detalle de cada cambio implementado

---

*Auditoría realizada en Mayo 2026*
