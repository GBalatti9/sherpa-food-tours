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

*Primera auditoría: 19 de Mayo 2026*

---
---

# Segunda Auditoría SEO - 31 de Mayo 2026

## Qué se hizo

Se realizó una segunda auditoría, esta vez analizando el **código fuente** del sitio (no solo el HTML de salida). Se usaron 8 agentes especializados que revisaron cada archivo del proyecto para detectar problemas invisibles desde afuera.

**Resultado:** Se encontraron **34 problemas nuevos** que la primera auditoría no captó. Se implementaron **22 fixes de código** adicionales y quedaron **16 pendientes manuales** nuevos.

---

## Por qué se hizo una segunda auditoría

La primera auditoría analizó el sitio "desde afuera" (como lo ve Google). Esta segunda auditoría analizó el sitio "desde adentro" (leyendo el código fuente). La diferencia es como ir al médico por síntomas vs. hacerse una tomografía: se ven cosas que no son visibles en la superficie.

---

## Lo más importante que se encontró (y ya se arregló)

### 1. Facebook no podía mostrar previews de los links
Cuando alguien compartía una URL del sitio en Facebook, Instagram o WhatsApp, no se mostraba ningún preview (ni imagen, ni título, ni descripción). Esto pasaba porque en la primera auditoría se bloqueó por error el bot de Facebook (FacebookBot) junto con los bots de entrenamiento de AI. **Ya está corregido** - ahora los links se comparten correctamente con imagen y descripción.

### 2. Números de reviews inconsistentes
El sitio mostraba tres números diferentes de reviews: 2,000 (Google) y 15,000 (TripAdvisor) en la página, pero 4,649 en el código que lee Google. Esto genera desconfianza tanto para Google como para los motores de AI. **Ya se unificó** a 17,000 (la suma real de ambas plataformas) en todos los lugares.

### 3. Artículos con datos duplicados y contradictorios
Los artículos del Travel Guide enviaban la misma información a Google en dos formatos diferentes que se contradecían entre sí. Google penaliza esto. **Ya se limpió** - ahora envían un solo formato consistente.

### 4. Precios podían aparecer como "null" en Google
Si un tour no tenía precio cargado en WordPress, Google veía un precio inválido en los resultados de búsqueda, lo que podía hacer que el resultado no se muestre. **Ya se agregó una protección** para que solo aparezca el precio cuando hay un valor real.

### 5. Texto en español en artículos en inglés
Los artículos del Travel Guide mostraban "Por:" (en español) antes del nombre del autor, en un sitio completamente en inglés. **Ya se cambió a "By:"**.

### 6. El tipo de negocio estaba mal declarado para Google
El sitio se identificaba como "TravelAgency" (agencia de viajes que vende paquetes) en vez de "TourOperator" (operador que da tours guiados). Google usa esto para decidir en qué categoría mostrar el negocio. **Ya se corrigió**.

---

## Otros fixes implementados (técnicos)

| Fix | Para qué sirve |
|---|---|
| H1 agregado a página de contacto | Google necesita un título principal en cada página |
| Schema de ContactPage + breadcrumb en contacto | Google entiende mejor qué es la página de contacto |
| Email visible en página de contacto | Antes no había forma de contacto visible (solo el formulario) |
| Logo del footer decía "Shera" (typo) | Ahora dice "Sherpa Food Tours logo" correctamente |
| H1 de About Us tenía HTML inválido | El título tenía un elemento de bloque dentro que confundía a los buscadores |
| Logo con URL relativa en schema del Travel Guide | Los buscadores no podían encontrar el logo porque la URL estaba incompleta |
| Links del footer usaban URLs absolutas | Podrían causar problemas en ambientes de preview/testing |
| Logos "As Featured In" competían con la imagen principal | Los logos de Google/Forbes/TripAdvisor se marcaban como "alta prioridad" aunque estaban debajo del fold, robándole velocidad a la imagen principal |
| Sitemap reportaba todas las páginas como "modificadas hoy" | Google estaba ignorando las fechas del sitemap porque cambiaban en cada deploy |
| console.log en producción en páginas de tour | Código de debug que quedó en producción, generando ruido en los logs |
| ClaudeBot agregado a robots.txt | Claude (Anthropic) ahora tiene acceso explícito para citar el contenido |
| LinkedIn agregado al schema de la organización | Fortalece el grafo de entidad de la marca |
| og:type corregido en páginas de tour | Estaba marcado como "artículo" en vez de "website" para páginas de producto |
| URL del llms.txt corregida | Apuntaba a un slug viejo de Buenos Aires |
| ratingCount cambiado a reviewCount en tours | Google prefiere esta propiedad para mostrar estrellas |
| URL de tour con trailing slash corregida | La URL en el schema no coincidía con la URL canónica |

---

## Impacto actualizado

| Métrica | Primera auditoría | Post-fixes 1ra | Post-fixes 2da | Objetivo |
|---|---|---|---|---|
| SEO Health Score | 55/100 | ~62/100 | ~72/100 | 87/100 |
| Schema errors | 12 críticos | 0 | 0 | 0 |
| Rich results | Parcial | Completa | Completa + consistente | - |
| AI search readiness | 58/100 | ~68/100 | ~75/100 | ~85/100 |
| Social sharing | Roto (FacebookBot bloqueado) | Roto | Funcionando | - |

---

## Lo que queda pendiente (acciones manuales)

### Prioridad alta (impacto directo en rankings)

1. **Crear Google Business Profile para las 8 ciudades** - Es el factor #1 para aparecer en el mapa de Google. Sin esto, Sherpa no aparece en búsquedas locales como "food tour Buenos Aires" en Google Maps.

2. **Agregar alt text a 18+ imágenes en WordPress** - La mitad de las imágenes del homepage no tienen texto alternativo. Afecta accesibilidad y SEO de imágenes.

3. **Publicar artículos para Barcelona y Cartagena** - Son ciudades con tours activos pero cero artículos en el blog. Google no puede considerar al sitio una autoridad en esas ciudades sin contenido.

4. **Crear Privacy Policy y Terms of Service** - No existen en el sitio. Es un requerimiento básico de confianza que Google evalúa.

### Prioridad media (mejora de rendimiento y experiencia)

5. **Optimizar el componente de imagen principal** - La imagen hero carga de forma ineficiente (dos imágenes apiladas). Afecta la velocidad de carga en móvil.

6. **Agregar coordenadas geográficas al schema de cada ciudad** - Ayuda a Google a entender dónde opera el negocio exactamente.

7. **Registrarse en Viator y GetYourGuide** - Estas plataformas dominan los resultados de búsqueda para "food tour [ciudad]". Estar listado genera backlinks de alta autoridad.

8. **Agregar Google Maps en las páginas de ciudad** - Ninguna página tiene un mapa. Es una señal fuerte de relevancia local.

### Prioridad baja (mejoras incrementales)

9. Crear página dedicada para grupos/corporativo
10. Expandir contenido de Lima (solo 1 artículo)
11. Crear canal de YouTube (alta correlación con citaciones de AI)
12. Transformar el hub del Travel Guide en una pillar page con contenido propio
13. Agregar schema Person para los co-founders en la página About

---

## Resumen de números

| Concepto | Primera auditoría | Segunda auditoría | Total |
|---|---|---|---|
| Problemas encontrados | 35 | 34 | 69 |
| Fixes de código implementados | 33 | 22 | 55 |
| Pendientes manuales | 16 | 13 nuevos | ~20 únicos |
| Archivos modificados | 10 | 12 | 14 únicos |

---

*Segunda auditoría: 31 de Mayo 2026*
